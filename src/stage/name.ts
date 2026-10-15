// The hero's name, as points for the particles to form. The page's own
// heading (data-hero-name) stays in place for layout, search and screen
// readers; each of its words is redrawn on a canvas at its exact place and
// size, and points are picked from the inked pixels, in the hero's rest-view
// frame (world units at z = 0, see world.ts). Positions come from layout
// offsets, so the intro's focus scale, the scroll drift and the letters'
// lift never skew them.

const SAMPLE_WIDTH = 720; // canvas pixels across the whole name

export type NamePoints = { points: Float32Array; count: number };

// Where an element sits on the page, before any transforms.
const pagePosition = (el: HTMLElement) => {
  let x = 0;
  let y = 0;
  for (let e: HTMLElement | null = el; e; e = e.offsetParent as HTMLElement | null) {
    x += e.offsetLeft;
    y += e.offsetTop;
  }
  return { x, y };
};

export const sampleName = (maxPoints: number, halfH: number): NamePoints | null => {
  const heading = document.querySelector<HTMLElement>("[data-hero-name]");
  if (!heading || heading.offsetWidth < 1 || heading.offsetHeight < 1) return null;
  const origin = pagePosition(heading);

  const style = getComputedStyle(heading);
  const fontSize = parseFloat(style.fontSize);
  const lineHeight = parseFloat(style.lineHeight) || fontSize * 0.8;
  const scale = SAMPLE_WIDTH / heading.offsetWidth;
  const canvas = document.createElement("canvas");
  canvas.width = SAMPLE_WIDTH;
  canvas.height = Math.ceil(heading.offsetHeight * scale) + 4;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.font = `${style.fontWeight} ${fontSize * scale}px ${style.fontFamily}`;
  ctx.letterSpacing = `${(parseFloat(style.letterSpacing) || 0) * scale}px`;
  ctx.fillStyle = "#fff";
  ctx.textBaseline = "alphabetic";
  const metrics = ctx.measureText("Rohan Mukka");
  // Where CSS puts the baseline in a line box: half the leading, then the ascent.
  const ascent = metrics.fontBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent;
  const baseline = (lineHeight * scale - (ascent + descent)) / 2 + ascent;

  for (const word of Array.from(heading.children) as HTMLElement[]) {
    ctx.fillText(word.textContent ?? "", word.offsetLeft * scale, word.offsetTop * scale + baseline);
  }

  // Every inked pixel, then an even pick of them.
  const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const inked: number[] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (data[(y * width + x) * 4 + 3] > 128) inked.push(x, y);
    }
  }
  const total = inked.length / 2;
  if (!total) return null;
  const count = Math.min(maxPoints, total);
  const points = new Float32Array(count * 2);
  // The hero's rest view is the top of the page.
  const toWorld = (2 * halfH) / window.innerHeight;
  for (let i = 0; i < count; i++) {
    const j = Math.floor((i / count) * total) * 2;
    const px = origin.x + (inked[j] + 0.5) / scale;
    const py = origin.y + (inked[j + 1] + 0.5) / scale;
    points[i * 2] = (px - window.innerWidth / 2) * toWorld;
    points[i * 2 + 1] = -(py - window.innerHeight / 2) * toWorld;
  }
  return { points, count };
};
