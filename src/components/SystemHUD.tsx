import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Activity, MousePointer2, Box } from 'lucide-react';

const SystemHUD = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentSection, setCurrentSection] = useState('HERO');
  const [logs, setLogs] = useState<string[]>(['SYSTEM_INIT // 200 OK', 'LOAD_ASSETS // COMPLETE']);
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
              addLog(`NAV_TO: ${section.toUpperCase()}`);
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

  const addLog = (message: string) => {
    setLogs(prev => [message, ...prev.slice(0, 4)]);
  };

  return (
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ opacity: 0, x: 20, y: 100 }}
      animate={{ opacity: 1, x: 0, y: 100 }}
      className="fixed top-20 right-6 z-[70] hidden md:block"
    >
      <div className={`glass-card p-4 w-64 backdrop-blur-2xl border-accent/20 transition-all duration-300 ${isMinimized ? 'h-12 overflow-hidden' : 'h-auto'}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 cursor-grab active:cursor-grabbing">
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-accent" />
            <span className="text-[10px] font-black tracking-widest uppercase text-primary-text opacity-70">Core_Sys_Monitor</span>
          </div>
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="w-3 h-3 rounded-full bg-accent/20 hover:bg-accent/40 transition-colors"
          />
        </div>

        {/* HUD Content */}
        {!isMinimized && (
          <div className="space-y-4 font-mono">
            {/* Live Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[8px] opacity-40 uppercase mb-1 flex items-center gap-1">
                  <Activity size={8} /> Status
                </div>
                <div className="text-[10px] text-green-500 font-bold animate-pulse">ACTIVE</div>
              </div>
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <div className="text-[8px] opacity-40 uppercase mb-1 flex items-center gap-1">
                  <Box size={8} /> Section
                </div>
                <div className="text-[10px] text-primary-text font-bold truncate">{currentSection}</div>
              </div>
            </div>

            {/* Mouse Trace */}
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="text-[8px] opacity-40 uppercase mb-1 flex items-center gap-1">
                <MousePointer2 size={8} /> Mouse_Vector
              </div>
              <div className="text-[10px] text-primary-text opacity-80">
                X: {mousePos.x} | Y: {mousePos.y}
              </div>
            </div>

            {/* Live Logs */}
            <div className="space-y-1 mt-4 border-t border-white/10 pt-4">
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div
                    key={`${log}-${i}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-[9px] text-accent font-bold opacity-60 leading-none"
                  >
                    {`> ${log}`}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
      
      {/* Draggable indicator */}
      {!isMinimized && (
        <div className="text-center mt-2">
          <span className="text-[8px] font-bold text-accent opacity-30 uppercase tracking-[0.3em]">Hold to Drag</span>
        </div>
      )}
    </motion.div>
  );
};

export default SystemHUD;
