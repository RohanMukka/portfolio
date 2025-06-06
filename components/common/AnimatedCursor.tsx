import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

const AnimatedCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'link' | 'text'>('default');

  // Smooth trailing using useSpring
  const springX = useSpring(mousePosition.x, { stiffness: 300, damping: 30 });
  const springY = useSpring(mousePosition.y, { stiffness: 300, damping: 30 });

  useEffect(() => {
    const move = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });

    const onEnterLink = () => setCursorVariant('link');
    const onLeaveLink = () => setCursorVariant('default');
    const onEnterText = () => setCursorVariant('text');
    const onLeaveText = () => setCursorVariant('default');

    window.addEventListener('mousemove', move);

    const links = document.querySelectorAll('a, button, [data-cursor-hover-link]');
    const texts = document.querySelectorAll('h1, h2, h3, p, span, [data-cursor-hover-text]');

    links.forEach(el => {
      el.addEventListener('mouseenter', onEnterLink);
      el.addEventListener('mouseleave', onLeaveLink);
    });
    texts.forEach(el => {
      el.addEventListener('mouseenter', onEnterText);
      el.addEventListener('mouseleave', onLeaveText);
    });

    return () => {
      window.removeEventListener('mousemove', move);
      links.forEach(el => {
        el.removeEventListener('mouseenter', onEnterLink);
        el.removeEventListener('mouseleave', onLeaveLink);
      });
      texts.forEach(el => {
        el.removeEventListener('mouseenter', onEnterText);
        el.removeEventListener('mouseleave', onLeaveText);
      });
    };
  }, []);

  const getStyle = () => {
    switch (cursorVariant) {
      case 'link':
        return {
          width: 48,
          height: 48,
          backgroundColor: 'rgba(56, 189, 248, 0.3)',
          border: '2px solid #38BDF8',
        };
      case 'text':
        return {
          width: 36,
          height: 36,
          backgroundColor: 'rgba(236, 72, 153, 0.2)',
          border: '2px solid #EC4899',
          mixBlendMode: 'difference',
        };
      default:
        return {
          width: 24,
          height: 24,
          backgroundColor: 'rgba(167, 139, 250, 0.1)',
          border: '2px solid #A78BFA',
        };
    }
  };

  const style = getStyle();

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block"
      style={{
        ...style,
        position: 'fixed',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        x: springX,
        y: springY,
      }}
    />
  );
};

export default AnimatedCursor;
