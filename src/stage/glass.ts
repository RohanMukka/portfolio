import { Color, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial, Vector2, Vector3 } from "three";
import type { Theme } from "../lib/theme";
import { BACKDROP, NOISE, PALETTE } from "./glsl";
import type { Frame, Piece } from "./piece";

// "Liquid glass": one glass form that changes shape per chapter.
//   0 hero      a large liquid blob behind the name, its surface rolling
//   1 about     a lens beside the story, turning as the panels slide
//   2 work      the lens opens a hole and becomes a ring
//   3 skills    the ring twists and ripples
//   4 creds     a quiet pebble
//   5 contact   a thin ring framing the closing line
// The surface is one grid of (u, v) points that every shape is a function
// of, so any shape morphs into any other. The shader bends the page's
// backdrop (its glows and dot grid) through the surface with a little
// colour dispersion, and reflects a soft studio of lights at the edges.

const PALETTES = {
  dark: { a: "#3b6cff", b: "#e0457b", c: "#ff7a3d", light: 0 },
  light: { a: "#1d3fbf", b: "#b83266", c: "#c45c26", light: 1 },
};

const vertexShader = /* glsl */ `
  #define TAU 6.28318530718
  #define PI 3.14159265359

  uniform float uTime;
  uniform float uFrom;
  uniform float uTo;
  uniform float uMix;
  uniform float uIntro;
  uniform float uAbout;
  uniform float uHalfW;
  uniform float uHalfH;
  uniform float uMobile;
  uniform vec2 uPointer;
  uniform float uPointerOn;
  uniform vec3 uRing;
  uniform vec2 uStop;

  varying vec3 vWorld;
  varying vec3 vNormal;

  ${NOISE}

  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
  }

  vec3 rotX(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
  }

  vec3 sphere(vec2 uv) {
    float th = uv.x * TAU, ph = uv.y * PI;
    return vec3(sin(ph) * cos(th), sin(ph) * sin(th), cos(ph));
  }

  // A torus facing the camera, its tube angle running so that the sphere's
  // front pole opens into the hole.
  vec3 torus(vec2 uv, float R, float r) {
    float th = uv.x * TAU, ps = PI * 0.5 - uv.y * TAU;
    return vec3((R + r * cos(ps)) * cos(th), (R + r * cos(ps)) * sin(th), r * sin(ps));
  }

  // Each shape returns its surface point relative to its centre, and the
  // centre itself, so blends move the form as well as reshape it.
  struct Placed { vec3 p; vec3 c; };

  Placed shape(float k, vec2 uv) {
    Placed o;
    if (k < 0.5) {
      vec3 n = sphere(uv);
      float roll = snoise(n * 0.8 + vec3(0.0, uTime * 0.15, uTime * 0.05)) * 0.18
        + snoise(n * 1.6 - uTime * 0.1) * 0.04;
      o.p = rotY(n * mix(2.1, 1.3, uMobile) * (1.0 + roll), uTime * 0.1);
      o.c = vec3(0.0, 0.0, -0.6);
    } else if (k < 1.5) {
      vec3 n = sphere(uv);
      float roll = snoise(n * 1.4 + uTime * 0.1) * 0.06;
      o.p = rotX(rotY(n * vec3(1.2, 1.2, 0.45) * (1.0 + roll), uAbout * PI * 0.4 - 0.7), 0.3);
      o.c = vec3(uStop, 0.0);
    } else if (k < 2.5) {
      o.p = rotY(rotX(torus(uv, 1.45, 0.55), -0.35 + sin(uTime * 0.3) * 0.12), 0.35 + sin(uTime * 0.25) * 0.45);
      o.c = vec3(mix(uHalfW * 0.5, 0.0, uMobile), mix(0.05, uHalfH * 0.42, uMobile), 0.0);
    } else if (k < 3.5) {
      float th = uv.x * TAU;
      float r = 0.4 + 0.16 * sin(th * 3.0 + uTime * 0.6);
      vec2 tw = vec2(uv.x, uv.y + uv.x * 1.0);
      o.p = rotY(rotX(torus(tw, 1.5, r), -0.5 + sin(uTime * 0.27) * 0.15), 0.4 + sin(uTime * 0.2) * 0.4);
      o.c = vec3(mix(uHalfW * 0.55, 0.0, uMobile), mix(0.0, uHalfH * 0.42, uMobile), -0.8);
    } else if (k < 4.5) {
      vec3 n = sphere(uv);
      float roll = snoise(n * 0.9 + uTime * 0.08) * 0.12;
      o.p = rotX(n * vec3(1.1, 0.8, 0.9) * (1.0 + roll), 0.4);
      o.c = vec3(mix(uHalfW * 0.58, 0.0, uMobile), mix(-0.2, uHalfH * 0.45, uMobile), -1.2);
    } else {
      o.p = torus(uv, uRing.z, 0.13);
      o.p = rotX(o.p, sin(uTime * 0.4) * 0.08);
      o.c = vec3(uRing.xy, 0.0);
    }
    return o;
  }

  vec3 surface(vec2 uv) {
    Placed a = shape(uFrom, uv);
    Placed b = shape(uTo, uv);
    float m = smoothstep(0.0, 1.0, uMix);
    vec3 p = mix(a.p, b.p, m);
    // Mid-morph the surface churns a little, like liquid finding its shape.
    p += snoise3(p * 0.8 + uTime * 0.3) * m * (1.0 - m) * 0.6;
    // Leans with the pointer.
    p = rotX(rotY(p, uPointer.x * 0.3 * uPointerOn), -uPointer.y * 0.2 * uPointerOn);
    // The intro: flattened into the loading line, then inflating.
    float open = smoothstep(0.0, 1.0, uIntro);
    p *= vec3(mix(1.6, 1.0, open), open, open);
    return p + mix(a.c, b.c, m) * open;
  }

  void main() {
    float e = 1.0 / 512.0;
    vec3 p = surface(uv);
    vec3 du = surface(uv + vec2(e, 0.0)) - p;
    vec3 dv = surface(uv + vec2(0.0, e)) - p;
    vec3 n = cross(du, dv);
    // At the sphere's poles one direction collapses; fall back to radial.
    n = length(n) < 1e-9 ? p : n;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    vNormal = normalize(mat3(modelMatrix) * n);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uLight;
  varying vec3 vWorld;
  varying vec3 vNormal;

  ${BACKDROP}
  ${PALETTE}

  // A soft studio to reflect: a big white light above left, a brand-orange
  // key on the right, a blue rim from the left and a faint sky.
  vec3 studio(vec3 r) {
    float sky = smoothstep(0.1, 0.9, r.y);
    float key = smoothstep(0.62, 0.93, dot(r, normalize(vec3(-0.6, 0.55, 0.6))));
    float warm = smoothstep(0.74, 0.96, dot(r, normalize(vec3(0.85, -0.1, 0.5))));
    float rim = smoothstep(0.7, 0.95, dot(r, normalize(vec3(-1.0, -0.2, 0.3))));
    vec3 c = sky * 0.18 * vec3(0.8, 0.86, 1.0);
    c += key * vec3(1.0);
    c += warm * 0.95 * uColC;
    c += rim * 0.8 * uColA;
    return c * mix(1.0, 0.55, uLight);
  }

  void main() {
    vec3 V = normalize(vWorld - cameraPosition);
    vec3 N = normalize(vNormal);
    if (dot(N, V) > 0.0) N = -N;
    float facing = clamp(dot(-V, N), 0.0, 1.0);
    float fres = 0.04 + 0.96 * pow(1.0 - facing, 4.0);

    // The backdrop bent through the glass, each channel a little differently.
    vec3 col = vec3(
      backdrop(vWorld, refract(V, N, 1.0 / 1.16)).r,
      backdrop(vWorld, refract(V, N, 1.0 / 1.2)).g,
      backdrop(vWorld, refract(V, N, 1.0 / 1.24)).b
    ) * mix(1.8, 1.0, uLight);
    // Light caught inside: the brand gradient running across the body,
    // strongest where the glass faces you (where it's thickest).
    vec3 inner = mix(uColA, uColC, smoothstep(-0.7, 0.9, -N.y + 0.3 * sin(uTime * 0.2)));
    col += inner * (0.08 + 0.32 * pow(facing, 2.0)) * mix(1.0, 0.45, uLight);
    // Glass picks up colour at grazing angles, shifting with the light.
    vec3 film = palette(fract(facing * 1.3 + uTime * 0.03));
    col += film * pow(1.0 - facing, 2.0) * mix(0.45, 0.22, uLight);
    col = mix(col, studio(reflect(V, N)) + film * 0.3, fres);

    vec3 H = normalize(normalize(vec3(-0.5, 0.8, 0.6)) - V);
    vec3 H2 = normalize(normalize(vec3(0.7, -0.3, 0.6)) - V);
    col += pow(max(dot(N, H), 0.0), 120.0) * mix(1.2, 0.8, uLight);
    col += pow(max(dot(N, H2), 0.0), 50.0) * 0.35 * uColC;
    // On paper the edges darken, the way a lens on a page does.
    col *= 1.0 - uLight * 0.35 * pow(1.0 - facing, 1.5);

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

export const createGlass = (opts: { mobile: boolean; theme: Theme; backdrop: Record<string, { value: unknown }> }): Piece => {
  const geometry = opts.mobile ? new PlaneGeometry(1, 1, 160, 80) : new PlaneGeometry(1, 1, 256, 128);
  // PlaneGeometry's uv runs 0 → 1 in both directions, which is all the
  // shader uses; its positions are ignored.
  const uniforms = {
    ...opts.backdrop,
    uTime: { value: 0 },
    uFrom: { value: 0 },
    uTo: { value: 1 },
    uMix: { value: 0 },
    uIntro: { value: 0 },
    uAbout: { value: 0 },
    uHalfW: { value: 1 },
    uHalfH: { value: 1 },
    uMobile: { value: opts.mobile ? 1 : 0 },
    uPointer: { value: new Vector2() },
    uPointerOn: { value: 0 },
    uRing: { value: new Vector3(0, 0, 3) },
    uStop: { value: new Vector2() },
    uColA: { value: new Color() },
    uColB: { value: new Color() },
    uColC: { value: new Color() },
    uLight: { value: 0 },
  };

  const material = new ShaderMaterial({ uniforms, vertexShader, fragmentShader, side: DoubleSide });
  const mesh = new Mesh(geometry, material);
  mesh.frustumCulled = false;

  const setTheme = (theme: Theme) => {
    const p = PALETTES[theme];
    uniforms.uColA.value.set(p.a);
    uniforms.uColB.value.set(p.b);
    uniforms.uColC.value.set(p.c);
    uniforms.uLight.value = p.light;
  };
  setTheme(opts.theme);

  return {
    object: mesh,
    setTheme,
    update(f: Frame) {
      const from = Math.min(5, Math.floor(f.chapter));
      uniforms.uTime.value = f.time;
      uniforms.uFrom.value = from;
      uniforms.uTo.value = Math.min(5, from + 1);
      uniforms.uMix.value = f.chapter - from;
      uniforms.uIntro.value = f.intro;
      uniforms.uAbout.value = f.aboutAt;
      uniforms.uStop.value.set(f.stop.x, f.stop.y);
      uniforms.uHalfW.value = f.halfW;
      uniforms.uHalfH.value = f.halfH;
      uniforms.uPointer.value.set(f.pointer.x, f.pointer.y);
      uniforms.uPointerOn.value = f.pointer.on;
      uniforms.uRing.value.set(f.ring.x, f.ring.y, f.ring.r);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
};
