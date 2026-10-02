import React, { useEffect, useRef } from "react";
import { motion, motionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { NAME_WORDS } from "../../lib/heroName";

// When the intro unmounts, each of its letters flies to the hero letter that
// shares its layoutId.
const handoff = (index: number) => ({
  layout: { duration: 1.1, ease: [0.76, 0, 0.24, 1] as const, delay: index * 0.02 },
});

const NAME_LETTERS = NAME_WORDS.map((word, w) => word.map((l, i) => ({ ...l, index: w * 5 + i })));
const ALL_LETTERS = NAME_LETTERS.flat();

const Letter = ({ letter, lift, setRef }: {
  letter: (typeof ALL_LETTERS)[number];
  lift: MotionValue<number>;
  setRef: (el: HTMLSpanElement | null) => void;
}) => {
  const s = useSpring(lift, { stiffness: 260, damping: 22 });
  const y = useTransform(s, (v) => `${-v * 14}%`);
  const scaleY = useTransform(s, [0, 1], [1, 1.3]);
  return (
    <motion.span
      ref={setRef}
      layoutId={letter.id}
      className="inline-block"
      style={{ y, scaleY, originY: 1 }}
      transition={handoff(letter.index)}
    >
      {letter.char}
    </motion.span>
  );
};

// The name spans the full width (size and colour come from `className`);
// letters near the cursor rise like a level meter. Centres come from
// offsetLeft, which ignores the lift itself, so the effect never feeds back
// on its own movement.
const FullWidthName = ({ className = "" }: { className?: string }) => {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const lifts = useRef(ALL_LETTERS.map(() => motionValue(0)));

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const h1 = h1Ref.current;
      if (!h1 || e.pointerType === "touch") return;
      const box = h1.getBoundingClientRect();
      const reach = Math.max(200, box.width * 0.17);
      const dy = Math.max(0, Math.abs(e.clientY - (box.top + box.height / 2)) - box.height / 2);
      const vertical = Math.max(0, 1 - dy / (box.height * 1.2));
      letterRefs.current.forEach((el, i) => {
        if (!el) return;
        const parent = el.offsetParent === h1 ? 0 : (el.parentElement?.offsetLeft ?? 0);
        const cx = box.left + parent + el.offsetLeft + el.offsetWidth / 2;
        lifts.current[i].set(Math.max(0, 1 - Math.abs(e.clientX - cx) / reach) * vertical);
      });
    };
    const onLeave = () => lifts.current.forEach((l) => l.set(0));
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <h1
      ref={h1Ref}
      aria-label="Rohan Mukka"
      className={`relative flex flex-col md:flex-row md:gap-x-[0.25em] font-display font-extrabold leading-[0.8] tracking-[-0.055em] ${className}`}
    >
      {NAME_LETTERS.map((word, w) => (
        <span key={w} className="relative inline-block whitespace-nowrap" aria-hidden="true">
          {word.map((l) => (
            <React.Fragment key={l.id}>
              <Letter letter={l} lift={lifts.current[l.index]} setRef={(el) => { letterRefs.current[l.index] = el; }} />
            </React.Fragment>
          ))}
        </span>
      ))}
    </h1>
  );
};

export default FullWidthName;
