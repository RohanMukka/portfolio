import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';

const Background = () => {
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    // Initial theme check
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme);

    const handleMouseMove = (e: MouseEvent) => {
      // Smoother mouse values
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 50);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 50);
    };

    const observer = new MutationObserver(() => {
      const updatedTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(updatedTheme);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Movement springs
  const springMouseX = useSpring(mouseX, { stiffness: 40, damping: 30 });
  const springMouseY = useSpring(mouseY, { stiffness: 40, damping: 30 });
  const scrollYDelayed = useSpring(scrollY, { stiffness: 50, damping: 40 });

  // Transforms
  const yParallax = useTransform(scrollYDelayed, [0, 2000], [0, -300]);
  
  // Grid Transforms
  const gridY = useTransform(scrollYDelayed, [0, 5000], [-300, 700]); // Moves grid "forward" (down) on scroll
  const gridX = useTransform(springMouseX, [-50, 50], [20, -20]); // Parallax opposite to mouse
  
  // Orb Parallax
  const xInverse = useTransform(springMouseX, [-25, 25], [12.5, -12.5]);
  const yInverse = useTransform(springMouseY, [-25, 25], [12.5, -12.5]);
  
  const xDeep = useTransform(springMouseX, [-25, 25], [-37.5, 37.5]);
  const yDeep = useTransform(springMouseY, [-25, 25], [30, -30]);

  const yParallaxHalf = useTransform(yParallax, (v: number) => v * 0.5);

  const isDark = theme === 'dark';

  // Memoize gradients to prevent unnecessary string computation
  const gradients = useMemo(() => ({
    top: isDark 
      ? 'radial-gradient(circle, #1e3a8a 0%, transparent 70%)' 
      : 'radial-gradient(circle, #bfdbfe 0%, transparent 70%)',
    bottom: isDark 
      ? 'radial-gradient(circle, #312e81 0%, transparent 70%)' 
      : 'radial-gradient(circle, #fef3c7 0%, transparent 75%)',
    center: isDark 
      ? 'radial-gradient(circle, #5b21b6 0%, transparent 70%)' 
      : 'radial-gradient(circle, rgba(0, 35, 102, 0.08) 0%, transparent 70%)'
  }), [isDark]);

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-background transition-colors duration-1000">
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Main Accent Orb (Top Right) */}
        <motion.div
          className="absolute -top-[10%] -right-[10%] w-[80vw] h-[80vw] rounded-full blur-[120px] opacity-[0.45]"
          style={{ 
            background: gradients.top,
            x: springMouseX,
            y: springMouseY,
            translateY: yParallax
          }}
        />

        {/* Secondary Accent Orb (Bottom Left) */}
        <motion.div
          className="absolute -bottom-[20%] -left-[10%] w-[90vw] h-[90vw] rounded-full blur-[150px] opacity-[0.35]"
          style={{ 
            background: gradients.bottom,
            x: xInverse,
            y: yInverse,
            translateY: yParallaxHalf
          }}
        />

        {/* Center Dynamic Glow */}
        <motion.div
          className="absolute top-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full blur-[180px] opacity-[0.1]"
          style={{ 
            background: gradients.center,
            x: xDeep,
            y: yDeep,
          }}
        />
      </div>

      {/* Subtle Texture/Grain */}
      <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay pointer-events-none"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
      </div>

      {/* 3D Perspective Grid */}
      <div 
        className="absolute inset-[-50%] opacity-[0.15] pointer-events-none"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div 
          className="w-full h-full origin-center"
          style={{
            backgroundImage: `
              linear-gradient(to right, var(--text-secondary) 1px, transparent 1px),
              linear-gradient(to bottom, var(--text-secondary) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
            rotateX: 60,
            y: gridY,
            x: gridX,
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
};

export default Background;
