// This visit's Core Web Vitals, from the browser's own performance entries
// (no library): Largest Contentful Paint, Cumulative Layout Shift, and
// Interaction to Next Paint (the slowest interaction so far, which is what
// INP reports for a short visit). Read by X-Ray and sent, without anything
// that identifies the visitor, by telemetry.ts.
export const vitals = { lcp: null as number | null, cls: 0, inp: null as number | null };

let started = false;

export const startVitals = () => {
  if (started) return;
  started = true;
  const watch = (type: string, onEntries: (entries: PerformanceEntry[]) => void, options: Record<string, unknown> = {}) => {
    try {
      new PerformanceObserver((list) => onEntries(list.getEntries())).observe({ type, buffered: true, ...options });
    } catch {
      // not supported in this browser: that vital stays unknown
    }
  };
  watch("largest-contentful-paint", (entries) => {
    vitals.lcp = Math.round(entries[entries.length - 1].startTime);
  });
  // Layout shifts in session windows (gaps under 1 s, at most 5 s long); CLS
  // is the worst window.
  let windowValue = 0;
  let windowStart = 0;
  let windowLast = 0;
  watch("layout-shift", (entries) => {
    for (const entry of entries as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
      if (entry.hadRecentInput) continue;
      if (entry.startTime - windowLast > 1000 || entry.startTime - windowStart > 5000) {
        windowValue = 0;
        windowStart = entry.startTime;
      }
      windowValue += entry.value;
      windowLast = entry.startTime;
      vitals.cls = Math.max(vitals.cls, +windowValue.toFixed(4));
    }
  });
  watch(
    "event",
    (entries) => {
      for (const entry of entries as (PerformanceEntry & { interactionId?: number })[]) {
        if (!entry.interactionId) continue;
        vitals.inp = Math.max(vitals.inp ?? 0, Math.round(entry.duration));
      }
    },
    { durationThreshold: 16 },
  );
};
