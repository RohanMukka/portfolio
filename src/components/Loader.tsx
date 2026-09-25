import React, { useEffect } from "react";
import { animate, motion, useMotionValue, usePresence, useTransform } from "framer-motion";
import { NAME_WORDS, NAME_TYPE } from "../lib/heroName";

const MIN_MS = 1400; // long enough to read as an intro, not a wait
const MAX_MS = 4000; // never hold visitors hostage to a slow asset
const EASE = [0.16, 1, 0.3, 1] as const;

const withCap = (p: Promise<unknown>) =>
  Promise.race([p.catch(() => undefined), new Promise((r) => setTimeout(r, MAX_MS))]);

const imageReady = (src: string) =>
  new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = img.onerror = () => resolve();
    img.src = src;
  });

const pageLoaded = () =>
  document.readyState === "complete"
    ? Promise.resolve()
    : new Promise<void>((r) => window.addEventListener("load", () => r(), { once: true }));

// Intro: a counter that follows real loading (fonts, the portrait, the page)
// while the name rises letter by letter from behind a mask. When it unmounts,
// each letter's layoutId hands it to the hero, so intro and page are one shot.
const Loader = ({ onDone }: { onDone: () => void }) => {
  const progress = useMotionValue(0);
  const counter = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const bar = useTransform(progress, (v) => v / 100);

  // Fade out on exit with a JS-driven motion value and release the presence
  // ourselves, rather than an `exit` prop (a native animation whose finish
  // event never fires while the tab isn't drawing frames).
  const fade = useMotionValue(1);
  const [isPresent, safeToRemove] = usePresence();
  useEffect(() => {
    if (isPresent) return;
    const controls = animate(fade, 0, { duration: 0.5, ease: EASE });
    controls.then(() => safeToRemove?.());
    return () => controls.stop();
  }, [isPresent, fade, safeToRemove]);

  useEffect(() => {
    let cancelled = false;
    const started = performance.now();
    const tasks = [
      document.fonts.ready,
      imageReady(`${import.meta.env.BASE_URL}hero-profile.png`),
      pageLoaded(),
    ].map(withCap);

    let settled = 0;
    tasks.forEach((t) =>
      t.then(() => {
        settled += 1;
        if (!cancelled) animate(progress, (settled / tasks.length) * 90, { duration: 0.6, ease: EASE });
      }),
    );

    Promise.all(tasks).then(async () => {
      const wait = MIN_MS - (performance.now() - started);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      if (cancelled) return;
      await animate(progress, 100, { duration: 0.45, ease: EASE });
      await new Promise((r) => setTimeout(r, 250));
      if (!cancelled) onDone();
    });

    return () => {
      cancelled = true;
    };
  }, [onDone, progress]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-background flex items-center justify-center px-6"
      aria-label="Loading"
      style={{ opacity: fade, pointerEvents: isPresent ? "auto" : "none" }}
    >
      <h1 className={`${NAME_TYPE} flex flex-wrap justify-center gap-x-4`} aria-label="Rohan Mukka">
        {NAME_WORDS.map((word, w) => (
          <span key={w} className="inline-block whitespace-nowrap" aria-hidden="true">
            {word.map((item, i) => (
              // The mask: letters rise from below a clipped line.
              <span key={item.id} className="inline-block overflow-hidden align-bottom pb-[0.08em]">
                <motion.span
                  layoutId={item.id}
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.15 + (w * 5 + i) * 0.045 }}
                >
                  {item.char}
                </motion.span>
              </span>
            ))}
          </span>
        ))}
      </h1>

      <div className="absolute inset-x-6 bottom-8 md:inset-x-10 md:bottom-10 flex items-end justify-between text-xs uppercase tracking-[0.3em] text-primary-secondary">
        <span>Portfolio</span>
        <motion.span className="font-display text-sm tabular-nums tracking-[0.1em] text-primary-text">{counter}</motion.span>
        <span>Software Engineer</span>
      </div>
      <motion.div
        className="absolute left-0 bottom-0 h-[2px] w-full bg-accent origin-left"
        style={{ scaleX: bar }}
      />
    </motion.div>
  );
};

export default Loader;
