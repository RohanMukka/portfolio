import React, { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";

const CHAPTERS = [
  {
    key: "Build",
    title: "Full-stack products, end to end.",
    body: "React and TypeScript up front, Node and Python behind — shipped on Vercel, Firebase and Cloud Run.",
  },
  {
    key: "Ship",
    title: "ML systems that hold up in production.",
    body: "Retrieval with NexusRAG, MLOps with MLFlowForge, real-time streaming with StreamSense.",
  },
  {
    key: "Learn",
    title: "MS Computer Science, University of Oklahoma.",
    body: "4.0 GPA — AI infrastructure, deep learning and software architecture.",
  },
];

// Scroll ranges (fractions of the pinned hero) each chapter owns.
export const CHAPTER_RANGES: [number, number][] = [
  [0.12, 0.38],
  [0.38, 0.64],
  [0.64, 0.92],
];

const Chapter = ({ progress, range, chapter, index }: {
  progress: MotionValue<number>;
  range: [number, number];
  chapter: (typeof CHAPTERS)[number];
  index: number;
}) => {
  const [a, b] = range;
  const last = index === CHAPTERS.length - 1;
  // Last chapter stays up until the stage recedes.
  const opacity = useTransform(progress, last ? [a, a + 0.05] : [a, a + 0.05, b - 0.05, b], last ? [0, 1] : [0, 1, 1, 0]);
  const y = useTransform(progress, last ? [a, a + 0.05] : [a, a + 0.05, b - 0.05, b], last ? [40, 0] : [40, 0, 0, -40]);

  return (
    <motion.div className="absolute inset-x-0 top-0" style={{ opacity, y }}>
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">
        {String(index + 1).padStart(2, "0")} — {chapter.key}
      </p>
      <p className="font-display text-3xl md:text-4xl font-bold tracking-[-0.035em] leading-[1.05] text-primary-text max-w-lg">
        {chapter.title}
      </p>
      <p className="mt-4 text-lg text-primary-secondary leading-relaxed max-w-md">{chapter.body}</p>
    </motion.div>
  );
};

// Captions that take turns in the space the intro copy leaves.
export const ChapterCaptions = ({ progress }: { progress: MotionValue<number> }) => (
  <div className="absolute inset-x-0 top-0 pointer-events-none">
    {CHAPTERS.map((c, i) => (
      <React.Fragment key={c.key}>
        <Chapter progress={progress} range={CHAPTER_RANGES[i]} chapter={c} index={i} />
      </React.Fragment>
    ))}
  </div>
);

const useClock = () => {
  const format = () =>
    new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: "America/Chicago" }).format(new Date());
  const [time, setTime] = useState(format);
  useEffect(() => {
    const id = setInterval(() => setTime(format()), 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
};

// USAvionix-style frame around the stage: a chapter indicator up top and
// small readouts in the upper corners (the lower ones hold fixed buttons).
export const ChapterFrame = ({ progress }: { progress: MotionValue<number> }) => {
  const [active, setActive] = useState(-1);
  const time = useClock();
  const frameOpacity = useTransform(progress, [0.08, 0.14], [0, 1]);
  const bar = useTransform(progress, [CHAPTER_RANGES[0][0], CHAPTER_RANGES[2][1]], [0, 1]);

  useMotionValueEvent(progress, "change", (v) => {
    const i = CHAPTER_RANGES.findIndex(([a, b]) => v >= a && v < b);
    setActive((prev) => (prev === i ? prev : i));
  });

  return (
    <motion.div className="absolute inset-0 z-20 pointer-events-none" style={{ opacity: frameOpacity }} aria-hidden="true">
      <div className="absolute top-28 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-[0.3em]">
          {CHAPTERS.map((c, i) => (
            <span key={c.key} className={`transition-colors duration-300 ${i === active ? "text-accent" : "text-primary-tertiary"}`}>
              {String(i + 1).padStart(2, "0")} {c.key}
            </span>
          ))}
        </div>
        <div className="w-64 h-px bg-primary-text/15 overflow-hidden">
          <motion.div className="h-full bg-accent origin-left" style={{ scaleX: bar }} />
        </div>
      </div>
      <div className="absolute top-28 left-8 text-[11px] uppercase tracking-[0.25em] text-primary-secondary leading-relaxed">
        Norman, Oklahoma
        <br />
        35.22° N · 97.44° W
      </div>
      <div className="absolute top-28 right-8 text-right text-[11px] uppercase tracking-[0.25em] text-primary-secondary leading-relaxed">
        {time} CT
        <br />
        <span className="text-accent">●</span> Available for work
      </div>
    </motion.div>
  );
};
