import React, { useEffect, useId, useRef } from "react";
import type { Project, ProjectMedia } from "../../data/projects";
import { diagrams, type Diagram, type DiagramEdge, type DiagramNode } from "../../data/diagrams";

// What a project looks like in Work: real footage of it running when there
// is some, else its system diagram, else a type-only cover.
// Drawn in a 400 × 300 box, so the parent sets a 4:3 aspect ratio.

const W = 400;
const H = 300;
const BOX_W = 116;
const BOX_H = 46;
const cx = (n: DiagramNode) => 70 + n.col * 130;
const cy = (n: DiagramNode) => 45 + n.row * 70;

const edgePath = (a: DiagramNode, b: DiagramNode, route: DiagramEdge["route"] = "vh") => {
  const [x1, y1, x2, y2] = [cx(a), cy(a), cx(b), cy(b)];
  if (x1 === x2 || y1 === y2) return `M${x1},${y1} L${x2},${y2}`;
  return route === "hv" ? `M${x1},${y1} L${x2},${y1} L${x2},${y2}` : `M${x1},${y1} L${x1},${y2} L${x2},${y2}`;
};

const Blueprint = ({ id }: { id: string }) => (
  <>
    <defs>
      <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M20,0 L0,0 L0,20" fill="none" stroke="var(--text-primary)" strokeOpacity="0.07" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width={W} height={H} fill="var(--bg-elevated)" />
    <rect width={W} height={H} fill={`url(#${id})`} />
  </>
);

const SystemDiagram = ({ diagram, playing }: { diagram: Diagram; playing: boolean }) => {
  const gridId = useId();
  const byId = Object.fromEntries(diagram.nodes.map((n) => [n.id, n]));
  const paths = diagram.edges.map((e) => edgePath(byId[e.from], byId[e.to], e.route));

  // The packets are SMIL animations, which the browser runs on the main
  // thread with a layout every frame, even off screen. They run only while
  // the diagram is on screen (and, in the hover preview, showing).
  const svgRef = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let onScreen = false;
    const apply = () => (onScreen && playing ? svg.unpauseAnimations() : svg.pauseAnimations());
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      apply();
    });
    observer.observe(svg);
    apply();
    return () => observer.disconnect();
  }, [playing]);

  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block w-full h-full" role="img" aria-label={diagram.fact}>
      <Blueprint id={gridId} />
      {paths.map((d) => (
        <path key={d} d={d} fill="none" stroke="var(--text-primary)" strokeOpacity="0.28" strokeWidth="1.25" />
      ))}
      {/* Packets travel centre to centre; the boxes drawn over them hide the ends. */}
      {paths.map((d, i) => (
        <circle key={`p${d}`} r="2.75" fill="var(--accent)">
          <animateMotion dur="2.2s" begin={`${(i * 0.37) % 2.2}s`} repeatCount="indefinite" path={d} />
        </circle>
      ))}
      {diagram.nodes.map((n) => (
        <g key={n.id} transform={`translate(${cx(n) - BOX_W / 2},${cy(n) - BOX_H / 2})`}>
          <rect width={BOX_W} height={BOX_H} rx="8" fill="var(--bg-primary)" stroke="var(--text-primary)" strokeOpacity="0.22" />
          <text
            x={BOX_W / 2}
            y={n.sub ? 20 : 27}
            textAnchor="middle"
            fill="var(--text-primary)"
            style={{ font: "700 12.5px var(--font-display)", letterSpacing: "-0.02em" }}
          >
            {n.label}
          </text>
          {n.sub && (
            <text x={BOX_W / 2} y={34} textAnchor="middle" fill="var(--text-secondary)" style={{ font: "500 9px var(--font-display)" }}>
              {n.sub}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

const TypeCover = ({ project }: { project: Project }) => {
  const gridId = useId();
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block w-full h-full" role="img" aria-label={project.title}>
      <Blueprint id={gridId} />
      <text x="28" y="44" fill="var(--accent)" style={{ font: "700 10px var(--font-display)", letterSpacing: "0.25em" }}>
        {project.category.toUpperCase()}
      </text>
      <text
        x="26"
        y="200"
        fill="var(--text-primary)"
        style={{ font: `700 ${Math.min(46, 620 / project.title.length)}px var(--font-display)`, letterSpacing: "-0.05em" }}
      >
        {project.title}
      </text>
      <text x="28" y="240" fill="var(--text-secondary)" style={{ font: "500 13px var(--font-display)" }}>
        {project.tags.join("  ·  ")}
      </text>
    </svg>
  );
};

export const factFor = (project: Project) => diagrams[project.title]?.fact;

// Real footage: the clip loops while `playing` (a hidden preview stops), else
// the still.
const Footage = ({ media, playing }: { media: ProjectMedia; playing: boolean }) => {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    if (playing) v.play().catch(() => {});
    else v.pause();
  }, [playing]);
  const fit = "block w-full h-full object-cover object-top";
  if (!media.clip) return <img src={media.still} alt={media.shows} loading="lazy" className={fit} />;
  return <video ref={video} src={media.clip} poster={media.still} muted loop playsInline preload="none" aria-label={media.shows} className={fit} />;
};

// A case study's Architecture section asks for the system itself; everywhere
// else real footage of a project beats a drawing of it.
const ProjectVisual = ({ project, architecture = false, playing = true }: { project: Project; architecture?: boolean; playing?: boolean }) => {
  const diagram = diagrams[project.title];
  if (project.media && !architecture) return <Footage media={project.media} playing={playing} />;
  if (diagram) return <SystemDiagram diagram={diagram} playing={playing} />;
  return <TypeCover project={project} />;
};

export default ProjectVisual;
