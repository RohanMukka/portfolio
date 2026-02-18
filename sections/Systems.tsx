
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, Activity, Zap } from 'lucide-react';

export const Systems: React.FC = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <section id="systems" className="relative py-32 bg-[#0A0A0C]/50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row-reverse gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 text-left"
        >
          <div className="inline-block px-3 py-1 rounded-full border border-[#0050FF]/20 bg-[#0050FF]/5 text-[#00D6FF] text-xs font-bold uppercase tracking-widest mb-6">
            Interactive Systems
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Interfaces that respond.
          </h2>
          <div className="space-y-6 text-white/60 text-lg font-light leading-relaxed max-w-xl">
            <p>
              I build event-driven architectures that feel alive. State management is handled with precision using React Hooks, ensuring a predictable UI.
            </p>
            <p>
              Predictable behavior under user interaction and async data handling are optimized through carefully controlled rendering cycles.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
             {[
               { icon: <Zap size={18} />, label: "Micro-interactions" },
               { icon: <Activity size={18} />, label: "State Synchronization" },
               { icon: <Layers size={18} />, label: "Optimized Rendering" },
             ].map((item, idx) => (
               <div key={idx} className="flex items-center gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <span className="text-[#0050FF]">{item.icon}</span>
                  <span className="text-white/80 text-sm font-medium">{item.label}</span>
               </div>
             ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="md:w-1/2 w-full p-1 border border-white/10 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent"
        >
          <div className="bg-[#050505] rounded-[2.25rem] p-10 h-full flex flex-col items-center justify-center gap-8 min-h-[400px]">
            <span className="text-white/30 text-xs font-bold uppercase tracking-[0.2em]">Live Interaction Demo</span>
            
            <div className="flex flex-col items-center gap-6">
              <motion.button
                onClick={() => setToggle(!toggle)}
                animate={{ 
                  scale: toggle ? 1.05 : 1,
                  backgroundColor: toggle ? '#0050FF' : 'rgba(255,255,255,0.05)'
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-10 py-5 rounded-full border border-white/10 text-white font-semibold transition-colors shadow-2xl"
              >
                {toggle ? 'System Active' : 'Initialize Logic'}
              </motion.button>

              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ 
                      opacity: toggle ? 1 : 0.2,
                      scale: toggle ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.2 }}
                    className="w-2 h-2 rounded-full bg-[#00D6FF]"
                  />
                ))}
              </div>
            </div>

            <motion.div 
              animate={{ opacity: toggle ? 1 : 0.4 }}
              className="text-white/40 text-sm font-mono text-center max-w-xs"
            >
              {toggle 
                ? 'const [state, setState] = useState(true); // Rendering optimized'
                : 'await system.init(); // Ready for input'}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
