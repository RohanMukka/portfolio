import { useSyncExternalStore } from "react";

// The visitor's "pause motion" choice (the navbar's pause button). Paused,
// the 3D stage's ambient drift stops (it still follows scrolling and the
// pointer, which the visitor drives), looping CSS animations hold still
// (index.css, html[data-motion="paused"]) and clips don't play on their
// own. Motion is on by default whatever the OS asks for (the owner's
// choice: motion for everyone, with a way to stop it). index.html applies
// a saved choice before the first paint.
const KEY = "motion";

const listeners = new Set<() => void>();
let paused = document.documentElement.getAttribute("data-motion") === "paused";

export const motionPaused = () => paused;

export const setMotionPaused = (next: boolean) => {
  if (next === paused) return;
  paused = next;
  if (next) document.documentElement.setAttribute("data-motion", "paused");
  else document.documentElement.removeAttribute("data-motion");
  try {
    if (next) localStorage.setItem(KEY, "paused");
    else localStorage.removeItem(KEY);
  } catch {
    // storage blocked: the choice lasts until the page closes
  }
  listeners.forEach((fn) => fn());
};

export const onMotionPaused = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};

export const useMotionPaused = () => useSyncExternalStore(onMotionPaused, motionPaused);
