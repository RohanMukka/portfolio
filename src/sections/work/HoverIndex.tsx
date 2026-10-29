import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { FEATURED_TITLES, type Project } from "../../data/projects";
import { useMediaQuery } from "../../lib/useMediaQuery";
import { WIDE } from "../../lib/breakpoints";
import { NODE_COUNT } from "../../stage/piece";
import { setFocus } from "../../stage/store";
import { EASE, pad, ProjectLinks, TagList } from "./shared";
import ProjectVisual, { factFor } from "./ProjectVisual";
import { hasCaseStudy, openCaseStudy } from "./CaseStudy";

// The project's node in the 3D network behind the list, if it has one.
const nodeOf = (p: Project) => {
  const i = FEATURED_TITLES.indexOf(p.title);
  return i < NODE_COUNT ? i : -1;
};

// The floating preview: its size (a 4:3 picture over a caption bar), and the
// gap it keeps from the row it shows.
const CARD_W = 380;
const CARD_H = 328;
const CARD_GAP = 16;
// Room the navbar takes at the top of the window.
const TOP_CLEAR = 80;

// An editorial list. Hovering a row lights that project's node in the 3D
// network beside it and floats its footage (or diagram) beside the row in a
// gradient frame that follows the cursor across and leans with its speed;
// clicking a row opens its case study, or its details inline for projects
// without one. Plain scrolling, no pin.
// `start` numbers the first row (lists that continue another count on from it).
const HoverIndex = ({ items, start = 1 }: { items: Project[]; start?: number }) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  // Keeps the preview's content while it fades out after the cursor leaves.
  const [shown, setShown] = useState<Project | null>(null);
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");
  // On wide screens the network's tag already shows a featured project's
  // headline fact, so the card shows its tagline instead.
  const wide = useMediaQuery(WIDE);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 30, mass: 0.5 });
  // Lean into the direction of travel, like a card being dragged.
  const tilt = useSpring(useTransform(useVelocity(x), [-2500, 0, 2500], [-9, 0, 9]), { stiffness: 200, damping: 25 });

  const showPreview = canHover && hovered !== null && hovered !== open;

  // The card sits above the hovered row (below it when there's no room
  // above), centred on the cursor across, so it never covers the row it's
  // showing. Placed from the row itself, it's right even when rows slide in
  // under a resting pointer while the page scrolls.
  const cardRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLElement | null>(null);
  const pointerX = useRef(0);
  const visible = useRef(false);
  visible.current = showPreview;
  const place = (jump: boolean) => {
    const row = rowRef.current;
    if (!row) return;
    const r = row.getBoundingClientRect();
    // Its height, or (before its first project has rendered) what it will be.
    const h = Math.max(cardRef.current?.offsetHeight ?? 0, CARD_H);
    const left = Math.min(Math.max(pointerX.current - CARD_W / 2, 16), window.innerWidth - CARD_W - 16);
    const above = r.top - CARD_GAP - h;
    const top = above >= TOP_CLEAR ? above : r.bottom + CARD_GAP;
    x.set(left);
    y.set(top);
    // A card that isn't showing yet appears in place rather than flying in.
    if (jump) {
      sx.jump(left);
      sy.jump(top);
    }
  };

  // Rows move under the card as the page scrolls; it keeps to its row.
  useEffect(() => {
    if (!showPreview) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        place(false);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [showPreview]);

  return (
    <div
      className="relative"
      onMouseMove={(e) => {
        pointerX.current = e.clientX;
        place(!visible.current);
      }}
      onMouseLeave={() => {
        setHovered(null);
        setFocus(-1);
      }}
    >
      <ol>
        {items.map((p, i) => {
          const isOpen = open === p.title;
          const isHovered = hovered === p.title;
          const dim = hovered !== null && !isHovered && !isOpen;
          return (
            <li key={p.title} className="border-b border-primary-text/10" onMouseEnter={(e) => {
                rowRef.current = e.currentTarget;
                pointerX.current = e.clientX;
                place(!visible.current);
                setHovered(p.title);
                setShown(p);
                setFocus(nodeOf(p));
              }}>
              <button
                onClick={() => (hasCaseStudy(p.title) ? openCaseStudy(p.title) : setOpen(isOpen ? null : p.title))}
                data-cursor={hasCaseStudy(p.title) ? "View" : isOpen ? "Close" : "Details"}
                aria-expanded={hasCaseStudy(p.title) ? undefined : isOpen}
                className={`relative w-full grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[4rem_1fr_7rem_2rem] items-center gap-4 py-6 md:py-7 text-left transition-opacity duration-300 ${dim ? "opacity-35" : "opacity-100"}`}
              >
                <span className="hud text-accent">{pad(start + i)}</span>
                <motion.span
                  className="min-w-0"
                  animate={{ x: isHovered ? 16 : 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <span className="block font-display font-bold text-2xl md:text-5xl tracking-[-0.04em] leading-none text-primary-text">
                    {p.title}
                  </span>
                  <span className="hidden md:block mt-2 text-sm text-primary-secondary truncate">{p.tagline}</span>
                </motion.span>
                {/* Gradient underline that sweeps across the hovered row. */}
                <motion.span
                  className="pointer-events-none absolute left-0 right-0 -bottom-px h-px origin-left"
                  style={{ background: "linear-gradient(90deg, #1d3fbf, #e0457b, #ff7a3d)" }}
                  initial={false}
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: EASE }}
                />
                <span className="hidden md:block hud text-primary-secondary">{p.category}</span>
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

      {/* Floating preview (mouse only), framed in the hero's colours. */}
      {canHover && (
        <motion.div
          ref={cardRef}
          className="pointer-events-none fixed left-0 top-0 z-40 rounded-[20px] p-[3px] shadow-2xl"
          style={{ width: CARD_W, x: sx, y: sy, rotate: tilt, background: "linear-gradient(135deg, #1d3fbf, #e0457b 55%, #ff7a3d)" }}
          animate={{ opacity: showPreview ? 1 : 0, scale: showPreview ? 1 : 0.85 }}
          transition={{ duration: 0.3, ease: EASE }}
          aria-hidden="true"
        >
          {shown && (
            <div className="relative rounded-[17px] overflow-hidden bg-background">
              <div className="aspect-[4/3]">
                <ProjectVisual project={shown} playing={showPreview} />
              </div>
              {/* HUD corner marks over the visual. */}
              {["top-3 left-3 border-t border-l", "top-3 right-3 border-t border-r", "bottom-[52px] left-3 border-b border-l", "bottom-[52px] right-3 border-b border-r"].map((c) => (
                <span key={c} className={`absolute w-3 h-3 border-primary-text/40 ${c}`} />
              ))}
              <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-primary-text/10 text-[10px] font-medium uppercase tracking-[0.2em]">
                <span className="truncate text-primary-text">{wide && nodeOf(shown) >= 0 ? shown.tagline : factFor(shown) ?? shown.tagline}</span>
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
