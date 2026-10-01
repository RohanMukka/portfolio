import React, { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../../data/projects";
import { useMediaQuery } from "../../lib/useMediaQuery";
import { EASE, pad, ProjectLinks, TagList } from "./shared";
import ProjectVisual, { factFor } from "./ProjectVisual";
import { hasCaseStudy, openCaseStudy } from "./CaseStudy";

// An editorial list. Hovering a row floats that project's diagram by
// the cursor; clicking a row opens its case study, or its details inline
// for projects without one. Plain scrolling, no pin.
const HoverIndex = ({ items }: { items: Project[] }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  // Keeps the preview's content while it fades out after the cursor leaves.
  const [shown, setShown] = useState<Project | null>(null);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.5 });

  const showPreview = canHover && hovered !== null && hovered !== open;

  return (
    <div
      className="relative"
      onMouseMove={(e) => {
        x.set(e.clientX);
        y.set(e.clientY);
      }}
      onMouseLeave={() => setHovered(null)}
    >
      <ol className="border-t border-primary-text/10">
        {items.map((p, i) => {
          const isOpen = open === p.title;
          const isHovered = hovered === p.title;
          const dim = hovered !== null && !isHovered && !isOpen;
          return (
            <li key={p.title} className="border-b border-primary-text/10" onMouseEnter={() => {
                setHovered(p.title);
                setShown(p);
              }}>
              <button
                onClick={() => (hasCaseStudy(p.title) ? openCaseStudy(p.title) : setOpen(isOpen ? null : p.title))}
                aria-expanded={hasCaseStudy(p.title) ? undefined : isOpen}
                className={`w-full grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[4rem_1fr_15rem_7rem_2rem] items-center gap-4 py-6 md:py-7 text-left transition-opacity duration-300 ${dim ? "opacity-35" : "opacity-100"}`}
              >
                <span className="text-xs tabular-nums tracking-widest text-accent">{pad(i + 1)}</span>
                <motion.span
                  className="font-display font-bold text-2xl md:text-5xl tracking-[-0.04em] leading-none text-primary-text"
                  animate={{ x: isHovered ? 16 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {p.title}
                </motion.span>
                <span className="hidden md:block text-sm text-primary-secondary truncate">{p.tagline}</span>
                <span className="hidden md:block text-xs font-bold uppercase tracking-[0.2em] text-primary-secondary">{p.category}</span>
                <motion.span
                  className="justify-self-end text-primary-text"
                  animate={{ rotate: isOpen ? 90 : isHovered ? 45 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <ArrowUpRight size={22} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    className="overflow-hidden"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <div className="grid md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1.1fr)] gap-6 md:gap-8 pb-10">
                      <span className="hidden md:block" />
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-primary-text/10">
                        <ProjectVisual project={p} />
                      </div>
                      <div className="flex flex-col gap-5">
                        <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">{p.tagline}</p>
                        {factFor(p) && (
                          <p className="font-display text-2xl md:text-3xl font-bold tracking-[-0.03em] leading-tight text-primary-text">{factFor(p)}</p>
                        )}
                        <p className="text-lg text-primary-secondary leading-relaxed">{p.description}</p>
                        <TagList tags={p.tags} />
                        <ProjectLinks project={p} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>

      {/* Cursor-following preview (mouse only). */}
      {canHover && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-40 -ml-[180px] -mt-[150px] w-[360px] rounded-2xl overflow-hidden shadow-2xl border border-primary-text/10 bg-background"
          style={{ x: sx, y: sy }}
          animate={{ opacity: showPreview ? 1 : 0, scale: showPreview ? 1 : 0.85 }}
          transition={{ duration: 0.3, ease: EASE }}
          aria-hidden="true"
        >
          {shown && (
            <>
              <div className="aspect-[4/3]">
                <ProjectVisual project={shown} />
              </div>
              <p className="px-4 py-3 border-t border-primary-text/10 text-xs font-semibold text-primary-text">
                {factFor(shown) ?? shown.tagline}
              </p>
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default HoverIndex;
