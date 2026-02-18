import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export type CursorType = 'default' | 'ring' | 'glow' | 'minimal' | 'ghost';

interface CustomCursorProps {
  type: CursorType;
}

const CustomCursor = ({ type }: CustomCursorProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  // Smooth movement for the outer ring/ghost
  const ringX = useSpring(0, { stiffness: 150, damping: 20 });
  const ringY = useSpring(0, { stiffness: 150, damping: 20 });

  useEffect(() => {
    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const mouseDown = () => setIsClicking(true);
    const mouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mouseover', handleHover);
    window.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseover', handleHover);
      window.removeEventListener('mousedown', mouseDown);
      window.removeEventListener('mouseup', mouseUp);
    };
  }, [ringX, ringY]);

  useEffect(() => {
    if (type !== 'default') {
      document.body.classList.add('cursor-none');
    } else {
      document.body.classList.remove('cursor-none');
    }
  }, [type]);

  if (type === 'default') return null;

  return (
    <>
      {/* Ghost Trail (Only for ghost type) */}
      {type === 'ghost' && Array.from({ length: 4 }).map((_, i) => (
        <motion.div
           key={i}
           className="fixed top-0 left-0 w-2 h-2 bg-accent rounded-full pointer-events-none z-[9998] hidden md:block"
           style={{ opacity: 0.3 - (i * 0.05) }}
           animate={{
             x: mousePosition.x - 4,
             y: mousePosition.y - 4,
           }}
           transition={{
             type: "spring",
             stiffness: 100 / (i + 1),
             damping: 15 + i,
             mass: 0.1
           }}
        />
      ))}

      {/* Main Dot */}
      {(type === 'ring' || type === 'glow' || type === 'minimal' || type === 'ghost') && (
        <motion.div
          className="fixed top-0 left-0 w-2 h-2 bg-accent rounded-full pointer-events-none z-[10000] hidden md:block"
          animate={{
            x: mousePosition.x - 4,
            y: mousePosition.y - 4,
            scale: isHovering && type !== 'minimal' ? 0.5 : 1
          }}
          transition={{ type: "tween", duration: 0 }}
        />
      )}

      {/* Outer Layer */}
      {type !== 'minimal' && (
        <motion.div
          className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block ${
            type === 'glow' ? 'bg-accent/20 blur-md border-none' : 'border border-accent'
          }`}
          style={{
            width: type === 'glow' ? 40 : 32,
            height: type === 'glow' ? 40 : 32,
            x: ringX,
            y: ringY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            scale: isHovering ? 2 : isClicking ? 0.8 : 1,
            backgroundColor: isHovering ? "rgba(var(--accent-rgb), 0.15)" : "transparent",
            borderWidth: isHovering || type === 'glow' ? 0 : 2, // Thicker border for better visibility
            opacity: type === 'ghost' ? 0.3 : 0.8 // Consistent opacity
          }}
        />
      )}
    </>
  );
};

export default CustomCursor;
