import React from 'react';
import Reveal from './Reveal';

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
      <Reveal delay={delay}>{children}</Reveal>
    </section>
  );
};

export default SectionContainer;
