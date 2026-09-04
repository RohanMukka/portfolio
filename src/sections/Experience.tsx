import React, { useState } from "react";
import Reveal from '../components/Reveal';
import { MapPin, Calendar, Briefcase } from "lucide-react";

interface ExperienceItem {
  id: number;
  tick: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  level: number; // 1 (earliest ground) – 5 (current peak)
  bullets: string[];
  tags: string[];
}

const experienceData: ExperienceItem[] = [
  {
    id: 1,
    tick: "2022",
    role: "[Role Title]",
    company: "[Company Name]",
    location: "Hyderabad, India",
    period: "[Jan 2022] – [May 2022]",
    level: 1,
    bullets: [
      "[Impact bullet — the concrete thing you built or fixed.]",
      "[Impact bullet — a measurable result: speed, scale, or accuracy.]",
    ],
    tags: ["Java", "SQL"],
  },
  {
    id: 2,
    tick: "2023",
    role: "[Role Title]",
    company: "[Company Name]",
    location: "Remote",
    period: "[May 2023] – [Aug 2023]",
    level: 2,
    bullets: [
      "[Impact bullet — what shipped, and who used it.]",
      "[Impact bullet — a system or process you improved.]",
    ],
    tags: ["React", "TypeScript", "Firebase"],
  },
  {
    id: 3,
    tick: "2024",
    role: "[Role Title]",
    company: "[Company Name]",
    location: "Norman, OK",
    period: "[Jan 2024] – [May 2024]",
    level: 3,
    bullets: [
      "[Impact bullet — a model, pipeline, or feature you owned.]",
      "[Impact bullet — the scale or accuracy it hit in production.]",
    ],
    tags: ["Python", "TensorFlow"],
  },
  {
    id: 4,
    tick: "2025",
    role: "[Role Title]",
    company: "[Company Name]",
    location: "Remote",
    period: "[Jun 2025] – Present",
    current: true,
    level: 5,
    bullets: [
      "[Impact bullet — the current scope of what you own.]",
      "[Impact bullet — a system or team you're driving forward.]",
    ],
    tags: ["Python", "PyTorch", "AWS"],
  },
];

// Plot geometry: viewBox is a fixed 1000 x 400 unit grid, so pixel math
// below stays correct at any render size as long as the wrapper keeps
// the same aspect ratio (enforced via aspect-[2.5/1] in JSX).
const VB_W = 1000;
const VB_H = 400;
const PAD_X = 80;
const TOP_Y = 70;
const BASE_Y = 320;
const AXIS_Y = 340;

const xFor = (i: number) =>
  PAD_X + (i * (VB_W - PAD_X * 2)) / (experienceData.length - 1);
const yFor = (level: number) => BASE_Y - ((level - 1) / 4) * (BASE_Y - TOP_Y);

const points = experienceData.map((item, i) => ({
  ...item,
  x: xFor(i),
  y: yFor(item.level),
}));

const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
const areaPath = `${linePath} L${points[points.length - 1].x},${AXIS_Y} L${points[0].x},${AXIS_Y} Z`;
const contourYs = [300, 260, 220, 180, 140, 100];

const Experience = () => {
  const [activeId, setActiveId] = useState(
    experienceData[experienceData.length - 1].id,
  );
  const active = experienceData.find((e) => e.id === activeId)!;

  return (
    <section
      id="experience"
      className="py-32 px-6 relative overflow-hidden flex flex-col items-center"
    >
      <style>
        {`
          @keyframes exp-pulse {
            0% { transform: scale(1); opacity: 0.55; }
            70% { transform: scale(2.4); opacity: 0; }
            100% { transform: scale(2.4); opacity: 0; }
          }
          .exp-pulse-ring {
            animation: exp-pulse 2.2s ease-out infinite;
            transform-origin: center;
          }
        `}
      </style>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-glass-border to-transparent opacity-50"></div>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full -z-10"
        style={{ background: "radial-gradient(circle, rgba(var(--accent-rgb), 0.08) 0%, transparent 70%)" }}
      ></div>

      <div className="max-w-6xl w-full relative z-10">
        <Reveal className="text-center mb-16 md:mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-text mb-6">
            Professional Path
          </h2>
          <p className="text-primary-secondary text-xl max-w-2xl mx-auto">
            Every role plotted as one continuous climb, not a list.
          </p>
        </Reveal>

        <Reveal
  className="relative rounded-[2rem] glass-card p-6 md:p-10 overflow-hidden"
>
          <div
            className="absolute -top-10 -right-10 w-56 h-56 rounded-full -z-10"
            style={{ background: "radial-gradient(circle, rgba(var(--accent-rgb), 0.12) 0%, transparent 70%)" }}
          ></div>

          {/* Terrain chart — horizontally scrollable on narrow screens so the
              trail never gets squashed illegible. */}
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="relative w-full aspect-[2.5/1]">
                <svg
                  viewBox={`0 0 ${VB_W} ${VB_H}`}
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="exp-terrain-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" style={{ stopColor: "var(--accent)", stopOpacity: 0.32 }} />
                      <stop offset="100%" style={{ stopColor: "var(--accent)", stopOpacity: 0 }} />
                    </linearGradient>
                    <clipPath id="exp-terrain-clip">
                      <path d={areaPath} />
                    </clipPath>
                  </defs>

                  {/* baseline axis */}
                  <line
                    x1={PAD_X - 20}
                    y1={AXIS_Y}
                    x2={VB_W - PAD_X + 20}
                    y2={AXIS_Y}
                    stroke="currentColor"
                    className="text-glass-border"
                    strokeWidth={1}
                  />

                  {/* topographic contour texture, clipped to the fill */}
                  <g clipPath="url(#exp-terrain-clip)">
                    {contourYs.map((cy) => (
                      <line
                        key={cy}
                        x1={PAD_X - 20}
                        y1={cy}
                        x2={VB_W - PAD_X + 20}
                        y2={cy}
                        stroke="currentColor"
                        className="text-primary-text"
                        strokeWidth={1}
                        opacity={0.07}
                      />
                    ))}
                  </g>

                  <path
    d={areaPath}
  fill="url(#exp-terrain-fill)"
/>

                  <path
    d={linePath}
  fill="none"
  stroke="currentColor"
  className="text-accent"
  strokeWidth={3}
  strokeLinejoin="round"
  strokeLinecap="round"
/>

                  {points.map((p) => {
                    const isActive = p.id === activeId;
                    return (
                      <g key={p.id}>
                        {p.current && (
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={10}
                            fill="currentColor"
                            className="text-accent exp-pulse-ring"
                          />
                        )}
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={isActive ? 10 : 7}
                          fill={isActive ? "currentColor" : "var(--bg-primary)"}
                          stroke="currentColor"
                          strokeWidth={3}
                          className="text-accent transition-all duration-200 cursor-pointer"
                          onClick={() => setActiveId(p.id)}
                        />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* tick row — shares the chart's horizontal scale exactly,
                  so each button sits under its own peak */}
              <div className="relative w-full h-14 mt-1">
                {points.map((p) => {
                  const isActive = p.id === activeId;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setActiveId(p.id)}
                      aria-pressed={isActive}
                      aria-label={`${p.role} at ${p.company}, ${p.period}`}
                      className="absolute -translate-x-1/2 flex flex-col items-center gap-1.5 group"
                      style={{ left: `${(p.x / VB_W) * 100}%`, top: 0 }}
                    >
                      <span
                        className={`text-xs font-bold tracking-wide transition-colors ${
                          isActive ? "text-primary-text" : "text-primary-tertiary group-hover:text-primary-secondary"
                        }`}
                      >
                        {p.tick}
                      </span>
                      <span
                        className={`text-[10px] uppercase tracking-wider font-medium transition-colors max-w-[100px] truncate ${
                          isActive ? "text-accent" : "text-primary-tertiary group-hover:text-primary-secondary"
                        }`}
                      >
                        {p.company}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* detail panel for the active point */}
          <div className="border-t border-glass-border mt-4 pt-8">
            <Reveal key={active.id}>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-surface-subtle border border-glass-border text-accent shrink-0">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl md:text-2xl font-display font-bold text-primary-text leading-tight">
                        {active.role}
                      </h3>
                      <p className="text-accent font-semibold text-sm mt-0.5">{active.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                      <Calendar size={12} />
                      {active.period}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-primary-tertiary">
                      <MapPin size={12} />
                      {active.location}
                    </span>
                  </div>
                </div>

                <ul className="space-y-2 mb-5">
                  {active.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2.5 text-sm md:text-base text-primary-secondary leading-relaxed">
                      <span className="text-accent mt-1.5 w-1 h-1 rounded-full bg-accent shrink-0"></span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2">
                  {active.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-surface-subtle text-xs text-primary-secondary border border-glass-border font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
            </Reveal>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Experience;
