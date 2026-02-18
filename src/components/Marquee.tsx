import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
  children: React.ReactNode;
  direction?: 'left' | 'right';
  speed?: number;
  className?: string;
}

const Marquee = ({ children, direction = 'left', speed = 25, className = '' }: MarqueeProps) => {
  return (
    <div className={`relative flex overflow-hidden w-full ${className}`}>
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
      <motion.div
        className="flex min-w-full shrink-0 gap-10 py-4"
        animate={{
          x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
        style={{ width: "max-content" }}
      >
        {children}
        {children}
      </motion.div>

      <motion.div
        className="flex min-w-full shrink-0 gap-10 py-4 ml-10"
        animate={{
          x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
         style={{ width: "max-content" }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

export default Marquee;
