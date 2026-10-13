import React, { useMemo } from "react";

// Lite mode's hero (no graphics card, so no 3D stage): the data stream from
// the stage's particles (stream() in src/stage/particles.ts) traced once as a
// still SVG, a band of dots in the brand gradient over a soft glow. Painted
// once, it costs nothing to scroll past.

const W = 1600;
const H = 900;
const UNIT = H / 2 / 3.64; // the stage's visible half-height at z = 0
const HALF_W = W / 2 / UNIT;
const HALF_H = 3.64;
const COUNT = 1400;
const STOPS = ["#3b6cff", "#e0457b", "#ff7a3d"];
const RGB = STOPS.map((hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)));

// The brand gradient at t = 0 … 1, as palette() in src/stage/glsl.ts.
const gradient = (t: number) => {
  const x = Math.min(1, Math.max(0, t)) * 2;
  const i = Math.min(1, Math.floor(x));
  const f = x - i;
  const [r, g, b] = RGB[i].map((c, k) => Math.round(c + (RGB[i + 1][k] - c) * f));
  return `rgb(${r} ${g} ${b})`;
};

const mulberry32 = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const centre = (u: number) => ({
  x: (u - 0.5) * HALF_W * 2.7,
  y: Math.sin(u * 4.2 + 0.8) * HALF_H * 0.3 + Math.sin(u * 11) * 0.15,
});

const toSvg = (p: { x: number; y: number }) => ({ x: W / 2 + p.x * UNIT, y: H / 2 - p.y * UNIT });

const LiteStream = () => {
  const { dots, path } = useMemo(() => {
    const random = mulberry32(20240801);
    const dots = Array.from({ length: COUNT }, () => {
      const u = random();
      const s = random();
      const a = random() * Math.PI * 2 + u * 7;
      const spark = random() > 0.92 ? 2.4 : 1;
      const width = 0.2 + 1.6 * Math.pow(Math.sin(u * Math.PI), 1.5);
      const c = centre(u);
      const p = toSvg({ x: c.x, y: c.y + Math.cos(a) * width * Math.pow(s, 1.35) * 0.75 * spark });
      const hue = u * 1.15 - 0.08 + (random() - 0.5) * 0.2;
      return { ...p, r: 1 + (1 - s) * 1.8, color: gradient(hue), opacity: 0.25 + 0.7 * Math.pow(1 - s, 1.5) };
    });
    const path = Array.from({ length: 61 }, (_, i) => {
      const p = toSvg(centre(i / 60));
      return `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }).join(" ");
    return { dots, path };
  }, []);

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="lite-stream" x1="0" x2="1" y1="0" y2="0">
          {STOPS.map((c, i) => (
            <stop key={c} offset={i / (STOPS.length - 1)} stopColor={c} />
          ))}
        </linearGradient>
        <filter id="lite-glow" x="-10%" y="-50%" width="120%" height="200%">
          <feGaussianBlur stdDeviation="28" />
        </filter>
      </defs>
      <path d={path} fill="none" stroke="url(#lite-stream)" strokeWidth="90" strokeLinecap="round" opacity="0.22" filter="url(#lite-glow)" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x.toFixed(1)} cy={d.y.toFixed(1)} r={d.r.toFixed(2)} fill={d.color} opacity={d.opacity.toFixed(2)} />
      ))}
    </svg>
  );
};

export default LiteStream;
