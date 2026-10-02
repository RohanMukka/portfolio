import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

export const SECTION_COUNT = 6;

interface SectionHeaderProps {
  /** Two-digit running number, e.g. "02". */
  index: string;
  /** Small label beside the number, e.g. "Work". */
  label: string;
  /** The title. "\n" breaks a line; *stars* set words in the accent serif. */
  title: string;
  subtitle?: string;
  /** Optional controls (filters, toggles) aligned to the title's baseline. */
  children?: React.ReactNode;
  className?: string;
}

type Glyph = { char: string; accent: boolean };

const parse = (title: string): Glyph[][] =>
  title.split("\n").map((line) => {
    let accent = false;
    const out: Glyph[] = [];
    for (const char of line) {
      if (char === "*") accent = !accent;
      else out.push({ char, accent });
    }
    return out;
  });

// One letter rising from behind its line's mask, driven by scroll progress.
const Letter = ({ glyph, progress, start }: { glyph: Glyph; progress: MotionValue<number>; start: number }) => {
  const y = useTransform(progress, [start, start + 0.35], ["105%", "0%"]);
  const rotate = useTransform(progress, [start, start + 0.35], [8, 0]);
  if (glyph.char === " ") return <span className="inline-block w-[0.25em]" />;
  return (
    <motion.span
      className={`inline-block origin-bottom-left ${glyph.accent ? "font-serif italic font-normal tracking-normal text-accent pr-[0.04em]" : ""}`}
      style={{ y, rotate }}
    >
      {glyph.char}
    </motion.span>
  );
};

// Editorial section opener: "02 — Work" with a "( 02 / 06 )" counter, a very
// large title whose letters rise into place as the section scrolls in, an
// optional subtitle, and a hairline that draws itself underneath.
const SectionHeader = ({ index, label, title, subtitle, children, className = "" }: SectionHeaderProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start 92%", "start 38%"] });
  const rule = useTransform(p, [0.3, 1], [0, 1]);

  const lines = parse(title);
  const total = lines.reduce((n, l) => n + l.length, 0);
  let n = 0;

  return (
    <header ref={ref} className={`w-full text-left ${className}`}>
      <motion.div
        className="flex items-center justify-between gap-4 mb-6 text-xs font-medium uppercase tracking-[0.3em] text-primary-secondary"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="flex items-center gap-4">
          <span className="text-accent tabular-nums">{index}</span>
          <span className="h-px w-10 bg-primary-text/25" />
          <span>{label}</span>
        </span>
        <span className="tabular-nums tracking-[0.22em] text-primary-tertiary">
          ( {index} / {String(SECTION_COUNT).padStart(2, "0")} )
        </span>
      </motion.div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h2
            aria-label={title.replace(/\*/g, "").replace(/\n/g, " ")}
            className="text-[clamp(2.75rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.045em] text-primary-text"
          >
            {lines.map((line, li) => (
              <span key={li} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]" aria-hidden="true">
                {line.map((glyph, gi) => {
                  const start = (n++ / Math.max(1, total)) * 0.65;
                  return (
                    <React.Fragment key={gi}>
                      <Letter glyph={glyph} progress={p} start={start} />
                    </React.Fragment>
                  );
                })}
              </span>
            ))}
          </h2>
          {subtitle && (
            <motion.p
              className="mt-6 max-w-xl text-lg md:text-xl text-primary-secondary leading-relaxed"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        {children}
      </div>
      <motion.div className="mt-10 h-px w-full bg-primary-text/10 origin-left" style={{ scaleX: rule }} />
    </header>
  );
};

export default SectionHeader;
