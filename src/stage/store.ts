// What the page tells the 3D stage, and what the stage tells the page. Kept
// free of three.js so sections can import it without pulling the 3D code
// into the first bundle.

export type Centrepiece = "particles" | "glass";
export const CENTREPIECES: { id: Centrepiece; label: string }[] = [
  { id: "particles", label: "Data → system" },
  { id: "glass", label: "Liquid glass" },
];

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

// Two centrepieces are built so the owner can pick one; the local-only
// switcher (Switcher.tsx) swaps them. Visitors always get the default.
const DEFAULT: Centrepiece = "particles";
const KEY = "centrepiece";
let centrepiece: Centrepiece = DEFAULT;
if (import.meta.env.DEV) {
  try {
    if (localStorage.getItem(KEY) === "glass") centrepiece = "glass";
  } catch {
    // storage blocked: default
  }
}

const pieceListeners = new Set<() => void>();
export const getCentrepiece = () => centrepiece;
export const setCentrepiece = (next: Centrepiece) => {
  centrepiece = next;
  try {
    localStorage.setItem(KEY, next);
  } catch {
    // storage blocked: this visit only
  }
  pieceListeners.forEach((fn) => fn());
};
export const onCentrepiece = (fn: () => void) => {
  pieceListeners.add(fn);
  return () => {
    pieceListeners.delete(fn);
  };
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
