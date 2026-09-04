import type React from "react";
import { useCallback, useRef } from "react";
import { useReducedMotion } from "./useReducedMotion";

/**
 * Per-element 3D tilt toward the cursor.
 *
 * Returns handlers that write --rx / --ry (degrees) and --gx / --gy (glare
 * position, %) onto the node itself. Nothing re-renders: the element's rect is
 * measured once on enter, and each move is a pair of style writes that feed a
 * CSS transform.
 */
export function useTilt(maxDeg = 9) {
  const rect = useRef<DOMRect | null>(null);
  const reduceMotion = useReducedMotion();

  const onMouseEnter = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (reduceMotion) return;
      rect.current = event.currentTarget.getBoundingClientRect();
    },
    [reduceMotion],
  );

  const onMouseMove = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      const box = rect.current;
      if (!box || reduceMotion) return;

      const px = (event.clientX - box.left) / box.width;
      const py = (event.clientY - box.top) / box.height;
      const node = event.currentTarget;

      node.style.setProperty("--ry", `${(px - 0.5) * 2 * maxDeg}deg`);
      node.style.setProperty("--rx", `${(py - 0.5) * -2 * maxDeg}deg`);
      node.style.setProperty("--gx", `${px * 100}%`);
      node.style.setProperty("--gy", `${py * 100}%`);
    },
    [maxDeg, reduceMotion],
  );

  const onMouseLeave = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const node = event.currentTarget;
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
    rect.current = null;
  }, []);

  return { onMouseEnter, onMouseMove, onMouseLeave };
}
