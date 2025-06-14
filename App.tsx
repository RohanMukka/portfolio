
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { personalData, typewriterWords } from './data';

import Navbar from './components/common/Navbar';
import Preloader from './components/common/Preloader';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Contact from './components/sections/Contact';
import Footer from './components/common/Footer';
import { Analytics } from '@vercel/analytics/react';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const { theme, toggleTheme } = useTheme();

  const homeRef = useRef<HTMLElement | null>(null);
  const aboutRef = useRef<HTMLElement | null>(null);
  const projectsRef = useRef<HTMLElement | null>(null);
  const skillsRef = useRef<HTMLElement | null>(null);
  const experienceRef = useRef<HTMLElement | null>(null);
  const contactRef = useRef<HTMLElement | null>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLElement | null>> = {
    home: homeRef,
    about: aboutRef,
    projects: projectsRef,
    skills: skillsRef,
    experience: experienceRef,
    contact: contactRef,
  };

  const handlePreloaderLoaded = () => {
    setIsLoading(false);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = isLoading ? 'hidden' : 'auto';
    }

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.4, // When 40% of the section is visible
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRefs = Object.values(sectionRefs)
      .map(ref => ref.current)
      .filter((el): el is HTMLElement => el !== null); // Type guard

    currentRefs.forEach(ref => observer.observe(ref));

    return () => {
      currentRefs.forEach(ref => {
        if (ref) observer.unobserve(ref);
      });
      if (typeof document !== 'undefined') {
        document.body.style.overflow = 'auto'; // Ensure overflow is reset on unmount
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]); // Re-run when isLoading changes to attach observer after preloader


  const scrollToSection = (id: string) => {
    const sectionRef = sectionRefs[id];
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
      setActiveSection(id); // Immediately highlight the target nav item
    } else {
      // Fallback for safety, though ref method should be primary
      const sectionElement = document.getElementById(id);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth'});
        setActiveSection(id); // Ensure state updates even with fallback
      } else {
        console.warn(`scrollToSection: Element or Ref for ID '${id}' not found.`);
      }
    }
  };



  if (isLoading && typeof window !== 'undefined') { // Ensure window check for SSR safety, though not strictly needed for CSR
    return <Preloader onLoaded={handlePreloaderLoaded} />;
  }

  return (
    <div className="min-h-screen text-inherit selection:bg-purple-600 selection:text-white">
      <Navbar
        currentSection={activeSection}
        personalData={{name: personalData.name, resumeUrl: personalData.resumeUrl}}
        scrollToSection={scrollToSection}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main>
        <Hero 
            refProp={homeRef} 
            scrollToSection={scrollToSection} 
            personalData={{name: personalData.name, title: personalData.title, resumeUrl: personalData.resumeUrl}} 
            typewriterWords={typewriterWords}
        />
        <About refProp={aboutRef} personalData={{name: personalData.name, about: personalData.about, resumeUrl: personalData.resumeUrl}} />
        <Projects refProp={projectsRef} projects={personalData.projects} />
        <Skills refProp={skillsRef} skills={personalData.skills} />
        <Experience refProp={experienceRef} experience={personalData.experience} />
        <Contact refProp={contactRef} personalData={{email: personalData.email, linkedin: personalData.linkedin, github: personalData.github, leetcode: personalData.leetcode, contact: personalData.contact}} />
      </main>
      
      <Footer personalData={{name: personalData.name, github: personalData.github, linkedin: personalData.linkedin, email: personalData.email}} />
      <Analytics />
    </div>
  );
};

export default App;
