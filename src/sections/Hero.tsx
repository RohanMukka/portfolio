import React, { useCallback, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Crosshair from './hero/Crosshair';
import FullWidthName from './hero/FullWidthName';
import GradientField from './hero/GradientField';
import HeroIntro, { INTRO_OPEN, type IntroPhase } from './hero/HeroIntro';
import { Magnetic, RevealWords, fadeUp } from './hero/shared';

// The name while the intro plays, and as it pulls into focus. Plain opacity,
// transform and filter values, so the browser animates them itself.
const NAME_HIDDEN = { opacity: 0, filter: 'blur(8px)', transform: 'scale(1.04)' };
const NAME_SHOWN = { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)', transitionEnd: { filter: 'none' } };

const RESUME_URL = `${import.meta.env.BASE_URL}Rohan_Mukka_Resume.pdf`;

const TextLink = ({ href, children, download }: { href: string; children: React.ReactNode; download?: string }) => (
  <Magnetic
    href={href}
    download={download}
    className="group inline-flex items-center gap-2 py-2 text-xs md:text-sm font-medium uppercase tracking-[0.22em] text-white"
  >
    <span className="relative">
      {children}
      <span className="absolute left-0 -bottom-1 h-px w-full bg-white origin-right scale-x-100 group-hover:scale-x-0 transition-transform duration-500" />
      <span className="absolute left-0 -bottom-1 h-px w-full bg-[#ffb38a] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
    </span>
    <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45 group-hover:text-[#ffb38a]" />
  </Magnetic>
);

const Corner = ({ className }: { className: string }) => (
  <span className={`absolute w-[18px] h-[18px] border-white/45 ${className}`} aria-hidden="true" />
);

// The hero is a rounded panel of drifting colour with the name huge in the
// middle and a crosshair tracking the cursor. It opens with an intro (see
// HeroIntro): a line of colour that widens as the page loads, then plates
// slide apart from it to uncover the panel as the name pulls into focus,
// before the details settle in.
// Scrolling away, the panel tips back in 3D, as if laying down onto the grid
// floor behind the page.
const Hero = ({ onIntroDone }: { onIntroDone: () => void }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const panelScale = useTransform(p, [0, 1], [1, 0.9]);
  const panelTilt = useTransform(p, [0, 1], [0, 16]);
  const fade = useTransform(p, [0, 0.6], [1, 0]);
  // The top row clears out quickly, before the navbar drops in over it.
  const topFade = useTransform(p, [0, 0.15], [1, 0]);

  const [phase, setPhase] = useState<IntroPhase>('loading');
  const entered = phase === 'open';
  const opening = useCallback(() => setPhase('opening'), []);
  const opened = useCallback(() => {
    setPhase('open');
    onIntroDone();
  }, [onIntroDone]);

  return (
    <section ref={sectionRef} id="hero" className="relative h-[100dvh] min-h-[640px] p-2.5 md:p-3.5">
      <motion.div
        ref={panelRef}
        data-nav-light
        style={{ scale: panelScale, rotateX: panelTilt, originY: 1, transformPerspective: 1400 }}
        className="relative h-full w-full overflow-hidden rounded-[22px] md:rounded-[28px] text-white flex flex-col"
      >
        <GradientField />

        <Corner className="top-4 md:top-6 left-4 md:left-7 border-t border-l" />
        <Corner className="top-4 md:top-6 right-4 md:right-7 border-t border-r" />
        <Corner className="bottom-4 md:bottom-6 left-4 md:left-7 border-b border-l" />
        <Corner className="bottom-4 md:bottom-6 right-4 md:right-7 border-b border-r" />

        <motion.div style={{ opacity: topFade }} className="relative z-[3] px-6 md:px-14 pt-8 md:pt-12">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 text-[10px] md:text-[11px] font-medium uppercase tracking-[0.22em] text-white/75"
            {...fadeUp(0.15, entered)}
          >
            <span>( Portfolio ©{new Date().getFullYear()} )</span>
            <span className="text-right md:text-center">Software Engineer</span>
            <span className="col-span-2 md:col-span-1 md:text-right">
              <span className="text-[#ffb38a]">●</span> Available for work
            </span>
          </motion.div>
        </motion.div>

        <div className="relative z-[1] flex-1 flex flex-col items-center justify-center px-5 md:px-14">
          <motion.div
            ref={nameRef}
            initial={NAME_HIDDEN}
            animate={phase === 'loading' ? NAME_HIDDEN : NAME_SHOWN}
            transition={INTRO_OPEN}
          >
            <FullWidthName className="items-center text-white text-[calc((100vw-4rem)*0.33)] md:text-[calc((100vw-9rem)*0.165)]" />
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: fade }}
          className="relative z-[3] px-6 md:px-14 pb-8 md:pb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <RevealWords
            play={entered}
            className="max-w-[640px] font-display font-semibold text-[clamp(1.5rem,2.4vw,2.25rem)] leading-[1.05] tracking-[-0.035em]"
            emClassName="text-[#ffd2b8]"
            parts={['I build full-stack products and', { em: 'ML systems' }, 'that hold up in production.']}
          />
          <motion.div className="flex flex-wrap md:justify-end gap-x-8 gap-y-2" {...fadeUp(0.35, entered)}>
            <TextLink href="#projects">View work</TextLink>
            <TextLink href="#contact">Get in touch</TextLink>
            <TextLink href={RESUME_URL} download="Rohan_Mukka_Resume.pdf">Resume</TextLink>
          </motion.div>
        </motion.div>

        <Crosshair area={panelRef} lineClassName="bg-white/25" labelClassName="text-[#ffb38a]" />
      </motion.div>

      {!entered && <HeroIntro phase={phase} nameRef={nameRef} onReady={opening} onOpened={opened} />}
    </section>
  );
};

export default Hero;
