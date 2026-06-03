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
  return (
    <section
      id="certifications"
      className="py-32 px-6 relative overflow-hidden flex flex-col items-center"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-glass-border to-transparent opacity-50"></div>
      
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full -z-10" style={{background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.05) 0%, transparent 70%)'}}></div>
      
      <div className="max-w-6xl w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-text mb-6">
            Certifications
          </h2>
          <p className="text-primary-secondary text-xl max-w-2xl mx-auto">
            Continuous learning and professional credentials.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificationsData.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-6 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden flex flex-col h-full hover:shadow-xl hover:shadow-accent/5 border border-glass-border hover:border-accent/30"
            >
              {/* Subtle accent glow on hover */}
              <div className="absolute -inset-px bg-gradient-to-br from-accent/0 via-accent/5 to-accent/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="p-3 rounded-xl bg-surface-subtle border border-glass-border text-accent group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-glass-shadow">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-display font-bold text-primary-text mb-2 leading-tight relative z-10 flex-grow">
                {cert.name}
              </h3>

              <div className="space-y-4 mt-auto pt-4 relative z-10">
                <p className="text-primary-secondary font-medium flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-accent/70" />
                  {cert.issuer}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-primary-secondary">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Certifications;
