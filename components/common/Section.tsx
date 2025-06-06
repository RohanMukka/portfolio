import React from 'react';
import { motion } from 'framer-motion';
import { SectionProps } from '../../types';

const Section: React.FC<SectionProps> = ({ children, id, className = '', fullHeight = false, refProp }) => {
  return (
    <motion.section
      ref={refProp}
      id={id}
      className={`relative ${fullHeight ? 'min-h-screen' : 'py-24 md:py-32'} px-6 md:px-12 ${className}`}
      data-testid={`section-${id}`} // For testing
    >
      <div className={`container mx-auto relative z-10 
                      ${fullHeight ? 'h-full flex flex-col justify-center items-center' : ''} 
                      ${id === 'contact' ? 'max-w-3xl' : 'max-w-6xl'}`}
      >
        {children}
      </div>
    </motion.section>
  );
};

export default Section;