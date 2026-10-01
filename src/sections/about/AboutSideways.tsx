import React, { useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useMediaQuery } from "../../lib/useMediaQuery";
import { DEVPOST, PANELS, PORTRAIT } from "./content";

const EASE = [0.16, 1, 0.3, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

// About: the section pins and the story slides sideways, one panel per
// chapter of the path here. Phones read it as a stack.

const Panel = ({ i, panel }: { i: number; panel: (typeof PANELS)[number] }) => (
  <div className="flex flex-col justify-center gap-8 h-full">
    <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">
      {pad(i + 1)} — {panel.kicker}
    </p>
    <h3 className="font-display font-bold text-4xl lg:text-[4.25rem] tracking-[-0.045em] leading-[1.02] text-primary-text max-w-[16ch]">
      {panel.heading}
    </h3>
    <p className="text-lg text-primary-secondary leading-relaxed max-w-xl">{panel.body}</p>
    {i === 0 && (
      <img
        src={PORTRAIT}
        alt="Pencil portrait of Rohan Mukka"
        className="w-28 h-28 rounded-full object-cover object-[50%_30%] border border-primary-text/10 bg-[#fbfaf6]"
      />
    )}
    {i === PANELS.length - 1 && (
      <a
        href={DEVPOST}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm font-semibold text-primary-text hover:text-accent transition-colors"
      >
        Hackathon work on Devpost <ArrowUpRight size={16} />
      </a>
    )}
  </div>
);

const Pinned = () => {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const measure = () => track.current && setDistance(track.current.scrollWidth - window.innerWidth);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(p, [0.04, 0.96], [0, -distance]);
  const bar = useTransform(p, [0.04, 0.96], [0, 1]);
  useMotionValueEvent(p, "change", (v) =>
    setActive(Math.min(PANELS.length - 1, Math.max(0, Math.round(((v - 0.04) / 0.92) * (PANELS.length - 1))))),
  );

  return (
    <div ref={ref} className="relative" style={{ height: `${PANELS.length * 90 + 60}vh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex flex-col">
        <motion.div ref={track} style={{ x }} className="flex flex-1 items-stretch will-change-transform">
          {PANELS.map((panel, i) => (
            <div
              key={panel.kicker}
              className="shrink-0 w-[78vw] max-w-[1100px] first:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] pr-[8vw] py-28"
            >
              <Panel i={i} panel={panel} />
            </div>
          ))}
          <div className="shrink-0 w-[10vw]" aria-hidden="true" />
        </motion.div>

        <div className="max-w-6xl mx-auto w-full px-6 pb-10 flex items-center gap-6">
          <span className="text-xs font-bold tabular-nums tracking-[0.25em] text-primary-text">
            {pad(active + 1)} / {pad(PANELS.length)}
          </span>
          <div className="relative flex-1 h-px bg-primary-text/15">
            <motion.div style={{ scaleX: bar }} className="absolute inset-0 origin-left bg-accent" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-primary-secondary">{PANELS[active].kicker}</span>
        </div>
      </div>
    </div>
  );
};

const Stacked = () => (
  <div className="max-w-6xl mx-auto px-6 flex flex-col">
    {PANELS.map((panel, i) => (
      <motion.div
        key={panel.kicker}
        className="py-12 border-t border-primary-text/10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <Panel i={i} panel={panel} />
      </motion.div>
    ))}
  </div>
);

const AboutSideways = () => (useMediaQuery("(min-width: 1024px)") ? <Pinned /> : <Stacked />);

export default AboutSideways;
