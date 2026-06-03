import React from "react";
import { motion } from "framer-motion";
import { Award, Calendar, ShieldCheck } from "lucide-react";

const certificationsData = [
  {
    name: "Oracle Certified Professional: Generative AI",
    issuer: "Oracle",
    issued: "Oct 2025",
    expires: "Oct 2027",
    skills: ["Generative AI"],
  },
  {
    name: "Networking Essentials",
    issuer: "Cisco Networking Academy",
    issued: "Dec 2022",
  },
  {
    name: "Introduction to Java and Object-Oriented Programming",
    issuer: "University of Pennsylvania",
    issued: "Dec 2021",
    skills: ["Java", "Object-Oriented Programming (OOP)"],
  },
  {
    name: "Java Full Stack",
    issuer: "Wipro",
    issued: "Oct 2023",
    skills: ["Java"],
  },
  {
    name: "Python Data Structures",
    issuer: "University of Michigan",
    issued: "Jan 2022",
    skills: ["Data Structures", "Python"],
  },
  {
    name: "Artificial Intelligence Foundation",
    issuer: "Wipro",
    issued: "Mar 2023",
    skills: ["Artificial Intelligence (AI)"],
  },
];

const Certifications = () => {
  // Duplicate the array to create a seamless marquee loop
  const marqueeData = [...certificationsData, ...certificationsData];

  return (
    <section
      id="certifications"
      className="py-32 relative overflow-hidden flex flex-col items-center"
    >
      <style>
        {`
          @keyframes scroll-marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .marquee-container {
            animation: scroll-marquee 45s linear infinite;
          }
          .marquee-container:hover {
            animation-play-state: paused;
          }
          @keyframes swing {
            0%, 100% { transform: rotate(-3deg); }
            50% { transform: rotate(3deg); }
          }
          .swing-animation {
            transform-origin: top center;
            animation: swing 5s ease-in-out infinite;
          }
        `}
      </style>

      {/* Decorative Top Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-glass-border to-transparent opacity-50"></div>
      
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full -z-10" style={{background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.05) 0%, transparent 70%)'}}></div>
      
      <div className="max-w-6xl w-full relative z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-text mb-6">
            Certifications
          </h2>
          <p className="text-primary-secondary text-xl max-w-2xl mx-auto">
            Continuous learning and professional credentials.
          </p>
        </motion.div>
      </div>

      {/* The Clothesline Section */}
      <div className="relative w-full overflow-visible py-10 mt-4">
        
        {/* The Thread */}
        <div className="absolute top-10 left-0 w-full h-[2px] bg-glass-border z-0 shadow-[0_1px_3px_rgba(var(--accent-rgb),0.3)]"></div>

        {/* The Marquee Container */}
        <div className="flex w-max marquee-container px-4">
          {marqueeData.map((cert, idx) => (
            <div 
              key={idx} 
              className="relative w-80 md:w-96 mx-4 swing-animation pt-8 group"
              style={{ animationDelay: `${(idx % certificationsData.length) * 0.7}s` }}
            >
              {/* The Peg/Clip */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-8 bg-surface-subtle border border-glass-border rounded-sm z-20 flex flex-col items-center shadow-lg shadow-black/20">
                 {/* Clip dot/accent */}
                 <div className="w-1.5 h-1.5 rounded-full bg-accent/70 mt-1"></div>
              </div>
              
              {/* The string connecting peg to card */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[2px] h-4 bg-glass-border z-10 group-hover:bg-accent/50 transition-colors"></div>
              
              {/* The Card */}
              <div className="glass-card rounded-2xl p-6 h-full border border-glass-border relative mt-4 flex flex-col hover:border-accent/40 transition-colors shadow-lg shadow-black/10 hover:shadow-accent/5 bg-glass-bg/90 backdrop-blur-md">
                
                {/* Subtle highlight */}
                <div className="absolute -inset-px bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none" />

                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="p-3 rounded-xl bg-surface-subtle border border-glass-border text-accent shadow-sm">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-primary-text mb-3 leading-tight relative z-10 flex-grow">
                  {cert.name}
                </h3>

                <div className="space-y-4 mt-auto pt-4 relative z-10">
                  <p className="text-primary-secondary font-medium flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4 text-accent/70" />
                    {cert.issuer}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-primary-secondary">
                    {cert.issued && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-subtle border border-glass-border font-medium">
                        <Calendar size={12} className="text-accent/70" />
                        Issued {cert.issued}
                      </span>
                    )}
                    {cert.expires && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-subtle border border-glass-border font-medium opacity-80">
                        Expires {cert.expires}
                      </span>
                    )}
                  </div>

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-glass-border">
                      {cert.skills.map((skill, skillIdx) => (
                        <span
                          key={skillIdx}
                          className="px-2 py-1 rounded-md bg-surface-subtle/50 text-[11px] font-medium text-primary-secondary border border-glass-border"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
