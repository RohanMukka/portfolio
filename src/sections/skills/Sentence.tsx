import React, { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { skillGroups } from "../../data/skills";

// [Name|label] marks a technology (Name must match data/skills.ts); anything
// after the closing bracket up to a space, like a comma, sticks to it.
const TEXT =
  "I write [Python], [Java], [TypeScript] and [C/C++|C++], build interfaces with [React.js|React], [Next.js] and [Angular], " +
  "and back them with [Node.js], [Firebase] and [SQL]. I ship on [Docker], [Kubernetes], [AWS] and [Google Cloud], " +
  "automate with [Jenkins] and [GitHub], and train models with [TensorFlow] and [Scikit-learn|scikit-learn] — " +
  "mostly around [NLP], [Gen AI] and [AI Infra|AI infrastructure].";

const ICONS = new Map(skillGroups.flatMap((g) => g.items.map((i) => [i.name, i.icon] as const)));

type Unit = { text: string; trail: string; tech?: string };

const UNITS: Unit[] = [...TEXT.matchAll(/\[([^\]]+)\]([^\s[]*)|(\S+)/g)].map((m) => {
  if (m[3]) return { text: m[3], trail: "" };
  const [name, label] = m[1].split("|");
  return { text: label ?? name, trail: m[2], tech: name };
});

const Word = ({ unit, index, total, progress }: { unit: Unit; index: number; total: number; progress: MotionValue<number> }) => {
  // Each word lights up during its own slice of the scroll.
  const opacity = useTransform(progress, [index / total, (index + 1) / total], [0.14, 1]);
  const icon = unit.tech ? ICONS.get(unit.tech) : undefined;

  return (
    <>
      <motion.span style={{ opacity }} className={unit.tech ? "relative group inline-block" : "inline"}>
        {unit.tech ? (
          <>
            <span className="font-extrabold underline decoration-accent/60 decoration-2 underline-offset-[0.18em] cursor-default">
              {unit.text}
            </span>
            {icon && (
              <span className="pointer-events-none absolute left-1/2 bottom-full mb-3 -translate-x-1/2 translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 p-2.5 rounded-xl bg-bg-elevated shadow-xl border border-glass-border">
                <img src={icon} alt="" className="block w-9 h-9 object-contain" />
              </span>
            )}
          </>
        ) : (
          unit.text
        )}
        {unit.trail}
      </motion.span>{" "}
    </>
  );
};

// The stack as one sentence in your own voice. Words fill in from
// faint to full colour as you scroll; hovering a technology shows its logo.
// A compact full list follows for anyone scanning for a keyword.
const Sentence = () => {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.45"] });

  return (
    <div>
      <p
        ref={ref}
        className="font-display font-semibold text-[clamp(1.75rem,3.6vw,3.4rem)] leading-[1.18] tracking-[-0.03em] text-primary-text max-w-6xl"
      >
        {UNITS.map((u, i) => (
          <React.Fragment key={i}>
            <Word unit={u} index={i} total={UNITS.length} progress={scrollYProgress} />
          </React.Fragment>
        ))}
      </p>

      <div className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-x-10 gap-y-8 border-t border-primary-text/10 pt-10">
        {skillGroups.map((g) => (
          <div key={g.category}>
            <h3 className="text-xs font-bold uppercase tracking-[0.25em] text-accent mb-3">{g.category}</h3>
            <p className="text-sm text-primary-secondary leading-relaxed">{g.items.map((i) => i.name).join(" · ")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sentence;
