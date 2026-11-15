import React from "react";
import { motion } from "framer-motion";
import { CHAPTERS, INTRO } from "./chapters";
import ChapterText, { ChapterLabel } from "./ChapterText";
import { PORTRAIT } from "./content";

const EASE = [0.16, 1, 0.3, 1] as const;

// About on phones and tablets: the intro, then the chapters as a stack.
const AboutStack = () => (
  <div className="max-w-6xl mx-auto px-6 flex flex-col">
    <div className="flex items-start gap-5 pb-12">
      <img
        src={PORTRAIT}
        alt="Pencil portrait of Rohan Mukka"
        width={224}
        height={224}
        loading="lazy"
        decoding="async"
        className="w-16 h-16 shrink-0 rounded-full object-cover border border-primary-text/10 bg-[#fbfaf6]"
      />
      <p data-stage-safe className="text-xl font-display font-semibold tracking-[-0.02em] leading-snug text-primary-text">
        {INTRO}
      </p>
    </div>
    {CHAPTERS.map((chapter, i) => (
      <motion.div
        key={chapter.kicker}
        className="relative py-12 border-t border-primary-text/10 flex flex-col gap-4"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <ChapterLabel chapter={chapter} lit />
        <ChapterText i={i} chapter={chapter} size="md" />
      </motion.div>
    ))}
  </div>
);

export default AboutStack;
