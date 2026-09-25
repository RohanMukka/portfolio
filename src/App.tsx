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
import Background from "./components/Background";
import TechRibbon from "./components/TechRibbon";
import SystemHUD from "./components/SystemHUD";
import DemoSwitcher from "./components/DemoSwitcher";
import { startSmoothScroll } from "./lib/smoothScroll";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  const finishIntro = useCallback(() => setLoading(false), []);

  useEffect(() => {
    // The intro hands its letters to the hero at the top of the page, so
    // always start there rather than at a restored scroll position.
    history.scrollRestoration = "manual";

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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
      <Background />
      <Navbar isScrolled={isScrolled} />
      {/* Local review only: never shipped in a production build. */}
      {import.meta.env.DEV && <DemoSwitcher />}

      {/* Fixed UI Elements */}
      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] flex flex-col gap-4 items-center">
        <BackToTop />
        <ResumeButton isCompact={isScrolled} />
      </div>

      {/* overflow-x-clip, not -hidden: hidden makes <main> a scroll container,
          which silently breaks position: sticky (the pinned hero) inside it. */}
      <main className="relative w-full overflow-x-clip">
        <Hero />
        <TechRibbon />
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
