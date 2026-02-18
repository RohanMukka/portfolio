
import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="relative py-32 px-6 overflow-hidden bg-[#050505]">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0050FF]/5 to-transparent pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            Engineering clarity into <br />every interface.
          </h2>
          <p className="text-xl md:text-2xl text-white/50 font-light mb-12">
            Focused. Structured. Production-ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20">
            <a 
              href="https://github.com/RohanMukka" 
              target="_blank"
              rel="noopener noreferrer"
              className="group w-full sm:w-auto px-10 py-5 rounded-full bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-white/90 transition-all duration-300"
            >
              <Github size={20} />
              <span>View GitHub</span>
            </a>
            <a 
              href="https://www.linkedin.com/in/rohanmukka" 
              className="group w-full sm:w-auto px-10 py-5 rounded-full border border-white/10 bg-white/5 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/10 transition-all duration-300"
            >
              <Linkedin size={20} />
              <span>Connect on LinkedIn</span>
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 pt-12 border-t border-white/5">
             <div className="flex items-center gap-2 text-white/40 text-sm font-medium">
                <Mail size={16} />
                <a href="mailto:hello@rohanmukka.com" className="hover:text-white transition-colors">hello@rohanmukka.com</a>
             </div>
             <div className="flex items-center gap-2 text-white/40 text-sm font-medium">
                <ExternalLink size={16} />
                <span className="">Available for collaboration</span>
             </div>
          </div>

          <div className="mt-16 text-white/20 text-[10px] uppercase tracking-[0.4em] font-bold">
            © 2024 Rohan Mukka Engineering • Crafted with Precision
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
