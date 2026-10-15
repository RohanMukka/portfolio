import React, { useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { projects, FEATURED_TITLES, type Project } from "../../data/projects";
import { diagrams } from "../../data/diagrams";
import { scrollToY } from "../../lib/smoothScroll";
import { NODE_COUNT } from "../../stage/piece";
import { setFocus } from "../../stage/store";
import { hasCaseStudy, openCaseStudy } from "./CaseStudy";
import { pad, ProjectLinks, TagList } from "./shared";

// The featured projects, one per node of the 3D network, in tour order.
const STOPS = FEATURED_TITLES.slice(0, NODE_COUNT).map((title) => projects.find((p) => p.title === title)!);
// The tour runs over this stretch of its scroll; the stage's camera flies
// node to node over the same stretch (placeTour in src/stage/scene.ts).
const RUN = [0.05, 0.95];

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// A stop's caption: fully in while the camera holds on its node, sliding
// on as the camera flies to the next.
const Caption = ({ project, index, at }: { project: Project; index: number; at: MotionValue<number> }) => {
  const opacity = useTransform(at, (a) => 1 - smooth(0.2, 0.5, Math.abs(a - index)));
  const y = useTransform(at, (a) => (index - a) * 36);
  const pointerEvents = useTransform(at, (a) => (Math.abs(a - index) < 0.5 ? "auto" : "none"));
  const fact = diagrams[project.title]?.fact;

  return (
    <div className="absolute inset-0 flex items-end lg:items-center">
      <motion.div style={{ opacity, y, pointerEvents }} className="w-full">
        <p className="hud text-primary-tertiary">
          <span className="text-accent">{pad(index + 1)}</span> / {pad(STOPS.length)} · {project.category}
        </p>
        <h3 className="mt-4 font-display font-bold text-[clamp(2.75rem,6vw,5.5rem)] tracking-[-0.045em] leading-[0.92] text-primary-text">
          {project.title}
        </h3>
        <p className="mt-3 font-serif italic text-2xl md:text-3xl text-accent">{project.tagline}</p>
        {fact && <p className="mt-5 text-lg md:text-xl text-primary-text max-w-md">{fact}</p>}
        <p className="hidden md:block mt-3 text-base text-primary-secondary leading-relaxed max-w-md">{project.description}</p>
        <div className="mt-5">
          <TagList tags={project.tags} />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {hasCaseStudy(project.title) && (
            <button
              type="button"
              onClick={() => openCaseStudy(project.title)}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-primary-text/20 text-sm font-medium text-primary-text hover:border-accent hover:text-accent transition-colors"
            >
              Read the case study
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
            </button>
          )}
          <ProjectLinks project={project} />
        </div>
      </motion.div>
    </div>
  );
};

// Work's tour: the scene pins while the camera flies to each featured
// project's node in turn, the caption beside it changing with it. Numbered
// ticks jump straight to a stop, and a link skips past to the rest of the
// work.
const WorkTour = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const at = useTransform(scrollYProgress, RUN, [0, STOPS.length - 1]);
  const [active, setActive] = useState(0);

  // The stop in view lights its node; leaving the tour lets it go.
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.round(at.get());
    if (i !== active) setActive(i);
    setFocus(p > 0.02 && p < 0.98 ? i : -1);
  });

  const jumpTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const p = RUN[0] + (i / (STOPS.length - 1)) * (RUN[1] - RUN[0]);
    scrollToY(top + p * (el.offsetHeight - window.innerHeight));
  };

  const skip = () => {
    const more = document.getElementById("more-work");
    if (more) scrollToY(more.getBoundingClientRect().top + window.scrollY - 80);
  };

  return (
    <div ref={ref} data-progress="work" className="relative" style={{ height: `${STOPS.length * 60 + 100}vh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        <div className="relative h-full max-w-6xl mx-auto px-6">
          <div className="absolute inset-x-6 top-[42%] bottom-28 lg:top-24 lg:bottom-24 lg:right-auto lg:w-[46%]">
            {STOPS.map((project, i) => (
              <React.Fragment key={project.title}>
                <Caption project={project} index={i} at={at} />
              </React.Fragment>
            ))}
          </div>

          {/* Left-aligned, clear of the page's floating buttons bottom right. */}
          <div className="absolute inset-x-6 bottom-8 flex flex-wrap items-center gap-x-8 gap-y-2">
            <div className="flex items-center gap-1" role="group" aria-label="Featured projects">
              {STOPS.map((project, i) => (
                <button
                  key={project.title}
                  type="button"
                  onClick={() => jumpTo(i)}
                  aria-label={project.title}
                  aria-current={i === active}
                  className={`hud px-2 py-1.5 rounded-md transition-colors ${
                    i === active ? "text-primary-text bg-surface-subtle" : "text-primary-tertiary hover:text-primary-text"
                  }`}
                >
                  {pad(i + 1)}
                </button>
              ))}
            </div>
            <button type="button" onClick={skip} className="group inline-flex items-center gap-2 hud text-primary-secondary hover:text-accent transition-colors">
              Skip to more work
              <ArrowDown size={14} className="transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkTour;
