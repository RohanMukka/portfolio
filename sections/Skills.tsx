import React from 'react';
import { motion } from 'framer-motion';

const skills = {
    "Languages": ["Python", "TypeScript", "JavaScript", "Java", "Solidity", "SQL", "C++"],
    "Frontend": ["React", "Next.js", "Tailwind CSS", "Framer Motion", "HTML5/CSS3"],
    "Backend & Cloud": ["Node.js", "Firebase", "Express", "REST APIs", "AWS"],
    "AI & Data": ["Machine Learning", "NLP", "PyTorch", "Data Visualization", "Pandas"]
};

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="relative py-32 overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} 
      />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-start">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 sticky top-32"
        >
          <div className="inline-block px-3 py-1 rounded-full border border-[#0050FF]/20 bg-[#0050FF]/5 text-[#00D6FF] text-xs font-bold uppercase tracking-widest mb-6">
            Technical Arsenal
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
            Built on a solid <br />foundation.
          </h2>
          <div className="space-y-6 text-white/60 text-lg font-light leading-relaxed max-w-xl">
            <p>
              I leverage a diverse set of languages and frameworks to build scalable, full-stack applications.
            </p>
            <p>
              From training ML models to crafting pixel-perfect UIs, my toolkit allows me to handle the entire product lifecycle.
            </p>
          </div>
        </motion.div>

        <div className="grid gap-8">
            {Object.entries(skills).map(([category, items], idx) => (
                <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="bg-[#0A0A0C] border border-white/5 rounded-2xl p-8 hover:border-[#0050FF]/30 transition-colors"
                >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-[#0050FF]"></span>
                        {category}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {items.map(skill => (
                            <span key={skill} className="px-3 py-2 rounded-lg bg-white/[0.03] text-white/70 text-sm border border-white/5 font-medium">
                                {skill}
                            </span>
                        ))}
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};
