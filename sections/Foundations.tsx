
import React from 'react';
import { motion } from 'framer-motion';

export const Foundations: React.FC = () => {
  return (
    <section id="foundations" className="relative py-32 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} 
      />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="inline-block px-3 py-1 rounded-full border border-[#0050FF]/20 bg-[#0050FF]/5 text-[#00D6FF] text-xs font-bold uppercase tracking-widest mb-6">
            Foundations
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Structured from the <br />ground up.
          </h2>
          <div className="space-y-6 text-white/60 text-lg md:text-xl font-light leading-relaxed max-w-xl">
            <p>
              Mastery of semantic HTML and accessibility-first design ensures every interface is inclusive and machine-readable.
            </p>
            <p>
              Responsive layout systems built with modern CSS architectures like Grid and Flexbox provide stability across any viewport size.
            </p>
            <p>
              I prioritize clean separation of concerns and a scalable component architecture that evolves as projects grow.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative aspect-square md:aspect-[4/3] rounded-3xl bg-[#0A0A0C] border border-white/5 overflow-hidden group shadow-2xl"
        >
          {/* Mockup UI representation */}
          <div className="absolute inset-0 p-8 flex flex-col gap-6">
            <div className="h-4 w-1/3 bg-white/10 rounded" />
            <div className="grid grid-cols-12 gap-4 h-full">
              <div className="col-span-8 space-y-4">
                <div className="h-48 bg-[#0050FF]/10 rounded-2xl border border-[#0050FF]/20 flex items-center justify-center">
                   <div className="w-12 h-12 rounded-full bg-[#00D6FF]/20 border border-[#00D6FF]/40" />
                </div>
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-4/5 bg-white/5 rounded" />
              </div>
              <div className="col-span-4 space-y-4">
                <div className="h-12 bg-white/5 rounded-xl" />
                <div className="h-12 bg-white/5 rounded-xl" />
                <div className="h-12 bg-white/5 rounded-xl" />
                <div className="h-full bg-white/5 rounded-xl" />
              </div>
            </div>
          </div>
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
        </motion.div>
      </div>
    </section>
  );
};
