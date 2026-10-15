import React, { useCallback, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Crosshair from './hero/Crosshair';
import FullWidthName from './hero/FullWidthName';
import HeroIntro, { INTRO_OPEN, type IntroPhase } from './hero/HeroIntro';
import LiteStream from './hero/LiteStream';
import { isSoftwareRendering } from '../lib/rendering';
import { Magnetic, RevealWords, fadeUp } from './hero/shared';
import { openStage } from '../stage/store';

// The name while the intro plays, and as it pulls into focus. Plain opacity,
// transform and filter values, so the browser animates them itself.
const NAME_HIDDEN = { opacity: 0, filter: 'blur(8px)', transform: 'scale(1.04)' };
const NAME_SHOWN = { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)', transitionEnd: { filter: 'none' } };

const RESUME_URL = `${import.meta.env.BASE_URL}Rohan_Mukka_Resume.pdf`;

const TextLink = ({ href, children, download }: { href: string; children: React.ReactNode; download?: string }) => (
  <Magnetic
    href={href}
    download={download}
    className="group inline-flex items-center gap-2 py-2 text-xs md:text-sm font-medium uppercase tracking-[0.22em] text-primary-text"
  >
    <span className="relative">
      {children}
      <span className="absolute left-0 -bottom-1 h-px w-full bg-primary-text origin-right scale-x-100 group-hover:scale-x-0 transition-transform duration-500" />
      <span className="absolute left-0 -bottom-1 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
    </span>
    <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45 group-hover:text-accent" />
  </Magnetic>
);

const Corner = ({ className }: { className: string }) => (
  <span className={`absolute w-[18px] h-[18px] border-primary-text/40 ${className}`} aria-hidden="true" />
);

// The hero is the 3D stage itself: the page's data stream flows behind the
// name, framed by viewfinder corners, with a crosshair tracking the cursor.
// It opens with an intro (see HeroIntro): a line of colour widens as the
// page loads, then plates slide apart from it while the stream unfolds out
// of that same line and the name pulls into focus. Scrolling away, the copy
// lifts off ahead of the name while the stream pulls into About's timeline.
const Hero = ({ onIntroDone }: { onIntroDone: () => void }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const nameY = useTransform(p, [0, 1], ['0%', '-35%']);
  const nameFade = useTransform(p, [0.2, 0.75], [1, 0]);
  const copyY = useTransform(p, [0, 1], ['0%', '-120%']);
  const fade = useTransform(p, [0, 0.45], [1, 0]);
  // The top row clears out quickly, before the navbar drops in over it.
  const topFade = useTransform(p, [0, 0.15], [1, 0]);

  const [phase, setPhase] = useState<IntroPhase>('loading');
  const entered = phase === 'open';
  const opening = useCallback(() => {
    setPhase('opening');
    openStage();
  }, []);
  const opened = useCallback(() => {
    setPhase('open');
    onIntroDone();
  }, [onIntroDone]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-chapter="hero"
      // Holding the mouse button pulls the particles harder; the cursor says so.
      data-cursor-hint={isSoftwareRendering() ? undefined : "Hold"}
      className="relative h-[100dvh] min-h-[640px]"
    >
      <div className="relative h-full w-full flex flex-col">
        {/* Without a graphics card there's no 3D stage behind the hero; its
            stream is painted in still. */}
        {isSoftwareRendering() && <LiteStream />}
        <motion.div style={{ opacity: topFade }} className="absolute inset-0 pointer-events-none">
          <Corner className="top-4 md:top-6 left-4 md:left-7 border-t border-l" />
          <Corner className="top-4 md:top-6 right-4 md:right-7 border-t border-r" />
          <Corner className="bottom-4 md:bottom-6 left-4 md:left-7 border-b border-l" />
          <Corner className="bottom-4 md:bottom-6 right-4 md:right-7 border-b border-r" />
        </motion.div>

        <motion.div style={{ opacity: topFade }} className="relative z-[3] px-6 md:px-14 pt-8 md:pt-12">
          <motion.div
            className="hud grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-primary-secondary"
            {...fadeUp(0.15, entered)}
          >
            <span>( Portfolio ©{new Date().getFullYear()} )</span>
            <span className="text-right md:text-center">Software engineer</span>
            <span className="col-span-2 md:col-span-1 md:text-right">
              <span className="text-accent">●</span> Available for work
            </span>
          </motion.div>
        </motion.div>

        <div className="relative z-[1] flex-1 flex flex-col items-center justify-center px-5 md:px-14">
          <motion.div style={{ y: nameY, opacity: nameFade }}>
            <motion.div
              ref={nameRef}
              initial={NAME_HIDDEN}
              animate={phase === 'loading' ? NAME_HIDDEN : NAME_SHOWN}
              transition={INTRO_OPEN}
            >
              <FullWidthName className="items-center text-primary-text text-[calc((100vw-4rem)*0.33)] md:text-[calc((100vw-9rem)*0.165)]" />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: fade, y: copyY }}
          className="relative z-[3] px-6 md:px-14 pb-10 md:pb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <RevealWords
            play={entered}
            className="max-w-[640px] font-display font-semibold text-primary-text text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.05] tracking-[-0.035em]"
            parts={['I build full-stack products and', { em: 'ML systems' }, 'that hold up in production.']}
          />
          <motion.div className="flex flex-wrap md:justify-end gap-x-8 gap-y-2" {...fadeUp(0.35, entered)}>
            <TextLink href="#projects">View work</TextLink>
            <TextLink href="#contact">Get in touch</TextLink>
            <TextLink href={RESUME_URL} download="Rohan_Mukka_Resume.pdf">Resume</TextLink>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ opacity: topFade }}
          className="absolute right-5 md:right-7 top-1/2 -translate-y-1/2 z-[3] hidden md:block"
          aria-hidden="true"
        >
          <motion.div className="flex flex-col items-center gap-3" {...fadeUp(0.6, entered)}>
            <span className="hud text-primary-tertiary [writing-mode:vertical-rl]">Scroll</span>
            <span className="relative block w-px h-10 overflow-hidden bg-primary-text/15">
              <span className="scroll-cue absolute inset-x-0 top-0 h-1/2 bg-accent" />
            </span>
          </motion.div>
        </motion.div>

        <Crosshair area={sectionRef} lineClassName="bg-primary-text/15" labelClassName="text-accent" />
      </div>

      {!entered && <HeroIntro phase={phase} nameRef={nameRef} onReady={opening} onOpened={opened} />}
    </section>
  );
};

export default Hero;
