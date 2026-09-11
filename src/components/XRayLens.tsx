import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const XRayLens = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[65] overflow-hidden">
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full border border-white/20 bg-white/5 backdrop-blur-[2px]"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          x: mousePos.x - 150, 
          y: mousePos.y - 150,
          scale: isVisible ? 1 : 0,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200, mass: 0.5 }}
        style={{
          boxShadow: '0 0 50px rgba(var(--accent-rgb), 0.1)',
        }}
      >
        {/* Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-full h-px bg-accent"></div>
          <div className="w-px h-full bg-accent absolute"></div>
        </div>

        {/* HUD Data inside Lens */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 px-2 py-1 bg-accent/20 rounded border border-accent/30 backdrop-blur-md">
          <span className="text-[8px] font-mono font-bold text-accent whitespace-nowrap uppercase tracking-tighter">
            SCAN_MODE // ARCH_INSPECTOR
          </span>
        </div>

        {/* Perimeter Markers */}
        {[0, 90, 180, 270].map((deg) => (
          <div 
            key={deg}
            className="absolute w-2 h-px bg-accent"
            style={{ 
              top: '50%', 
              left: '50%', 
              transform: `rotate(${deg}deg) translate(140px, 0)` 
            }}
          />
        ))}

        {/* Local Coordinate Grid inside lens */}
        <div 
          className="absolute inset-4 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--accent) 1px, transparent 1px),
              linear-gradient(to bottom, var(--accent) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }}
        />
      </motion.div>
    </div>
  );
};

export default XRayLens;
