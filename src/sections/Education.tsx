import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import SectionHeader from "../components/SectionHeader";

const EASE = [0.16, 1, 0.3, 1] as const;
const GRADIENT = "linear-gradient(180deg, #1d3fbf, #e0457b 55%, #ff7a3d)";

// Newest first.
const educationData = [
  {
    school: "University of Oklahoma",
    location: "Oklahoma, United States",
    degree: "Master of Science in Computer Science",
    gpa: "4.0",
    scale: "4.0",
    period: "Aug 2024 – May 2026",
    coursework: ["Advanced Algorithms", "AI Infrastructure", "Deep Learning", "Software Architecture", "Quantum Computing"],
  },
  {
    school: "CVR College of Engineering",
    location: "Hyderabad, India",
    degree: "Bachelor of Technology in Computer Science",
    minor: "Minor in AI/ML",
    gpa: "9.1",
    scale: "10.0",
    period: "Aug 2020 – May 2024",
    coursework: ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "DBMS", "Machine Learning"],
  },
];

// An editorial timeline: a rail that fills with the hero's colours as you
// scroll, then one row per school with the GPA set large on the right.
const Education = () => {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="education" className="py-24 md:py-32 px-6 relative">
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader
          className="mb-2"
          index="04"
          label="Education"
          title={"Academic\nJourney"}
          subtitle="From foundational principles to advanced specialization."
        />

        <ol ref={listRef} className="relative">
          <span className="absolute left-[7px] top-0 bottom-0 w-px bg-primary-text/10" aria-hidden="true" />
          <motion.span
            className="absolute left-[7px] top-0 bottom-0 w-px origin-top"
            style={{ scaleY: fill, background: GRADIENT }}
            aria-hidden="true"
          />

          {educationData.map((e, i) => (
            <motion.li
              key={e.school}
              className="group relative grid grid-cols-[1.5rem_1fr] md:grid-cols-[1.5rem_13rem_1fr_9rem] gap-x-6 md:gap-x-8 gap-y-5 py-12 md:py-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
            >
              <span className="relative z-[1] mt-2 w-[15px] h-[15px] rounded-full border-2 border-accent bg-background" aria-hidden="true" />

              <div className="col-start-2 md:col-start-auto">
                <p className="text-xs font-medium uppercase tracking-[0.22em] tabular-nums text-accent">{e.period}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-primary-tertiary">{e.location}</p>
              </div>

              <div className="col-start-2 md:col-start-auto min-w-0">
                <h3 className="font-display font-bold text-3xl md:text-5xl tracking-[-0.04em] leading-[0.95] text-primary-text transition-transform duration-500 group-hover:translate-x-3">
                  {e.school}
                </h3>
                <p className="mt-4 text-lg md:text-xl text-primary-text">
                  {e.degree}
                  {e.minor && <span className="font-serif italic text-accent"> · {e.minor}</span>}
                </p>
                <p className="mt-4 text-sm md:text-base text-primary-secondary leading-relaxed">{e.coursework.join("  ·  ")}</p>
              </div>

              <div className="col-start-2 md:col-start-auto md:text-right">
                <p className="font-display font-extrabold text-5xl md:text-7xl tracking-[-0.05em] leading-none text-primary-text">{e.gpa}</p>
                <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.22em] text-primary-secondary">GPA / {e.scale}</p>
              </div>

              {/* Row rule, with the gradient sweeping across it on hover. */}
              <span className="absolute left-10 right-0 bottom-0 h-px bg-primary-text/10" aria-hidden="true" />
              <span
                className="absolute left-10 right-0 bottom-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, #1d3fbf, #e0457b, #ff7a3d)" }}
                aria-hidden="true"
              />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Education;
