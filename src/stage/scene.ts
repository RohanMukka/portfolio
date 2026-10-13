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
import { LAYER_COUNT, NODE_COUNT, STOP_COUNT, type Frame, type Piece } from "./piece";
import { emitStageLabels, stageState, type LabelSet, type ScreenPoint } from "./store";
import { CHAPTERS, createTimeline, type TimelineReading } from "./timeline";

// The page's 3D stage: one fixed canvas behind every section. A backdrop of
// soft glows and a faint dot grid, a drift of dust at many depths that
// parallaxes as the page scrolls, and the centrepiece, tens of thousands of
// points that take a new shape for each chapter of the page (particles.ts).

export type Stage = {
  setTheme: (theme: Theme) => void;
  setPointer: (ndc: { x: number; y: number } | null) => void;
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
    dotAlpha: 0.07,
    dust: "#a5b4fc",
    dustAlpha: 0.55,
  },
  light: {
    bg: "#f4f1ea",
    glows: [["#ffffff", 0.6], ["#eadfcd", 0.55], ["#c45c26", 0.07]] as const,
    dots: "#003399",
    dotAlpha: 0.09,
    dust: "#003399",
    dustAlpha: 0.35,
  },
};

const FOV = 40;
const CAMERA_Z = 10;
const PLANE_Z = -6; // the backdrop plane, see glsl.ts
const INTRO_MS = 2200;

const backdropVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    // Direction of the camera ray through this corner, in world space.
    vec4 view = inverse(projectionMatrix) * vec4(position.xy, 1.0, 1.0);
    vDir = (inverse(viewMatrix) * vec4(view.xyz / view.w, 0.0)).xyz;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const backdropFragment = /* glsl */ `
  varying vec3 vDir;
  ${BACKDROP}
  void main() {
    gl_FragColor = vec4(backdrop(cameraPosition, normalize(vDir)), 1.0);
    #include <colorspace_fragment>
  }
`;

const dustVertex = /* glsl */ `
  attribute vec4 aSeed;
  uniform float uScroll;
  uniform float uTime;
  uniform float uTanHalf;
  uniform float uAspect;
  uniform float uPixel;
  varying float vAlpha;
  void main() {
    float depth = aSeed.z;
    float z = mix(-14.0, 5.0, depth * depth);
    float spanY = 2.0 * (${CAMERA_Z.toFixed(1)} - z) * uTanHalf * 1.15;
    float y = (aSeed.y - 0.5) * spanY + uScroll * mix(0.15, 1.3, depth) + uTime * 0.03 * (0.5 + aSeed.w);
    y = mod(y + spanY * 0.5, spanY) - spanY * 0.5;
    vec4 mv = modelViewMatrix * vec4((aSeed.x - 0.5) * spanY * uAspect, y, z, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = mix(1.0, 3.2, depth) * uPixel;
    // Twinkle, and fade at the wrap so no mote pops in or out.
    vAlpha = (0.35 + 0.65 * pow(0.5 + 0.5 * sin(uTime * (0.6 + aSeed.w) + aSeed.x * 40.0), 3.0))
      * (1.0 - smoothstep(0.42, 0.5, abs(y / spanY))) * mix(0.35, 1.0, depth);
  }
`;

const dustFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  varying float vAlpha;
  void main() {
    float soft = smoothstep(0.5, 0.0, length(gl_PointCoord - 0.5));
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
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 200);
  camera.position.set(0, 0, CAMERA_Z);
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
    uPlaneHalfH: { value: (CAMERA_Z - PLANE_Z) * tanHalf },
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
  const DUST = opts.mobile ? 500 : 1400;
  const dustSeeds = new Float32Array(DUST * 4).map(() => Math.random());
  const dustGeometry = new BufferGeometry();
  dustGeometry.setAttribute("position", new BufferAttribute(new Float32Array(DUST * 3), 3));
  dustGeometry.setAttribute("aSeed", new BufferAttribute(dustSeeds, 4));
  const dustUniforms = {
    uScroll: { value: 0 },
    uTime: { value: 0 },
    uTanHalf: { value: tanHalf },
    uAspect: { value: 1 },
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
  };

  // Centrepiece
  const piece: Piece = createParticles({ mobile: opts.mobile, theme });
  scene.add(piece.object);

  // Eased state
  const timeline = createTimeline();
  const reading: TimelineReading = { chapter: 0, progress: CHAPTERS.map(() => 0) };
  const frame: Frame = {
    time: 0,
    chapter: 0,
    progress: CHAPTERS.map(() => 0),
    pointer: { x: 0, y: 0, on: 0 },
    intro: 0,
    focus: new Array(NODE_COUNT).fill(0),
    halfW: 1,
    halfH: CAMERA_Z * tanHalf,
    aspect: 1,
    mobile: opts.mobile,
    viewH: 1,
    tanHalf,
    ring: { x: 0, y: 0, r: 3 },
    stops: Array.from({ length: STOP_COUNT }, (_, i) => ({ x: (i - 1) * 6, y: 0 })),
    aboutAt: 0,
    stop: { x: 0, y: 0 },
  };
  const pointerTarget = { x: 0, y: 0, active: false };
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

    frame.intro = stageState.openedAt ? Math.min(1, (now - stageState.openedAt) / INTRO_MS) : 0;
    // AboutSideways slides its panels over 4% → 96% of the pinned scroll.
    frame.aboutAt = Math.min(1, Math.max(0, (frame.progress[1] - 0.04) / 0.92)) * (STOP_COUNT - 1);
    if (frame.chapter > 0.05 && frame.chapter < 2.5) placeStops();
    if (frame.chapter > 3.5) placeRing();

    camera.position.set(pointer.x * 0.35 * pointer.on, pointer.y * 0.22 * pointer.on, CAMERA_Z);
    camera.lookAt(0, 0, 0);
    backdropUniforms.uDrift.value.set(pointer.x * 0.08 * pointer.on, pointer.y * 0.06 * pointer.on);
    dustUniforms.uScroll.value = (window.scrollY / height) * 2 * frame.halfH;
    dustUniforms.uTime.value = frame.time;

    piece.update(frame);
    renderer.render(scene, camera);
    sendLabels();
    adapt(dt);
  };

  const render = (now: number) => {
    raf = requestAnimationFrame(render);
    draw(now);
  };

  // If the first couple of seconds after the intro run slow (an integrated
  // GPU on a big screen, say), draw at one pixel per CSS pixel instead.
  const sampled = { frames: 0, seconds: 0 };
  const adapt = (dt: number) => {
    if (frame.intro < 1 || sampled.frames >= 120) return;
    sampled.frames += 1;
    sampled.seconds += dt;
    if (sampled.frames < 120 || sampled.seconds / sampled.frames < 1 / 40 || renderer.getPixelRatio() <= 1) return;
    renderer.setPixelRatio(1);
    renderer.setSize(width, height, false);
    frame.viewH = height;
    dustUniforms.uPixel.value = 1;
  };

  // While developing: the eased state, and a way to step frames by hand
  // when the page is in a hidden tab (where the browser stops animating).
  if (import.meta.env.DEV) {
    Object.assign(window, {
      __stageFrame: frame,
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
      backdropUniforms.uAspect.value = frame.aspect;
      dustUniforms.uAspect.value = frame.aspect;
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
      piece.dispose();
      backdropGeometry.dispose();
      backdropMaterial.dispose();
      dustGeometry.dispose();
      dustMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
};
