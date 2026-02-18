import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useSpring, useMotionValue } from 'framer-motion';
import FloatingParticles from '../components/FloatingParticles';
import TiltedCard from '../components/TiltedCard';

const MagneticButton = ({ children, className, href }: { children: React.ReactNode, className?: string, href: string }) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    x.set(distanceX * 0.3);
    y.set(distanceY * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
};

const Hero = () => {
  const [words, setWords] = useState([
    [
      { char: 'R', id: 'swap-1', needsShake: true },
      { char: 'o', id: 'o-1' },
      { char: 'h', id: 'h-1' },
      { char: 'a', id: 'a-1' },
      { char: 'n', id: 'n-1' },
    ],
    [
      { char: 'M', id: 'swap-2', needsShake: true },
      { char: 'u', id: 'u-1' },
      { char: 'k', id: 'k-1' },
      { char: 'k', id: 'k-2' },
      { char: 'a', id: 'a-2' },
    ]
  ]);

  const [stage, setStage] = useState('swapped');

  const letterAnimation = {
    whileHover: { 
      scaleY: 1.5,
      scaleX: 0.9,
      y: -10,
      color: "var(--accent)"
    }
  };

  const variants = {
    initial: (i: number) => {
       const startX = (i % 2 === 0 ? -150 : 150) + (i * 10);
       const startY = (i % 3 === 0 ? -150 : 150) + (i * 5);
       const startRotate = (i % 2 === 0 ? -45 : 45);
       return { opacity: 0, x: startX, y: startY, scale: 2, rotate: startRotate, filter: "blur(10px)" };
    },
    entry: (i: number) => ({
      opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)",
      transition: { duration: 0.8, delay: 0.1 + (i * 0.08), type: "spring", bounce: 0.5 }
    }),
    shake: (i: number) => ({
      x: [0, -5, 5, -5, 5, 0],
      opacity: 1,
      color: "#ef4444",
      transition: { duration: 0.5 }
    }),
    swapped: {
      x: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)", opacity: 1,
      color: "var(--text-primary)",
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="hero" className="relative flex items-center justify-center min-h-[100dvh] px-6 overflow-hidden py-24 md:py-0">
      <FloatingParticles count={30} />
      

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Left Column: Image */}
        <motion.div 
          className="relative order-2 md:order-1 flex justify-center md:justify-end group"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px]">
             <TiltedCard
               imageSrc={`${import.meta.env.BASE_URL}hero-profile.png`}
               altText="Rohan Mukka - Full Stack Developer"
               captionText="Rohan Mukka • Full Stack Developer"
               containerHeight="100%"
               containerWidth="100%"
               imageHeight="100%"
               imageWidth="100%"
               rotateAmplitude={12}
               scaleOnHover={1.05}
               showMobileWarning={false}
               showTooltip={true}
               displayOverlayContent={true}
               overlayContent={
                 <div className="absolute inset-0 bg-gradient-to-tr from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[15px]"></div>
               }
             />
             
             <motion.div 
               className="absolute -z-10 top-6 -left-6 w-full h-full border-2 border-primary-text/20 rounded-2xl pointer-events-none"
               animate={{ x: [0, 5, 0], y: [0, -5, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
             ></motion.div>
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl animate-pulse pointer-events-none"></div>
             <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-blue/10 rounded-full blur-3xl animate-pulse delay-700 pointer-events-none"></div>
          </div>
        </motion.div>

        {/* Right Column: Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-2 z-10 w-full">
          <motion.p
            className="text-primary-secondary text-sm uppercase tracking-[0.2em] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Full Stack Developer
          </motion.p>
          
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-[7rem] font-display font-bold tracking-tighter text-primary-text leading-[0.9] mb-8 flex flex-wrap justify-center md:justify-start gap-x-4 w-full"
            layout
          >
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block whitespace-nowrap">
                {word.map((item, letterIndex) => {
                  const uniqueIndex = wordIndex * 10 + letterIndex;
                  return (
                    <motion.span
                      layoutId={item.id}
                      key={item.id}
                      className="inline-block cursor-default relative"
                      custom={uniqueIndex}
                      initial="initial"
                      animate={stage === 'swapped' ? 'swapped' : 'entry'}
                      variants={variants}
                      whileHover={letterAnimation.whileHover}
                    >
                      {item.char}
                    </motion.span>
                  );
                })}
              </span>
            ))}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-primary-secondary max-w-lg mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            I build web applications with a focus on clean architecture, performance, and thoughtful UX. Transforming complex problems into elegant solutions.
          </motion.p>
          
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <MagneticButton 
              href="#projects"
              className="btn-cta inline-flex items-center gap-2 px-10 py-5 rounded-xl text-base"
            >
              View work
            </MagneticButton>
            <MagneticButton 
              href="#contact"
              className="inline-flex items-center gap-2 px-10 py-5 rounded-xl text-primary-text glass-card hover:border-accent/40 shadow-none hover:shadow-lg transition-all text-base"
            >
              Get in touch
            </MagneticButton>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Hero;
