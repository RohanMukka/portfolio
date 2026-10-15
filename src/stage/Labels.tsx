import React, { useEffect, useRef } from "react";
import { projects, FEATURED_TITLES } from "../data/projects";
import { diagrams } from "../data/diagrams";
import { hasCaseStudy, openCaseStudy } from "../sections/work/CaseStudy";
import { NODE_COUNT } from "./piece";
import { dragSpin, onStageLabels, releaseSpin, setFocus, stageState, type LabelSet } from "./store";

const pad = (n: number) => String(n).padStart(2, "0");
// Roughly how wide a tag runs, and how far apart two need to sit to read.
const TAG_WIDTH = 190;
const TAG_GAP = 26;
// Radians the network turns per pixel dragged.
const SPIN_PER_PX = 0.006;

type Tag = { name: string; detail?: string; open?: () => void };

// Work: one tag per featured project's node, short enough that tags on the
// network's left stay clear of the list. The detail (its headline fact)
// shows while the project is hovered; clicking opens its case study (or,
// without one, its code).
const SHORT: Record<string, string> = {
  "Multi-Agent Course Builder": "Course Builder",
  "Fake Review Detection": "Fake Reviews",
};
const WORK: Tag[] = FEATURED_TITLES.slice(0, NODE_COUNT).map((title) => ({
  name: SHORT[title] ?? title,
  detail: diagrams[title]?.fact,
  open: () => {
    if (hasCaseStudy(title)) openCaseStudy(title);
    else {
      const link = projects.find((p) => p.title === title)?.links.github;
      if (link) window.open(link, "_blank", "noopener,noreferrer");
    }
  },
}));

// Skills: the stack's layers, top to bottom, as the layers of a system,
// each with the tools from the Skills sentence it's built from.
const SKILLS: Tag[] = [
  { name: "Interfaces", detail: "React · Next.js · Angular" },
  { name: "Services", detail: "Node.js · Firebase · SQL" },
  { name: "Infrastructure", detail: "Docker · K8s · AWS · GCP" },
  { name: "Models", detail: "TensorFlow · scikit-learn · NLP" },
];

// Instrument-panel tags on points of the 3D scene: a ring on the point, a
// leader line, a number and name. Positions arrive from the stage after
// every frame, so the tags ride on the moving shapes; they're written
// straight to the DOM rather than through React state.
const TagLayer = ({ set, tags, hoverable }: { set: LabelSet; tags: Tag[]; hoverable?: boolean }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLElement | null)[]>([]);
  const order = useRef(tags.map((_, i) => i));
  const drag = useRef<{ x: number; t: number } | null>(null);

  // Dragging across the network's side of the screen turns it; a quick
  // flick sends it coasting, a drag that stops before letting go doesn't.
  const endDrag = () => {
    if (drag.current && performance.now() - drag.current.t > 90) stageState.spinSpeed = 0;
    drag.current = null;
    releaseSpin();
  };
  const dragHandlers = {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      drag.current = { x: e.clientX, t: performance.now() };
      dragSpin(0, 0);
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (!d) return;
      const now = performance.now();
      const radians = (e.clientX - d.x) * SPIN_PER_PX;
      dragSpin(radians, radians / Math.max(0.008, (now - d.t) / 1000));
      d.x = e.clientX;
      d.t = now;
    },
    onPointerUp: endDrag,
    onPointerCancel: endDrag,
  };

  useEffect(
    () =>
      onStageLabels((which, points, visible) => {
        const box = boxRef.current;
        if (which !== set || !box) return;
        box.style.opacity = String(visible);
        box.style.visibility = visible > 0.01 ? "visible" : "hidden";
        if (visible <= 0.01) return;
        // Clickable and draggable only once they're well in view.
        box.dataset.live = String(visible > 0.6);
        if (hoverable) box.dataset.focus = String(stageState.focus >= 0);
        // Work's tags point away from the network's middle, so they spread
        // out rather than pile up across it, and left wherever pointing right
        // would run them off the screen. Top to bottom, a tag that would sit
        // on a neighbour pointing the same way drops just below it.
        const middle = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        const placed: { x: number; y: number; side: string }[] = [];
        order.current = order.current.sort((a, b) => points[a].y - points[b].y);
        order.current.forEach((i) => {
          const p = points[i];
          const tag = tagRefs.current[i];
          if (!tag) return;
          const fitsRight = p.x + TAG_WIDTH < window.innerWidth;
          const fitsLeft = p.x - TAG_WIDTH > 0;
          let side = set === "work" && (p.x < middle || !fitsRight) ? "left" : "right";
          // A tag whose text would run across another node swaps sides, as
          // long as the other side has room on screen.
          const crosses = (dir: number) =>
            points.some((q) => q !== p && (q.x - p.x) * dir > 15 && (q.x - p.x) * dir < TAG_WIDTH && Math.abs(q.y - (p.y - 26)) < 22);
          if (set === "work" && side === "right" && crosses(1) && !crosses(-1) && fitsLeft) side = "left";
          else if (set === "work" && side === "left" && crosses(-1) && !crosses(1) && fitsRight) side = "right";
          let y = p.y;
          for (const q of placed) {
            if (q.side === side && Math.abs(q.x - p.x) < TAG_WIDTH && y - q.y < TAG_GAP) y = q.y + TAG_GAP;
          }
          placed.push({ x: p.x, y, side });
          tag.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
          tag.style.setProperty("--nudge", `${(y - p.y).toFixed(1)}px`);
          // A Skills layer's tag arrives as the layer locks into place.
          if (set === "skills") tag.style.opacity = stageState.layers[i].toFixed(2);
          const on = String(!!hoverable && stageState.focus === i);
          if (tag.dataset.on !== on) tag.dataset.on = on;
          if (tag.dataset.side !== side) tag.dataset.side = side;
        });
      }),
    [set, hoverable],
  );

  return (
    <div
      ref={boxRef}
      className="stage-labels fixed inset-0 z-[5] pointer-events-none hidden lg:block"
      data-set={set}
      style={{ opacity: 0, visibility: "hidden" }}
      aria-hidden="true"
    >
      {hoverable && (
        <div className="stage-drag absolute right-0 top-0 bottom-0 w-[40%]" {...dragHandlers}>
          <span className="stage-drag-hint hud">Drag to spin · Click a node</span>
        </div>
      )}
      {tags.map((tag, i) => {
        const parts = (
          <>
            <span className="stage-tag-ring" />
            <span className="stage-tag-line" />
            <span className="stage-tag-text hud">
              <span className="text-accent">{pad(i + 1)}</span> {tag.name}
              {tag.detail && <span className="stage-tag-fact">{tag.detail}</span>}
            </span>
          </>
        );
        const setRef = (el: HTMLElement | null) => {
          tagRefs.current[i] = el;
        };
        // Work's tags are mouse targets on the nodes (the tour's captions
        // and the lists carry the same links for keyboards and screen
        // readers): hovering lights the node, clicking opens the project.
        return tag.open ? (
          <button
            key={tag.name}
            ref={setRef}
            type="button"
            tabIndex={-1}
            className="stage-tag stage-tag-button absolute left-0 top-0"
            data-on="false"
            onClick={tag.open}
            onPointerEnter={() => setFocus(i)}
            onPointerLeave={() => setFocus(-1)}
          >
            <span className="stage-tag-hit" />
            {parts}
          </button>
        ) : (
          <div key={tag.name} ref={setRef} className="stage-tag absolute left-0 top-0" data-on="false">
            {parts}
          </div>
        );
      })}
    </div>
  );
};

const StageLabels = () => (
  <>
    <TagLayer set="work" tags={WORK} hoverable />
    <TagLayer set="skills" tags={SKILLS} />
  </>
);

export default StageLabels;
