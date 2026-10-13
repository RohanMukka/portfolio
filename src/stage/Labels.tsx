import React, { useEffect, useRef } from "react";
import { FEATURED_TITLES } from "../data/projects";
import { diagrams } from "../data/diagrams";
import { NODE_COUNT } from "./piece";
import { onStageLabels, stageState, type LabelSet } from "./store";

const pad = (n: number) => String(n).padStart(2, "0");

type Tag = { name: string; detail?: string };

// Work: one tag per featured project's node, short enough that tags on the
// network's left stay clear of the list. The detail (its headline fact)
// shows while the project is hovered.
const SHORT: Record<string, string> = {
  "Multi-Agent Course Builder": "Course Builder",
  "Fake Review Detection": "Fake Reviews",
};
const WORK: Tag[] = FEATURED_TITLES.slice(0, NODE_COUNT).map((title) => ({
  name: SHORT[title] ?? title,
  detail: diagrams[title]?.fact,
}));

// Skills: the stack's layers, top to bottom, as the layers of a system,
// each with the tools from the Skills sentence it's built from.
const SKILLS: Tag[] = [
  { name: "Interfaces", detail: "React · Next.js · Angular" },
  { name: "Services", detail: "Node.js · Firebase · SQL" },
  { name: "Infrastructure", detail: "Docker · Kubernetes · AWS · Google Cloud" },
  { name: "Models", detail: "TensorFlow · scikit-learn · NLP" },
];

// Instrument-panel tags on points of the 3D scene: a ring on the point, a
// leader line, a number and name. Positions arrive from the stage after
// every frame, so the tags ride on the moving shapes; they're written
// straight to the DOM rather than through React state.
const TagLayer = ({ set, tags, hoverable }: { set: LabelSet; tags: Tag[]; hoverable?: boolean }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(
    () =>
      onStageLabels((which, points, visible) => {
        const box = boxRef.current;
        if (which !== set || !box) return;
        box.style.opacity = String(visible);
        box.style.visibility = visible > 0.01 ? "visible" : "hidden";
        if (visible <= 0.01) return;
        if (hoverable) box.dataset.focus = String(stageState.focus >= 0);
        // Tags point away from the shape's middle, so they spread out rather
        // than pile up across it.
        const middle = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        points.forEach((p, i) => {
          const tag = tagRefs.current[i];
          if (!tag) return;
          tag.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
          const on = String(!!hoverable && stageState.focus === i);
          if (tag.dataset.on !== on) tag.dataset.on = on;
          const side = set === "work" && p.x < middle ? "left" : "right";
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
      {tags.map((tag, i) => (
        <div key={tag.name} ref={(el) => { tagRefs.current[i] = el; }} className="stage-tag absolute left-0 top-0" data-on="false">
          <span className="stage-tag-ring" />
          <span className="stage-tag-line" />
          <span className="stage-tag-text hud">
            <span className="text-accent">{pad(i + 1)}</span> {tag.name}
            {tag.detail && <span className="stage-tag-fact">{tag.detail}</span>}
          </span>
        </div>
      ))}
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
