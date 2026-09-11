import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Code, Database, Globe, Server, Terminal, Cpu, Layers } from 'lucide-react';

const skillsData = [
  {
    category: "Languages",
    icon: <Code className="w-8 h-8 text-electric-cyan" />,
    items: [
      { name: "Python", icon: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg" },
      { name: "Java", icon: "https://upload.wikimedia.org/wikipedia/en/3/30/Java_programming_language_logo.svg" },
      { name: "C/C++", icon: "https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg" },
      { name: "JavaScript", icon: "https://upload.wikimedia.org/wikipedia/commons/9/99/Unofficial_JavaScript_logo_2.svg" },
      { name: "SQL", icon: "https://upload.wikimedia.org/wikipedia/commons/8/87/Sql_data_base_with_logo.png" }, // Adjusted as SQL generic or specific DB
      { name: "Kotlin", icon: "https://upload.wikimedia.org/wikipedia/commons/7/74/Kotlin_Icon.png" },
      { name: "HTML/CSS", icon: "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg" },
      { name: "TypeScript", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" },
      { name: "MATLAB", icon: "https://upload.wikimedia.org/wikipedia/commons/2/21/Matlab_Logo.png" }
    ]
  },
  {
    category: "Developer Tools",
    icon: <Terminal className="w-8 h-8 text-primary-purple" />,
    items: [
      { name: "GitHub", icon: "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" },
      { name: "GitLab", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e1/GitLab_logo.svg" },
      { name: "Kubernetes", icon: "https://upload.wikimedia.org/wikipedia/commons/3/39/Kubernetes_logo_without_workmark.svg" },
      { name: "Docker", icon: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Docker_%28container_engine%29_logo.svg" },
      { name: "AWS", icon: "https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg" },
      { name: "PyCharm", icon: "https://upload.wikimedia.org/wikipedia/commons/1/1d/PyCharm_Icon.svg" },
      { name: "Jenkins", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e9/Jenkins_logo.svg" }
    ]
  },
  {
    category: "Frameworks/Tools",
    icon: <Globe className="w-8 h-8 text-primary-pink" />,
    items: [
      { name: "React.js", icon: "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" },
      { name: "Node.js", icon: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg" },
      { name: "Firebase", icon: "https://upload.wikimedia.org/wikipedia/commons/3/37/Firebase_Logo.svg" },
      { name: "Google Cloud", icon: "https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg" },
      { name: "TensorFlow", icon: "https://upload.wikimedia.org/wikipedia/commons/2/2d/Tensorflow_logo.svg" },
      { name: "Scikit-learn", icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" },
      { name: "Angular", icon: "https://raw.githubusercontent.com/devicons/devicon/master/icons/angularjs/angularjs-original.svg" },
      { name: "Next.js", icon: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_light_background.png" }
    ]
  },
  {
    category: "Platforms",
    icon: <Server className="w-8 h-8 text-primary-orange" />,
    items: [
      { name: "Linux", icon: "https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" },
      { name: "Windows", icon: "https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg" },
      { name: "Git", icon: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Git-logo.svg" }
    ]
  },
  {
    category: "Concepts",
    icon: <Layers className="w-8 h-8 text-primary-green" />,
    items: [
      { name: "RESTful APIs", icon: "https://cdn-icons-png.flaticon.com/512/8297/8297437.png" }, // Generic API icon
      { name: "Fullstack", icon: "https://cdn-icons-png.flaticon.com/512/10061/10061837.png" }, // Layers
      { name: "Machine Learning", icon: "https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg" }, 
      { name: "NLP", icon: "https://cdn-icons-png.flaticon.com/512/12222/12222588.png" },
      { name: "Security", icon: "https://cdn-icons-png.flaticon.com/512/2716/2716652.png" } // Better security shield icon
    ]
  },
    {
    category: "Specialized Tech",
    icon: <Cpu className="w-8 h-8 text-primary-blue" />,
    items: [
      { name: "AI Infra", icon: "https://cdn-icons-png.flaticon.com/512/2103/2103633.png" },
      { name: "Speech Audio", icon: "https://cdn-icons-png.flaticon.com/512/2883/2883162.png" },
      { name: "Gen AI", icon: "https://cdn-icons-png.flaticon.com/512/12128/12128882.png" }
    ]
  }
];

const Skills = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGridView, setIsGridView] = useState(false);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % skillsData.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + skillsData.length) % skillsData.length);
  };

  return (
    <section id="skills" className="py-32 px-6 relative overflow-hidden min-h-[800px] flex items-center justify-center">
      <div className="max-w-7xl mx-auto w-full relative z-10">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
        >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-primary-text mb-6">
            Technical Arsenal
            </h2>
            <p className="text-primary-secondary text-xl max-w-2xl mx-auto mb-10">
                A curated selection of technologies I've mastered.
            </p>

            <div className="flex justify-center mb-8">
                <div className="flex bg-surface-subtle/50 p-1.5 rounded-2xl border border-glass-border">
                    <button 
                        onClick={() => setIsGridView(false)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${!isGridView ? 'bg-primary-text text-background shadow-lg scale-105' : 'text-primary-secondary hover:text-primary-text hover:bg-bg-elevated/50'}`}
                    >
                        Carousel
                    </button>
                    <button 
                        onClick={() => setIsGridView(true)}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${isGridView ? 'bg-primary-text text-background shadow-lg scale-105' : 'text-primary-secondary hover:text-primary-text hover:bg-bg-elevated/50'}`}
                    >
                        Grid
                    </button>
                </div>
            </div>
        </motion.div>

        {/* Content Area */}
        <div className="relative min-h-[500px]">
            {isGridView ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                    {skillsData.map((skill, idx) => (
                        <motion.div
                            key={skill.category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-3xl glass-card border border-glass-border flex flex-col items-center gap-6 group hover:border-primary-text/20 transition-all duration-300"
                        >
                            <div className="p-4 rounded-full bg-surface-subtle/50 border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                                {skill.icon}
                            </div>
                            <h3 className="text-2xl font-display font-bold text-primary-text">
                                {skill.category}
                            </h3>
                            <div className="grid grid-cols-3 gap-4 w-full">
                                {skill.items.map((item) => (
                                    <div key={item.name} className="group relative flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-help">
                                        <div className="w-10 h-10 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                            <img src={item.icon} alt={item.name} className="w-full h-full object-contain filter drop-shadow-sm" loading="lazy" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                /* Carousel View */
                <div className="relative h-[500px] flex items-center justify-center perspective-1000">
                    {/* Left Button */}
                    <button 
                        onClick={prevSlide}
                        className="absolute left-4 md:left-0 z-30 p-4 rounded-full bg-glass-bg border border-glass-border text-primary-text hover:bg-glass-shadow transition-all backdrop-blur-md hover:scale-110 active:scale-95 shadow-xl"
                        aria-label="Previous Skill"
                    >
                        <ChevronLeft size={32} />
                    </button>

                    {/* Right Button */}
                    <button 
                        onClick={nextSlide}
                        className="absolute right-4 md:right-0 z-30 p-4 rounded-full bg-glass-bg border border-glass-border text-primary-text hover:bg-glass-shadow transition-all backdrop-blur-md hover:scale-110 active:scale-95 shadow-xl"
                        aria-label="Next Skill"
                    >
                        <ChevronRight size={32} />
                    </button>

                    <div className="relative w-full h-full flex items-center justify-center">
                        <AnimatePresence mode='popLayout'>
                            {skillsData.map((skill, index) => {
                                let offset = index - currentIndex;
                                if (offset < -Math.floor(skillsData.length / 2)) offset += skillsData.length;
                                if (offset > Math.floor(skillsData.length / 2)) offset -= skillsData.length;
                                if (Math.abs(offset) > 1) return null;
                                const isCenter = offset === 0;
                                
                                return (
                                    <motion.div
                                        key={skill.category}
                                        layout
                                        initial={{ 
                                            scale: 0.8, 
                                            opacity: 0, 
                                            x: offset * 300,
                                            filter: 'blur(10px)'
                                        }}
                                        animate={{ 
                                            scale: isCenter ? 1 : 0.85, 
                                            opacity: isCenter ? 1 : 0.4, 
                                            x: offset * (window.innerWidth < 768 ? 0 : 400),
                                            y: window.innerWidth < 768 && !isCenter ? (offset > 0 ? 300 : -300) : 0,
                                            zIndex: isCenter ? 10 : 5,
                                            filter: isCenter ? 'none' : 'blur(4px)', // Fixed: Changed 'blur(0px)' to 'none'
                                            rotateY: offset * 15
                                        }}
                                        exit={{ opacity: 0, scale: 0.5, filter: 'blur(10px)' }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className={`absolute w-[300px] md:w-[380px] h-[450px] rounded-3xl p-8 glass-card border overflow-hidden ${isCenter ? 'border-primary-text/20 shadow-2xl shadow-primary-text/10' : 'border-glass-border font-medium opacity-80'} flex flex-col items-center justify-start gap-8`}
                                        style={{ transformStyle: 'preserve-3d' }}
                                    >
                                        {isCenter && (
                                            <motion.div 
                                                className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -translate-x-full"
                                                animate={{ x: ['100%', '-100%'] }}
                                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                            />
                                        )}
                                        <div className="p-4 rounded-full bg-surface-subtle/50 border border-white/5 shadow-inner">
                                            {skill.icon}
                                        </div>
                                        <h3 className={`text-2xl font-display font-bold ${isCenter ? 'text-primary-text' : 'text-primary-secondary'}`}>
                                            {skill.category}
                                        </h3>
                                        <div className="grid grid-cols-3 gap-4 w-full">
                                            {skill.items.map((item) => (
                                                <div key={item.name} className="group relative flex flex-col items-center justify-center gap-2 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-help">
                                                    <div className="w-12 h-12 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                                                        <img src={item.icon} alt={item.name} className="w-full h-full object-contain filter drop-shadow-md" loading="lazy" />
                                                    </div>
                                                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded bg-black/80 text-white text-xs whitespace-nowrap pointer-events-none z-20 shadow-lg">
                                                        {item.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
        
        {/* Pagination Dots - Only in Carousel Mode */}
        {!isGridView && (
            <div className="flex justify-center gap-3 mt-12">
                {skillsData.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-10 bg-primary-text shadow-sm' : 'w-2.5 bg-primary-text/20 hover:bg-primary-text/40'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        )}

      </div>
    </section>
  );
};

export default Skills;
