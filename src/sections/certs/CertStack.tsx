import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { certificationsByDate, yearOf, type Certification } from "../../data/certifications";

const TOP = 120; // px from the top where cards stick
const OFFSET = 14; // each later card sticks a little lower, so edges show

const StackCard = ({ cert, index, total, progress }: {
  cert: Certification;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) => {
  // Cards shrink slightly as later cards land on top of them.
  const start = index / total;
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - index) * 0.03]);

  return (
    <div className="sticky h-[70vh] flex items-start" style={{ top: TOP + index * OFFSET }}>
      <motion.article
        className="w-full origin-top rounded-[2rem] glass-card p-8 md:p-12 grid md:grid-cols-[1fr_auto] gap-8 items-end min-h-[320px]"
        style={{ scale }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")} · {cert.issuer}
          </p>
          <h3 className="mt-5 font-display text-3xl md:text-5xl font-bold tracking-[-0.04em] leading-[1.02] text-primary-text max-w-3xl">
            {cert.name}
          </h3>
          {cert.skills && <p className="mt-5 text-primary-secondary">{cert.skills.join("  ·  ")}</p>}
        </div>
        <div className="text-left md:text-right">
          <span className="block font-display text-6xl md:text-8xl font-extrabold tracking-[-0.06em] leading-none text-primary-text/15">
            {yearOf(cert)}
          </span>
          <span className="mt-2 block text-sm text-primary-secondary">
            {cert.expires ? `Valid until ${cert.expires}` : `Issued ${cert.issued}`}
          </span>
        </div>
      </motion.article>
    </div>
  );
};

// Option 4: cards stick near the top and stack as the next one slides up.
const CertStack = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const total = certificationsByDate.length;

  return (
    <div ref={ref} className="relative pb-[10vh]">
      {certificationsByDate.map((c, i) => (
        <React.Fragment key={c.name}>
          <StackCard cert={c} index={i} total={total} progress={scrollYProgress} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default CertStack;
