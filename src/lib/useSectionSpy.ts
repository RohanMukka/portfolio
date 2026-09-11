import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view using IntersectionObserver.
 *
 * Replaces the old scroll handler that called getBoundingClientRect() on every
 * section on every scroll event -- a forced synchronous layout per tick.
 */
export function useSectionSpy(ids: string[]): string {
  const [active, setActive] = useState("");

  useEffect(() => {
    const visible = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.set(entry.target.id, entry.intersectionRatio);
          } else {
            visible.delete(entry.target.id);
          }
        }

        let best = "";
        let bestRatio = 0;
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best) setActive(best);
      },
      { threshold: [0.15, 0.4, 0.7], rootMargin: "-80px 0px -40% 0px" },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [ids.join(",")]);

  return active;
}
