
import React, { useState, useEffect, useRef } from 'react';
import { personalData, placeholderLottieData, typewriterWords } from './data';

import Navbar from './components/common/Navbar';
import Preloader from './components/common/Preloader';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Experience from './components/sections/Experience';
import Contact from './components/sections/Contact';
import Footer from './components/common/Footer';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const [isDark, setIsDark] = useState(true);

  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  const sectionRefs: Record<string, React.RefObject<HTMLElement>> = {
    home: homeRef,
    about: aboutRef,
    skills: skillsRef,
    projects: projectsRef,
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

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isDark) {
        document.body.classList.add('dark');
        document.body.classList.remove('light');
      } else {
        document.body.classList.add('light');
        document.body.classList.remove('dark');
      }
    }
  }, [isDark]);

  const scrollToSection = (id: string) => {
    const sectionRef = sectionRefs[id];
    if (sectionRef && sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback for safety, though ref method should be primary
      const sectionElement = document.getElementById(id);
      if (sectionElement) {
        sectionElement.scrollIntoView({ behavior: 'smooth'});
      } else {
        console.warn(`scrollToSection: Element or Ref for ID '${id}' not found.`);
      }
    }
  };

  const toggleTheme = () => setIsDark(prev => !prev);

  if (isLoading && typeof window !== 'undefined') { // Ensure window check for SSR safety, though not strictly needed for CSR
    return <Preloader onLoaded={handlePreloaderLoaded} />;
  }

  return (
    <div className="min-h-screen text-inherit selection:bg-purple-500 selection:text-white">
      <Navbar
        setActiveSection={setActiveSection}
        currentSection={activeSection}
        personalData={{name: personalData.name, resumeUrl: personalData.resumeUrl}}
        scrollToSection={scrollToSection}
        toggleTheme={toggleTheme}
        isDark={isDark}
      />
      
      <main>
        <Hero 
            refProp={homeRef} 
            scrollToSection={scrollToSection} 
            personalData={{name: personalData.name, title: personalData.title, resumeUrl: personalData.resumeUrl}} 
            typewriterWords={typewriterWords}
            placeholderLottieData={placeholderLottieData}
        />
        <About refProp={aboutRef} personalData={{name: personalData.name, about: personalData.about, resumeUrl: personalData.resumeUrl}} />
        <Skills refProp={skillsRef} skills={personalData.skills} />
        <Projects refProp={projectsRef} projects={personalData.projects} />
        <Experience refProp={experienceRef} experience={personalData.experience} />
        <Contact refProp={contactRef} personalData={{email: personalData.email, linkedin: personalData.linkedin, github: personalData.github, leetcode: personalData.leetcode, contact: personalData.contact}} />
      </main>
      
      <Footer personalData={{name: personalData.name, github: personalData.github, linkedin: personalData.linkedin, email: personalData.email}} />
    </div>
  );
};

export default App;
