
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { NavbarProps } from '../../types';

const NAV_ITEMS = ["Home", "About", "Projects", "Skills", "Experience", "Contact"];


const Navbar: React.FC<NavbarProps> = ({ currentSection, personalData, scrollToSection, theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    scrollToSection(id.toLowerCase());
    setIsOpen(false); // Close mobile menu on item click
  };

  const navLinkClasses = (item: string) =>
    `text-gray-800 dark:text-gray-300 hover:text-purple-600 dark:hover:text-pink-400 transition-colors duration-200 relative group ${currentSection === item.toLowerCase() ? 'text-purple-600 dark:text-pink-400 font-semibold' : ''}`;
  
  const activeIndicator = (item: string) =>
    currentSection === item.toLowerCase() && (
      <motion.div
        layoutId="activePill"
        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"
        initial={false}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      />
    );

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen ? 'bg-white/30 dark:bg-[#0A0A14]/50 backdrop-blur-lg shadow-xl py-4' : 'bg-transparent py-6'}`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        <motion.div
          className="text-3xl font-bold text-gray-900 dark:text-white cursor-pointer"
          onClick={() => handleNavClick('home')}
          whileHover={{ scale: 1.05, color: '#000000' }}
          data-cursor-hover-link
        >
          {personalData.name.split(' ')[0]}
          <span className="text-purple-600 dark:text-pink-400">.</span>
        </motion.div>
        
        <div className="hidden md:flex space-x-8 items-center">
          {NAV_ITEMS.map((item) => (
            <motion.button
              key={item}
              onClick={() => handleNavClick(item)}
              className={navLinkClasses(item)}
              whileHover={{ y: -2 }}
              whileTap={{ y: 0 }}
              data-cursor-hover-link
            >
              {item}
              {activeIndicator(item)}
            </motion.button>
          ))}
          <motion.a
            href={personalData.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold px-5 py-2.5 rounded-lg shadow-lg hover:shadow-pink-500/50 transition-all duration-300 transform hover:scale-105"
            whileHover={{ boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.6)" }}
            data-cursor-hover-link
          >
            Resume
          </motion.a>
          <button
            onClick={toggleTheme}
            className="text-gray-800 dark:text-gray-300 hover:text-purple-600 dark:hover:text-pink-400 focus:outline-none"
            aria-label="Toggle theme"
            data-cursor-hover-link
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-900 dark:text-white focus:outline-none z-50"
            data-cursor-hover-link
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0, transition: { duration: 0.3 } }} 
            transition={{ duration: 0.4, ease: "easeInOut" }} 
            className="md:hidden absolute top-full left-0 right-0 bg-white/80 dark:bg-[#0A0A14]/90 backdrop-blur-lg shadow-2xl border-t border-gray-700/50"
          >
            <div className="flex flex-col items-center py-6 space-y-5">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => handleNavClick(item)}
                  className={`text-xl py-2 ${navLinkClasses(item)}`}
                  data-cursor-hover-link
                >
                  {item}
                </button>
              ))}
              <motion.a
                href={personalData.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-semibold px-8 py-3 rounded-lg shadow-md mt-3 text-lg"
                data-cursor-hover-link
              >
                Resume
              </motion.a>
              <button
                onClick={toggleTheme}
                className="text-gray-800 dark:text-gray-300 hover:text-purple-600 dark:hover:text-pink-400 focus:outline-none"
                aria-label="Toggle theme"
                data-cursor-hover-link
              >
                {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
