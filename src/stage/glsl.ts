// GLSL shared by the stage's shaders.

// 3D simplex noise, after Ashima Arts / Stefan Gustavson (MIT licence).
export const NOISE = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  vec3 snoise3(vec3 p) {
    return vec3(snoise(p), snoise(p + vec3(31.4, -7.1, 12.9)), snoise(p + vec3(-19.7, 43.3, 5.1)));
  }
`;

// The brand gradient (blue → magenta → orange) at t = 0 … 1.
export const PALETTE = /* glsl */ `
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform vec3 uColC;
  vec3 palette(float t) {
    t = clamp(t, 0.0, 1.0);
    return t < 0.5 ? mix(uColA, uColB, t * 2.0) : mix(uColB, uColC, t * 2.0 - 1.0);
  }
`;

// The page's backdrop as seen along a ray: a plane behind the scene with soft
// colour glows and a faint grid of dots, drawn full-screen along camera rays.
export const BACKDROP = /* glsl */ `
  uniform vec3 uBg;
  uniform vec3 uGlow[3];
  uniform float uGlowAlpha[3];
  uniform vec3 uDotColor;
  uniform float uDotAlpha;
  uniform vec2 uDrift;
  uniform float uPlaneHalfH;
  uniform float uAspect;

  const float PLANE_Z = -6.0;

  float glowAt(vec2 p, vec2 c, float r) {
    vec2 d = (p - c) / r;
    return exp(-dot(d, d));
  }

  vec3 backdrop(vec3 ro, vec3 rd) {
    float t = (PLANE_Z - ro.z) / min(rd.z, -1e-3);
    vec2 hit = (ro + rd * t).xy;
    vec2 p = hit / uPlaneHalfH;
    vec3 col = uBg;
    col = mix(col, uGlow[0], uGlowAlpha[0] * glowAt(p, vec2(0.9 * uAspect, 0.85) + uDrift, 1.1));
    col = mix(col, uGlow[1], uGlowAlpha[1] * glowAt(p, vec2(-0.85 * uAspect, -0.9) - uDrift, 1.3));
    col = mix(col, uGlow[2], uGlowAlpha[2] * glowAt(p, vec2(-0.2, 0.1) + uDrift * 1.5, 0.9));
    vec2 cell = hit / 0.45;
    float aa = max(fwidth(cell.x), 1e-3);
    float dotMask = 1.0 - smoothstep(0.045, 0.045 + aa * 1.5, length(fract(cell) - 0.5));
    // Dots fade where they'd shrink below a pixel, so they never shimmer.
    dotMask *= 1.0 - smoothstep(0.08, 0.2, aa);
    return mix(col, uDotColor, dotMask * uDotAlpha);
  }
`;
