import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

// A link that leans toward the cursor while it's near.
export const Magnetic = ({ href, className, children, download }: {
  href: string;
  className?: string;
  children: React.ReactNode;
  download?: string;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 15, stiffness: 150 });
  const sy = useSpring(y, { damping: 15, stiffness: 150 });

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - (r.left + r.width / 2)) * 0.3);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.3);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a ref={ref} href={href} download={download} className={className} onMouseMove={onMove} onMouseLeave={onLeave} style={{ x: sx, y: sy }}>
      {children}
    </motion.a>
  );
};

// A line whose words rise one by one from behind a mask, once `play` is on.
// `{ em }` parts are set in the italic serif, in the accent colour unless
// `emClassName` says otherwise.
export type RevealPart = string | { em: string };

export const RevealWords = ({ parts, delay = 0, play = true, className = "", emClassName = "text-accent" }: {
  parts: RevealPart[];
  delay?: number;
  play?: boolean;
  className?: string;
  emClassName?: string;
}) => {
  const words = parts.flatMap((part) =>
    typeof part === "string"
      ? part.split(" ").filter(Boolean).map((text) => ({ text, em: false }))
      : part.em.split(" ").map((text) => ({ text, em: true })),
  );
  return (
    <p className={className}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className={`inline-block ${w.em ? `font-serif italic font-normal tracking-normal ${emClassName}` : ""}`}
              initial={{ y: "110%" }}
              animate={{ y: play ? 0 : "110%" }}
              transition={{ duration: 0.9, ease: EASE, delay: delay + i * 0.04 }}
            >
              {w.text}
            </motion.span>
          </span>{" "}
        </React.Fragment>
      ))}
    </p>
  );
};

export const fadeUp = (delay: number, play = true) => ({
  initial: { opacity: 0, y: 16 },
  animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
  transition: { duration: 0.8, ease: EASE, delay },
});
