// What the page tells the 3D stage, and what the stage tells the page. Kept
// free of three.js so sections can import it without pulling the 3D code
// into the first bundle.

// The stage reads and writes these every frame it draws. The page changes
// them through the functions below, which also wake the stage (it only
// draws while something it shows is changing; see clock.ts).
export const stageState = {
  /** The Work node in focus (hovered, or the tour's stop), by featured project (0-based), or -1. */
  focus: -1,
  /** performance.now() when the intro began to open, or 0 while it's loading. */
  openedAt: 0,
  /** Where in the Skills scene (its data-progress, 0 → 1) each layer of the
      stack locks into place, top to bottom; set by the Skills section. */
  layerAt: [0.2, 0.4, 0.6, 0.8],
  /** How built each layer is (0 → 1), written by the stage for the tags. */
  layers: [0, 0, 0, 0],
  /** How far the Work network has been spun by dragging it (radians), how
      fast it's still turning (radians a second), and whether it's held. */
  spin: 0,
  spinSpeed: 0,
  spinning: false,
  /** Where the stage is in the page's chapters (0 → 5), written every frame;
      -1 while there's no 3D stage (lite mode, or not loaded yet). */
  chapter: -1,
  /** The Work node the camera is diving into as its case study opens, or -1. */
  dive: -1,
  /** True while a case study fully covers the page: the stage stops drawing. */
  covered: false,
  /** True while the stage is drawing frames; false once it has settled and
      gone to sleep (the cursor stops re-checking what's under it then). */
  awake: false,
};

// What the stage measures about itself, for the X-Ray view (src/xray). The
// stage writes it as it draws; nothing here costs anything while X-Ray is
// closed beyond a few numbers per frame.
export type StagePass = { name: string; width: number; height: number; draws: number };
export const stageStats = {
  /** CPU time to prepare and submit each of the last FRAME_LOG frames (ms), a ring buffer. */
  cpuMs: new Float32Array(240),
  /** GPU time of the last measured frame (ms), or null where the browser doesn't expose GPU timers. */
  gpuMs: null as number | null,
  gpuTimers: false,
  /** Frames drawn since the stage started, and draw calls in the last one. */
  frames: 0,
  drawCalls: 0,
  /** The lens's passes, and the GPU memory the stage's buffers and targets take (bytes). */
  passes: [] as StagePass[],
  gpuBytes: 0,
  /** The clock: its mode, what last woke it, and how long it has spent in each mode (ms). */
  mode: "asleep",
  reason: "",
  timeScale: 0,
  modeMs: { active: 0, ambient: 0, dozing: 0, asleep: 0, covered: 0 } as Record<string, number>,
  modeSince: 0,
  /** Mode changes over the last minute, for the timeline strip. */
  history: [] as { mode: string; at: number }[],
};

// The stage registers how to wake it; until it has loaded, waking does nothing.
let wake: (reason: string) => void = () => {};
export const onStageWake = (fn: (reason: string) => void) => {
  wake = fn;
  return () => {
    wake = () => {};
  };
};
export const wakeStage = (reason: string) => wake(reason);

// Whether opening a case study now should dive into its node: only with a
// 3D stage, and only from around Work, where the network is in view.
export const canDive = () => stageState.chapter >= 0 && Math.abs(stageState.chapter - 2) < 0.6;

// Dragging the Work network turns it; let go and it coasts to a stop
// (`coast` false: the drag had stopped before letting go, so it stays put).
export const dragSpin = (radians: number, perSecond: number) => {
  stageState.spin += radians;
  stageState.spinSpeed = perSecond;
  stageState.spinning = true;
  wake("spin");
};

export const releaseSpin = (coast = true) => {
  if (!coast) stageState.spinSpeed = 0;
  stageState.spinning = false;
  wake("spin");
};

export const setFocus = (index: number) => {
  if (stageState.focus === index) return;
  stageState.focus = index;
  wake("focus");
};

export const openStage = () => {
  if (stageState.openedAt) return;
  stageState.openedAt = performance.now();
  wake("intro");
};

// A case study opening dives into its node (or -1 to pull back out); once
// it fully covers the page the stage has nothing to draw.
export const setDive = (node: number) => {
  stageState.dive = node;
  wake("dive");
};

export const setCovered = (covered: boolean) => {
  if (stageState.covered === covered) return;
  stageState.covered = covered;
  if (!covered) wake("uncovered");
};

// Screen positions of points in the scene that the page labels (the Work
// network's nodes, the Skills stack's layers), sent after every rendered
// frame. `visible` fades 0 → 1 while the scene shows them.
export type LabelSet = "work" | "skills";
export type ScreenPoint = { x: number; y: number };
type LabelListener = (set: LabelSet, points: ScreenPoint[], visible: number) => void;
const labelListeners = new Set<LabelListener>();
export const onStageLabels = (fn: LabelListener) => {
  labelListeners.add(fn);
  return () => {
    labelListeners.delete(fn);
  };
};
export const emitStageLabels = (set: LabelSet, points: ScreenPoint[], visible: number) => {
  labelListeners.forEach((fn) => fn(set, points, visible));
};
