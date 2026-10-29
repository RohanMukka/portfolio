import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Pause, Play } from "lucide-react";
import type { ProjectMedia } from "../../data/projects";
import { motionPaused, onMotionPaused } from "../../lib/motion";

const when = (day: string) =>
  new Date(`${day}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// The project running, recorded from its live demo. The screen lies tilted
// back like a laptop lid and lifts to face you as it scrolls up the case
// study; its clip plays while it's in view and stops when it isn't, or when
// paused. `container` is the case study's own scroller.
const InUse = ({ media, container }: { media: ProjectMedia; container: React.RefObject<HTMLDivElement | null> }) => {
  const screen = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  // Starts paused while the visitor has paused motion (lib/motion.ts); the
  // screen's own button still plays it.
  const [paused, setPaused] = useState(motionPaused);
  useEffect(() => onMotionPaused(() => setPaused(motionPaused())), []);

  const { scrollYProgress } = useScroll({ container, target: screen, offset: ["start end", "center center"] });
  const lift = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const rotateX = useTransform(lift, [0, 1], [38, 0]);
  const scale = useTransform(lift, [0, 1], [0.86, 1]);
  const y = useTransform(lift, [0, 1], [80, 0]);

  useEffect(() => {
    const el = screen.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { root: container.current, threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, [container]);

  const playing = Boolean(media.clip) && inView && !paused;
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) v.play().catch(() => setPaused(true));
    else v.pause();
  }, [playing]);

  // Narrow enough that the whole screen (16:10 plus its bar) fits under the
  // case study's header on short laptop screens.
  return (
    <figure className="[perspective:1600px]" style={{ maxWidth: "min(100%, calc((100svh - 11rem) * 1.6))" }}>
      <motion.div
        ref={screen}
        style={{ rotateX, scale, y, transformOrigin: "50% 100%" }}
        className="overflow-hidden rounded-2xl md:rounded-3xl border border-primary-text/15 bg-[#09090c] shadow-2xl"
      >
        <div className="hud flex items-center gap-3 h-11 px-4 md:px-5 border-b border-primary-text/10 bg-background/90">
          <span className={`shrink-0 w-2 h-2 rounded-full transition-colors ${playing ? "bg-accent" : "bg-primary-text/30"}`} />
          <span className="truncate text-primary-text">{media.from}</span>
          <span className="ml-auto shrink-0 hidden sm:block text-primary-secondary">Recorded {when(media.recorded)}</span>
          {media.clip && (
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play the recording" : "Pause the recording"}
              data-cursor={paused ? "Play" : "Pause"}
              className="shrink-0 -mr-1 grid place-items-center w-7 h-7 rounded-full text-primary-text hover:bg-primary-text/10 transition-colors"
            >
              {paused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          )}
        </div>
        <div className="aspect-[16/10]">
          {media.clip ? (
            <video
              ref={video}
              src={media.clip}
              poster={media.still}
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={media.shows}
              className="block w-full h-full object-cover"
            />
          ) : (
            <img src={media.still} alt={media.shows} loading="lazy" className="block w-full h-full object-cover" />
          )}
        </div>
      </motion.div>
      <figcaption className="mt-5 max-w-3xl text-sm font-semibold text-primary-secondary">{media.shows}</figcaption>
    </figure>
  );
};

export default InUse;
