import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  NoToneMapping,
  NormalBlending,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
} from "three";
import type { Theme } from "../lib/theme";
import { BACKDROP } from "./glsl";
import { createParticles } from "./particles";
import { createLens } from "./post";
import { sampleName } from "./name";
import { LAYER_COUNT, NODE_COUNT, STOP_COUNT, type Frame, type Piece } from "./piece";
import { emitStageLabels, stageState, type LabelSet, type ScreenPoint } from "./store";
import { CHAPTERS, createTimeline, type TimelineReading } from "./timeline";
import { cameraAt, FLOOR_Y, PLACE_COUNT, placePositions, placeRotations, VIEW_DISTANCE } from "./world";

// The page's 3D stage: one fixed canvas behind every section. A backdrop of
// soft glows and a faint dot grid, a drift of dust at many depths that
// parallaxes as the page scrolls, and the centrepiece, tens of thousands of
// points that take a new shape for each chapter of the page (particles.ts).

export type Stage = {
  setTheme: (theme: Theme) => void;
  setPointer: (ndc: { x: number; y: number } | null) => void;
  setPress: (down: boolean) => void;
  resize: (width: number, height: number) => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

const THEMES = {
  dark: {
    bg: "#0a0a0d",
    glows: [["#1e3a8a", 0.24], ["#312e81", 0.2], ["#5b21b6", 0.06]] as const,
    dots: "#94a3b8",
    dotAlpha: 0.2,
    dust: "#a5b4fc",
    dustAlpha: 0.55,
  },
  light: {
    bg: "#f4f1ea",
    glows: [["#ffffff", 0.6], ["#eadfcd", 0.55], ["#c45c26", 0.07]] as const,
    dots: "#003399",
    dotAlpha: 0.16,
    dust: "#003399",
    dustAlpha: 0.35,
  },
};

const FOV = 40;
const INTRO_MS = 2200;
const WORLD_UP = new Vector3(0, 1, 0);

const backdropVertex = /* glsl */ `
  varying vec3 vDir;
  varying vec2 vNdc;
  void main() {
    // Direction of the camera ray through this corner, in world space.
    vec4 view = inverse(projectionMatrix) * vec4(position.xy, 1.0, 1.0);
    vDir = (inverse(viewMatrix) * vec4(view.xyz / view.w, 0.0)).xyz;
    vNdc = position.xy;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const backdropFragment = /* glsl */ `
  varying vec3 vDir;
  varying vec2 vNdc;
  ${BACKDROP}
  void main() {
    gl_FragColor = vec4(backdrop(vNdc, cameraPosition, normalize(vDir)), 1.0);
    #include <colorspace_fragment>
  }
`;

// Dust hangs in a wide tube along the whole flight path (and a little past
// both ends), drifting slowly, so flying between places means flying
// through it.
const dustVertex = /* glsl */ `
  attribute vec4 aSeed;
  uniform vec3 uPlaces[${PLACE_COUNT}];
  uniform float uTime;
  uniform float uTanHalf;
  uniform float uViewH;
  uniform float uPixel;
  varying float vAlpha;
  varying float vNear;
  void main() {
    float u = aSeed.z * ${(PLACE_COUNT + 0.6).toFixed(1)} - 0.8;
    int i = int(clamp(floor(u), 0.0, ${(PLACE_COUNT - 2).toFixed(1)}));
    vec3 centre = mix(uPlaces[i], uPlaces[i + 1], u - float(i));
    vec3 pos = centre + vec3((aSeed.x - 0.5) * 34.0, (aSeed.y - 0.5) * 20.0, 0.0);
    pos += vec3(cos(uTime * 0.15 + aSeed.w * 20.0), sin(uTime * 0.2 + aSeed.w * 30.0), 0.0) * 0.4;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    float dist = -mv.z;
    gl_Position = projectionMatrix * mv;
    // Motes right by the lens are out of focus: big, faint, flat discs.
    float near = smoothstep(4.0, 1.5, dist);
    float size = 0.025 * uViewH / (2.0 * uTanHalf * max(dist, 0.5));
    gl_PointSize = dist < 0.3 ? 0.0 : min(mix(size, 26.0 * uPixel, near), 40.0);
    // Twinkle, and fade into the distance.
    vAlpha = (0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * (0.6 + aSeed.w) + aSeed.x * 40.0), 3.0))
      * exp(-max(dist - 10.0, 0.0) * 0.03) * mix(1.0, 0.12, near);
    vNear = near;
  }
`;

const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vAlpha;
  varying float vNear;
  void main() {
    float soft = smoothstep(0.5, mix(0.0, 0.38, vNear), length(gl_PointCoord - 0.5));
    gl_FragColor = vec4(uColor, soft * vAlpha * uAlpha);
    #include <colorspace_fragment>
  }
`;

const ease = (rate: number, dt: number) => 1 - Math.exp(-rate * dt);

export const createStage = (
  canvas: HTMLCanvasElement,
  opts: { theme: Theme; mobile: boolean },
): Stage => {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping; // keep page colours exact

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 400);
  const tanHalf = Math.tan(((FOV / 2) * Math.PI) / 180);

  let theme = opts.theme;

  // Backdrop
  const backdropUniforms = {
    uBg: { value: new Color() },
    uGlow: { value: [new Color(), new Color(), new Color()] },
    uGlowAlpha: { value: [0, 0, 0] },
    uDotColor: { value: new Color() },
    uDotAlpha: { value: 0 },
    uDrift: { value: new Vector2() },
    uFloorY: { value: FLOOR_Y },
    uAspect: { value: 1 },
  };
  const backdropMaterial = new ShaderMaterial({
    uniforms: backdropUniforms,
    vertexShader: backdropVertex,
    fragmentShader: backdropFragment,
    depthTest: false,
    depthWrite: false,
  });
  const backdropGeometry = new PlaneGeometry(2, 2);
  const backdrop = new Mesh(backdropGeometry, backdropMaterial);
  backdrop.frustumCulled = false;
  backdrop.renderOrder = -2;
  scene.add(backdrop);

  // Dust
  const DUST = opts.mobile ? 1600 : 4000;
  const dustSeeds = new Float32Array(DUST * 4).map(() => Math.random());
  const dustGeometry = new BufferGeometry();
  dustGeometry.setAttribute("position", new BufferAttribute(new Float32Array(DUST * 3), 3));
  dustGeometry.setAttribute("aSeed", new BufferAttribute(dustSeeds, 4));
  const dustUniforms = {
    uPlaces: { value: placePositions },
    uTime: { value: 0 },
    uTanHalf: { value: tanHalf },
    uViewH: { value: 1 },
    uPixel: { value: renderer.getPixelRatio() },
    uColor: { value: new Color() },
    uAlpha: { value: 0 },
  };
  const dustMaterial = new ShaderMaterial({
    uniforms: dustUniforms,
    vertexShader: dustVertex,
    fragmentShader: dustFragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const dust = new Points(dustGeometry, dustMaterial);
  dust.frustumCulled = false;
  dust.renderOrder = -1;
  scene.add(dust);

  const applyTheme = (next: Theme) => {
    theme = next;
    const t = THEMES[next];
    backdropUniforms.uBg.value.set(t.bg);
    t.glows.forEach(([c, a], i) => {
      backdropUniforms.uGlow.value[i].set(c);
      backdropUniforms.uGlowAlpha.value[i] = a;
    });
    backdropUniforms.uDotColor.value.set(t.dots);
    backdropUniforms.uDotAlpha.value = t.dotAlpha;
    dustUniforms.uColor.value.set(t.dust);
    dustUniforms.uAlpha.value = t.dustAlpha;
    dustMaterial.blending = next === "dark" ? AdditiveBlending : NormalBlending;
    dustMaterial.needsUpdate = true;
    piece.setTheme(next);
    lens.setTheme(next);
  };

  // Centrepiece
  const piece: Piece = createParticles({ mobile: opts.mobile, theme });
  scene.add(piece.object);
  const lens = createLens(renderer, scene, camera, theme);

  // The hero name, drawn in points once its font is in and again whenever
  // the heading changes size. While the points draw it, the page's own
  // heading steps back (index.css, html[data-stage-name]).
  let nameTimer = 0;
  const drawName = () => {
    const name = sampleName(opts.mobile ? 4500 : 12000, frame.halfH);
    piece.setName?.(name);
    if (name) document.documentElement.dataset.stageName = "";
  };
  const nameWatch = new ResizeObserver(() => {
    clearTimeout(nameTimer);
    nameTimer = window.setTimeout(drawName, 150);
  });
  document.fonts.ready.then(() => {
    drawName();
    const heading = document.querySelector("[data-hero-name]");
    if (heading) nameWatch.observe(heading);
  });

  // Eased state
  const timeline = createTimeline();
  const reading: TimelineReading = { chapter: 0, progress: CHAPTERS.map(() => 0) };
  const frame: Frame = {
    time: 0,
    chapter: 0,
    progress: CHAPTERS.map(() => 0),
    pointer: { x: 0, y: 0, on: 0, press: 0 },
    spin: 0,
    intro: 0,
    focus: new Array(NODE_COUNT).fill(0),
    halfW: 1,
    halfH: VIEW_DISTANCE * tanHalf,
    aspect: 1,
    mobile: opts.mobile,
    viewH: 1,
    tanHalf,
    ring: { x: 0, y: 0, r: 3 },
    stops: Array.from({ length: STOP_COUNT }, (_, i) => ({ x: (i - 1) * 6, y: 0 })),
    aboutAt: 0,
    stop: { x: 0, y: 0 },
    tour: 0,
    focusDist: VIEW_DISTANCE,
    layers: [0, 0, 0, 0],
  };
  const pointerTarget = { x: 0, y: 0, active: false, down: false };
  let width = 1;
  let height = 1;
  let first = true;

  // Contact's heading carries data-ring; the ring follows it as it scrolls.
  let ringEl: Element | null = null;
  const placeRing = () => {
    if (!ringEl || !ringEl.isConnected) ringEl = document.querySelector("[data-ring]");
    if (!ringEl) return;
    const r = ringEl.getBoundingClientRect();
    const toWorld = (2 * frame.halfH) / height;
    frame.ring.x = (r.left + r.width / 2 - width / 2) * toWorld;
    frame.ring.y = -(r.top + r.height / 2 - height / 2) * toWorld;
    frame.ring.r = Math.max(r.width * 0.5 * 1.08, r.height * 1.1) * toWorld;
  };

  // About's panels each carry a data-stop marker; the timeline's stops ride
  // on them as the panels slide.
  let stopEls: Element[] = [];
  const placeStops = () => {
    if (!stopEls[0]?.isConnected) stopEls = Array.from(document.querySelectorAll("[data-stop]"));
    const toWorld = (2 * frame.halfH) / height;
    stopEls.slice(0, STOP_COUNT).forEach((el, i) => {
      const r = el.getBoundingClientRect();
      frame.stops[i].x = (r.left - width / 2) * toWorld;
      frame.stops[i].y = -(r.top - height / 2) * toWorld;
    });
    const i = Math.min(STOP_COUNT - 2, Math.floor(frame.aboutAt));
    const f = frame.aboutAt - i;
    frame.stop.x = frame.stops[i].x + (frame.stops[i + 1].x - frame.stops[i].x) * f;
    frame.stop.y = frame.stops[i].y + (frame.stops[i + 1].y - frame.stops[i].y) * f;
  };

  const project = new Vector3();
  const screens: Record<LabelSet, ScreenPoint[]> = {
    work: Array.from({ length: NODE_COUNT }, () => ({ x: 0, y: 0 })),
    skills: Array.from({ length: LAYER_COUNT }, () => ({ x: 0, y: 0 })),
  };
  const shown: Record<LabelSet, boolean> = { work: false, skills: false };

  // Tags on the scene's labelled points, placed on screen for the page.
  const sendLabels = () => {
    for (const group of piece.labels?.(frame) ?? []) {
      const screen = screens[group.set];
      if (group.visible > 0) {
        group.points.forEach((p, i) => {
          project.copy(p).project(camera);
          screen[i].x = (project.x * 0.5 + 0.5) * width;
          screen[i].y = (-project.y * 0.5 + 0.5) * height;
        });
        emitStageLabels(group.set, screen, group.visible * frame.intro);
        shown[group.set] = true;
      } else if (shown[group.set]) {
        emitStageLabels(group.set, screen, 0);
        shown[group.set] = false;
      }
    }
  };

  // The camera flies the path between places (world.ts) as the chapters
  // change, leans with the pointer across its view, and banks into the
  // turns while it's travelling.
  const eye = new Vector3();
  const target = new Vector3();
  const ahead = new Vector3();
  const aheadTarget = new Vector3();
  const forward = new Vector3();
  const right = new Vector3();
  const up = new Vector3();
  const tourNode = new Vector3();
  const tourEye = new Vector3();
  const tourTarget = new Vector3();
  const tourOffset = new Vector3();
  const smooth = (a: number, b: number, x: number) => {
    const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
    return t * t * (3 - 2 * t);
  };

  // Work's tour: while its pinned scene scrolls, the camera leaves the rest
  // view and flies close to each featured project's node in turn, holding
  // on each for most of its stretch of scroll. The node sits right of
  // centre, beside the caption (on phones, above it).
  const placeTour = () => {
    const nodes = piece.nodes?.();
    const p = frame.progress[2];
    frame.tour = nodes ? Math.max(0, 1 - Math.abs(frame.chapter - 2) * 2) * smooth(0, 0.05, p) * (1 - smooth(0.95, 1, p)) : 0;
    if (!nodes || frame.tour <= 0) return;
    const at = Math.min(1, Math.max(0, (p - 0.05) / 0.9)) * (NODE_COUNT - 1);
    const i = Math.min(NODE_COUNT - 2, Math.floor(at));
    tourNode.lerpVectors(nodes[i], nodes[i + 1], smooth(0.35, 0.65, at - i));
    tourOffset.set(frame.mobile ? 0 : -1.4, frame.mobile ? -0.9 : 0, 0).applyMatrix3(placeRotations[2]);
    tourTarget.copy(tourNode).add(tourOffset);
    tourOffset.set(0, 0.3, frame.mobile ? 4.8 : 4.4).applyMatrix3(placeRotations[2]);
    tourEye.copy(tourTarget).add(tourOffset);
    eye.lerp(tourEye, frame.tour);
    target.lerp(tourTarget, frame.tour);
    frame.focusDist += (eye.distanceTo(tourNode) - frame.focusDist) * frame.tour;
  };

  const placeCamera = () => {
    const { pointer } = frame;
    cameraAt(frame.chapter, eye, target);
    cameraAt(frame.chapter + 0.02, ahead, aheadTarget);
    const sideways = ahead.sub(eye).dot(right.subVectors(target, eye).cross(WORLD_UP).normalize());
    frame.focusDist = VIEW_DISTANCE;
    placeTour();
    forward.subVectors(target, eye).normalize();
    right.crossVectors(forward, WORLD_UP).normalize();
    up.crossVectors(right, forward);
    eye.addScaledVector(right, pointer.x * 0.35 * pointer.on).addScaledVector(up, pointer.y * 0.22 * pointer.on);
    camera.position.copy(eye);
    camera.up.copy(WORLD_UP);
    camera.lookAt(target);
    const travelling = Math.sin(Math.PI * (frame.chapter % 1));
    camera.rotateZ(Math.max(-0.22, Math.min(0.22, -sideways * 0.35)) * travelling);
  };

  let raf = 0;
  let running = false;
  let last = 0;
  const started = performance.now();

  const draw = (now: number) => {
    // Capped, so a frame after the tab was hidden doesn't jump, but loose
    // enough that slow machines still move in real time.
    const dt = Math.min((now - last) / 1000, 0.25);
    last = now;
    frame.time = (now - started) / 1000;

    timeline.read(window.scrollY, height, reading);
    const k = first ? 1 : ease(4.5, dt);
    frame.chapter += (reading.chapter - frame.chapter) * k;
    reading.progress.forEach((p, i) => {
      frame.progress[i] += (p - frame.progress[i]) * (first ? 1 : ease(7, dt));
    });
    first = false;

    frame.focus.forEach((w, i) => {
      frame.focus[i] += ((stageState.focus === i ? 1 : 0) - w) * ease(6, dt);
    });

    const pointer = frame.pointer;
    pointer.x += (pointerTarget.x - pointer.x) * ease(5, dt);
    pointer.y += (pointerTarget.y - pointer.y) * ease(5, dt);
    pointer.on += ((pointerTarget.active ? 1 : 0) - pointer.on) * ease(3, dt);
    pointer.press += ((pointerTarget.down ? 1 : 0) - pointer.press) * ease(pointerTarget.down ? 4 : 2, dt);

    // A spun network coasts on after it's let go, slowing to a stop, then
    // drifts back round to face you, where its tags read best.
    if (!stageState.spinning) {
      stageState.spin += stageState.spinSpeed * dt;
      stageState.spinSpeed *= Math.exp(-2.2 * dt);
      if (Math.abs(stageState.spinSpeed) < 0.15) {
        const facing = Math.round(stageState.spin / (2 * Math.PI)) * 2 * Math.PI;
        stageState.spin += (facing - stageState.spin) * ease(0.6, dt);
      }
    }
    frame.spin = stageState.spin;

    frame.intro = stageState.openedAt ? Math.min(1, (now - stageState.openedAt) / INTRO_MS) : 0;
    // AboutSideways slides its panels over 4% → 96% of the pinned scroll.
    frame.aboutAt = Math.min(1, Math.max(0, (frame.progress[1] - 0.04) / 0.92)) * (STOP_COUNT - 1);
    if (frame.chapter > 0.05 && frame.chapter < 2.5) placeStops();
    if (frame.chapter > 3.5) placeRing();
    // Each Skills layer locks into place as its stretch of the scene scrolls by.
    frame.layers.forEach((_, k) => {
      const at = stageState.layerAt[k];
      frame.layers[k] = stageState.layers[k] = smooth(at - 0.05, at + 0.04, frame.progress[3]);
    });

    placeCamera();
    backdropUniforms.uDrift.value.set(pointer.x * 0.08 * pointer.on, pointer.y * 0.06 * pointer.on);
    dustUniforms.uTime.value = frame.time;

    piece.update(frame);
    lens.render(frame.time);
    sendLabels();
    adapt(dt);
  };

  const render = (now: number) => {
    raf = requestAnimationFrame(render);
    draw(now);
  };

  // If the first couple of seconds after the intro run slow (an integrated
  // GPU on a big screen, say), drop the bloom; if that's still not enough,
  // draw at one pixel per CSS pixel.
  const sampled = { frames: 0, seconds: 0, steps: 0 };
  const adapt = (dt: number) => {
    if (frame.intro < 1 || sampled.steps >= 2) return;
    sampled.frames += 1;
    sampled.seconds += dt;
    if (sampled.frames < 120) return;
    const slow = sampled.seconds / sampled.frames > 1 / 40;
    sampled.frames = 0;
    sampled.seconds = 0;
    sampled.steps = slow ? sampled.steps + 1 : 2;
    if (!slow) return;
    if (sampled.steps === 1) {
      lens.lighten();
    } else if (renderer.getPixelRatio() > 1) {
      renderer.setPixelRatio(1);
      renderer.setSize(width, height, false);
      lens.setSize(width, height, 1);
      frame.viewH = height;
      dustUniforms.uPixel.value = 1;
      dustUniforms.uViewH.value = height;
    }
  };

  // While developing: the eased state, and a way to step frames by hand
  // when the page is in a hidden tab (where the browser stops animating).
  if (import.meta.env.DEV) {
    Object.assign(window, {
      __stageFrame: frame,
      __stageState: stageState,
      __stageNodes: () => piece.nodes?.().map((n) => n.clone().project(camera)),
      __stageStep: (frames = 1) => {
        for (let i = 0; i < frames; i++) draw(last + 100);
      },
    });
  }

  applyTheme(opts.theme);

  return {
    setTheme: applyTheme,
    setPointer: (ndc) => {
      pointerTarget.active = !!ndc;
      if (ndc) {
        pointerTarget.x = ndc.x;
        pointerTarget.y = ndc.y;
      }
    },
    setPress: (down) => {
      pointerTarget.down = down;
    },
    resize: (w, h) => {
      width = Math.max(1, w);
      height = Math.max(1, h);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      frame.aspect = width / height;
      // The layout follows the window (phones turning, windows resizing);
      // the point budget set at start doesn't.
      frame.mobile = width < 768;
      frame.halfW = frame.halfH * frame.aspect;
      frame.viewH = height * renderer.getPixelRatio();
      lens.setSize(width, height, renderer.getPixelRatio());
      backdropUniforms.uAspect.value = frame.aspect;
      dustUniforms.uViewH.value = frame.viewH;
    },
    start: () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(render);
    },
    stop: () => {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose: () => {
      running = false;
      cancelAnimationFrame(raf);
      timeline.dispose();
      nameWatch.disconnect();
      clearTimeout(nameTimer);
      delete document.documentElement.dataset.stageName;
      piece.dispose();
      lens.dispose();
      backdropGeometry.dispose();
      backdropMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
};
