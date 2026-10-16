import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useMediaQuery } from "../lib/useMediaQuery";

type Mode = "default" | "link" | "label" | "text";

// What the cursor is over: an element (or ancestor) with data-cursor="…"
// shows that word in a pill; links and buttons grow the ring; open space
// inside data-cursor-hint="…" shows a small hint beside the ring; text
// fields get the system caret.
const read = (target: EventTarget | null): { mode: Mode; label: string; hint: string } => {
  const el = target instanceof Element ? target : null;
  if (!el) return { mode: "default", label: "", hint: "" };
  if (el.closest("input, textarea, select, [contenteditable='true']")) return { mode: "text", label: "", hint: "" };
  const labelled = el.closest<HTMLElement>("[data-cursor]");
  if (labelled) return { mode: "label", label: labelled.dataset.cursor ?? "", hint: "" };
  if (el.closest("a, button, [role='button'], label, summary")) return { mode: "link", label: "", hint: "" };
  return { mode: "default", label: "", hint: el.closest<HTMLElement>("[data-cursor-hint]")?.dataset.cursorHint ?? "" };
};

// The site's own cursor, for mice: a dot on the pointer and a ring that
// trails it on a spring, growing over links and turning into a labelled
// pill where something has a name for what a click does. It stays hidden
// until the pointer first moves (so it never sits stranded in a corner)
// and whenever the pointer leaves the window; touch screens never see it.
const Cursor = () => {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 380, damping: 32, mass: 0.6 });
  const [shown, setShown] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [state, setState] = useState<{ mode: Mode; label: string; hint: string }>({ mode: "default", label: "", hint: "" });
  const last = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (!fine) return;
    const root = document.documentElement;
    root.classList.add("has-cursor");

    const update = (next: ReturnType<typeof read>) =>
      setState((s) => (s.mode === next.mode && s.label === next.label && s.hint === next.hint ? s : next));

    // Arriving (the first move, or back into the window), the ring starts on
    // the pointer rather than trailing in from wherever it was.
    let away = true;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      last.current = { x: e.clientX, y: e.clientY };
      x.set(e.clientX);
      y.set(e.clientY);
      if (away) {
        rx.jump(e.clientX);
        ry.jump(e.clientY);
        away = false;
      }
      setShown(true);
      update(read(e.target));
    };
    // Things also change under a still pointer: scrolling slides new ones in,
    // the network sways its tags away, a case study opens over the page. So
    // look again on scroll, and a few times a second while the pointer rests.
    let frame = 0;
    const recheck = () => {
      if (away || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update(read(document.elementFromPoint(last.current.x, last.current.y)));
      });
    };
    const poll = window.setInterval(recheck, 200);
    const onLeave = (e: PointerEvent) => {
      if (e.relatedTarget) return;
      setShown(false);
      away = true;
    };
    const onDown = (e: PointerEvent) => e.pointerType === "mouse" && setPressed(true);
    const onUp = () => setPressed(false);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", recheck, { passive: true });
    document.addEventListener("pointerout", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("blur", onUp);
    return () => {
      root.classList.remove("has-cursor");
      cancelAnimationFrame(frame);
      window.clearInterval(poll);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", recheck);
      document.removeEventListener("pointerout", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("blur", onUp);
    };
  }, [fine, x, y, rx, ry]);

  if (!fine) return null;

  const { mode, label, hint } = state;
  const visible = shown && mode !== "text";
  const ringSize = mode === "label" ? 76 : mode === "link" ? 48 : 30;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100]" aria-hidden="true">
      <motion.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <motion.div
          className={`cursor-ring ${mode === "label" ? "cursor-ring-filled" : ""}`}
          animate={{
            width: ringSize,
            height: ringSize,
            opacity: visible ? 1 : 0,
            scale: pressed ? 0.82 : 1,
          }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
        >
          <motion.span
            className="hud cursor-label"
            animate={{ opacity: mode === "label" ? 1 : 0, scale: mode === "label" ? 1 : 0.6 }}
            transition={{ duration: 0.2 }}
          >
            {label}
          </motion.span>
        </motion.div>
        <motion.span
          className="hud cursor-hint"
          animate={{ opacity: visible && hint ? 1 : 0, x: hint ? 0 : -6 }}
          transition={{ duration: 0.25 }}
        >
          {hint}
        </motion.span>
      </motion.div>
      <motion.div
        className="cursor-dot"
        style={{ x, y }}
        animate={{ opacity: visible && mode === "default" ? 1 : 0, scale: pressed ? 0.6 : 1 }}
        transition={{ duration: 0.15 }}
      />
    </div>
  );
};

export default Cursor;
