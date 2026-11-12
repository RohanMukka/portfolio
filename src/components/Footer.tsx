import { ArrowDown, ArrowUp, ArrowUpRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { CardKind } from "./FooterCards";
import { RESUME_FILE, RESUME_URL } from "../lib/resume";
import { GITHUB_URL, LINKEDIN_URL } from "../lib/contact";
import { DEVPOST } from "../sections/about/content";
import { scrollToTop, scrollToY } from "../lib/smoothScroll";
import { setXRayOpen } from "../lib/xray";
import { useMotionPaused } from "../lib/motion";
import { cachedViews, loadViews } from "../lib/views";

// The live cards (and the calendar library they bring) load on first hover.
const FooterCard = lazy(() => import("./FooterCards"));

// Where else to find the work, in words (recruiters scan text, not icons).
// The page's own sections aren't listed again: the navbar is still on screen.
const LINKS: { name: string; href: string; card?: CardKind }[] = [
  { name: "GitHub", href: GITHUB_URL, card: "github" },
  { name: "LinkedIn", href: LINKEDIN_URL },
  { name: "Devpost", href: DEVPOST },
  { name: "LeetCode", href: "https://leetcode.com/u/rohan_mukka/", card: "leetcode" },
  { name: "Monkeytype", href: "https://monkeytype.com/profile/kunnu", card: "monkeytype" },
  { name: "Source", href: "https://github.com/RohanMukka/portfolio" },
];

const LINK = "group inline-flex items-center gap-1.5 py-2 text-sm font-medium text-primary-text hover:text-accent transition-colors";
const ARROW = "text-primary-tertiary group-hover:text-accent transition-all duration-300";

// A profile link. One with a card shows it just above the link, centred on
// it (kept on screen near the page's edges), while a mouse is over the link
// or the keyboard is on it. Nothing of the card is fetched until the first
// time that happens, and never for a finger: a tap follows the link.
const CARD_WIDTH = 450;
const ProfileLink = ({ name, href, card }: (typeof LINKS)[number]) => {
  const [wanted, setWanted] = useState(false);
  const [left, setLeft] = useState(0);
  const want = (li: HTMLLIElement) => {
    const { left: x, width } = li.getBoundingClientRect();
    const centred = x + width / 2 - CARD_WIDTH / 2;
    setLeft(Math.max(16, Math.min(centred, window.innerWidth - CARD_WIDTH - 16)) - x);
    setWanted(true);
  };
  return (
    <li
      className="group/card relative"
      onPointerEnter={card ? (e) => e.pointerType === "mouse" && want(e.currentTarget) : undefined}
      onFocus={card ? (e) => want(e.currentTarget) : undefined}
    >
      <a href={href} target="_blank" rel="noopener noreferrer" className={LINK}>
        {name}
        <ArrowUpRight size={14} className={`${ARROW} group-hover:translate-x-0.5 group-hover:-translate-y-0.5`} aria-hidden="true" />
      </a>
      {card && wanted && (
        <div style={{ left, width: CARD_WIDTH }} className="hidden md:block absolute bottom-full z-50 pb-2 pointer-events-none opacity-0 invisible translate-y-2 transition-all duration-300 group-hover/card:opacity-100 group-hover/card:visible group-hover/card:translate-y-0 group-focus-within/card:opacity-100 group-focus-within/card:visible group-focus-within/card:translate-y-0">
          <Suspense fallback={null}>
            <FooterCard kind={card} />
          </Suspense>
        </div>
      )}
    </li>
  );
};

// The page's view count, as a command to run: press it and it prints.
// Hidden until the count is known (it's never guessed).
const Views = () => {
  const [count, setCount] = useState(cachedViews);
  const [shown, setShown] = useState(false);
  const box = useRef<HTMLButtonElement>(null);
  // The printed line makes the box taller; if that pushes it under the
  // bottom of the screen, the page follows it down.
  const follow = () => {
    const under = (box.current?.getBoundingClientRect().bottom ?? 0) + 24 - window.innerHeight;
    if (shown && under > 0) scrollToY(Math.min(window.scrollY + under, document.documentElement.scrollHeight - window.innerHeight));
  };
  // The cursors stop blinking while the visitor has paused motion.
  const still = useMotionPaused();
  useEffect(() => {
    loadViews().then((n) => n !== null && setCount(n));
  }, []);
  if (count === null) return null;

  const cursor = (
    <motion.span
      animate={{ opacity: still ? 1 : [1, 0, 1] }}
      transition={still ? { duration: 0.2 } : { repeat: Infinity, duration: 0.8 }}
      className="inline-block w-2 h-3.5 bg-green-500"
      aria-hidden="true"
    />
  );
  return (
    <button
      ref={box}
      type="button"
      onClick={() => setShown((on) => !on)}
      aria-expanded={shown}
      aria-label={shown ? `${count.toLocaleString()} page views. Hide` : "Show this page's view count"}
      className="group block w-56 p-4 text-left font-mono text-xs rounded-lg border border-glass-border hover:border-accent/50 transition-colors"
    >
      <span className="flex items-center gap-2">
        <span className="text-accent">~/site</span>
        <span className="text-primary-text">$</span>
        <span className="text-primary-secondary group-hover:text-primary-text transition-colors">./get_views</span>
        {!shown && cursor}
      </span>
      <AnimatePresence initial={false}>
        {shown && (
          <motion.span
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 12 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            onAnimationComplete={follow}
            className="flex items-center gap-2 overflow-hidden"
          >
            <span className="text-accent font-bold">{">"}</span>
            <span className="font-bold text-primary-text tracking-wider tabular-nums">{count.toLocaleString()}</span>
            <span className="text-primary-secondary tracking-widest text-[10px] uppercase">views</span>
            {cursor}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

const Footer = () => {
  return (
    <footer id="footer" className="relative pt-16 md:pt-24 pb-8 md:pb-10">
      <div className="px-6 md:px-14">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-10 pb-6 md:pb-8 border-b border-primary-text/10">
          <p className="hud text-primary-tertiary">AI / ML engineer</p>
          <nav aria-label="Profiles and files">
            <ul className="flex flex-wrap gap-x-7 md:gap-x-8 gap-y-1">
              {LINKS.map((link) => (
                <React.Fragment key={link.name}>
                  <ProfileLink {...link} />
                </React.Fragment>
              ))}
              <li>
                <a href={RESUME_URL} download={RESUME_FILE} className={LINK}>
                  Resume
                  <ArrowDown size={14} className={`${ARROW} group-hover:translate-y-0.5`} aria-hidden="true" />
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="pt-5 md:pt-6 grid grid-cols-1 md:grid-cols-3 items-center gap-4 md:gap-10 text-xs text-primary-secondary">
          <div className="space-y-1.5">
            <p>© {new Date().getFullYear()} Rohan Mukka</p>
            <p>
              Built with React and three.js. The 3D draws only while something changes.{" "}
              <button
                type="button"
                onClick={() => setXRayOpen(true)}
                className="font-medium text-primary-text underline underline-offset-4 decoration-primary-text/30 hover:text-accent hover:decoration-accent transition-colors"
              >
                Open X-Ray
              </button>
            </p>
          </div>
          <div className="md:justify-self-center">
            <Views />
          </div>
          <button type="button" onClick={scrollToTop} className="group justify-self-start md:justify-self-end inline-flex items-center gap-1.5 py-2 font-medium text-primary-text hover:text-accent transition-colors">
            Back to top
            <ArrowUp size={13} className={`${ARROW} group-hover:-translate-y-0.5`} aria-hidden="true" />
          </button>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
