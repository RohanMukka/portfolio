
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="overview" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 pt-20">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-30 pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          className="w-[800px] h-[800px] rounded-full border border-white/[0.03] flex items-center justify-center"
        >
          <div className="w-[500px] h-[500px] rounded-full border border-white/[0.05]" />
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-[#0050FF]/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-sm font-medium text-white/70">Available for new opportunities</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-6 leading-[1.1]">
            Rohan Mukka <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
              Full Stack Developer
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-white/60 font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            Building decentralized systems, AI-powered applications, and intuitive web interfaces with precision and performance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#projects" 
              className="px-8 py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              View Projects
            </a>
            <a 
              href="#contact" 
              className="px-8 py-4 rounded-full border border-white/10 bg-white/5 text-white font-medium hover:bg-white/10 transition-all duration-300"
            >
              Contact Me
            </a>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-white/30">
             {/* Simple tech stack logos or icons could go here */}
             <div className="flex flex-col items-center gap-1">
                <span className="text-xs tracking-wider uppercase">Specializing in</span>
                <div className="flex gap-4 text-sm font-medium text-white/50">
                   <span>Web3</span>
                   <span>•</span>
                   <span>AI/ML</span>
                   <span>•</span>
                   <span>Full Stack</span>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/30 text-[10px] uppercase tracking-widest font-bold">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={20} className="text-white/20" />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};
