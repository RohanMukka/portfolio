import { Vector2, type Camera, type Scene, type WebGLRenderer } from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import type { Theme } from "../lib/theme";

// The stage's camera "lens": the scene is drawn to a buffer, its brightest
// points bloom into soft glow (dark theme only; on paper glow reads as
// smudge), then the frame gets a film finish: a fine moving grain, a
// vignette, and a trace of colour fringing toward the corners.

const LOOK = {
  dark: { bloom: true, grain: 0.055, vignette: 0.55, fringe: 0.6 },
  light: { bloom: false, grain: 0.035, vignette: 0.12, fringe: 0.25 },
};

const FilmShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uGrain: { value: 0 },
    uVignette: { value: 0 },
    uFringe: { value: 0 },
    uResolution: { value: new Vector2(1, 1) },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uGrain;
    uniform float uVignette;
    uniform float uFringe;
    uniform vec2 uResolution;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 c = vUv - 0.5;
      float aspect = uResolution.x / uResolution.y;
      // Fringing grows toward the corners, a few pixels at most.
      vec2 shift = c * dot(c, c) * uFringe * 0.02;
      vec3 col = vec3(
        texture2D(tDiffuse, vUv - shift).r,
        texture2D(tDiffuse, vUv).g,
        texture2D(tDiffuse, vUv + shift).b
      );
      float edge = length(c * vec2(aspect, 1.0)) / length(vec2(aspect, 1.0) * 0.5);
      col *= 1.0 - uVignette * smoothstep(0.35, 1.05, edge);
      // Grain changes every frame, in whole pixels.
      col += (hash(floor(vUv * uResolution) + fract(uTime * 7.3) * 91.7) - 0.5) * uGrain;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
};

export type Lens = {
  render: (time: number) => void;
  setTheme: (theme: Theme) => void;
  setSize: (width: number, height: number, pixelRatio: number) => void;
  /** Drops the bloom, the costliest part, when the machine is struggling. */
  lighten: () => void;
  dispose: () => void;
};

export const createLens = (renderer: WebGLRenderer, scene: Scene, camera: Camera, theme: Theme): Lens => {
  // Half-float buffers, so additive glow can run past white before the bloom.
  const composer = new EffectComposer(renderer);

  const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.7, 0.5, 0.6);
  const film = new ShaderPass(FilmShader);
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  composer.addPass(film);

  let canBloom = true;
  const setTheme = (next: Theme) => {
    const look = LOOK[next];
    bloom.enabled = look.bloom && canBloom;
    film.uniforms.uGrain.value = look.grain;
    film.uniforms.uVignette.value = look.vignette;
    film.uniforms.uFringe.value = look.fringe;
  };
  setTheme(theme);

  return {
    render: (time) => {
      film.uniforms.uTime.value = time;
      composer.render();
    },
    setTheme,
    setSize: (width, height, pixelRatio) => {
      composer.setPixelRatio(pixelRatio);
      composer.setSize(width, height);
      film.uniforms.uResolution.value.set(width * pixelRatio, height * pixelRatio);
    },
    lighten: () => {
      canBloom = false;
      bloom.enabled = false;
    },
    dispose: () => {
      bloom.dispose();
      composer.dispose();
    },
  };
};
