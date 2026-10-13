// What the page tells the 3D stage, and what the stage tells the page. Kept
// free of three.js so sections can import it without pulling the 3D code
// into the first bundle.

// The stage reads these every frame.
export const stageState = {
  /** Hover weight of each Work node, by featured project (0-based); see setFocus. */
  focus: -1,
  /** performance.now() when the intro began to open, or 0 while it's loading. */
  openedAt: 0,
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
