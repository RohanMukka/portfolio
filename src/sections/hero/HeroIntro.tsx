import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { loadStage } from "../../stage/Stage";
import { isSoftwareRendering } from "../../lib/rendering";
import { EASE } from "./shared";

const MAX_MS = 4000; // never hold visitors hostage to a slow asset
const MIN_MS = 1200; // long enough to read as an intro, not a wait
const HINT_MS = 2400; // long enough to also read the graphics tip
const STEP_MS = 260; // a fast load still moves the line in steps you can see

// One unhurried curve for the opening. The hero's name pulls into focus on
// the same one, so the two read as a single move.
export const INTRO_OPEN = { duration: 1.6, ease: [0.65, 0, 0.35, 1] as const };

export type IntroPhase = "loading" | "opening" | "open";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const withCap = (p: Promise<unknown>) => Promise.race([p.catch(() => undefined), sleep(MAX_MS)]);

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

// What the intro waits for. The name's own face comes first, so the name is
// never measured or shown in a fallback font. Lite mode has no 3D stage.
const LOAD_TASKS = [
  () => document.fonts.load('800 1em "Inter Tight"').then(() => document.fonts.ready),
  () => imageReady(`${import.meta.env.BASE_URL}hero-profile.png`),
  () => (isSoftwareRendering() ? Promise.resolve() : loadStage()),
  pageLoaded,
];

// Real loading: `progress` runs 0 → 90 as the tasks settle, and `ready` turns
// true once all are in and the intro has had `minMs` on screen.
const useIntroLoad = (minMs: number) => {
  const progress = useMotionValue(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const started = performance.now();
    let done = 0;
    let nextStep = started;

    const runs = LOAD_TASKS.map((task) =>
      withCap(task()).then(async () => {
        const at = Math.max(performance.now(), nextStep);
        nextStep = at + STEP_MS;
        await sleep(at - performance.now());
        if (cancelled) return;
        done += 1;
        animate(progress, (done / LOAD_TASKS.length) * 90, { duration: 0.6, ease: EASE });
      }),
    );

    Promise.all(runs).then(async () => {
      const wait = minMs - (performance.now() - started);
      if (wait > 0) await sleep(wait);
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [minMs, progress]);

  return { progress, ready };
};

// The hero's opening, laid over the hero. Two plain plates cover the colour
// panel and meet behind a solid line of its colours, which widens as the page
// loads, with a small counter in the corner. Once everything is in, the
// plates slide apart top and bottom to uncover the panel while the name
// pulls into focus. Only transforms and opacity move, so the browser can run
// it smoothly even without a graphics card.
const HeroIntro = ({ phase, nameRef, onReady, onOpened }: {
  phase: IntroPhase;
  nameRef: React.RefObject<HTMLDivElement | null>;
  onReady: () => void;
  onOpened: () => void;
}) => {
  const [hint] = useState(isSoftwareRendering);
  const { progress, ready } = useIntroLoad(hint ? HINT_MS : MIN_MS);
  const lineScale = useTransform(progress, (v) => 0.04 + 0.96 * Math.min(v / 90, 1));
  const counter = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const opening = phase !== "loading";

  // The plates meet at the name's middle. The intro renders after the panel,
  // so the name's ref is already set when this measures, before first paint.
  const boxRef = useRef<HTMLDivElement>(null);
  const [seam, setSeam] = useState<number | null>(null);
  useLayoutEffect(() => {
    const box = boxRef.current;
    const name = nameRef.current;
    if (!box || !name) return;
    const measure = () => {
      const b = box.getBoundingClientRect();
      const n = name.getBoundingClientRect();
      setSeam(n.top - b.top + n.height / 2);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(name);
    return () => observer.disconnect();
  }, [nameRef]);

  useEffect(() => {
    if (!ready) return;
    animate(progress, 100, { duration: 0.5, ease: EASE });
    onReady();
  }, [ready, progress, onReady]);

  const at = seam ?? "50%";
  const chrome = { animate: { opacity: opening ? 0 : 1 }, transition: { duration: 0.4, ease: "easeOut" as const } };

  return (
    <div ref={boxRef} className="absolute inset-0 z-20 pointer-events-none" aria-hidden="true">
      <motion.div
        className="absolute inset-x-0 top-0 bg-background"
        style={{ height: at }}
        initial={false}
        animate={{ transform: opening ? "translateY(-100%)" : "translateY(0%)" }}
        transition={INTRO_OPEN}
        onAnimationComplete={() => opening && onOpened()}
      />
      <motion.div
        className="absolute inset-x-0 bottom-0 bg-background"
        style={{ top: at }}
        initial={false}
        animate={{ transform: opening ? "translateY(100%)" : "translateY(0%)" }}
        transition={INTRO_OPEN}
      />

      <motion.div className="absolute inset-x-2.5 md:inset-x-3.5 h-2 -mt-1" style={{ top: at }} initial={false} {...chrome}>
        <motion.div
          className="h-full rounded-full bg-[linear-gradient(90deg,#3b6cff,#e0457b_55%,#ff7a3d)]"
          style={{ scaleX: lineScale }}
        />
      </motion.div>

      <div className="absolute inset-0 p-2.5 md:p-3.5">
        <div className="relative h-full w-full">
          {hint && (
            <motion.p
              className="absolute bottom-8 left-6 md:bottom-12 md:left-14 max-w-[300px] text-[10px] leading-relaxed uppercase tracking-[0.2em] text-primary-secondary"
              initial={false}
              {...chrome}
            >
              Your browser is drawing without graphics acceleration, so this is a lighter version of the site. Turn
              acceleration on in its settings for the full one.
            </motion.p>
          )}
          <motion.div
            className="absolute bottom-8 right-6 md:bottom-12 md:right-14 flex items-baseline gap-3 text-primary-text"
            initial={false}
            {...chrome}
          >
            <span className="text-[10px] uppercase tracking-[0.3em] text-primary-secondary">Loading</span>
            <motion.span className="font-display text-sm tabular-nums tracking-[0.1em]">{counter}</motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroIntro;
