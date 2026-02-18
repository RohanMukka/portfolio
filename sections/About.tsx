import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Brain, Globe, Database } from 'lucide-react';

const Card = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
    className="group p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.05] to-transparent hover:border-[#0050FF]/40 transition-all duration-500 h-full"
  >
    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:bg-[#0050FF]/10 group-hover:border-[#0050FF]/20 transition-all duration-500 text-white/80 group-hover:text-[#00D6FF]">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
    <p className="text-white/50 leading-relaxed font-light">{description}</p>
  </motion.div>
);

export const About: React.FC = () => {
  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row gap-16 items-start mb-20"
        >
            <div className="md:w-1/2">
                <div className="inline-block px-3 py-1 rounded-full border border-[#0050FF]/20 bg-[#0050FF]/5 text-[#00D6FF] text-xs font-bold uppercase tracking-widest mb-6">
                    About Me
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
                    Bridging the gap between <br /> AI and Engineering.
                </h2>
            </div>
            <div className="md:w-1/2">
                <p className="text-lg text-white/50 font-light leading-relaxed mb-6">
                    I am a developer who thrives at the intersection of complex systems. Whether it's architecting decentralized networks or fine-tuning machine learning models for emotion recognition, I am driven by the challenge of building robust, meaningful software.
                </p>
                <p className="text-lg text-white/50 font-light leading-relaxed">
                    My approach is research-backed and product-focused. I don't just write code; I design systems that optimize for scalability, performance, and user experience.
                </p>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            icon={<Globe size={24} />}
            title="Decentralized Systems"
            description="Experience with Ethereum and Web3 technologies, building trustless and transparent applications."
            delay={0.1}
          />
          <Card 
            icon={<Brain size={24} />}
            title="AI & Machine Learning"
            description="Developing models for NLP and signal processing, translating data into actionable insights."
            delay={0.2}
          />
          <Card 
            icon={<Code2 size={24} />}
            title="Full Stack Engineering"
            description="End-to-end development using modern stacks like React, Node.js, and TypeScript."
            delay={0.3}
          />
          <Card 
            icon={<Database size={24} />}
            title="Data Architecture"
            description="Designing efficient database schemas and managing complex data relationships."
            delay={0.4}
          />
        </div>
      </div>
    </section>
  );
};
