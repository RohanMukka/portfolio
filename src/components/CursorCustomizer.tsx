import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, X, Sparkles } from 'lucide-react';
import { CursorType } from './CustomCursor';

interface CursorCustomizerProps {
  currentType: CursorType;
  onChange: (type: CursorType) => void;
}

const CursorCustomizer = ({ currentType, onChange }: CursorCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [onHero, setOnHero] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Show widget only while the Hero section is visible (show when scrolled back up too)
  useEffect(() => {
    const hero = document.getElementById('hero');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOnHero(entry.isIntersecting);
        // Auto-close panel if user scrolls away
        if (!entry.isIntersecting) setIsOpen(false);
      },
      { threshold: 0.1 } // show as soon as 10% of hero is back in view
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Show a one-time hint tooltip to draw attention on first visit
  useEffect(() => {
    const alreadySeen = localStorage.getItem('cursorHintSeen');
    if (!alreadySeen) {
      const delay = setTimeout(() => {
        setShowHint(true);
        const hide = setTimeout(() => {
          setShowHint(false);
          localStorage.setItem('cursorHintSeen', '1');
        }, 4000);
        return () => clearTimeout(hide);
      }, 2800); // fires just after loader disappears
      return () => clearTimeout(delay);
    }
  }, []);

  // Click-outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      setShowHint(false);
      localStorage.setItem('cursorHintSeen', '1');
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const cursors: { id: CursorType; label: string; icon: string }[] = [
    { id: 'ring', label: 'Classic Ring', icon: '⭕' },
    { id: 'glow', label: 'Soft Glow', icon: '✨' },
    { id: 'minimal', label: 'Minimal Dot', icon: '•' },
    { id: 'ghost', label: 'Ghost Trail', icon: '👻' },
    { id: 'default', label: 'System', icon: '🖱️' },
  ];

  return (
    // Hidden on mobile — custom cursors don't work on touch devices
    <div className="hidden md:block fixed bottom-10 left-10 z-[60]">
      <AnimatePresence>
        {onHero && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
          >
            {/* One-time hint bubble */}
            <AnimatePresence>
              {showHint && !isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -12, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -12, scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className="absolute bottom-16 left-0 mb-3 whitespace-nowrap"
                >
                  <div className="flex items-center gap-2 bg-accent text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg shadow-accent/30">
                    <Sparkles size={13} />
                    <span>Customize your cursor!</span>
                  </div>
                  {/* Arrow pointing down toward the button */}
                  <div
                    className="w-3 h-3 bg-accent rotate-45 ml-5 -mt-1.5 rounded-sm"
                    style={{ boxShadow: '2px 2px 6px rgba(0,0,0,0.15)' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cursor style panel */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
                  className="absolute bottom-16 left-0 mb-4 w-60 bg-bg-elevated/95 backdrop-blur-2xl border border-glass-border rounded-[2.5rem] shadow-2xl p-5 overflow-hidden ring-1 ring-black/5"
                >
                  <div className="flex items-center justify-between mb-4 px-2">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary-secondary">Cursor Style</span>
                    <button onClick={() => setIsOpen(false)} className="text-primary-secondary hover:text-primary-text transition-colors">
                      <X size={16} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {cursors.map((cursor) => (
                      <button
                        key={cursor.id}
                        onClick={() => onChange(cursor.id)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                          currentType === cursor.id
                            ? 'bg-accent text-white shadow-lg shadow-accent/25'
                            : 'bg-surface-subtle hover:bg-accent/10 text-primary-text border border-glass-border hover:border-accent/30'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl group-hover:scale-110 transition-transform">{cursor.icon}</span>
                          <span className={`text-sm font-bold ${currentType === cursor.id ? 'text-white' : 'text-primary-text group-hover:text-accent'}`}>
                            {cursor.label}
                          </span>
                        </div>
                        {currentType === cursor.id && (
                          <motion.div layoutId="cursor-active-check" className="w-2 h-2 rounded-full bg-white shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle button with attention ping ring */}
            <div className="relative">
              {/* Pulsing attention ring — only when panel is closed */}
              {!isOpen && (
                <>
                  <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping pointer-events-none" />
                  <span className="absolute inset-0 rounded-full bg-accent/10 pointer-events-none" />
                </>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(!isOpen)}
                title="Customize cursor"
                className={`relative p-4 rounded-full shadow-2xl transition-all border ${
                  isOpen
                    ? 'bg-accent text-white border-accent'
                    : 'bg-glass-bg backdrop-blur-xl text-primary-text border-glass-border hover:border-accent/40 shadow-glass-shadow'
                }`}
              >
                <MousePointer2 size={24} className={isOpen ? 'rotate-12 transition-transform' : 'transition-transform'} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CursorCustomizer;
