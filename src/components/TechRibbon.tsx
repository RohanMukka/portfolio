import React from 'react';
import { motion } from 'framer-motion';

const techStack = [
  'React', 'TypeScript', 'Node.js', 'Python', 'ML', 'Solidity', 
  'Cloud Systems', 'Full-Stack', 'Web3', 'Blockchain', 'System Design'
];

const TechRibbon = () => {
  return (
    <div className="relative py-12 overflow-hidden bg-surface-subtle border-y border-glass-border">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-primary to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-bg-primary to-transparent z-10"></div>
      
      <motion.div 
        className="flex whitespace-nowrap"
        animate={{ x: [0, -1000] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {[...techStack, ...techStack, ...techStack].map((tech, i) => (
          <div key={i} className="flex items-center gap-4 md:gap-6 mx-4 md:mx-8">
            <span className="text-2xl md:text-5xl font-display font-black text-primary-text opacity-10 uppercase tracking-tighter hover:opacity-100 transition-opacity cursor-default">
              {tech}
            </span>
            <span className="w-2 h-2 rounded-full bg-accent opacity-20"></span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TechRibbon;
