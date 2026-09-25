import React, { useRef } from "react";
import { motion, useScroll } from "framer-motion";
import { certificationsByDate, yearOf, type Certification } from "../../data/certifications";

const EASE = [0.16, 1, 0.3, 1] as const;

// Group newest-first certificates by year.
const byYear = certificationsByDate.reduce<[string, Certification[]][]>((groups, c) => {
  const y = yearOf(c);
  const last = groups[groups.length - 1];
  if (last && last[0] === y) last[1].push(c);
  else groups.push([y, [c]]);
  return groups;
}, []);

// Option 2: a vertical timeline. Big years sit on the left of a line that
// fills with orange as you scroll through; certificates hang off each year.
const CertTimeline = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.5"] });

  return (
    <div ref={ref} className="relative">
      <div className="absolute left-[5.5rem] md:left-[10.5rem] inset-y-0 w-px bg-primary-text/10">
        <motion.div className="absolute inset-0 bg-accent origin-top" style={{ scaleY: scrollYProgress }} />
      </div>

      <div className="flex flex-col gap-14 md:gap-20 py-4">
        {byYear.map(([year, certs]) => (
          <motion.div
            key={year}
            className="grid grid-cols-[5.5rem_1fr] md:grid-cols-[10.5rem_1fr]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="font-display text-3xl md:text-6xl font-extrabold tracking-[-0.05em] leading-none text-primary-text pr-4 md:pr-8 text-right">
              {year}
            </span>
            <div className="relative flex flex-col gap-8 pl-8 md:pl-12">
              {certs.map((c) => (
                <div key={c.name} className="relative">
                  <span className="absolute -left-8 md:-left-12 top-2 -translate-x-1/2 w-3 h-3 rounded-full bg-background border-2 border-accent" />
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                    {c.issuer} · {c.issued.split(" ")[0]}
                  </p>
                  <h3 className="mt-2 font-display text-xl md:text-3xl font-bold tracking-[-0.03em] leading-tight text-primary-text">{c.name}</h3>
                  {(c.skills || c.expires) && (
                    <p className="mt-2 text-sm text-primary-secondary">
                      {[...(c.skills ?? []), c.expires ? `Valid until ${c.expires}` : null].filter(Boolean).join("  ·  ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CertTimeline;
