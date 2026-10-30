import { useSyncExternalStore } from "react";

// Whether X-Ray (src/xray) is open: from `?xray` in the address, the X key
// (outside text fields), or About's "Measure this page" link.
const listeners = new Set<() => void>();
let open = new URLSearchParams(location.search).has("xray");

export const setXRayOpen = (next: boolean) => {
  if (next === open) return;
  open = next;
  listeners.forEach((fn) => fn());
};

export const useXRayOpen = () =>
  useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    () => open,
  );

export const watchXRayKey = () => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "x" && e.key !== "X") return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const target = e.target as HTMLElement | null;
    if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
    setXRayOpen(!open);
  };
  window.addEventListener("keydown", onKey);
  return () => window.removeEventListener("keydown", onKey);
};
