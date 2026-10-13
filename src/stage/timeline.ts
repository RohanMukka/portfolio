// The page's story, as the stage sees it. Sections mark themselves with
// data-chapter="…" in this order; the centrepiece takes one shape per chapter.
export const CHAPTERS = ["hero", "about", "work", "skills", "credentials", "contact"] as const;
export type ChapterId = (typeof CHAPTERS)[number];

type Box = { top: number; height: number };

const box = (el: Element | null): Box | null => {
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return { top: r.top + window.scrollY, height: r.height };
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

export type TimelineReading = {
  /** 0 → 5: whole numbers while a chapter fills the screen, fractions while
      the next one scrolls in (its top travelling from 90% to 10% of the screen). */
  chapter: number;
  /** How far each chapter, or its data-progress="…" element (e.g. About's
      pinned track), has scrolled through: 0 at its top, 1 at its end. */
  progress: number[];
};

export const createTimeline = () => {
  let chapters: (Box | null)[] = [];
  let tracks: (Box | null)[] = [];

  // Offsets only change when something's size does (fonts, "Show all",
  // phones rotating), and every such change resizes the body too.
  const measure = () => {
    chapters = CHAPTERS.map((id) => box(document.querySelector(`[data-chapter="${id}"]`)));
    tracks = CHAPTERS.map((id, i) => box(document.querySelector(`[data-progress="${id}"]`)) ?? chapters[i]);
  };
  measure();
  const observer = new ResizeObserver(measure);
  observer.observe(document.body);

  return {
    read(scrollY: number, vh: number, out: TimelineReading) {
      let chapter = 0;
      for (let i = 1; i < chapters.length; i++) {
        const c = chapters[i];
        if (c) chapter += clamp01((scrollY - (c.top - vh * 0.9)) / (vh * 0.8));
      }
      out.chapter = chapter;
      for (let i = 0; i < tracks.length; i++) {
        const t = tracks[i];
        out.progress[i] = t ? clamp01((scrollY - t.top) / Math.max(1, t.height - vh)) : 0;
      }
    },
    dispose: () => observer.disconnect(),
  };
};
