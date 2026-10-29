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
import Cursor from "./components/Cursor";
import Stage from "./stage/Stage";
import StageLabels from "./stage/Labels";
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
      <Cursor />
      <Navbar isScrolled={isScrolled} />

      {/* Fixed UI Elements. They wait until the hero is behind you: the hero
          has its own Resume link, and the big type runs edge to edge. Until
          then they're inert too, so Tab can't land on an invisible button.
          Phones don't get them: there they'd sit on top of the page's own
          buttons and links; the navbar's name goes back to the top and the
          phone menu carries the Resume link. */}
      <div
        inert={!pastHero}
        className={`fixed bottom-10 right-10 z-[60] hidden md:flex flex-col gap-4 items-center transition-all duration-500 ${pastHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}
      >
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
    </div>
  );
};

export default App;
