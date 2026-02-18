import React from 'react';
import SectionContainer from '../components/SectionContainer';
import { motion } from 'framer-motion';
import { ExternalLink, Code2, Rocket, Calendar } from 'lucide-react';

const Architecture = () => {
  return (
    <SectionContainer id="architecture">
      <motion.div
        className="max-w-6xl mx-auto p-6 md:p-16 rounded-[2.5rem] glass-card backdrop-blur-3xl border border-white/10 relative overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-blue/5 rounded-full blur-[100px] -z-10"></div>

        <h2 className="text-4xl md:text-6xl font-display font-bold text-primary-text mb-12 tracking-tight">
             <span className="text-accent italic">Journey</span>
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-6 text-lg md:text-xl text-primary-text leading-[1.8] font-medium opacity-90">
              <p>
                  Since <span className="text-accent font-black">2020</span>, I've been obsessed with the art of digital construction. What started as simple curiosity has grown into a deep-seated passion for architectural integrity and performance.
              </p>

              <p>
                  I don't just write code; I design systems. Currently specializing in <span className="text-primary-text font-black">Full-Stack Scalability</span> and <span className="text-primary-text font-black">Intelligent Automation</span> at the University of Oklahoma, I believe that every pixel and every line of logic should serve a purpose.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-5 pt-4">
              <a 
                href="https://devpost.com/rohan-mukka-1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary-text text-background hover:bg-primary-text/90 transition-all duration-300 group font-bold shadow-2xl shadow-primary-text/20 border border-primary-text/10"
              >
                <Rocket size={22} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                <span>View Hackathon Portfolio</span>
                <ExternalLink size={18} className="opacity-50" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-4 grid grid-cols-1 gap-5">
            {[
              { label: "Experience", value: "4+ Yrs", icon: <Calendar className="text-accent" />, color: "border-accent/10" },
              { label: "Built", value: "15+ Proj", icon: <Rocket className="text-primary-blue" />, color: "border-blue-500/10" },
              { label: "Mastered", value: "12+ Tech", icon: <Code2 className="text-primary-purple" />, color: "border-purple-500/10" },
            ].map((stat, i) => (
                  <motion.div 
                    key={stat.label}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                    className={`p-8 rounded-[2.5rem] bg-bg-elevated/60 backdrop-blur-xl border-2 ${stat.color} flex items-center justify-between group hover:bg-bg-elevated transition-all transform hover:-translate-y-2 shadow-lg shadow-black/5 mx-auto w-full`}
                  >
                <div>
                  <div className="text-3xl font-display font-black text-primary-text mb-1">{stat.value}</div>
                  <div className="text-xs text-primary-secondary font-bold tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-opacity">{stat.label}</div>
                </div>
                <div className="p-4 rounded-2xl bg-accent/5 group-hover:bg-accent/10 transition-colors shadow-inner border border-accent/5">
                  {stat.icon}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </SectionContainer>
  );
};

export default Architecture;
