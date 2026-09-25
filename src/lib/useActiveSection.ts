import { useEffect, useState } from "react";

// Tracks which section sits under a horizontal line `lineY` px from the top of
// the viewport. An IntersectionObserver watching a 1px band replaces measuring
// every section on every scroll event. Keeps the last match between sections.
export const useActiveSection = (ids: string[], lineY: number) => {
  const [active, setActive] = useState("");
  const key = ids.join(",");

  useEffect(() => {
    let observer: IntersectionObserver | null = null;

    const observe = () => {
      observer?.disconnect();
      const bottom = Math.max(0, window.innerHeight - lineY - 1);
      observer = new IntersectionObserver(
        (entries) => {
          const hit = entries.find((entry) => entry.isIntersecting);
          if (hit) setActive(hit.target.id);
        },
        { rootMargin: `-${lineY}px 0px -${bottom}px 0px` },
      );
      for (const id of key.split(",")) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    };

    observe();
    window.addEventListener("resize", observe);
    return () => {
      window.removeEventListener("resize", observe);
      observer?.disconnect();
    };
  }, [key, lineY]);

  return active;
};
