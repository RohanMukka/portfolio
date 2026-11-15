import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { useMediaQuery } from "../../lib/useMediaQuery";
import { WIDE } from "../../lib/breakpoints";
import { CHAPTERS, INTRO } from "./chapters";
import ChapterText, { ChapterLabel } from "./ChapterText";
import AboutStack from "./AboutStack";
import { PORTRAIT } from "./content";

// About, "Short path": nothing pins. The intro holds on the left while the
// chapters scroll past on the right like a normal page; the chapter at the
// middle of the screen is at full strength (and lit in the intro's list);
// the rest dim to the quietest text colour. About to Work in under 2
// screens of scroll. Behind it the 3D stage is only a faint haze
// (particles.ts, haze()).

const Wide = () => {
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // The chapter whose middle is nearest the middle of the screen.
  const update = () => {
    const mid = window.innerHeight * 0.5;
    let best = 0;
    let bestDist = Infinity;
    rows.current.forEach((el, i) => {
      const r = el?.getBoundingClientRect();
      if (!r) return;
      const d = Math.abs(r.top + r.height * 0.5 - mid);
      if (d < bestDist) {
        best = i;
        bestDist = d;
      }
    });
    setActive(best);
  };

  useEffect(update, []);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", update);

  return (
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-12 gap-x-6">
      <div className="col-span-4">
        <div className="sticky top-32 flex flex-col gap-8">
          <img
            src={PORTRAIT}
            alt="Pencil portrait of Rohan Mukka"
            width={224}
            height={224}
            loading="lazy"
            decoding="async"
            className="w-20 h-20 rounded-full object-cover border border-primary-text/10 bg-[#fbfaf6]"
          />
          <p data-stage-safe className="text-[1.65rem] font-display font-semibold tracking-[-0.025em] leading-[1.3] text-primary-text">
            {INTRO}
          </p>
          <ol className="flex flex-col gap-2" aria-label="Chapters">
            {CHAPTERS.map((chapter, i) => (
              <li key={chapter.kicker}>
                <ChapterLabel chapter={chapter} lit={i === active} />
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="col-span-8 flex flex-col">
        {CHAPTERS.map((chapter, i) => (
          <div
            key={chapter.kicker}
            ref={(el) => {
              rows.current[i] = el;
            }}
            className="relative pl-12 py-16 first:pt-4"
          >
            <ChapterText i={i} chapter={chapter} size="md" lit={i === active} />
          </div>
        ))}
      </div>
    </div>
  );
};

const AboutPath = () => (useMediaQuery(WIDE) ? <Wide /> : <AboutStack />);

export default AboutPath;
