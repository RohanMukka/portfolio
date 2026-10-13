import { CatmullRomCurve3, Matrix3, Matrix4, Vector3 } from "three";

// The page as one world. Each chapter's shape sits at its own place, seen
// from a rest view in front of it; scrolling from one chapter to the next
// flies the camera from one rest view to the next. The places weave left and
// right, up and down, and each is seen from a slightly different side, so
// the camera banks and turns as it travels.

const PLACES = [
  { at: [0, 0, 0], yaw: 0 },
  { at: [10, 2, -36], yaw: -0.35 },
  { at: [-6, -1, -74], yaw: 0.3 },
  { at: [8, 3, -112], yaw: -0.25 },
  { at: [-4, 0, -150], yaw: 0.2 },
  { at: [0, 1, -188], yaw: 0 },
] as const;

/** How far each rest view sits from its place: the distance the shapes are designed at. */
export const VIEW_DISTANCE = 10;
/** The floor of light the world floats over (see glsl.ts). */
export const FLOOR_Y = -10;

export const PLACE_COUNT = PLACES.length;
export const placePositions = PLACES.map(({ at }) => new Vector3(...at));
export const placeRotations = PLACES.map(({ yaw }) => new Matrix3().setFromMatrix4(new Matrix4().makeRotationY(yaw)));

// A point in a place's own frame (x right, y up, the rest view on +z), in the world.
export const toWorld = (place: number, local: Vector3) => local.applyMatrix3(placeRotations[place]).add(placePositions[place]);

const eyes = placePositions.map((_, i) => toWorld(i, new Vector3(0, 0, VIEW_DISTANCE)));
const eyePath = new CatmullRomCurve3(eyes, false, "centripetal");
const targetPath = new CatmullRomCurve3(placePositions, false, "centripetal");

// Where the camera is and what it looks at, `chapter` (0 → 5) of the way
// along. Whole chapters land exactly on the rest views.
export const cameraAt = (chapter: number, eye: Vector3, target: Vector3) => {
  const t = Math.min(1, Math.max(0, chapter / (PLACE_COUNT - 1)));
  eyePath.getPoint(t, eye);
  targetPath.getPoint(t, target);
};
