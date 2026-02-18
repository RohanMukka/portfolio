
import React from 'react';
import { motion } from 'framer-motion';

const MetricBar = ({ label, value, delay }: { label: string, value: number, delay: number }) => (
  <div className="w-full">
    <div className="flex justify-between items-end mb-3">
      <span className="text-white/60 text-sm font-medium">{label}</span>
      <span className="text-white font-bold text-2xl tracking-tighter">{value}%</span>
    </div>
    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.02]">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${value}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay, ease: [0.16, 1, 0.3, 1] }}
        className="h-full bg-gradient-to-r from-[#0050FF] to-[#00D6FF] rounded-full"
      />
    </div>
  </div>
);

export const Performance: React.FC = () => {
  return (
    <section id="performance" className="py-32 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-3 py-1 rounded-full border border-[#0050FF]/20 bg-[#0050FF]/5 text-[#00D6FF] text-xs font-bold uppercase tracking-widest mb-6">
            Performance
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Performance is a <br />primary feature.
          </h2>
          <div className="space-y-6 text-white/60 text-lg font-light leading-relaxed max-w-xl mb-12">
            <p>
              Lazy loading strategies and asset optimization ensure that high-fidelity experiences load instantly on any network.
            </p>
            <p>
              I deliver production-ready code optimized for Lighthouse scores, using best practices in caching, bundle size, and rendering.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="bg-[#0A0A0C] border border-white/5 p-12 rounded-[2.5rem] shadow-2xl relative"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#0050FF]/10 blur-[80px] rounded-full" />
          
          <div className="flex flex-col gap-10 relative z-10">
            <MetricBar label="Performance (Lighthouse)" value={100} delay={0.1} />
            <MetricBar label="Core Web Vitals" value={98} delay={0.2} />
            <MetricBar label="First Contentful Paint" value={95} delay={0.3} />
            <MetricBar label="Accessibility Score" value={100} delay={0.4} />
          </div>

          <div className="mt-12 flex items-center justify-center p-6 rounded-2xl bg-white/[0.02] border border-white/5 italic text-white/40 text-sm">
            "Every millisecond matters in modern architecture."
          </div>
        </motion.div>
      </div>
    </section>
  );
};
