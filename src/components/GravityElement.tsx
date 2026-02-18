import React, { useRef } from 'react';
import { motion } from 'framer-motion';

interface GravityElementProps {
  children: React.ReactNode;
  constraintsRef: React.RefObject<HTMLDivElement>;
  className?: string;
  onClick?: () => void;
}

const GravityElement = ({ children, constraintsRef, className = "", onClick }: GravityElementProps) => {
  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      dragElastic={0.2}
      whileHover={{ scale: 1.1, cursor: "grab" }}
      whileDrag={{ scale: 1.2, cursor: "grabbing" }}
      // Initial random position? Or just let them be in flow but draggable
      className={`inline-flex items-center justify-center ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GravityElement;
