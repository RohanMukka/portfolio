import {
  BufferAttribute,
  BufferGeometry,
  HalfFloatType,
  Mesh,
  OrthographicCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderTarget,
  type Camera,
  type IUniform,
  type WebGLRenderer,
} from "three";
import type { Theme } from "../lib/theme";
import type { StagePass } from "./store";

// The stage's camera "lens". The scene is drawn into a half-float buffer; in
// the dark theme its brightest points bloom into soft glow (on paper glow
// reads as smudge, so the light theme has none); then one last pass adds the
// glow, converts to the screen's colours and gives the frame its film finish
// (a fine moving grain, a vignette, a trace of colour fringing toward the
// corners), straight onto the screen.
//
// The bloom is three.js's UnrealBloomPass, pass for pass and number for
// number (the look was approved with it), but the chain around it is folded
// together: the old EffectComposer chain went over the full screen four
// times a frame (scene, bloom blend, colour conversion, film), this one
// twice (scene, finish).
//
//   dark:  scene (3 draws) + bright pass + 5 × 2 blurs + composite + finish = 16 draw calls (was 18)
//   light: scene (3 draws) + finish                                        =  4 draw calls (was 5)

const LOOK = {
  dark: { bloom: true, grain: 0.055, vignette: 0.55, fringe: 0.6 },
  light: { bloom: false, grain: 0.035, vignette: 0.12, fringe: 0.25 },
};

// UnrealBloomPass(strength 0.7, radius 0.5, threshold 0.6): pixels brighter
// than the threshold are blurred at five halvings of resolution, each with a
// wider kernel; each blurred level weighs mix(f, 1.2 - f, 0.5) = 0.6 times
// the strength. Its composite was then added with that same composite's
// alpha (the sum of the five weights, 2.1) as the blend factor, so the glow
// it added was weight × 2.1 × the sum of the levels. GLOW is that product.
const THRESHOLD = 0.6;
const KERNELS = [3, 5, 7, 9, 11];
const LEVEL_WEIGHT = 0.7 * 0.6;
const GLOW = LEVEL_WEIGHT * (LEVEL_WEIGHT * KERNELS.length);

export type Lens = {
  /** Compiles the lens's shaders ahead of the first frame (see scene.ts). */
  compile: () => Promise<unknown>;
  render: (time: number) => void;
  setTheme: (theme: Theme) => void;
  setSize: (width: number, height: number, pixelRatio: number) => void;
  /** Drops the bloom, the costliest part, when the machine is struggling. */
  lighten: () => void;
  /** The passes a frame runs and the memory its buffers take, for X-Ray. */
  describe: () => { passes: StagePass[]; bytes: number };
  dispose: () => void;
};

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Keeps only what's bright enough to glow (LuminosityHighPassShader).
const brightShader = /* glsl */ `
  uniform sampler2D tSource;
  varying vec2 vUv;
  void main() {
    vec4 texel = texture2D(tSource, vUv);
    float glow = smoothstep(${THRESHOLD.toFixed(2)}, ${(THRESHOLD + 0.01).toFixed(2)}, luminance(texel.rgb));
    gl_FragColor = vec4(texel.rgb * glow, 1.0);
  }
`;

// One direction of a separable Gaussian, sigma = KERNEL_RADIUS texels of the
// level being drawn, truncated at that radius (as UnrealBloomPass's).
const blurShader = /* glsl */ `
  uniform sampler2D tSource;
  uniform vec2 uStep;
  uniform float uWeights[KERNEL_RADIUS];
  varying vec2 vUv;
  void main() {
    float weightSum = uWeights[0];
    vec3 sum = texture2D(tSource, vUv).rgb * weightSum;
    for (int i = 1; i < KERNEL_RADIUS; i++) {
      vec2 offset = uStep * float(i);
      sum += (texture2D(tSource, vUv + offset).rgb + texture2D(tSource, vUv - offset).rgb) * uWeights[i];
      weightSum += 2.0 * uWeights[i];
    }
    gl_FragColor = vec4(sum / weightSum, 1.0);
  }
`;

const compositeShader = /* glsl */ `
  uniform sampler2D tLevel0;
  uniform sampler2D tLevel1;
  uniform sampler2D tLevel2;
  uniform sampler2D tLevel3;
  uniform sampler2D tLevel4;
  varying vec2 vUv;
  void main() {
    vec3 sum = texture2D(tLevel0, vUv).rgb + texture2D(tLevel1, vUv).rgb + texture2D(tLevel2, vUv).rgb
      + texture2D(tLevel3, vUv).rgb + texture2D(tLevel4, vUv).rgb;
    gl_FragColor = vec4(sum * ${GLOW.toFixed(4)}, 1.0);
  }
`;

// The finish: glow added in linear light, then to sRGB for the screen, then
// the film look over it, as the old chain's separate passes did it.
const finishShader = /* glsl */ `
  uniform sampler2D tScene;
  uniform sampler2D tBloom;
  uniform float uBloom;
  uniform float uTime;
  uniform float uGrain;
  uniform float uVignette;
  uniform float uFringe;
  uniform vec2 uResolution;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  vec3 lit(vec2 uv) {
    return texture2D(tScene, uv).rgb + texture2D(tBloom, uv).rgb * uBloom;
  }
  vec3 toSRGB(vec3 c) {
    c = max(c, 0.0);
    return mix(pow(c, vec3(0.41666)) * 1.055 - 0.055, c * 12.92, vec3(lessThanEqual(c, vec3(0.0031308))));
  }

  void main() {
    vec2 c = vUv - 0.5;
    float aspect = uResolution.x / uResolution.y;
    // Fringing grows toward the corners, a few pixels at most.
    vec2 shift = c * dot(c, c) * uFringe * 0.02;
    vec3 col = toSRGB(vec3(lit(vUv - shift).r, lit(vUv).g, lit(vUv + shift).b));
    float edge = length(c * vec2(aspect, 1.0)) / length(vec2(aspect, 1.0) * 0.5);
    col *= 1.0 - uVignette * smoothstep(0.35, 1.05, edge);
    // Grain changes every frame, in whole pixels.
    col += (hash(floor(vUv * uResolution) + fract(uTime * 7.3) * 91.7) - 0.5) * uGrain;
    gl_FragColor = vec4(col, 1.0);
  }
`;

// One triangle that covers the screen, for every full-frame pass.
const fullScreenTriangle = () => {
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array([-1, 3, 0, -1, -1, 0, 3, -1, 0]), 3));
  geometry.setAttribute("uv", new BufferAttribute(new Float32Array([0, 2, 0, 0, 2, 0]), 2));
  return geometry;
};

const buffer = () => new WebGLRenderTarget(1, 1, { type: HalfFloatType, depthBuffer: false });

// UnrealBloomPass's kernel weights for a blur of the given radius.
const gaussian = (radius: number) =>
  Array.from({ length: radius }, (_, i) => (0.39894 * Math.exp((-0.5 * i * i) / (radius * radius))) / radius);

export const createLens = (renderer: WebGLRenderer, scene: Scene, camera: Camera, theme: Theme): Lens => {
  const triangle = fullScreenTriangle();
  const ortho = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const pass = (fragmentShader: string, uniforms: Record<string, IUniform>, defines?: Record<string, number>) => {
    const material = new ShaderMaterial({ vertexShader, fragmentShader, uniforms, defines, depthTest: false, depthWrite: false });
    const mesh = new Mesh(triangle, material);
    mesh.frustumCulled = false;
    return mesh;
  };

  // Half-float buffers, so additive glow can run past white before the bloom.
  const sceneTarget = buffer();
  const bright = buffer();
  const across = KERNELS.map(buffer);
  const down = KERNELS.map(buffer);
  const composite = buffer();

  const brightPass = pass(brightShader, { tSource: { value: sceneTarget.texture } });
  // Each level blurs across, then down; it starts from the level above it.
  const blurPasses = KERNELS.flatMap((radius, i) => [
    pass(blurShader, { tSource: { value: (i === 0 ? bright : down[i - 1]).texture }, uStep: { value: new Vector2() }, uWeights: { value: gaussian(radius) } }, { KERNEL_RADIUS: radius }),
    pass(blurShader, { tSource: { value: across[i].texture }, uStep: { value: new Vector2() }, uWeights: { value: gaussian(radius) } }, { KERNEL_RADIUS: radius }),
  ]);
  const compositePass = pass(
    compositeShader,
    Object.fromEntries(down.map((level, i) => [`tLevel${i}`, { value: level.texture }])),
  );
  const finish = pass(finishShader, {
    tScene: { value: sceneTarget.texture },
    tBloom: { value: composite.texture },
    uBloom: { value: 0 },
    uTime: { value: 0 },
    uGrain: { value: 0 },
    uVignette: { value: 0 },
    uFringe: { value: 0 },
    uResolution: { value: new Vector2(1, 1) },
  });

  let bloom = true;
  let canBloom = true;
  const setTheme = (next: Theme) => {
    const look = LOOK[next];
    bloom = look.bloom && canBloom;
    const u = finish.material.uniforms;
    u.uBloom.value = bloom ? 1 : 0;
    u.uGrain.value = look.grain;
    u.uVignette.value = look.vignette;
    u.uFringe.value = look.fringe;
  };
  setTheme(theme);

  const draw = (mesh: Mesh, into: WebGLRenderTarget | null) => {
    renderer.setRenderTarget(into);
    renderer.render(mesh, ortho);
  };

  return {
    compile: () => {
      // Programs differ by target: the bloom passes draw into buffers, the
      // finish onto the screen.
      const buffers = new Scene().add(brightPass, ...blurPasses, compositePass);
      const screen = new Scene().add(finish);
      renderer.setRenderTarget(sceneTarget);
      const ready = renderer.compileAsync(buffers, ortho);
      renderer.setRenderTarget(null);
      const done = Promise.all([ready, renderer.compileAsync(screen, ortho)]);
      [brightPass, ...blurPasses, compositePass, finish].forEach((mesh) => mesh.removeFromParent());
      return done;
    },
    render: (time) => {
      renderer.setRenderTarget(sceneTarget);
      renderer.render(scene, camera);
      if (bloom) {
        draw(brightPass, bright);
        KERNELS.forEach((_, i) => {
          draw(blurPasses[i * 2], across[i]);
          draw(blurPasses[i * 2 + 1], down[i]);
        });
        draw(compositePass, composite);
      }
      finish.material.uniforms.uTime.value = time;
      draw(finish, null);
    },
    setTheme,
    describe: () => {
      const size = (t: WebGLRenderTarget) => ({ width: t.width, height: t.height });
      const passes: StagePass[] = [{ name: "Scene", ...size(sceneTarget), draws: 3 }];
      if (bloom) {
        passes.push({ name: "Bright pass", ...size(bright), draws: 1 });
        KERNELS.forEach((radius, i) => passes.push({ name: `Blur ${i + 1} (r ${radius}, ×2)`, ...size(down[i]), draws: 2 }));
        passes.push({ name: "Bloom composite", ...size(composite), draws: 1 });
      }
      passes.push({ name: "Finish → screen", ...size(sceneTarget), draws: 1 });
      // Half-float RGBA: 8 bytes a pixel.
      const targets = [sceneTarget, bright, ...across, ...down, composite];
      return { passes, bytes: targets.reduce((sum, t) => sum + t.width * t.height * 8, 0) };
    },
    setSize: (width, height, pixelRatio) => {
      const w = Math.max(1, Math.floor(width * pixelRatio));
      const h = Math.max(1, Math.floor(height * pixelRatio));
      sceneTarget.setSize(w, h);
      // Half size for the bright pass and the first level, halving from there.
      let lw = Math.round(w / 2);
      let lh = Math.round(h / 2);
      bright.setSize(lw, lh);
      composite.setSize(lw, lh);
      KERNELS.forEach((_, i) => {
        across[i].setSize(lw, lh);
        down[i].setSize(lw, lh);
        blurPasses[i * 2].material.uniforms.uStep.value.set(1 / lw, 0);
        blurPasses[i * 2 + 1].material.uniforms.uStep.value.set(0, 1 / lh);
        lw = Math.max(1, Math.round(lw / 2));
        lh = Math.max(1, Math.round(lh / 2));
      });
      finish.material.uniforms.uResolution.value.set(w, h);
    },
    lighten: () => {
      canBloom = false;
      bloom = false;
      finish.material.uniforms.uBloom.value = 0;
    },
    dispose: () => {
      [sceneTarget, bright, ...across, ...down, composite].forEach((target) => target.dispose());
      [brightPass, ...blurPasses, compositePass, finish].forEach((mesh) => mesh.material.dispose());
      triangle.dispose();
    },
  };
};
