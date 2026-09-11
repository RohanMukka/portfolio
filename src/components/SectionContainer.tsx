import React from 'react';
import { motion } from 'framer-motion';

interface SectionContainerProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  delay?: number;
}

const SectionContainer: React.FC<SectionContainerProps> = ({ children, id, className = '', delay = 0 }) => {
  return (
    <section 
      id={id} 
      className={`relative w-full max-w-7xl mx-auto px-6 py-20 md:py-32 ${className}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay }}
      >
        {children}
      </motion.div>
    </section>
  );
};

export default SectionContainer;
