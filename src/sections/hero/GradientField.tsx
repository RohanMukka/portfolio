import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { isSoftwareRendering } from "../../lib/rendering";

// The hero panel's living colour: a base gradient with three soft colour
// blobs that drift on their own (CSS keyframes in index.css) and lean a
// little toward the cursor, under a film-grain layer. In lite mode they hold
// still and the grain goes (index.css).
const GradientField = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 30, damping: 20 });
  const sy = useSpring(y, { stiffness: 30, damping: 20 });

  useEffect(() => {
    if (isSoftwareRendering()) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      x.set((e.clientX / window.innerWidth - 0.5) * 60);
      y.set((e.clientY / window.innerHeight - 0.5) * 40);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y]);

  return (
    <div className="hero-field absolute inset-0" aria-hidden="true">
      <motion.div className="absolute inset-[-10%]" style={{ x: sx, y: sy }}>
        <div className="hero-blob hero-blob-a" />
        <div className="hero-blob hero-blob-b" />
        <div className="hero-blob hero-blob-c" />
      </motion.div>
      <div className="hero-grain absolute inset-0" />
      {/* A soft shade along the top and bottom edges, where the small white
          labels sit, so they stay readable over the brightest colours. */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,10,40,0.28)_0%,transparent_22%,transparent_70%,rgba(0,10,40,0.3)_100%)]" />
    </div>
  );
};

export default GradientField;
