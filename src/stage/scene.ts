import {
  Color,
  Mesh,
  NoToneMapping,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Vector2,
  WebGLRenderer,
} from "three";

// The page's 3D stage: one fixed canvas behind every section. A full-screen
// shader paints the background, its soft glows and an endless grid floor that
// the camera glides over as the page scrolls.

export type Theme = "light" | "dark";

export type Stage = {
  setTheme: (theme: Theme) => void;
  setPointer: (ndc: { x: number; y: number } | null) => void;
  resize: (width: number, height: number) => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

// Matches index.css and the CSS Background it replaces.
const THEMES = {
  light: {
    bg: "#f4f1ea",
    line: "#003399",
    lineAlpha: 0.2,
    glows: [["#ffffff", 0.6], ["#eadfcd", 0.55], ["#c45c26", 0.07]] as const,
  },
  dark: {
    bg: "#0a0a0d",
    line: "#94a3b8",
    lineAlpha: 0.13,
    glows: [["#1e3a8a", 0.55], ["#312e81", 0.5], ["#5b21b6", 0.2]] as const,
  },
};

const FOV = 40;
const CAMERA_HEIGHT = 4;
const CAMERA_PITCH = -0.32; // look down at the floor; horizon sits near the top
const TRAVEL = 0.0035; // world units the camera moves per pixel scrolled

const backdropVertex = /* glsl */ `
  varying vec3 vDir;
  varying vec2 vNdc;
  void main() {
    vNdc = position.xy;
    // Direction of the camera ray through this corner, in world space.
    vec4 view = inverse(projectionMatrix) * vec4(position.xy, 1.0, 1.0);
    vDir = (inverse(viewMatrix) * vec4(view.xyz / view.w, 0.0)).xyz;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const backdropFragment = /* glsl */ `
  uniform vec3 uBg;
  uniform vec3 uLine;
  uniform float uLineAlpha;
  uniform vec3 uGlow[3];
  uniform float uGlowAlpha[3];
  uniform float uAspect;
  uniform vec2 uDrift;
  varying vec3 vDir;
  varying vec2 vNdc;

  float glow(vec2 p, vec2 c, float r) {
    vec2 d = (p - c) / r;
    return exp(-dot(d, d));
  }

  void main() {
    vec3 col = uBg;

    // Soft colour fields, drifting a little with the pointer.
    vec2 p = vec2(vNdc.x * uAspect, vNdc.y);
    col = mix(col, uGlow[0], uGlowAlpha[0] * glow(p, vec2(0.9 * uAspect, 0.85) + uDrift, 1.1));
    col = mix(col, uGlow[1], uGlowAlpha[1] * glow(p, vec2(-0.85 * uAspect, -0.9) - uDrift, 1.3));
    col = mix(col, uGlow[2], uGlowAlpha[2] * glow(p, vec2(-0.2, 0.1) + uDrift * 1.5, 0.9));

    // Endless floor grid where the ray meets y = 0.
    vec3 dir = normalize(vDir);
    if (dir.y < -1e-4) {
      float t = -cameraPosition.y / dir.y;
      vec2 coord = (cameraPosition + dir * t).xz / 0.75;
      vec2 w = fwidth(coord);
      vec2 g = abs(fract(coord - 0.5) - 0.5) / max(w, vec2(1e-4));
      float line = 1.0 - min(min(g.x, g.y), 1.0);
      // Fade with distance, and where cells shrink to a few pixels (moire).
      float fade = exp(-t * 0.035) * (1.0 - smoothstep(0.12, 0.5, max(w.x, w.y)));
      col = mix(col, uLine, line * uLineAlpha * fade);
    }

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export const createStage = (canvas: HTMLCanvasElement, opts: { theme: Theme; mobile: boolean }): Stage => {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, opts.mobile ? 1.25 : 1.5));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = NoToneMapping; // keep page colours exact

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 200);
  camera.position.set(0, CAMERA_HEIGHT, 0);
  camera.rotation.order = "YXZ";

  const uniforms = {
    uBg: { value: new Color() },
    uLine: { value: new Color() },
    uLineAlpha: { value: 0 },
    uGlow: { value: [new Color(), new Color(), new Color()] },
    uGlowAlpha: { value: [0, 0, 0] },
    uAspect: { value: 1 },
    uDrift: { value: new Vector2() },
  };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: backdropVertex,
    fragmentShader: backdropFragment,
    depthTest: false,
    depthWrite: false,
  });
  const geometry = new PlaneGeometry(2, 2);
  const backdrop = new Mesh(geometry, material);
  backdrop.frustumCulled = false;
  scene.add(backdrop);

  let dirty = true;
  const applyTheme = (theme: Theme) => {
    const t = THEMES[theme];
    uniforms.uBg.value.set(t.bg);
    uniforms.uLine.value.set(t.line);
    uniforms.uLineAlpha.value = t.lineAlpha;
    t.glows.forEach(([c, a], i) => {
      uniforms.uGlow.value[i].set(c);
      uniforms.uGlowAlpha.value[i] = a;
    });
    dirty = true;
  };

  // Eased state.
  let camZ = 0;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0, on: 0, active: false };

  let raf = 0;
  let running = false;
  let last = 0;

  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    const ease = (rate: number) => 1 - Math.exp(-rate * dt);

    const targetZ = -window.scrollY * TRAVEL;
    const moving = Math.abs(targetZ - camZ) > 1e-4;
    camZ += (targetZ - camZ) * ease(10);

    pointer.x += (pointer.tx - pointer.x) * ease(5);
    pointer.y += (pointer.ty - pointer.y) * ease(5);
    const onTarget = pointer.active ? 1 : 0;
    pointer.on += (onTarget - pointer.on) * ease(3);
    const steering =
      Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) + Math.abs(onTarget - pointer.on) > 1e-3;

    // Nothing changes on screen while the page and pointer are still.
    if (!dirty && !moving && !steering) return;
    dirty = false;

    camera.position.z = camZ;
    camera.rotation.x = CAMERA_PITCH + pointer.y * 0.025 * pointer.on;
    camera.rotation.y = -pointer.x * 0.035 * pointer.on;
    uniforms.uDrift.value.set(pointer.x * 0.08 * pointer.on, pointer.y * 0.06 * pointer.on);
    renderer.render(scene, camera);
  };

  applyTheme(opts.theme);

  return {
    setTheme: applyTheme,
    setPointer: (ndc) => {
      pointer.active = !!ndc;
      if (ndc) {
        pointer.tx = ndc.x;
        pointer.ty = ndc.y;
      }
    },
    resize: (w, h) => {
      renderer.setSize(Math.max(1, w), Math.max(1, h), false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uAspect.value = w / h;
      dirty = true;
    },
    start: () => {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop: () => {
      running = false;
      cancelAnimationFrame(raf);
    },
    dispose: () => {
      running = false;
      cancelAnimationFrame(raf);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
};
