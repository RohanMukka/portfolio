import React, { useRef } from 'react';
import { motion, useSpring, useMotionValue, useScroll, useTransform } from 'framer-motion';
import FloatingParticles from '../components/FloatingParticles';
import TiltedCard from '../components/TiltedCard';
import { useMediaQuery } from '../lib/useMediaQuery';
import { NAME_WORDS, NAME_TYPE } from '../lib/heroName';
import { ChapterCaptions, ChapterFrame } from './hero/Chapters';

// Scroll ranges, as fractions of the pinned hero (see CHAPTER_RANGES for the
// captions in between).
const COPY_OUT: [number, number] = [0, 0.12];
const MOVE: [number, number] = [0, 0.3];
const RECEDE: [number, number] = [0.92, 1];

const LETTER_VARIANTS = {
  rest: { scaleY: 1, scaleX: 1, y: 0, color: 'var(--text-primary)', transition: { duration: 0.3 } },
  hover: { scaleY: 1.5, scaleX: 0.9, y: -10, color: 'var(--accent)' },
};

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
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  // On desktop the hero pins and plays a chaptered scene: the intro copy lifts
  // away, the portrait turns and the name drifts apart, then three captions
  // (Build / Ship / Learn) take turns before the stage recedes. Phones get the
  // static hero. Deliberately not gated on prefers-reduced-motion (owner's
  // decision): the scene follows the visitor's own scroll.
  const pinned = isDesktop;

  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });

  const copyOpacity = useTransform(p, COPY_OUT, [1, 0]);
  const copyY = useTransform(p, COPY_OUT, [0, -60]);
  const hintOpacity = useTransform(p, [0, 0.06], [1, 0]);

  const nameY = useTransform(p, MOVE, [0, -40]);
  const nameScale = useTransform(p, MOVE, [1, 1.12]);
  const firstNameX = useTransform(p, MOVE, [0, -36]);
  const lastNameX = useTransform(p, MOVE, [0, 56]);

  const cardRotateY = useTransform(p, MOVE, [0, -22]);
  const cardRotateX = useTransform(p, MOVE, [0, 6]);
  const cardScale = useTransform(p, MOVE, [1, 1.08]);

  const stageScale = useTransform(p, RECEDE, [1, 0.9]);
  const stageOpacity = useTransform(p, RECEDE, [1, 0.25]);

  return (
    <section ref={sectionRef} id="hero" className={pinned ? 'relative h-[340vh]' : 'relative'}>
      <motion.div
        className={`sticky top-0 flex items-center justify-center px-6 overflow-hidden py-24 md:py-0 ${pinned ? 'h-[100dvh] will-change-transform' : 'min-h-[100dvh]'}`}
        style={pinned ? { scale: stageScale, opacity: stageOpacity } : undefined}
      >
      <FloatingParticles count={30} />

      {pinned && <ChapterFrame progress={p} />}

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Left Column: Image */}
        <motion.div 
          className="relative order-2 md:order-1 flex justify-center md:justify-end group"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="relative w-[300px] h-[400px] md:w-[400px] md:h-[500px]"
            style={pinned ? { rotateY: cardRotateY, rotateX: cardRotateX, scale: cardScale, transformPerspective: 1200 } : undefined}
          >
             <TiltedCard
               imageSrc={`${import.meta.env.BASE_URL}hero-profile.png`}
               altText="Rohan Mukka - Software Engineer"
               captionText="Rohan Mukka • Software Engineer"
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
          </motion.div>
        </motion.div>

        {/* Right Column: Content */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left order-1 md:order-2 z-10 w-full">
          <motion.div style={pinned ? { opacity: copyOpacity, y: copyY } : undefined}>
          <motion.p
            className="text-primary-secondary text-sm uppercase tracking-[0.2em] mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Software Engineer
          </motion.p>
          </motion.div>

          <motion.div
            className="w-full origin-left"
            style={pinned ? { y: nameY, scale: nameScale } : undefined}
          >
          <motion.h1
            className={`${NAME_TYPE} mb-8 flex flex-wrap justify-center md:justify-start gap-x-4 w-full`}
            layout
          >
            {NAME_WORDS.map((word, wordIndex) => (
              <motion.span
                key={wordIndex}
                className="inline-block whitespace-nowrap"
                style={pinned ? { x: wordIndex === 0 ? firstNameX : lastNameX } : undefined}
              >
                {word.map((item, letterIndex) => (
                  // Shares its layoutId with the intro's letter, so on mount it
                  // flies here from wherever the intro left it.
                  <motion.span
                    layoutId={item.id}
                    key={item.id}
                    className="inline-block cursor-default relative"
                    initial={false}
                    animate="rest"
                    whileHover="hover"
                    variants={LETTER_VARIANTS}
                    transition={{ layout: { duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: (wordIndex * 5 + letterIndex) * 0.02 } }}
                  >
                    {item.char}
                  </motion.span>
                ))}
              </motion.span>
            ))}
          </motion.h1>
          </motion.div>

          <div className="relative w-full">
          {pinned && <ChapterCaptions progress={p} />}
          <motion.div style={pinned ? { opacity: copyOpacity, y: copyY } : undefined}>
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
          </motion.div>
          </div>
        </div>

      </div>

      {pinned && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-primary-secondary pointer-events-none"
          style={{ opacity: hintOpacity }}
          aria-hidden="true"
        >
          <span className="text-[10px] uppercase tracking-[0.35em]">Scroll</span>
          <span className="relative block w-px h-10 overflow-hidden bg-primary-text/10">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-primary-text/60"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>
      )}
      </motion.div>
    </section>
  );
};

export default Hero;
