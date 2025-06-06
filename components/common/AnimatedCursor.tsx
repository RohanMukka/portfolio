
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const AnimatedCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHoveringLink, setIsHoveringLink] = useState(false);
  const [isHoveringText, setIsHoveringText] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => setPosition({ x: e.clientX, y: e.clientY });
    
    const handleMouseEnterLink = () => setIsHoveringLink(true);
    const handleMouseLeaveLink = () => setIsHoveringLink(false);
    const handleMouseEnterText = () => setIsHoveringText(true);
    const handleMouseLeaveText = () => setIsHoveringText(false);

    window.addEventListener('mousemove', updatePosition);

    // Query for elements after component mounts and DOM is ready
    const linkElements = document.querySelectorAll('a, button, [data-cursor-hover-link]');
    const textElements = document.querySelectorAll('h1, h2, h3, p, span, [data-cursor-hover-text]');

    linkElements.forEach(el => { 
      el.addEventListener('mouseenter', handleMouseEnterLink); 
      el.addEventListener('mouseleave', handleMouseLeaveLink); 
    });
    textElements.forEach(el => { 
      el.addEventListener('mouseenter', handleMouseEnterText); 
      el.addEventListener('mouseleave', handleMouseLeaveText); 
    });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      linkElements.forEach(el => { 
        el.removeEventListener('mouseenter', handleMouseEnterLink); 
        el.removeEventListener('mouseleave', handleMouseLeaveLink); 
      });
      textElements.forEach(el => { 
        el.removeEventListener('mouseenter', handleMouseEnterText); 
        el.removeEventListener('mouseleave', handleMouseLeaveText); 
      });
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  const cursorVariants = {
    default: { 
      width: 24, height: 24, 
      border: '2px solid #A78BFA', // purple-400
      backgroundColor: 'rgba(167, 139, 250, 0.1)', 
      x: position.x - 12, y: position.y - 12, 
      transition: { type: 'spring', stiffness: 700, damping: 30 } 
    },
    linkHover: { 
      width: 48, height: 48, 
      border: '2px solid #38BDF8', // sky-500
      backgroundColor: 'rgba(56, 189, 248, 0.2)', 
      x: position.x - 24, y: position.y - 24, 
      transition: { type: 'spring', stiffness: 500, damping: 20 } 
    },
    textHover: { 
      width: 36, height: 36, 
      border: '2px solid #EC4899', // pink-500
      backgroundColor: 'rgba(236, 72, 153, 0.1)', 
      x: position.x - 18, y: position.y - 18, 
      mixBlendMode: 'difference' as const, // Ensure string literal type
      transition: { type: 'spring', stiffness: 600, damping: 25 } 
    }
  };

  let currentVariant = "default";
  if (isHoveringLink) currentVariant = "linkHover";
  else if (isHoveringText) currentVariant = "textHover";

  return (
    <motion.div 
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block" 
      variants={cursorVariants} 
      animate={currentVariant} 
    />
  );
};

export default AnimatedCursor;
