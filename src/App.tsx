import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './sections/Hero';
import Architecture from './sections/Architecture';
import Projects from './sections/Projects';
import Skills from './sections/Skills';
import Education from './sections/Education';
import FinalCTA from './sections/FinalCTA';
import Loader from './components/Loader';
import ResumeButton from './components/ResumeButton';
import BackToTop from './components/BackToTop';
import CustomCursor, { CursorType } from './components/CustomCursor';
import CursorCustomizer from './components/CursorCustomizer';
import Background from './components/Background';
import TechRibbon from './components/TechRibbon';
import SystemHUD from './components/SystemHUD';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>('default');

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    const savedCursor = localStorage.getItem('cursorType') as CursorType;
    if (savedCursor) setCursorType(savedCursor);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCursorChange = (type: CursorType) => {
    setCursorType(type);
    localStorage.setItem('cursorType', type);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={`bg-transparent text-primary-text relative min-h-screen ${cursorType !== 'default' ? 'cursor-none' : ''}`}>
      <SystemHUD />
      <CustomCursor type={cursorType} />
      <Background />
      <Navbar 
        isScrolled={isScrolled} 
      />
      
      <CursorCustomizer currentType={cursorType} onChange={handleCursorChange} />
      
      {/* Fixed UI Elements */}
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
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
}

export default App;
