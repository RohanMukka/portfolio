import React, { useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { certificationsByDate, yearOf } from "../data/certifications";

const EASE = [0.16, 1, 0.3, 1] as const;
const GRADIENT = "linear-gradient(180deg, #1d3fbf, #e0457b 55%, #ff7a3d)";
const SWEEP = "linear-gradient(90deg, #1d3fbf, #e0457b, #ff7a3d)";

// Newest first.
const degrees = [
  {
    school: "University of Oklahoma",
    location: "Norman, Oklahoma",
    degree: "M.S. Computer Science",
    gpa: "4.0",
    scale: "4.0",
    period: "Aug 2024 – May 2026",
    coursework: ["Advanced Algorithms", "AI Infrastructure", "Deep Learning", "Software Architecture", "Quantum Computing"],
  },
  {
    school: "CVR College of Engineering",
    location: "Hyderabad, India",
    degree: "B.Tech Computer Science",
    minor: "Minor in AI/ML",
    gpa: "9.1",
    scale: "10.0",
    period: "Aug 2020 – May 2024",
    coursework: ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "DBMS", "Machine Learning"],
  },
];

// The degrees as a timeline whose rail fills with the brand gradient as it
// scrolls by, each with its GPA set large; then the certifications as a
// compact ledger, where hovering a row reveals what it covers.
const Credentials = () => {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 80%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="credentials" data-chapter="credentials" className="py-24 md:py-32 px-6 relative">
      <div className="max-w-6xl mx-auto w-full">
        <SectionHeader className="mb-2" index="04" label="Credentials" title={"Degrees &\n*certificates*"} />

        <div className="lg:w-[62%]">
          <ol ref={listRef} className="relative">
            <span className="absolute left-[7px] top-0 bottom-0 w-px bg-primary-text/10" aria-hidden="true" />
            <motion.span
              className="absolute left-[7px] top-0 bottom-0 w-px origin-top"
              style={{ scaleY: fill, background: GRADIENT }}
              aria-hidden="true"
            />

            {degrees.map((d, i) => (
              <motion.li
                key={d.school}
                className="group relative grid grid-cols-[1.5rem_1fr] sm:grid-cols-[1.5rem_1fr_auto] gap-x-6 gap-y-4 py-12 md:py-14"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{ duration: 0.8, ease: EASE, delay: i * 0.1 }}
              >
                <span className="relative z-[1] mt-2 w-[15px] h-[15px] rounded-full border-2 border-accent bg-background" aria-hidden="true" />

                <div className="min-w-0">
                  <p className="hud text-accent">{d.period} · {d.location}</p>
                  <h3 className="mt-3 font-display font-bold text-3xl md:text-[2.75rem] tracking-[-0.04em] leading-[0.95] text-primary-text transition-transform duration-500 group-hover:translate-x-2">
                    {d.school}
                  </h3>
                  <p className="mt-3 text-lg text-primary-text">
                    {d.degree}
                    {d.minor && <span className="font-serif italic text-accent"> · {d.minor}</span>}
                  </p>
                  <p className="mt-3 text-sm text-primary-secondary leading-relaxed">{d.coursework.join("  ·  ")}</p>
                </div>

                <div className="col-start-2 sm:col-start-auto sm:text-right">
                  <p className="font-display font-extrabold text-5xl md:text-6xl tracking-[-0.05em] leading-none text-primary-text">{d.gpa}</p>
                  <p className="mt-2 hud text-primary-tertiary">GPA / {d.scale}</p>
                </div>

                <span className="absolute left-10 right-0 bottom-0 h-px bg-primary-text/10" aria-hidden="true" />
                <span
                  className="absolute left-10 right-0 bottom-0 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
                  style={{ background: SWEEP }}
                  aria-hidden="true"
                />
              </motion.li>
            ))}
          </ol>

          <div className="mt-20 md:mt-24">
            <p className="hud text-primary-tertiary mb-4">Certifications ({String(certificationsByDate.length).padStart(2, "0")})</p>
            <ol onMouseLeave={() => setHovered(null)} className="border-t border-primary-text/10">
              {certificationsByDate.map((c) => {
                const isHovered = hovered === c.name;
                const dim = hovered !== null && !isHovered;
                return (
                  <li
                    key={c.name}
                    onMouseEnter={() => setHovered(c.name)}
                    className={`relative border-b border-primary-text/10 transition-opacity duration-300 ${dim ? "opacity-35" : ""}`}
                  >
                    <motion.span
                      className="pointer-events-none absolute left-0 right-0 -bottom-px h-px origin-left"
                      style={{ background: SWEEP }}
                      initial={false}
                      animate={{ scaleX: isHovered ? 1 : 0 }}
                      transition={{ duration: 0.6, ease: EASE }}
                    />
                    <div className="grid grid-cols-[3.25rem_1fr_auto] items-center gap-4 py-5">
                      <span className="hud text-accent">{yearOf(c)}</span>
                      <div className="min-w-0">
                        <motion.h3
                          className="font-display text-lg md:text-2xl font-bold tracking-[-0.03em] leading-tight text-primary-text"
                          animate={{ x: isHovered ? 10 : 0 }}
                          transition={{ duration: 0.4, ease: EASE }}
                        >
                          {c.name}
                        </motion.h3>
                        <p className="mt-1 text-sm text-primary-secondary">{c.issuer}</p>
                        <motion.div
                          className="overflow-hidden"
                          initial={false}
                          animate={{ height: isHovered ? "auto" : 0, opacity: isHovered ? 1 : 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                        >
                          <p className="pt-2 text-sm text-primary-tertiary">
                            {[...(c.skills ?? []), c.expires ? `Valid until ${c.expires}` : `Issued ${c.issued}`].join("  ·  ")}
                          </p>
                        </motion.div>
                      </div>
                      <motion.span
                        className="justify-self-end text-primary-text"
                        animate={{ rotate: isHovered ? 45 : 0 }}
                        transition={{ duration: 0.4, ease: EASE }}
                      >
                        <ArrowUpRight size={18} />
                      </motion.span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Credentials;
