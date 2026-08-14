import React, { useMemo } from "react";

export type VisualMotif = "neural" | "pipeline" | "layout" | "chain";

interface ProjectVisualProps {
  /** Seeds the generator — same title always yields the same artwork. */
  seed: string;
  motif: VisualMotif;
  color: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Deterministic pseudo-randomness                                     */
/* ------------------------------------------------------------------ */

const hashString = (input: string) => {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
};

/** mulberry32 — small, fast, good enough for layout jitter. */
const makeRng = (seed: number) => {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const VB = 480;

/* ------------------------------------------------------------------ */
/* Motifs                                                              */
/* ------------------------------------------------------------------ */

/** Layered node graph — for ML / AI work. */
const Neural = ({ rng }: { rng: () => number }) => {
  const layers = useMemo(() => {
    const columnCount = 4;
    return Array.from({ length: columnCount }, (_, col) => {
      const nodeCount = 3 + Math.floor(rng() * 3);
      const x = 90 + col * ((VB - 180) / (columnCount - 1));
      const span = 90 + rng() * 130;
      return Array.from({ length: nodeCount }, (_, row) => ({
        x,
        y:
          VB / 2 -
          span / 2 +
          (nodeCount === 1 ? span / 2 : (row * span) / (nodeCount - 1)),
        r: 3.5 + rng() * 3,
      }));
    });
  }, [rng]);

  return (
    <g>
      {layers.slice(0, -1).map((layer, li) =>
        layer.map((node, ni) =>
          layers[li + 1].map((next, nj) => (
            <line
              key={`${li}-${ni}-${nj}`}
              x1={node.x}
              y1={node.y}
              x2={next.x}
              y2={next.y}
              stroke="currentColor"
              strokeWidth={0.75}
              opacity={0.12 + rng() * 0.3}
            />
          )),
        ),
      )}
      {layers.flat().map((node, i) => (
        <circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={node.r}
          fill="currentColor"
          opacity={0.55 + rng() * 0.45}
        />
      ))}
    </g>
  );
};

/** Lanes of flowing packets — for distributed systems / streaming. */
const Pipeline = ({ rng }: { rng: () => number }) => {
  const lanes = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => {
        const y = 120 + i * 80;
        const blocks: { x: number; w: number; o: number }[] = [];
        let x = 50 + rng() * 40;
        while (x < VB - 60) {
          const w = 22 + rng() * 60;
          blocks.push({ x, w, o: 0.25 + rng() * 0.65 });
          x += w + 14 + rng() * 30;
        }
        return { y, blocks };
      }),
    [rng],
  );

  return (
    <g>
      {lanes.map((lane, i) => (
        <g key={i}>
          <line
            x1={40}
            y1={lane.y}
            x2={VB - 40}
            y2={lane.y}
            stroke="currentColor"
            strokeWidth={0.75}
            opacity={0.18}
          />
          {lane.blocks.map((b, j) => (
            <rect
              key={j}
              x={b.x}
              y={lane.y - 5}
              width={b.w}
              height={10}
              rx={5}
              fill="currentColor"
              opacity={b.o}
            />
          ))}
        </g>
      ))}
    </g>
  );
};

/** Abstract interface wireframe — for web apps. */
const Layout = ({ rng }: { rng: () => number }) => {
  const cards = useMemo(() => {
    const cols = 2 + Math.floor(rng() * 2);
    const rows = 2 + Math.floor(rng() * 2);
    const gap = 16;
    const left = 60;
    const top = 170;
    const w = (VB - left * 2 - gap * (cols - 1)) / cols;
    const h = (VB - top - 70 - gap * (rows - 1)) / rows;
    const out: { x: number; y: number; w: number; h: number; o: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({
          x: left + c * (w + gap),
          y: top + r * (h + gap),
          w,
          h,
          o: 0.22 + rng() * 0.5,
        });
      }
    }
    return out;
  }, [rng]);

  return (
    <g>
      {/* Header bar */}
      <rect
        x={60}
        y={80}
        width={VB - 120}
        height={54}
        rx={14}
        fill="currentColor"
        opacity={0.5}
      />
      <circle cx={86} cy={107} r={6} fill="currentColor" opacity={0.9} />
      <rect
        x={106}
        y={102}
        width={90 + rng() * 70}
        height={10}
        rx={5}
        fill="currentColor"
        opacity={0.85}
      />
      {cards.map((c, i) => (
        <rect
          key={i}
          x={c.x}
          y={c.y}
          width={c.w}
          height={c.h}
          rx={12}
          fill="currentColor"
          opacity={c.o}
        />
      ))}
    </g>
  );
};

/** Linked block lattice — for blockchain work. */
const Chain = ({ rng }: { rng: () => number }) => {
  const blocks = useMemo(() => {
    const count = 4;
    const size = 46;
    return Array.from({ length: count }, (_, i) => {
      const t = i / (count - 1);
      return {
        cx: 100 + t * (VB - 200),
        cy: 150 + Math.sin(t * Math.PI * 1.2 + rng() * 0.4) * 90,
        size,
        o: 0.4 + rng() * 0.5,
      };
    });
  }, [rng]);

  const hex = (cx: number, cy: number, s: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6;
      return `${cx + s * Math.cos(a)},${cy + s * Math.sin(a)}`;
    }).join(" ");

  return (
    <g>
      {blocks.slice(0, -1).map((b, i) => (
        <line
          key={i}
          x1={b.cx}
          y1={b.cy}
          x2={blocks[i + 1].cx}
          y2={blocks[i + 1].cy}
          stroke="currentColor"
          strokeWidth={1.5}
          opacity={0.35}
          strokeDasharray="5 5"
        />
      ))}
      {blocks.map((b, i) => (
        <g key={i}>
          <polygon
            points={hex(b.cx, b.cy, b.size)}
            fill="currentColor"
            opacity={b.o * 0.25}
          />
          <polygon
            points={hex(b.cx, b.cy, b.size)}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            opacity={b.o}
          />
        </g>
      ))}
    </g>
  );
};

/* ------------------------------------------------------------------ */

const ProjectVisual = ({ seed, motif, color, className }: ProjectVisualProps) => {
  const rng = useMemo(() => makeRng(hashString(seed)), [seed]);
  const gradientId = useMemo(
    () => `pv-grad-${hashString(seed).toString(36)}`,
    [seed],
  );
  const gridId = useMemo(
    () => `pv-grid-${hashString(seed).toString(36)}`,
    [seed],
  );

  const Motif = { neural: Neural, pipeline: Pipeline, layout: Layout, chain: Chain }[
    motif
  ];

  return (
    <svg
      viewBox={`0 0 ${VB} ${VB}`}
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role="presentation"
      aria-hidden="true"
      style={{ color }}
    >
      <defs>
        <radialGradient id={gradientId} cx="30%" cy="20%" r="90%">
          <stop offset="0%" stopColor={color} stopOpacity="0.38" />
          <stop offset="100%" stopColor={color} stopOpacity="0.06" />
        </radialGradient>
        <pattern
          id={gridId}
          width="32"
          height="32"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M32 0H0V32"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.14"
          />
        </pattern>
      </defs>

      <rect width={VB} height={VB} fill="var(--bg-elevated)" />
      <rect width={VB} height={VB} fill={`url(#${gradientId})`} />
      <rect width={VB} height={VB} fill={`url(#${gridId})`} />

      <Motif rng={rng} />
    </svg>
  );
};

export default ProjectVisual;
