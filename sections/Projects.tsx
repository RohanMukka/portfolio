import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';

interface Project {
  title: string;
  description: string;
  tags: string[];
  links: {
    github?: string;
    demo?: string;
  };
}

const projects: Project[] = [
  {
    title: "BEneFIT",
    description: "A decentralized fitness accountability framework using ETH staking, smart contracts, and fraud-resistant goal validation. Inspired by behavioral psychology to incentivize fitness.",
    tags: ["Ethereum", "Web3", "React", "Smart Contracts", "Solidity"],
    links: {
      github: "https://github.com/RohanMukka/BEneFIT"
    }
  },
  {
    title: "SpendSmart",
    description: "Comprehensive personal finance tracker built with TypeScript and Firebase. Features real-time data synchronization and intuitive visualization of spending habits.",
    tags: ["TypeScript", "Firebase", "React", "Data Viz"],
    links: {
      github: "https://github.com/RohanMukka/spendsmart"
    }
  },
  {
    title: "Multiclass Emotion Recognition",
    description: "AI system for classifying emotions from EEG signals. Leverages machine learning algorithms to interpret brain orphysiological data for emotion detection.",
    tags: ["Python", "Machine Learning", "EEG", "Data Analysis"],
    links: {
      github: "https://github.com/RohanMukka/Multiclass-Emotion-Recognition-from-EEG-Signals"
    }
  },
  {
    title: "Patient Assistant Network",
    description: "Robust database system for patient management. Handles complex queries and data relationships to support healthcare administration.",
    tags: ["Java", "SQL", "Database Design"],
    links: {
      github: "https://github.com/RohanMukka/Patient-Assistant-Network-Database-System"
    }
  },
  {
    title: "Multilingual Polarization",
    description: "NLP model for detecting polarization in multilingual text. Analyzes sentiment and bias across different languages to better understand discourse.",
    tags: ["NLP", "Python", "Deep Learning"],
    links: {
      github: "https://github.com/RohanMukka/Multilingual-Polarization-Detection"
    }
  },
  {
    title: "FitPrep",
    description: "Fitness preparation and tracking tool. Helps users plan workouts and track nutrition goals effectively.",
    tags: ["Web Dev", "Health Tech"],
    links: {
      github: "https://github.com/RohanMukka/fitprep"
    }
  }
];

export const Projects: React.FC = () => {
    return (
      <section id="projects" className="relative py-32 bg-[#0A0A0C]/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="inline-block px-3 py-1 rounded-full border border-[#0050FF]/20 bg-[#0050FF]/5 text-[#00D6FF] text-xs font-bold uppercase tracking-widest mb-6">
              Selected Work
            </div>
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight">
              Engineering with <br /> purpose.
            </h2>
            <p className="text-white/60 text-lg max-w-2xl">
              From decentralized applications to AI-driven analysis, I build systems that solve complex problems.
            </p>
          </motion.div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-6">
                            <h3 className="text-xl font-bold text-white group-hover:text-[#00D6FF] transition-colors">
                                {project.title}
                            </h3>
                            <div className="flex gap-3">
                                {project.links.github && (
                                    <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                        <Github size={20} />
                                    </a>
                                )}
                                {project.links.demo && (
                                    <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors">
                                        <ExternalLink size={20} />
                                    </a>
                                )}
                            </div>
                        </div>
                        
                        <p className="text-white/60 text-sm leading-relaxed mb-6">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                        {project.tags.map(tag => (
                            <span key={tag} className="text-xs font-medium px-2 py-1 rounded-md bg-white/5 text-white/50 border border-white/5">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
             <a href="https://github.com/RohanMukka?tab=repositories" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors text-sm font-medium">
                View more on GitHub <ArrowRight size={16} />
             </a>
          </motion.div>
        </div>
      </section>
    );
  };
