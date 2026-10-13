import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Euler,
  Matrix3,
  Matrix4,
  NormalBlending,
  Points,
  ShaderMaterial,
  Vector2,
  Vector3,
} from "three";
import type { Theme } from "../lib/theme";
import { NOISE, PALETTE } from "./glsl";
import { NODE_COUNT, STOP_COUNT, perChapter, type Frame, type Piece } from "./piece";

// "Data becomes a system": tens of thousands of points that tell the page's
// story one shape per chapter.
//   0 hero      a stream of raw data flowing across the screen
//   1 about     the stream pulls taut into a timeline, one bright stop per
//               chapter of the About story, sliding along as it's told
//   2 work      a network: one node per featured project, data flowing down
//               the edges; the hovered project's node flares
//   3 skills    a stack of layers (the rings) wired together by data buses
//   4 creds     a crystal: an icosahedron of light around a warm core
//   5 contact   a ring framing the closing line, with data spiralling in
// Every shape is computed on the GPU from per-point random seeds, so moving
// between chapters is a blend of two functions, each point leaving on its
// own beat and swirling through noise on the way.

const NODES = [
  [-1.7, 1.15, 0.3],
  [0.15, 1.75, -0.6],
  [1.75, 0.95, 0.35],
  [-0.55, 0.15, 1.0],
  [1.05, -0.25, -0.95],
  [-1.85, -0.85, -0.45],
  [0.25, -1.6, 0.55],
  [1.9, -1.35, 0.05],
].map(([x, y, z]) => new Vector3(x, y, z));

const EDGES = [
  [0, 1], [1, 2], [0, 3], [3, 4], [1, 4], [2, 4], [3, 5],
  [5, 6], [3, 6], [4, 7], [6, 7], [2, 7], [0, 5],
].map(([a, b]) => new Vector2(a, b));

const PALETTES = {
  dark: { a: "#3b6cff", b: "#e0457b", c: "#ff7a3d", light: 0 },
  light: { a: "#1d3fbf", b: "#b83266", c: "#c45c26", light: 1 },
};

// How bright the points run in each chapter: down where big text sits on top.
const DIM = { dark: [1, 0.85, 0.9, 0.55, 0.6, 1], light: [1.15, 1, 1, 0.6, 0.7, 1.15] };
// Phones put the shapes behind the text itself, so they sit further back there.
const PHONE_DIM = [1, 0.6, 0.5, 0.4, 0.45, 1];

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
  uniform float uViewH;
  uniform float uTanHalf;
  uniform float uSize;
  uniform float uAspect;
  uniform float uDim;
  uniform vec2 uPointer;
  uniform float uPointerOn;
  uniform vec3 uNodes[8];
  uniform vec2 uEdges[13];
  uniform float uNodeFocus[8];
  uniform float uFocusAmt;
  uniform mat3 uNetRot;
  uniform vec3 uNetCenter;
  uniform vec3 uRing;
  uniform vec3 uStops[5];

  attribute vec4 aSeed;
  attribute vec4 aSeed2;

  varying vec3 vColor;
  varying float vAlpha;

  ${NOISE}
  ${PALETTE}

  struct Shape { vec3 pos; float glow; float hue; float size; };

  vec3 sphereDir(vec2 r) {
    float z = r.x * 2.0 - 1.0;
    float a = r.y * TAU;
    return vec3(sqrt(1.0 - z * z) * vec2(cos(a), sin(a)), z);
  }

  vec3 rotY(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(p.x * c + p.z * s, p.y, -p.x * s + p.z * c);
  }

  vec3 rotX(vec3 p, float a) {
    float c = cos(a), s = sin(a);
    return vec3(p.x, p.y * c - p.z * s, p.y * s + p.z * c);
  }

  // 0 · hero: raw data streaming across the screen, thick in the middle.
  Shape stream(vec4 s, vec4 t) {
    float u = fract(s.x + uTime * 0.006);
    vec3 c = vec3(
      (u - 0.5) * uHalfW * 2.7,
      sin(u * 4.2 + 0.8) * uHalfH * 0.3 + sin(u * 11.0 - uTime * 0.3) * 0.15,
      cos(u * 5.0) * 1.4 - 0.6
    );
    // Thin where it enters and leaves the screen, a broad band mid-way that
    // twists as it flows; a dense bright core with a haze around it.
    float width = 0.2 + 1.6 * pow(sin(u * PI), 1.5);
    float r = width * pow(s.y, 1.35);
    float a = s.z * TAU + u * 7.0 - uTime * 0.3;
    vec3 off = vec3(0.0, cos(a) * r * 0.75, sin(a) * r * 1.3);
    if (s.w > 0.92) off *= 2.4;
    Shape o;
    o.pos = c + off;
    o.glow = 0.25 + 0.75 * pow(1.0 - s.y, 1.5);
    o.hue = u * 1.15 - 0.08 + (t.x - 0.5) * 0.2;
    o.size = 0.75 + t.y * 0.55;
    return o;
  }

  // 1 · about: a timeline through five stops, one beside each panel of the
  // story (the stops ride on the panels as they slide); the panel being read
  // has the brightest, warmest stop.
  Shape timeline(vec4 s, vec4 t) {
    Shape o;
    if (s.w < 0.55) {
      int k = int(floor(s.x * 5.0));
      float here = 1.0 - clamp(abs(uAbout - float(k)), 0.0, 1.0);
      o.pos = uStops[k] + sphereDir(t.xy) * (0.45 + here * 0.3) * pow(s.y, 2.2);
      o.glow = 0.4 + 0.6 * (1.0 - s.y) + here * 0.5;
      o.hue = mix(0.1 + t.z * 0.15, 0.95, here);
      o.size = 0.9 + here * 0.6;
    } else {
      // The line runs through every stop and on past both ends.
      float k = fract(s.y + uTime * 0.01) * 6.0 - 1.0;
      float seg = clamp(floor(k), 0.0, 3.0);
      int i = int(seg);
      o.pos = mix(uStops[i], uStops[i + 1], k - seg);
      o.pos += vec3(0.0, sin(k * 2.0 + uTime * 0.5) * 0.08, sin(k * 1.7 + uTime * 0.3) * 0.5);
      o.pos += (t.xyz - 0.5) * vec3(0.0, 0.07, 0.07);
      o.glow = 0.3;
      o.hue = 0.08 + t.w * 0.15;
      o.size = 0.6;
    }
    return o;
  }

  // 2 · work: nodes and the edges between them, data flowing both ways.
  Shape network(vec4 s, vec4 t) {
    Shape o;
    if (s.w < 0.34) {
      int k = int(floor(s.x * 8.0));
      float f = uNodeFocus[k];
      o.pos = uNodes[k] + sphereDir(t.xy) * (0.22 + 0.32 * f) * pow(s.y, 1.6);
      o.glow = (0.5 + 0.6 * (1.0 - s.y)) * (1.0 - uFocusAmt * 0.45 * (1.0 - f)) + f * 0.7;
      o.hue = mix(0.12 + t.z * 0.2, 1.0, f);
      o.size = 1.0 + f * 0.5;
    } else if (s.w < 0.88) {
      vec2 e = uEdges[int(floor(s.x * 13.0))];
      vec3 a = uNodes[int(e.x)];
      vec3 b = uNodes[int(e.y)];
      float u = fract(s.y + uTime * 0.05 * (0.4 + s.z) * (t.w > 0.5 ? 1.0 : -1.0));
      vec3 bend = normalize(cross(b - a, vec3(0.0, 0.0, 1.0)) + 1e-4);
      float f = max(uNodeFocus[int(e.x)], uNodeFocus[int(e.y)]);
      o.pos = mix(a, b, u) + bend * sin(u * PI) * 0.18 + (t.xyz - 0.5) * 0.04;
      o.glow = (0.26 + 0.25 * pow(sin(u * PI), 4.0)) * (1.0 - uFocusAmt * 0.4 * (1.0 - f)) + f * 0.45;
      o.hue = mix(0.05 + t.z * 0.25, 0.85, f);
      o.size = 0.65;
    } else {
      o.pos = sphereDir(s.yz) * (2.8 + t.x * 1.6);
      o.glow = 0.12 + t.y * 0.12;
      o.hue = t.z * 0.4;
      o.size = 0.5;
    }
    o.pos = uNetRot * o.pos + uNetCenter;
    return o;
  }

  // 3 · skills: four layers turning in opposite directions, with buses
  // carrying data up between them.
  Shape stack(vec4 s, vec4 t) {
    Shape o;
    float k = floor(s.x * 4.0);
    if (s.w < 0.85) {
      float dir = mod(k, 2.0) < 0.5 ? 1.0 : -1.0;
      float a = s.y * TAU + uTime * 0.12 * dir;
      float r = 1.9 + (t.x - 0.5) * 0.14;
      o.pos = vec3(cos(a) * r, (1.5 - k) * 0.95 + (t.y - 0.5) * 0.05, sin(a) * r);
      o.glow = 0.38 + 0.4 * t.z;
      o.hue = k / 3.0 * 0.75 + t.w * 0.15;
      o.size = 0.8;
    } else {
      float a = floor(s.y * 6.0) / 6.0 * TAU + uTime * 0.05;
      o.pos = vec3(cos(a) * 1.9, (fract(s.z + uTime * 0.08) - 0.5) * 2.85, sin(a) * 1.9);
      o.glow = 0.55;
      o.hue = 0.92;
      o.size = 0.6;
    }
    o.pos = rotX(o.pos, 0.42);
    o.pos += vec3(mix(uHalfW * 0.55, 0.0, uMobile), mix(0.0, uHalfH * 0.45, uMobile), -1.0);
    return o;
  }

  // 4 · credentials: a crystal (an icosahedron of light) around a warm
  // core, turning slowly, with glints running along its edges.
  const float PHI = 1.618034;
  const vec3 ICO[12] = vec3[12](
    vec3(-1.0, PHI, 0.0), vec3(1.0, PHI, 0.0), vec3(-1.0, -PHI, 0.0), vec3(1.0, -PHI, 0.0),
    vec3(0.0, -1.0, PHI), vec3(0.0, 1.0, PHI), vec3(0.0, -1.0, -PHI), vec3(0.0, 1.0, -PHI),
    vec3(PHI, 0.0, -1.0), vec3(PHI, 0.0, 1.0), vec3(-PHI, 0.0, -1.0), vec3(-PHI, 0.0, 1.0)
  );
  const vec2 ICO_EDGES[30] = vec2[30](
    vec2(0, 11), vec2(11, 5), vec2(5, 0), vec2(5, 1), vec2(1, 0), vec2(1, 7), vec2(7, 0), vec2(7, 10),
    vec2(10, 0), vec2(10, 11), vec2(5, 9), vec2(9, 1), vec2(11, 4), vec2(4, 5), vec2(10, 2), vec2(2, 11),
    vec2(7, 6), vec2(6, 10), vec2(1, 8), vec2(8, 7), vec2(3, 9), vec2(9, 4), vec2(4, 3), vec2(4, 2),
    vec2(2, 3), vec2(2, 6), vec2(6, 3), vec2(6, 8), vec2(8, 3), vec2(8, 9)
  );

  Shape crystal(vec4 s, vec4 t) {
    Shape o;
    if (s.w < 0.28) {
      o.pos = ICO[int(floor(s.x * 12.0))] + sphereDir(t.xy) * 0.16 * pow(s.y, 1.6);
      o.glow = 0.5 + 0.6 * (1.0 - s.y);
      o.hue = 0.18 + t.z * 0.2;
      o.size = 0.9;
    } else if (s.w < 0.9) {
      vec2 e = ICO_EDGES[int(floor(s.x * 30.0))];
      float glint = pow(0.5 + 0.5 * sin(s.y * 12.0 - uTime * 1.4 + s.z * 6.0), 10.0);
      o.pos = mix(ICO[int(e.x)], ICO[int(e.y)], s.y) + (t.xyz - 0.5) * 0.03;
      o.glow = 0.26 + glint * 0.7;
      o.hue = mix(0.12, 0.9, glint);
      o.size = 0.6 + glint * 0.5;
    } else {
      o.pos = sphereDir(t.xy) * 0.55 * pow(s.y, 2.0);
      o.glow = 0.25 + 0.6 * (1.0 - s.y);
      o.hue = 0.95;
      o.size = 0.8;
    }
    o.pos *= 0.82 + 0.03 * sin(uTime * 0.8);
    o.pos = rotX(rotY(o.pos, uTime * 0.12 + 0.4), 0.35 + sin(uTime * 0.2) * 0.1);
    o.pos += vec3(mix(uHalfW * 0.6, 0.0, uMobile), mix(-0.1, uHalfH * 0.45, uMobile), -0.5);
    return o;
  }

  // 5 · contact: a ring around the closing line, data spiralling into it.
  Shape ring(vec4 s, vec4 t) {
    Shape o;
    float R = uRing.z;
    float a = s.x * TAU + uTime * 0.06;
    if (s.w < 0.8) {
      float r = 0.3 * pow(s.y, 1.8);
      float b = s.z * TAU + uTime * 0.4;
      vec3 radial = vec3(cos(a), sin(a), 0.0);
      o.pos = radial * (R + cos(b) * r) + vec3(0.0, 0.0, sin(b) * r * 1.6);
      o.glow = 0.4 + 0.7 * (1.0 - s.y);
      o.hue = 0.5 + 0.5 * sin(a + uTime * 0.2);
      o.size = 0.8 + t.x * 0.4;
    } else {
      float u = fract(s.y + uTime * 0.04);
      float aa = a + u * 3.0;
      o.pos = vec3(cos(aa), sin(aa), 0.0) * R * (1.0 + u * 0.9) + vec3(0.0, 0.0, -u * 2.0);
      o.glow = 0.35 * (1.0 - u);
      o.hue = 0.5 + 0.5 * sin(aa);
      o.size = 0.6;
    }
    o.pos.xy += uRing.xy;
    return o;
  }

  Shape formation(float k, vec4 s, vec4 t) {
    if (k < 0.5) return stream(s, t);
    if (k < 1.5) return timeline(s, t);
    if (k < 2.5) return network(s, t);
    if (k < 3.5) return stack(s, t);
    if (k < 4.5) return crystal(s, t);
    return ring(s, t);
  }

  void main() {
    Shape a = formation(uFrom, aSeed, aSeed2);
    Shape b = formation(uTo, aSeed, aSeed2);
    float m = smoothstep(0.0, 1.0, clamp((uMix - aSeed2.w * 0.4) / 0.6, 0.0, 1.0));
    vec3 pos = mix(a.pos, b.pos, m);
    float flight = m * (1.0 - m) * 4.0;
    pos += snoise3(pos * 0.25 + aSeed.xyz * 3.0 + uTime * 0.1) * flight * 1.3;
    pos += snoise3(pos * 0.35 + uTime * 0.05) * 0.06;
    float glow = mix(a.glow, b.glow, m) + flight * 0.15;
    float hue = mix(a.hue, b.hue, m);
    float size = mix(a.size, b.size, m);

    // The intro: everything starts folded into its loading line and opens
    // out from the middle.
    float open = smoothstep(0.0, 1.0, clamp((uIntro - abs(aSeed.x - 0.5) * 0.6 - aSeed2.z * 0.15) / 0.5, 0.0, 1.0));
    vec3 folded = vec3((aSeed.x - 0.5) * 2.0 * uHalfW, (aSeed2.x - 0.5) * 0.02, 0.0);
    pos = mix(folded, pos, open);
    glow = mix(0.9, glow, open);
    hue = mix(aSeed.x, hue, open);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);

    // Points part around the pointer.
    vec4 clip = projectionMatrix * mv;
    vec2 d = (clip.xy / clip.w - uPointer) * vec2(uAspect, 1.0);
    float push = uPointerOn * smoothstep(0.3, 0.0, length(d)) * open;
    mv.xy += normalize(d + 1e-5) * push * 0.5 * (-mv.z / 10.0);
    glow += push * 0.5;

    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(64.0, uSize * size * uViewH / (2.0 * uTanHalf * -mv.z));
    vColor = palette(hue);
    vAlpha = clamp(glow, 0.0, 1.6) * uDim;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uLight;
  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float soft = smoothstep(0.5, 0.05, d);
    float core = smoothstep(0.2, 0.0, d);
    vec3 col = vColor * (0.6 + core * 0.8) + core * 0.3 * (1.0 - uLight);
    gl_FragColor = vec4(col, soft * vAlpha * mix(1.0, 0.85, uLight));
    #include <colorspace_fragment>
  }
`;

// Deterministic randoms, so the shapes are the same on every visit.
const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export const createParticles = (opts: { mobile: boolean; theme: Theme }): Piece => {
  const count = opts.mobile ? 9000 : 24000;
  const random = mulberry32(20240801);
  const seeds = new Float32Array(count * 4);
  const seeds2 = new Float32Array(count * 4);
  for (let i = 0; i < count * 4; i++) {
    seeds[i] = random();
    seeds2[i] = random();
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seeds, 4));
  geometry.setAttribute("aSeed2", new BufferAttribute(seeds2, 4));

  const uniforms = {
    uTime: { value: 0 },
    uFrom: { value: 0 },
    uTo: { value: 1 },
    uMix: { value: 0 },
    uIntro: { value: 0 },
    uAbout: { value: 0 },
    uHalfW: { value: 1 },
    uHalfH: { value: 1 },
    uMobile: { value: opts.mobile ? 1 : 0 },
    uViewH: { value: 1 },
    uTanHalf: { value: 1 },
    uSize: { value: opts.mobile ? 0.045 : 0.034 },
    uAspect: { value: 1 },
    uDim: { value: 1 },
    uPointer: { value: new Vector2() },
    uPointerOn: { value: 0 },
    uNodes: { value: NODES.map((n) => n.clone()) },
    uEdges: { value: EDGES },
    uNodeFocus: { value: new Array(NODE_COUNT).fill(0) },
    uFocusAmt: { value: 0 },
    uNetRot: { value: new Matrix3() },
    uNetCenter: { value: new Vector3() },
    uRing: { value: new Vector3(0, 0, 3) },
    uStops: { value: Array.from({ length: STOP_COUNT }, () => new Vector3()) },
    uColA: { value: new Color() },
    uColB: { value: new Color() },
    uColC: { value: new Color() },
    uLight: { value: 0 },
  };

  const material = new ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const points = new Points(geometry, material);
  points.frustumCulled = false;

  let theme = opts.theme;
  const setTheme = (next: Theme) => {
    theme = next;
    const p = PALETTES[next];
    uniforms.uColA.value.set(p.a);
    uniforms.uColB.value.set(p.b);
    uniforms.uColC.value.set(p.c);
    uniforms.uLight.value = p.light;
    material.blending = next === "dark" ? AdditiveBlending : NormalBlending;
    material.needsUpdate = true;
  };
  setTheme(opts.theme);

  const rotation = new Matrix4();
  const euler = new Euler();
  const netRot = new Matrix3();
  const netCenter = new Vector3();

  // The network turns slowly and leans with the pointer; labels need the
  // same transform, so it's built here rather than in the shader.
  const placeNetwork = (f: Frame) => {
    euler.set(-0.18 + f.pointer.y * 0.12 * f.pointer.on, f.time * 0.07 + f.pointer.x * 0.25 * f.pointer.on, 0);
    rotation.makeRotationFromEuler(euler).multiplyScalar(f.mobile ? 0.62 : 0.92);
    netRot.setFromMatrix4(rotation);
    netCenter.set(f.mobile ? 0 : f.halfW * 0.56, f.mobile ? f.halfH * 0.42 : -0.05, 0);
  };

  const labelPoints = NODES.map(() => new Vector3());

  return {
    object: points,
    setTheme,
    update(f) {
      const from = Math.min(5, Math.floor(f.chapter));
      uniforms.uTime.value = f.time;
      uniforms.uFrom.value = from;
      uniforms.uTo.value = Math.min(5, from + 1);
      uniforms.uMix.value = f.chapter - from;
      uniforms.uIntro.value = f.intro;
      uniforms.uAbout.value = f.aboutAt;
      f.stops.forEach((s, i) => uniforms.uStops.value[i].set(s.x, s.y, 0));
      uniforms.uHalfW.value = f.halfW;
      uniforms.uHalfH.value = f.halfH;
      uniforms.uViewH.value = f.viewH;
      uniforms.uTanHalf.value = f.tanHalf;
      uniforms.uAspect.value = f.aspect;
      uniforms.uDim.value = perChapter(DIM[theme], f.chapter) * (f.mobile ? perChapter(PHONE_DIM, f.chapter) : 1);
      uniforms.uPointer.value.set(f.pointer.x, f.pointer.y);
      uniforms.uPointerOn.value = f.pointer.on;
      uniforms.uNodeFocus.value = f.focus;
      uniforms.uFocusAmt.value = Math.max(...f.focus);
      uniforms.uRing.value.set(f.ring.x, f.ring.y, f.ring.r);
      placeNetwork(f);
      uniforms.uNetRot.value.copy(netRot);
      uniforms.uNetCenter.value.copy(netCenter);
    },
    labels(f) {
      NODES.forEach((n, i) => labelPoints[i].copy(n).applyMatrix3(netRot).add(netCenter));
      return { points: labelPoints, visible: Math.max(0, 1 - Math.abs(f.chapter - 2) * 2.2) };
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
};
