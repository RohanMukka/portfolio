import React, { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "../../data/projects";
import { useMediaQuery } from "../../lib/useMediaQuery";
import { EASE, pad, ProjectLinks, TagList } from "./shared";
import ProjectVisual, { factFor } from "./ProjectVisual";
import { hasCaseStudy, openCaseStudy } from "./CaseStudy";

// An editorial list. Hovering a row floats that project's diagram by the
// cursor in a colour-panel frame that leans with the cursor's speed;
// clicking a row opens its case study, or its details inline for projects
// without one. Plain scrolling, no pin.
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
  // Lean into the direction of travel, like a card being dragged.
  const tilt = useSpring(useTransform(useVelocity(x), [-2500, 0, 2500], [-9, 0, 9]), { stiffness: 200, damping: 25 });

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
      <ol>
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
                className={`relative w-full grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[4rem_1fr_15rem_7rem_2rem] items-center gap-4 py-6 md:py-7 text-left transition-opacity duration-300 ${dim ? "opacity-35" : "opacity-100"}`}
              >
                <span className="text-xs tabular-nums tracking-widest text-accent">{pad(i + 1)}</span>
                <motion.span
                  className="font-display font-bold text-2xl md:text-5xl tracking-[-0.04em] leading-none text-primary-text"
                  animate={{ x: isHovered ? 16 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  {p.title}
                </motion.span>
                {/* Gradient underline that sweeps across the hovered row. */}
                <motion.span
                  className="pointer-events-none absolute left-0 right-0 -bottom-px h-px origin-left"
                  style={{ background: "linear-gradient(90deg, #1d3fbf, #e0457b, #ff7a3d)" }}
                  initial={false}
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
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

      {/* Cursor-following preview (mouse only), framed in the hero's colours. */}
      {canHover && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-40 -ml-[190px] -mt-[160px] w-[380px] rounded-[20px] p-[3px] shadow-2xl"
          style={{ x: sx, y: sy, rotate: tilt, background: "linear-gradient(135deg, #1d3fbf, #e0457b 55%, #ff7a3d)" }}
          animate={{ opacity: showPreview ? 1 : 0, scale: showPreview ? 1 : 0.85 }}
          transition={{ duration: 0.3, ease: EASE }}
          aria-hidden="true"
        >
          {shown && (
            <div className="relative rounded-[17px] overflow-hidden bg-background">
              <div className="aspect-[4/3]">
                <ProjectVisual project={shown} />
              </div>
              {/* HUD corner marks over the visual. */}
              {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-[52px] left-3 border-b border-l", "bottom-[52px] right-3 border-b border-r"].map((c) => (
                <span key={c} className={`absolute w-3 h-3 border-primary-text/40 ${c}`} />
              ))}
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-primary-text/10 text-[10px] font-medium uppercase tracking-[0.2em]">
                <span className="truncate text-primary-text">{factFor(shown) ?? shown.tagline}</span>
                <span className="shrink-0 text-accent">{shown.category}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default HoverIndex;
