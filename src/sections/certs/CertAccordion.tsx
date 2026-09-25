import React, { useState } from "react";
import { motion } from "framer-motion";
import { certificationsByDate, yearOf } from "../../data/certifications";

// Option 6: tall strips side by side. Hovering (or tapping) one widens it to
// show the certificate; the rest narrow to their year and issuer.
const CertAccordion = () => {
  const [open, setOpen] = useState(0);

  return (
    <div className="flex flex-col md:flex-row gap-3 md:h-[440px]">
      {certificationsByDate.map((c, i) => {
        const isOpen = open === i;
        return (
          <motion.button
            key={c.name}
            onMouseEnter={() => setOpen(i)}
            onClick={() => setOpen(i)}
            className={`relative overflow-hidden rounded-[1.5rem] text-left p-6 flex flex-col justify-between transition-colors ${
              isOpen ? "bg-primary-text text-background" : "glass-card text-primary-text"
            }`}
            animate={{ flexGrow: isOpen ? 5 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ flexBasis: 0, minWidth: 0 }}
          >
            <span className={`font-display text-2xl font-extrabold tracking-[-0.04em] ${isOpen ? "text-accent" : ""}`}>{yearOf(c)}</span>
            {isOpen ? (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
                <p className="text-xs font-bold uppercase tracking-[0.3em] opacity-70">{c.issuer}</p>
                <h3 className="mt-3 font-display text-2xl md:text-4xl font-bold tracking-[-0.035em] leading-[1.05]">{c.name}</h3>
                <p className="mt-4 text-sm opacity-80">
                  {[...(c.skills ?? []), c.expires ? `Valid until ${c.expires}` : `Issued ${c.issued}`].join("  ·  ")}
                </p>
              </motion.div>
            ) : (
              <span className="hidden md:block text-xs font-bold uppercase tracking-[0.2em] opacity-60 [writing-mode:vertical-rl] rotate-180 whitespace-nowrap">
                {c.issuer}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default CertAccordion;
