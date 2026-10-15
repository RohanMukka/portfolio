import type { Object3D, Vector3 } from "three";
import type { Theme } from "../lib/theme";
import type { NamePoints } from "./name";
import type { LabelSet } from "./store";

// One featured Work project per node in the scene.
export const NODE_COUNT = 8;
// The Skills stack's layers, top to bottom.
export const LAYER_COUNT = 4;

// Everything a centrepiece needs to draw a frame; scene.ts eases it all.
export type Frame = {
  /** Seconds since the stage started. */
  time: number;
  /** 0 → 5 through the chapters (see timeline.ts). */
  chapter: number;
  /** Per chapter, 0 → 1 through it. */
  progress: number[];
  /** Pointer in normalised device coordinates; `on` fades out when it
      leaves, `press` rises while the button is held. */
  pointer: { x: number; y: number; on: number; press: number };
  /** How far the visitor has spun the Work network by dragging it (radians). */
  spin: number;
  /** 0 while the intro holds everything folded into its loading line, 1 once open. */
  intro: number;
  /** Hover weight (0 → 1) of each Work node. */
  focus: number[];
  /** Half the visible width and height at z = 0, in world units. */
  halfW: number;
  halfH: number;
  aspect: number;
  /** Phone-sized window: the shapes centre themselves above the text. */
  mobile: boolean;
  /** Drawing-buffer height in device pixels, and tan(fov / 2): for sizing points. */
  viewH: number;
  tanHalf: number;
  /** Centre and radius (world units, z = 0) of the ring framing Contact's heading. */
  ring: { x: number; y: number; r: number };
  /** About's timeline: where each panel's stop sits (world units, z = 0),
      which panel is being read (0 → 4, fractional while sliding), and the
      point between stops that follows the reading. */
  stops: { x: number; y: number }[];
  aboutAt: number;
  stop: { x: number; y: number };
  /** How far the camera has left Work's rest view for its project tour (0 → 1). */
  tour: number;
  /** Distance from the camera to what it's looking at: the depth-of-field focus. */
  focusDist: number;
  /** How built each layer of the Skills stack is (0 → 1), top to bottom. */
  layers: number[];
};

export const STOP_COUNT = 5;

export type Labels = { set: LabelSet; points: Vector3[]; visible: number };

export interface Piece {
  readonly object: Object3D;
  update(frame: Frame): void;
  setTheme(theme: Theme): void;
  /** World positions the page labels (Work's nodes, Skills' layers) and how visible each set is. */
  labels?(frame: Frame): Labels[];
  /** Work's nodes in the world this frame, for the camera's project tour. */
  nodes?(): Vector3[];
  /** The hero name's points (name.ts), or null to let the stream have them all. */
  setName?(name: NamePoints | null): void;
  dispose(): void;
}

// A chapter's value for some per-chapter setting, blended between chapters.
export const perChapter = (values: readonly number[], chapter: number) => {
  const i = Math.min(values.length - 1, Math.floor(chapter));
  const j = Math.min(values.length - 1, i + 1);
  const t = chapter - i;
  return values[i] + (values[j] - values[i]) * t;
};
