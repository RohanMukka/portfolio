import React, { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useTransform, type MotionValue } from "framer-motion";
import { loadStage } from "../../stage/Stage";
import { EASE } from "./shared";

const MAX_MS = 4000; // never hold visitors hostage to a slow asset
const MIN_MS = 1200; // long enough to read as an intro, not a wait
const STEP_MS = 260; // a fast load still moves the line in steps you can see
const SLOT_PX = 8; // height of the closed line
// One unhurried curve for the opening; the name's focus rides the same one.
const OPEN = { duration: 1.6, ease: [0.65, 0, 0.35, 1] as const };

// The panel before the intro has run: a slot too thin to see.
export const CLOSED_CLIP = "inset(50% 48% 50% 48% round 400px)";

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
// never measured or shown in a fallback font.
const LOAD_TASKS = [
  () => document.fonts.load('800 1em "Inter Tight"').then(() => document.fonts.ready),
  () => imageReady(`${import.meta.env.BASE_URL}hero-profile.png`),
  () => loadStage(),
  pageLoaded,
];

// Real loading: `progress` runs 0 → 90 as the tasks settle, and `ready` turns
// true once all are in and the intro has had MIN_MS on screen.
const useIntroLoad = () => {
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
      const wait = MIN_MS - (performance.now() - started);
      if (wait > 0) await sleep(wait);
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [progress]);

  return { progress, ready };
};

// Where the name sits inside the panel, in px from its top-left, kept
// current through resizes. A passive effect, not a layout one: the intro
// renders before the panel, and the panel's ref is only attached by then.
const useNameCentre = (
  panelRef: React.RefObject<HTMLDivElement | null>,
  nameRef: React.RefObject<HTMLDivElement | null>,
  onChange: () => void,
) => {
  const centre = useRef<{ cy: number; h: number } | null>(null);
  const changed = useRef(onChange);
  changed.current = onChange;

  useEffect(() => {
    const panel = panelRef.current;
    const name = nameRef.current;
    if (!panel || !name) return;
    const update = () => {
      const p = panel.getBoundingClientRect();
      const n = name.getBoundingClientRect();
      centre.current = { cy: n.top - p.top + n.height / 2, h: p.height };
      changed.current();
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(panel);
    observer.observe(name);
    return () => observer.disconnect();
  }, [panelRef, nameRef]);

  return centre;
};

// The hero's opening, drawn on the plain page under the panel. A solid line
// of the panel's colour runs across the middle and widens as the page loads,
// with a small counter in the corner. Once everything is in, the line opens
// top and bottom into the full panel while the name, hidden until now, pulls
// into focus inside it, like a lens. `clip` and `focus` drive the panel;
// `onOpen` hands over once it is fully open.
const HeroIntro = ({ clip, focus, panelRef, nameRef, onOpen }: {
  clip: MotionValue<string>;
  focus: MotionValue<number>;
  panelRef: React.RefObject<HTMLDivElement | null>;
  nameRef: React.RefObject<HTMLDivElement | null>;
  onOpen: () => void;
}) => {
  const { progress, ready } = useIntroLoad();
  const open = useMotionValue(0);
  const counter = useTransform(progress, (v) => String(Math.round(v)).padStart(3, "0"));
  const chrome = useTransform(open, [0, 0.3], [1, 0]);

  const centre = useNameCentre(panelRef, nameRef, () => update());
  // The line is centred on the name; its width follows loading, its height
  // the opening.
  const update = () => {
    const c = centre.current;
    if (!c) return;
    const o = open.get();
    const x = (100 - (4 + 96 * Math.min(progress.get() / 90, 1))) / 2;
    const top = (c.cy - SLOT_PX / 2) * (1 - o);
    const bottom = (c.h - c.cy - SLOT_PX / 2) * (1 - o);
    clip.set(`inset(${top}px ${x}% ${bottom}px ${x}% round ${(1 - o) * 400}px)`);
  };

  useEffect(() => {
    const offs = [
      progress.on("change", update),
      open.on("change", (o) => {
        update();
        focus.set(o);
      }),
    ];
    return () => offs.forEach((off) => off());
  });

  useEffect(() => {
    if (!ready) return;
    let cancelled = false;
    (async () => {
      animate(progress, 100, { duration: 0.5, ease: EASE });
      await animate(open, 1, OPEN);
      if (!cancelled) onOpen();
    })();
    return () => {
      cancelled = true;
    };
  }, [ready, progress, open, onOpen]);

  return (
    <motion.div
      className="absolute bottom-8 right-6 md:bottom-12 md:right-14 flex items-baseline gap-3 text-primary-text"
      style={{ opacity: chrome }}
    >
      <span className="text-[10px] uppercase tracking-[0.3em] text-primary-secondary">Loading</span>
      <motion.span className="font-display text-sm tabular-nums tracking-[0.1em]">{counter}</motion.span>
    </motion.div>
  );
};

export default HeroIntro;
