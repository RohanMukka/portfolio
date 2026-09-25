import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Activity, MousePointer2, Box } from 'lucide-react';

const SystemHUD = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState('HERO');
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      const sections = ['hero', 'architecture', 'projects', 'skills', 'education', 'contact'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            if (currentSection !== section.toUpperCase()) {
              setCurrentSection(section.toUpperCase());
            }
            break;
          }
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [currentSection]);

  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ opacity: 0, x: 20, y: 100 }}
      animate={{ opacity: 1, x: 0, y: 100 }}
      className="fixed top-20 right-6 z-[70] hidden min-[1720px]:block"
    >
      <div className={`glass-card p-2.5 w-44 backdrop-blur-2xl border-accent/20 transition-all duration-300 ${isMinimized ? 'h-9 overflow-hidden' : 'h-auto'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-2 cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <Terminal size={12} className="text-accent" />
            <span className="text-[9px] font-black tracking-widest uppercase text-primary-text opacity-70">Core_Sys_Monitor</span>
          </div>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-2.5 h-2.5 rounded-full bg-accent/20 hover:bg-accent/40 transition-colors"
          />
        </div>

        {/* HUD Content */}
        {!isMinimized && (
          <div className="space-y-1.5 font-mono">
            {/* Live Stats */}
            <div className="grid grid-cols-2 gap-1.5">
              <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[8px] opacity-40 uppercase mb-0.5 flex items-center gap-1">
                  <Activity size={8} /> Status
                </div>
                <div className="text-[10px] text-green-500 font-bold animate-pulse">ACTIVE</div>
              </div>
              <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[8px] opacity-40 uppercase mb-0.5 flex items-center gap-1">
                  <Box size={8} /> Section
                </div>
                <div className="text-[10px] text-primary-text font-bold truncate">{currentSection}</div>
              </div>
            </div>

            {/* Mouse Trace */}
            <div className="px-2 py-1.5 rounded-lg bg-white/5 border border-white/10">
              <div className="text-[8px] opacity-40 uppercase mb-0.5 flex items-center gap-1">
                <MousePointer2 size={8} /> Mouse_Vector
              </div>
              <div className="text-[10px] text-primary-text opacity-80">
                X: {mousePos.x} | Y: {mousePos.y}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Draggable indicator */}
      {!isMinimized && (
        <div className="text-center mt-1">
          <span className="text-[8px] font-bold text-accent opacity-30 uppercase tracking-[0.3em]">Hold to Drag</span>
        </div>
      )}
    </motion.div>
  );
};

export default SystemHUD;
