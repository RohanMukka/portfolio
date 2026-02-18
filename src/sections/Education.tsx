import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar, MapPin, Award, ArrowUp } from 'lucide-react';

const educationData = [
  {
    id: 1,
    school: "CVR College of Engineering",
    location: "Hyderabad, India",
    degree: "Bachelor of Technology in Computer Science",
    minor: "Minor in AI/ML",
    gpa: "9.1/10.0",
    period: "Aug 2020 – May 2024",
    color: "#FF9933",
    coursework: ["Data Structures", "Algorithms", "Operating Systems", "Computer Networks", "DBMS", "Machine Learning"]
  },
  {
    id: 2,
    school: "University of Oklahoma",
    location: "Oklahoma, United States",
    degree: "Master of Science in Computer Science",
    gpa: "4.0/4.0",
    period: "Aug 2024 – May 2026",
    color: "#830000",
    coursework: ["Advanced Algorithms", "AI Infrastructure", "Deep Learning", "Software Architecture", "Quantum Computing"]
  }
];

const Education = () => {
  return (
    <section id="education" className="py-32 px-6 relative overflow-hidden min-h-screen flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-glass-border to-transparent opacity-50"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[100px] -z-10"></div>
      <div className="max-w-5xl w-full relative z-10">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="text-center mb-24"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-text mb-6">
            Academic Journey
          </h2>
          <p className="text-primary-secondary text-xl max-w-2xl mx-auto">
             From foundational principles to advanced specialization.
          </p>
        </motion.div>

        <div className="relative flex flex-col items-center gap-20 w-full max-w-5xl mx-auto py-10">
            
            {/* SVG Spiral Connecting Line (Desktop) - Absolutely positioned ON TOP of cards for arrow visibility */}
            <div className="absolute inset-0 pointer-events-none hidden md:block z-20 overflow-visible">
               <svg className="w-full h-full" viewBox="0 0 1024 800" fill="none" style={{ overflow: 'visible' }}>
                  
                  {/* Spiral Path: Lands exactly on the left border of the Masters card */}
                  <motion.path 
                    d="M 460 500 
                       C 600 500, 700 400, 512 400
                       C 350 400, 400 250, 563 250" 
                    stroke="currentColor" 
                    strokeWidth="2.5" 
                    fill="transparent"
                    strokeDasharray="10 5" 
                    className="text-primary-text drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 2.5, ease: "easeInOut" }}
                  />
                  
                  {/* Manually drawn Arrowhead - Larger Size */}
                  <motion.path
                    d="M 548 244 L 563 250 L 548 256 Z"
                    fill="currentColor"
                    className="text-primary-text drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2.4, duration: 0.2 }}
                  />
               </svg>
            </div>

            {/* Masters Card (Top Right) */}
            <div className="relative w-full flex md:justify-end justify-center z-10 pr-4 md:pr-0 pl-4 md:pl-0">
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="w-full md:w-[45%] p-8 rounded-2xl glass-card transition-all relative group"
                >
                    <div className="absolute -top-6 -right-6 w-20 h-20 bg-electric-cyan/5 rounded-full blur-2xl group-hover:bg-electric-cyan/10 transition-colors"></div>
                    
                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-2xl font-display font-bold text-primary-text mb-1">
                                    {educationData[1].school}
                                </h3>
                                <div className="flex items-center gap-2 text-primary-secondary text-sm">
                                    <MapPin size={14} />
                                    <span>{educationData[1].location}</span>
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-surface-subtle/50 border border-white/5">
                                <GraduationCap className="text-electric-cyan w-6 h-6" />
                            </div>
                        </div>
                        <div className="border-t border-glass-border my-2"></div>
                        <div>
                            <h4 className="text-lg font-semibold text-primary-text leading-tight mb-3">
                                {educationData[1].degree}
                            </h4>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-primary-secondary font-bold mb-2">Core Coursework</div>
                                    <div className="flex flex-wrap gap-2">
                                        {educationData[1].coursework?.map(course => (
                                            <span key={course} className="px-2 py-1 rounded-md bg-surface-subtle text-[11px] text-primary-secondary border border-glass-border">{course}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                                        <Calendar size={12} />
                                        {educationData[1].period}
                                    </span>
                                    <motion.span 
                                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-extrabold bg-accent text-white shadow-lg shadow-accent/30"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Award size={14} />
                                        GPA: {educationData[1].gpa}
                                    </motion.span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>


            {/* Undergrad Card (Bottom Left) */}
            <div className="relative w-full flex md:justify-start justify-center z-10 pr-4 md:pr-0 pl-4 md:pl-0">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-full md:w-[45%] p-8 rounded-2xl glass-card transition-all relative group"
                >
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-primary-orange/5 rounded-full blur-2xl group-hover:bg-primary-orange/10 transition-colors"></div>

                    <div className="flex flex-col gap-4 relative z-10">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="text-2xl font-display font-bold text-primary-text mb-1">
                                    {educationData[0].school}
                                </h3>
                                <div className="flex items-center gap-2 text-primary-secondary text-sm">
                                    <MapPin size={14} />
                                    <span>{educationData[0].location}</span>
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-surface-subtle/50 border border-white/5">
                                <GraduationCap className="text-primary-orange w-6 h-6" />
                            </div>
                        </div>
                        <div className="border-t border-glass-border my-2"></div>
                        <div>
                            <h4 className="text-lg font-semibold text-primary-text leading-tight mb-1">
                                {educationData[0].degree}
                            </h4>
                             <p className="text-sm text-accent italic mb-3">
                                {educationData[0].minor}
                            </p>
                            
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[10px] uppercase tracking-wider text-primary-secondary font-bold mb-2">Key Modules</div>
                                    <div className="flex flex-wrap gap-2">
                                        {educationData[0].coursework?.map(course => (
                                            <span key={course} className="px-2 py-1 rounded-md bg-surface-subtle text-[11px] text-primary-secondary border border-glass-border">{course}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                                        <Calendar size={12} />
                                        {educationData[0].period}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-extrabold bg-accent text-white shadow-lg shadow-accent/30">
                                        <Award size={14} />
                                        GPA: {educationData[0].gpa}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
            
        </div>
      </div>
    </section>
  );
};

export default Education;
