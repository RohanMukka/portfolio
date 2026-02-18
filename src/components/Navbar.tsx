import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { MousePointer2, ChevronDown, Menu, X as CloseIcon } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavbarProps {
  isScrolled?: boolean;
}

const Navbar = ({ isScrolled = false }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [isNavHovered, setIsNavHovered] = useState(false);
  const [theme, setTheme] = useState('light');
  const [activeTab, setActiveTab] = useState('');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const handleScroll = () => {
      const sections = ['architecture', 'projects', 'skills', 'education', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveTab(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
  };

  const links = [
    { name: 'About', href: '#architecture' },
    { name: 'Work', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Education', href: '#education' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>

      <motion.nav
        className={`fixed top-4 left-0 right-0 z-50 flex justify-center`}
        initial={{ y: -20, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          scale: isNavHovered ? 1.05 : 1 
        }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 25
        }}
        onMouseEnter={() => setIsNavHovered(true)}
        onMouseLeave={() => setIsNavHovered(false)}
      >
        <div
          className={`w-full max-w-5xl transition-all duration-500 bg-glass-bg backdrop-blur-xl rounded-full border border-glass-border shadow-2xl shadow-glass-shadow mx-4 px-6 flex justify-between items-center relative overflow-hidden ${
            isScrolled ? 'py-3' : 'py-5'
          } ${isNavHovered ? 'shadow-accent/20 border-accent/20' : ''}`}
        >
          {/* Scroll Progress Bar */}
          <motion.div 
            className="absolute bottom-0 left-0 h-0.5 bg-accent origin-left w-full"
            style={{ scaleX }}
          />

          <a href="#" className="text-lg font-display font-semibold text-primary-text hover:opacity-80 transition-opacity tracking-tight">
            Rohan Mukka
          </a>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const isActive = activeTab === link.href.replace('#', '');
            return (
              <motion.a
                key={link.name}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${isActive ? 'text-primary-text' : 'text-primary-secondary hover:text-primary-text'}`}
                onMouseEnter={() => setHovered(link.name)}
                onMouseLeave={() => setHovered(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {(hovered === link.name || isActive) && (
                  <motion.span
                    layoutId="nav-item-active"
                    className={`absolute inset-0 border rounded-full -z-10 ${isActive ? 'bg-surface-subtle border-accent/20' : 'bg-surface-subtle/50 border-glass-border'}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                {link.name}
              </motion.a>
            );
          })}
          
          <div className="ml-4 flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>

        {/* Mobile Menu Button Controls */}
        <div className="flex items-center gap-4 md:hidden">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          <button
            type="button"
            className="p-2 text-primary-text"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M3 12h18M3 6h18M3 18h18" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 overflow-hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Background Accent Blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-blue/10 rounded-full blur-[100px]"></div>

            {/* Close Button Header */}
            <div className="absolute top-8 right-8">
              <button 
                onClick={() => setMobileOpen(false)}
                className="p-3 rounded-full bg-surface-subtle text-primary-text border border-glass-border shadow-lg"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col items-center gap-8 w-full max-w-xs">
              {links.map((link, i) => (
                <motion.a 
                  key={link.name} 
                  href={link.href} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + (i * 0.1) }}
                  className="text-4xl font-display font-bold text-primary-text hover:text-accent transition-colors relative group"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="relative z-10">{link.name}</span>
                  <motion.span 
                    className="absolute -bottom-2 left-0 h-1 bg-accent rounded-full -z-10"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                  />
                </motion.a>
              ))}
            </nav>

            <motion.div 
              className="mt-20 flex flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
                <div className="flex items-center gap-4 text-primary-text">
                  <span className="text-sm font-bold uppercase tracking-widest opacity-60">Theme</span>
                  <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                </div>
              <div className="text-xs text-primary-secondary font-medium tracking-wide">
                © {new Date().getFullYear()} ROHAN MUKKA
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
