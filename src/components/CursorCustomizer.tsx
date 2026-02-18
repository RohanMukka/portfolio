import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MousePointer2, Settings2, X } from 'lucide-react';
import { CursorType } from './CustomCursor';

interface CursorCustomizerProps {
  currentType: CursorType;
  onChange: (type: CursorType) => void;
}

const CursorCustomizer = ({ currentType, onChange }: CursorCustomizerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const cursors: { id: CursorType; label: string; icon: string }[] = [
    { id: 'ring', label: 'Classic Ring', icon: '⭕' },
    { id: 'glow', label: 'Soft Glow', icon: '✨' },
    { id: 'minimal', label: 'Minimal Dot', icon: '•' },
    { id: 'ghost', label: 'Ghost Trail', icon: '👻' },
    { id: 'default', label: 'System', icon: '🖱️' },
  ];

  return (
    <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[60]" ref={menuRef}>
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
                  onClick={() => {
                    onChange(cursor.id);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    currentType === cursor.id 
                    ? 'bg-accent text-white shadow-lg shadow-accent/25' 
                    : 'bg-surface-subtle hover:bg-accent/10 text-primary-text border border-glass-border hover:border-accent/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl group-hover:scale-110 transition-transform">{cursor.icon}</span>
                    <span className={`text-sm font-bold ${currentType === cursor.id ? 'text-white' : 'text-primary-text group-hover:text-accent'}`}>{cursor.label}</span>
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

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-4 rounded-full shadow-2xl transition-all border ${
          isOpen 
          ? 'bg-accent text-white border-accent' 
          : 'bg-glass-bg backdrop-blur-xl text-primary-text border-glass-border hover:border-accent/40 shadow-glass-shadow'
        }`}
      >
        <MousePointer2 size={24} className={isOpen ? 'rotate-12' : ''} />
      </motion.button>
    </div>
  );
};

export default CursorCustomizer;
