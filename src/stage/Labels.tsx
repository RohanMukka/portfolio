import React, { useEffect, useRef } from "react";
import { FEATURED_TITLES } from "../data/projects";
import { diagrams } from "../data/diagrams";
import { NODE_COUNT } from "./piece";
import { onStageLabels, stageState } from "./store";

const pad = (n: number) => String(n).padStart(2, "0");
const NAMES = FEATURED_TITLES.slice(0, NODE_COUNT);
// Short enough that tags on the network's left stay clear of the list.
const SHORT: Record<string, string> = {
  "Multi-Agent Course Builder": "Course Builder",
  "Fake Review Detection": "Fake Reviews",
};

// Instrument-panel tags on the Work network's nodes: a ring on the node, a
// leader line, the project's number and name. The hovered project's tag
// lights up and adds its headline fact. Positions arrive from the stage after
// every frame, so the tags ride on the turning network; they're written
// straight to the DOM rather than through React state.
const StageLabels = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(
    () =>
      onStageLabels((points, visible) => {
        const box = boxRef.current;
        if (!box) return;
        box.style.opacity = String(visible);
        box.style.visibility = visible > 0.01 ? "visible" : "hidden";
        if (visible <= 0.01) return;
        box.dataset.focus = String(stageState.focus >= 0);
        // Tags point away from the network's middle, so they spread out
        // rather than pile up across it.
        const middle = points.reduce((sum, p) => sum + p.x, 0) / points.length;
        points.forEach((p, i) => {
          const tag = tagRefs.current[i];
          if (!tag) return;
          tag.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0)`;
          const on = String(stageState.focus === i);
          if (tag.dataset.on !== on) tag.dataset.on = on;
          const side = p.x < middle ? "left" : "right";
          if (tag.dataset.side !== side) tag.dataset.side = side;
        });
      }),
    [],
  );

  return (
    <div
      ref={boxRef}
      className="stage-labels fixed inset-0 z-[5] pointer-events-none hidden lg:block"
      style={{ opacity: 0, visibility: "hidden" }}
      aria-hidden="true"
    >
      {NAMES.map((name, i) => (
        <div key={name} ref={(el) => { tagRefs.current[i] = el; }} className="stage-tag absolute left-0 top-0" data-on="false">
          <span className="stage-tag-ring" />
          <span className="stage-tag-line" />
          <span className="stage-tag-text hud">
            <span className="text-accent">{pad(i + 1)}</span> {SHORT[name] ?? name}
            <span className="stage-tag-fact">{diagrams[name]?.fact}</span>
          </span>
        </div>
      ))}
    </div>
  );
};

export default StageLabels;
