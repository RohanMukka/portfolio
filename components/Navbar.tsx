
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Menu, X } from 'lucide-react';

interface NavbarProps {
  isScrolled: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', href: '#overview' },
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <nav className={`
        pointer-events-auto
        flex items-center gap-1 p-2 rounded-full
        border border-white/10 bg-white/5 backdrop-blur-md shadow-lg shadow-black/20
        transition-all duration-300
        ${isScrolled ? 'scale-100 opacity-100' : 'scale-105 opacity-100'}
      `}>
        {/* Logo Icon */}
        <a href="#" className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
          <span className="font-bold text-lg">R</span>
        </a>

        {/* Separator */}
        <div className="w-px h-6 bg-white/10 mx-2 hidden md:block"></div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              className="px-4 py-2 text-sm text-white/60 hover:text-white font-medium rounded-full hover:bg-white/5 transition-all"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden p-2 text-white/90 hover:bg-white/10 rounded-full transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Action Button */}
        <a 
            href="https://github.com/RohanMukka" 
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-[#0050FF] text-white hover:bg-[#003dc2] transition-colors ml-1"
            title="View GitHub"
        >
            <Github size={18} />
        </a>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="absolute top-20 left-6 right-6 p-4 rounded-2xl border border-white/10 bg-[#0A0A0C]/95 backdrop-blur-xl shadow-2xl pointer-events-auto md:hidden"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-3 text-white/60 text-lg font-medium hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
