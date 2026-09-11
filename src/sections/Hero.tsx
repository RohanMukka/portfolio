import React from "react";
import MagneticButton from "../components/MagneticButton";
import Reveal from "../components/Reveal";
import { useAmbient } from "../lib/ambient";
import "./Hero.css";

const NAME = [
  ["R", "o", "h", "a", "n"],
  ["M", "u", "k", "k", "a"],
];

/** Chips float in front of the portrait, placed in the rig's 3D space. */
const CHIPS = [
  {
    label: "React",
    dot: "var(--hue-blue)",
    style: {
      top: "24%",
      left: 0,
      "--tx": "-58%",
      "--cz": "92px",
      "--cd": "0s",
    },
  },
  {
    label: "TypeScript",
    dot: "var(--hue-cyan)",
    style: {
      top: "6%",
      right: 0,
      "--tx": "24%",
      "--cz": "124px",
      "--cd": "1.4s",
    },
  },
  {
    label: "Python",
    dot: "var(--hue-green)",
    style: {
      bottom: "14%",
      right: 0,
      "--tx": "22%",
      "--cz": "76px",
      "--cd": "2.6s",
    },
  },
] satisfies { label: string; dot: string; style: React.CSSProperties }[];

const Hero = () => {
  const rigRef = useAmbient<HTMLDivElement>("pointer");

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center min-h-[100dvh] px-6 py-24 md:py-0"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
        {/* Portrait stage */}
        <Reveal
          variant="scale"
          className="order-2 md:order-1 flex justify-center md:justify-end"
        >
          <div className="hero-stage">
            <div className="hero-rig" ref={rigRef}>
              <div className="hero-halo" />
              <div className="hero-slab hero-slab--3" />
              <div className="hero-slab hero-slab--2" />
              <div className="hero-slab hero-slab--1" />

              <div className="hero-portrait">
                <picture>
                  <source
                    srcSet={`${import.meta.env.BASE_URL}hero-profile.webp`}
                    type="image/webp"
                  />
                  <img
                    src={`${import.meta.env.BASE_URL}hero-profile.jpg`}
                    alt="Rohan Mukka"
                    width={800}
                    height={1200}
                    fetchPriority="high"
                    decoding="async"
                  />
                </picture>
              </div>

              {CHIPS.map((chip) => (
                <div key={chip.label} className="hero-chip" style={chip.style}>
                  <span className="hero-chip-inner">
                    <span
                      className="hero-chip-dot"
                      style={{ ["--chip-dot" as string]: chip.dot }}
                    />
                    {chip.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Copy */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-2 w-full">
          <Reveal
            as="p"
            delay={0.1}
            className="text-primary-secondary text-xs uppercase tracking-[0.28em] mb-5 font-semibold"
          >
            Software Engineer
          </Reveal>

          <h1 className="hero-title text-5xl sm:text-6xl lg:text-[6.5rem] font-display font-bold tracking-tighter text-primary-text leading-[0.92] mb-8 flex flex-wrap justify-center md:justify-start gap-x-5">
            {NAME.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap">
                {word.map((char, letterIndex) => (
                  <span
                    key={`${wordIndex}-${letterIndex}`}
                    className="hero-letter"
                    style={{
                      animationDelay: `${
                        0.15 + (wordIndex * 5 + letterIndex) * 0.045
                      }s`,
                    }}
                  >
                    {char}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <Reveal
            as="p"
            delay={0.5}
            className="text-lg md:text-xl text-primary-secondary max-w-lg mb-10 leading-relaxed"
          >
            I build web applications with a focus on clean architecture,
            performance, and thoughtful UX. Transforming complex problems into
            elegant solutions.
          </Reveal>

          <Reveal delay={0.65} className="flex flex-wrap gap-4">
            <MagneticButton
              href="#projects"
              className="btn-cta px-10 py-5 rounded-xl text-base"
            >
              View work
            </MagneticButton>
            <MagneticButton
              href="#contact"
              className="surface surface-glass lift px-10 py-5 rounded-xl text-base text-primary-text"
              data-elev="2"
            >
              Get in touch
            </MagneticButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

export default Hero;
