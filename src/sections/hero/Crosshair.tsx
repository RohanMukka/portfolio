import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// Thin lines that follow the cursor across `area`, with an X / Y readout.
// Mouse only: touch has no hover, so phones never see it.
const Crosshair = ({ area, lineClassName = "bg-primary-text/15", labelClassName = "text-accent" }: {
  area: React.RefObject<HTMLElement | null>;
  lineClassName?: string;
  labelClassName?: string;
}) => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });
  const [pos, setPos] = useState({ x: 0, y: 0, on: false });

  useEffect(() => {
    const el = area.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      x.set(e.clientX - r.left);
      y.set(e.clientY - r.top);
      setPos({ x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top), on: true });
    };
    const onLeave = () => setPos((p) => ({ ...p, on: false }));
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [area, x, y]);

  return (
    <div
      className={`absolute inset-0 z-10 pointer-events-none hidden md:block transition-opacity duration-300 ${pos.on ? "opacity-100" : "opacity-0"}`}
      aria-hidden="true"
    >
      <motion.div className={`absolute top-0 bottom-0 w-px ${lineClassName}`} style={{ x: sx }} />
      <motion.div className={`absolute left-0 right-0 h-px ${lineClassName}`} style={{ y: sy }} />
      <motion.div
        className={`absolute text-[10px] font-medium uppercase tracking-[0.22em] tabular-nums ${labelClassName}`}
        style={{ x: sx, y: sy }}
      >
        <span className="block translate-x-3 translate-y-2 whitespace-nowrap">
          X {String(pos.x).padStart(4, "0")} · Y {String(pos.y).padStart(4, "0")}
        </span>
      </motion.div>
    </div>
  );
};

export default Crosshair;
