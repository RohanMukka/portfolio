// When the stage draws. Rather than drawing every frame forever, it draws
// only while something it shows is changing, then lets its ambient drift
// slow to a stop and sleeps: no animation frames, no draw calls, no main
// thread work, until input wakes it again on the very next frame.
//
//   active   something is still changing (scroll, pointer, an eased value
//            settling, the intro): draw every frame
//   ambient  all settled, but the shapes keep drifting a little longer
//   dozing   the drift slows to a stop (time runs slower and slower)
//   asleep   nothing to draw until the next wake
//   covered  a case study covers the page: nothing to draw at all
//
// The stage's moving parts (the stream, the shimmer, the network's sway, the
// grain) all run on the clock's own time, which runs at `timeScale` of real
// time: 1 while active, falling to 0 as it dozes, ramping back up on waking,
// so motion eases out and back in rather than freezing or jumping.

export type ClockMode = "active" | "ambient" | "dozing" | "asleep" | "covered";

/** How long the ambient drift plays once everything has settled. With the
    doze that follows (about a second), motion nobody asked for stops within
    five seconds (WCAG 2.2.2's limit for moving content that can't be
    paused; this page can be paused too, from the navbar). */
export const AMBIENT_MS = 3800;
// How fast the drift slows (e-folds per second) and picks back up (per second).
const DOZE_RATE = 5;
const WAKE_RATE = 4;
// Real time between frames is capped, so a frame after a stall or a hidden
// tab doesn't jump.
const MAX_DT = 0.25;

/** Draws one frame. `dt` is real seconds since the last frame, `simDt` the
    clock's own (scaled) seconds. Returns true while something it shows is
    still changing, false once all has settled, or null when there's nothing
    to draw (covered). */
export type ClockStep = (dt: number, simDt: number, now: number) => boolean | null;

export type Clock = {
  /** Wakes the stage for the next frame; anything that changes what it would draw calls this. */
  wake: (reason: string) => void;
  /** Stops drawing at once (the stage is being disposed or stopped). */
  stop: () => void;
  readonly mode: ClockMode;
  readonly timeScale: number;
  /** What last woke it, for the X-Ray view and tests. */
  readonly reason: string;
};

export const createClock = (
  step: ClockStep,
  opts: { paused: () => boolean; covered: () => boolean; onMode?: (mode: ClockMode) => void },
): Clock => {
  let mode: ClockMode = "asleep";
  let raf = 0;
  let last = 0;
  let quietSince = 0;
  let timeScale = 1;
  let reason = "";

  const setMode = (next: ClockMode) => {
    if (next === mode) return;
    mode = next;
    opts.onMode?.(next);
  };

  const tick = (now: number) => {
    raf = 0;
    const dt = Math.min(Math.max(now - last, 0) / 1000, MAX_DT);
    last = now;
    // Time runs while there's motion to show; paused, it never does.
    const running = !opts.paused() && (mode === "active" || mode === "ambient");
    timeScale = running ? Math.min(1, timeScale + dt * WAKE_RATE) : timeScale * Math.exp(-DOZE_RATE * dt);
    if (!running && timeScale < 0.005) timeScale = 0;

    const changing = step(dt, dt * timeScale, now);
    if (changing === null) {
      setMode("covered");
      return;
    }
    if (changing) {
      quietSince = now;
      setMode("active");
    } else if (mode === "active") {
      setMode("ambient");
    }
    if (mode === "ambient" && (opts.paused() || now - quietSince > AMBIENT_MS)) setMode("dozing");
    if (mode === "dozing" && timeScale === 0) {
      setMode("asleep");
      return;
    }
    raf = requestAnimationFrame(tick);
  };

  return {
    wake: (why) => {
      reason = why;
      quietSince = performance.now();
      if (opts.covered()) return;
      setMode("active");
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    },
    stop: () => {
      cancelAnimationFrame(raf);
      raf = 0;
      setMode("asleep");
    },
    get mode() {
      return mode;
    },
    get timeScale() {
      return timeScale;
    },
    get reason() {
      return reason;
    },
  };
};
