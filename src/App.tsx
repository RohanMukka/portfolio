import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import Architecture from "./sections/Architecture";
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
import { startAmbient } from "./lib/ambient";

const App = () => {
  const [booting, setBooting] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const stopAmbient = startAmbient();

    // The loader is an overlay over already-rendered content, not a gate in
    // front of it, so the real hero is what gets measured as the largest paint.
    // It leaves as soon as webfonts settle, with a hard ceiling so a slow font
    // CDN can never hold the page.
    let done = false;
    const dismiss = () => {
      if (done) return;
      done = true;
      setBooting(false);
    };
    const ceiling = window.setTimeout(dismiss, 900);
    document.fonts?.ready.then(dismiss).catch(dismiss);

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      stopAmbient();
      window.clearTimeout(ceiling);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-transparent text-primary-text relative min-h-screen">
      <Loader done={!booting} />
      <Background />
      <Navbar isScrolled={isScrolled} />

      <div className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[60] flex flex-col gap-4 items-center">
        <BackToTop />
        <ResumeButton isCompact={isScrolled} />
      </div>

      <main className="relative w-full overflow-x-hidden">
        <Hero />
        <TechRibbon />
        <Architecture />
        <Projects />
        <Skills />
        <Education />
        <Certifications />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
};

export default App;
