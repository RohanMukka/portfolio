import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { certificationsByDate, yearOf } from "../../data/certifications";

// Option 5: the section pins and vertical scroll slides a row of paper
// certificates sideways, each styled like the real document.
const CertPapers = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // Slide until the last paper is fully in view.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-52%"]);

  return (
    <div ref={ref} className="relative h-[260vh] left-1/2 w-screen -translate-x-1/2">
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <motion.div className="flex gap-8 pl-[max(1.5rem,calc((100vw-72rem)/2))]" style={{ x }}>
          {certificationsByDate.map((c) => (
            <article
              key={c.name}
              className="relative shrink-0 w-[78vw] sm:w-[26rem] aspect-[1.414/1] rounded-md bg-[#fbfaf6] text-[#002366] shadow-[0_30px_60px_-25px_rgba(0,35,102,0.35)] p-6 md:p-8 flex flex-col"
            >
              {/* Double rule border, like a printed certificate. */}
              <div className="absolute inset-3 border border-[#002366]/25 rounded-sm pointer-events-none" />
              <div className="absolute inset-[18px] border border-[#002366]/10 rounded-sm pointer-events-none" />
              <p className="relative text-[10px] font-bold uppercase tracking-[0.35em] text-[#c45c26]">Certificate · {c.issuer}</p>
              <h3 className="relative mt-4 font-display text-xl md:text-2xl font-bold tracking-[-0.02em] leading-tight">{c.name}</h3>
              <p className="relative mt-2 text-xs text-[#002366]/60">Awarded to Rohan Mukka</p>
              <div className="relative mt-auto flex items-end justify-between">
                <div className="text-[11px] leading-relaxed text-[#002366]/70">
                  Issued {c.issued}
                  {c.expires && <><br />Valid until {c.expires}</>}
                </div>
                <div className="w-16 h-16 rounded-full border-2 border-[#c45c26] flex items-center justify-center text-[#c45c26] font-display font-extrabold text-sm rotate-[-12deg]">
                  {yearOf(c)}
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default CertPapers;
