import React, { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export const EASE = [0.16, 1, 0.3, 1] as const;

// A link that leans toward the cursor while it's near. `external` opens it in
// a new tab.
export const Magnetic = ({ href, className, children, download, external, onClick, label }: {
  href: string;
  className?: string;
  children: React.ReactNode;
  download?: string;
  external?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  label?: string;
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
    <motion.a
      ref={ref}
      href={href}
      download={download}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      onClick={onClick}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.a>
  );
};

export const fadeUp = (delay: number, play = true) => ({
  initial: { opacity: 0, y: 16 },
  animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
  transition: { duration: 0.8, ease: EASE, delay },
});
