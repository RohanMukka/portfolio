import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Track scroll progress for the SVG ring
  const { scrollYProgress } = useScroll();
  // Add a spring physics effect to the scroll progress so it fills smoothly
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          className="relative z-50"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-background/60 backdrop-blur-md border border-glass-border text-primary-text shadow-xl shadow-primary-text/10 outline-none group overflow-hidden"
            aria-label="Back to top"
          >
            {/* Soft background pulse on hover to make it feel alive */}
            <div className="absolute inset-0 bg-primary-text/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Background Track Circle */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
              <circle 
                cx="50" 
                cy="50" 
                r="46" 
                className="fill-none stroke-primary-text/20 stroke-[4px]" 
              />
              
              {/* Animated Progress Circle */}
              <motion.circle
                cx="50"
                cy="50"
                r="46"
                className="fill-none stroke-primary-text stroke-[4px] drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]"
                strokeLinecap="round"
                style={{ pathLength }}
              />
            </svg>

            {/* Bouncing Arrow Icon */}
            <ArrowUp 
              size={24} 
              strokeWidth={2.5} 
              className="group-hover:-translate-y-1.5 transition-transform duration-300" 
            />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
