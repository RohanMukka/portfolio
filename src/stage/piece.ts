import type { Object3D, Vector3 } from "three";
import type { Theme } from "../lib/theme";

// One featured Work project per node in the scene.
export const NODE_COUNT = 8;

// Everything a centrepiece needs to draw a frame; scene.ts eases it all.
export type Frame = {
  /** Seconds since the stage started. */
  time: number;
  /** 0 → 5 through the chapters (see timeline.ts). */
  chapter: number;
  /** Per chapter, 0 → 1 through it. */
  progress: number[];
  /** Pointer in normalised device coordinates; `on` fades out when it leaves. */
  pointer: { x: number; y: number; on: number };
  /** 0 while the intro holds everything folded into its loading line, 1 once open. */
  intro: number;
  /** Hover weight (0 → 1) of each Work node. */
  focus: number[];
  /** Half the visible width and height at z = 0, in world units. */
  halfW: number;
  halfH: number;
  aspect: number;
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
};

export const STOP_COUNT = 5;

export interface Piece {
  readonly object: Object3D;
  update(frame: Frame): void;
  setTheme(theme: Theme): void;
  /** World positions the page labels (the Work nodes) and how visible they are. */
  labels?(frame: Frame): { points: Vector3[]; visible: number };
  dispose(): void;
}

// A chapter's value for some per-chapter setting, blended between chapters.
export const perChapter = (values: readonly number[], chapter: number) => {
  const i = Math.min(values.length - 1, Math.floor(chapter));
  const j = Math.min(values.length - 1, i + 1);
  const t = chapter - i;
  return values[i] + (values[j] - values[i]) * t;
};
