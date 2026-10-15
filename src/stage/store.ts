// What the page tells the 3D stage, and what the stage tells the page. Kept
// free of three.js so sections can import it without pulling the 3D code
// into the first bundle.

// The stage reads and writes these every frame.
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
};

// Dragging the Work network turns it; let go and it coasts to a stop.
export const dragSpin = (radians: number, perSecond: number) => {
  stageState.spin += radians;
  stageState.spinSpeed = perSecond;
  stageState.spinning = true;
};

export const releaseSpin = () => {
  stageState.spinning = false;
};

export const setFocus = (index: number) => {
  stageState.focus = index;
};

export const openStage = () => {
  if (!stageState.openedAt) stageState.openedAt = performance.now();
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
