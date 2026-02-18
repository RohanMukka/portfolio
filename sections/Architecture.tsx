
import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Package, Wind, Layout } from 'lucide-react';

const Card = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="group p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.05] to-transparent hover:border-[#0050FF]/40 transition-all duration-500"
  >
    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#0050FF]/10 group-hover:border-[#0050FF]/20 transition-all duration-500 text-white/80 group-hover:text-[#00D6FF]">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-white/50 leading-relaxed font-light">{description}</p>
  </motion.div>
);

export const Architecture: React.FC = () => {
  return (
    <section id="architecture" className="py-32 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto mb-20"
        >
          <div className="inline-block px-3 py-1 rounded-full border border-[#0050FF]/20 bg-[#0050FF]/5 text-[#00D6FF] text-xs font-bold uppercase tracking-widest mb-6">
            Architecture
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
            Built with modern architecture.
          </h2>
          <p className="text-lg text-white/50 font-light">
            Component-driven design with reusable abstractions. Utility-first styling with Tailwind and structured file organization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            icon={<Layout size={24} />}
            title="Component Systems"
            description="Highly decoupled, reusable UI components built for scale and consistency."
            delay={0.1}
          />
          <Card 
            icon={<Package size={24} />}
            title="Modular Structure"
            description="Well-organized project hierarchy promoting maintainability and clear concerns."
            delay={0.2}
          />
          <Card 
            icon={<Wind size={24} />}
            title="Utility-First Styling"
            description="Leveraging Tailwind CSS for lightning-fast styling with design system precision."
            delay={0.3}
          />
          <Card 
            icon={<Code2 size={24} />}
            title="TypeScript Core"
            description="Type-safe engineering ensuring robust runtime behavior and developer joy."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};
