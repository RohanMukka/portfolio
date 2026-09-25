import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { certificationsByDate, yearOf } from "../../data/certifications";

const EASE = [0.16, 1, 0.3, 1] as const;

// Option 1: editorial rows, newest first. Hovering a row slides the title and
// reveals the skills it covers; others dim.
const CertList = () => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <ol className="border-t border-primary-text/10" onMouseLeave={() => setHovered(null)}>
      {certificationsByDate.map((c) => {
        const isHovered = hovered === c.name;
        const dim = hovered !== null && !isHovered;
        return (
          <li
            key={c.name}
            onMouseEnter={() => setHovered(c.name)}
            className={`border-b border-primary-text/10 transition-opacity duration-300 ${dim ? "opacity-35" : ""}`}
          >
            <div className="grid grid-cols-[3.5rem_1fr_auto] md:grid-cols-[5rem_1fr_14rem_2rem] items-center gap-4 py-6 md:py-7">
              <span className="font-display text-sm md:text-base font-bold tabular-nums text-accent">{yearOf(c)}</span>
              <div className="min-w-0">
                <motion.h3
                  className="font-display text-xl md:text-3xl font-bold tracking-[-0.03em] leading-tight text-primary-text"
                  animate={{ x: isHovered ? 14 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {c.name}
                </motion.h3>
                <motion.div
                  className="overflow-hidden"
                  initial={false}
                  animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                >
                  <p className="pt-2 pl-[14px] text-sm text-primary-secondary">
                    {[...(c.skills ?? []), c.expires ? `Valid until ${c.expires}` : `Issued ${c.issued}`].join("  ·  ")}
                  </p>
                </motion.div>
              </div>
              <span className="hidden md:block text-sm font-semibold text-primary-secondary">{c.issuer}</span>
              <motion.span
                className="justify-self-end text-primary-text"
                animate={{ rotate: isHovered ? 45 : 0 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <ArrowUpRight size={20} />
              </motion.span>
            </div>
            <p className="md:hidden -mt-4 pb-5 pl-[4.5rem] text-sm text-primary-secondary">{c.issuer}</p>
          </li>
        );
      })}
    </ol>
  );
};

export default CertList;
