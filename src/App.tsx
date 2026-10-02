import React, { useState, useEffect, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import Architecture from "./sections/Architecture";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import Education from "./sections/Education";
import Certifications from "./sections/Certifications";
import FinalCTA from "./sections/FinalCTA";
import Loader from "./components/Loader";
import ResumeButton from "./components/ResumeButton";
import BackToTop from "./components/BackToTop";
import Stage from "./stage/Stage";
import SystemHUD from "./components/SystemHUD";
import { startSmoothScroll } from "./lib/smoothScroll";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [overHero, setOverHero] = useState(true);

  const finishIntro = useCallback(() => setLoading(false), []);

  useEffect(() => {
    // The intro hands its letters to the hero at the top of the page, so
    // always start there rather than at a restored scroll position.
    history.scrollRestoration = "manual";

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setPastHero(window.scrollY > window.innerHeight * 0.6);
      // The navbar turns frosted white while it floats over the hero panel.
      const hero = document.getElementById("hero");
      const heroHeight = hero ? hero.offsetHeight : window.innerHeight;
      setOverHero(window.scrollY < heroHeight - 110);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Start after the loader so Lenis measures the real page, not the splash.
  useEffect(() => {
    if (!loading) return startSmoothScroll();
  }, [loading]);

  return (
    <>
    {/* AnimatePresence keeps the intro mounted for one more render as it
        leaves, which lets framer-motion measure its letters and fly them
        into the hero's matching layoutIds. */}
    <AnimatePresence>
      {loading && (
        <div key="intro">
          <Loader onDone={finishIntro} />
        </div>
      )}
    </AnimatePresence>
    {!loading && (
    <div className="bg-transparent text-primary-text relative min-h-screen">
      <SystemHUD />
      <Stage />
      <Navbar isScrolled={isScrolled} overHero={overHero} />

      {/* Fixed UI Elements. They wait until the hero is behind you: the hero
          has its own Resume link, and the big type runs edge to edge. */}
      <div className={`fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] flex flex-col gap-4 items-center transition-all duration-500 ${pastHero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6 pointer-events-none'}`}>
        <BackToTop />
        <ResumeButton isCompact={isScrolled} />
      </div>

      {/* overflow-x-clip, not -hidden: hidden makes <main> a scroll container,
          which silently breaks position: sticky (the pinned hero) inside it. */}
      <main className="relative w-full overflow-x-clip">
        <Hero />
        <Architecture />
        {/* <Experience /> */}
        <Projects />
        <Skills />
        <Education />
        <Certifications />
        <FinalCTA />
        <Footer />
      </main>
    </div>
    )}
    </>
  );
};

export default App;
