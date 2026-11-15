import React from "react";
import { ArrowUpRight } from "lucide-react";
import type { Chapter } from "./chapters";

const pad = (n: number) => String(n).padStart(2, "0");

// Colours fade between full and the quietest text colour (which still meets
// WCAG AA), never through opacity, so a dimmed chapter stays readable.
const FADE = "transition-colors duration-500";

// One chapter of About's story: kicker, heading, body and an optional link.
// `lit` false dims it while another chapter is being read.
const ChapterText = ({ i, chapter, size = "lg", lit = true }: { i: number; chapter: Chapter; size?: "lg" | "md"; lit?: boolean }) => (
  <div className="flex flex-col gap-6">
    <p className={`hud ${FADE} ${lit ? "text-accent" : "text-primary-tertiary"}`}>
      {pad(i + 1)} — {chapter.kicker}
    </p>
    <h3
      data-stage-safe
      className={`font-display font-bold tracking-[-0.04em] leading-[1.04] ${FADE} ${lit ? "text-primary-text" : "text-primary-tertiary"} ${
        size === "lg" ? "text-4xl lg:text-[3.75rem] max-w-[17ch]" : "text-3xl lg:text-[2.6rem] max-w-[20ch]"
      }`}
    >
      {chapter.heading}
    </h3>
    <p data-stage-safe className={`text-lg leading-relaxed max-w-xl ${FADE} ${lit ? "text-primary-secondary" : "text-primary-tertiary"}`}>
      {chapter.body}
    </p>
    {chapter.link && (
      <a
        href={chapter.link.href}
        target="_blank"
        rel="noopener noreferrer"
        className="self-start inline-flex items-center gap-2 text-sm font-semibold text-primary-text hover:text-accent transition-colors"
      >
        {chapter.link.label} <ArrowUpRight size={16} />
      </a>
    )}
  </div>
);

// A chapter's when and where, lit while that chapter is being read.
export const ChapterLabel = ({ chapter, lit }: { chapter: Chapter; lit: boolean }) => (
  <span
    className={`hud whitespace-nowrap ${FADE} ${lit ? "text-primary-text" : "text-primary-tertiary"}`}
  >
    {chapter.when} · {chapter.where}
  </span>
);

export default ChapterText;
