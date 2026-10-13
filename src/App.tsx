import React, { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import Architecture from "./sections/Architecture";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Credentials from "./sections/Credentials";
import FinalCTA from "./sections/FinalCTA";
import ResumeButton from "./components/ResumeButton";
import BackToTop from "./components/BackToTop";
import Stage from "./stage/Stage";
import StageLabels from "./stage/Labels";
import Switcher from "./stage/Switcher";
import { startSmoothScroll } from "./lib/smoothScroll";

const App = () => {
  const [introDone, setIntroDone] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  const finishIntro = useCallback(() => setIntroDone(true), []);

  useEffect(() => {
    // The intro plays in the hero at the top of the page, so always start
    // there rather than at a restored scroll position.
    history.scrollRestoration = "manual";

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setPastHero(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hold the page still while the intro plays, then start smooth scrolling.
  useEffect(() => {
    if (introDone) return startSmoothScroll();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = "";
    };
  }, [introDone]);

  return (
    <div className="bg-transparent text-primary-text relative min-h-screen">
      <Stage />
      <StageLabels />
      <Navbar isScrolled={isScrolled} />

      {/* Fixed UI Elements. They wait until the hero is behind you: the hero
          has its own Resume link, and the big type runs edge to edge. */}
      <div className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] flex flex-col gap-4 items-center transition-all duration-500 ${pastHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
        <BackToTop />
        <ResumeButton isCompact={isScrolled} />
      </div>

      {/* overflow-x-clip, not -hidden: hidden makes <main> a scroll container,
          which silently breaks position: sticky (the pinned About story) inside it. */}
      <main className="relative w-full overflow-x-clip">
        <Hero onIntroDone={finishIntro} />
        <Architecture />
        <Projects />
        <Skills />
        <Credentials />
        <FinalCTA />
        <Footer />
      </main>

      {import.meta.env.DEV && <Switcher />}
    </div>
  );
};

export default App;
