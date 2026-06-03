import React from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, ShieldCheck } from 'lucide-react';
import { certificationsData } from '../data';

export const Certifications: React.FC = () => {
  return (
    <section id="certifications" className="relative py-32 overflow-hidden">
      {/* Background Grid - consistent with other sections */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, backgroundSize: '60px 60px' }} 
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-16 text-center md:text-left"
        >
          <div className="inline-block px-3 py-1 rounded-full border border-[#f97316]/20 bg-[#f97316]/5 text-[#f97316] text-xs font-bold uppercase tracking-widest mb-6">
            Continuous Learning
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Certifications & <br className="hidden md:block" />Credentials.
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {certificationsData.map((cert, idx) => (
            <motion.div
              key={cert.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card rounded-2xl p-6 hover:border-[#f97316]/40 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
            >
              {/* Subtle orange glow on hover */}
              <div className="absolute -inset-px bg-gradient-to-r from-[#f97316]/0 via-[#f97316]/10 to-[#f97316]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#16161a] border border-white/5 flex items-center justify-center text-[#f97316] group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-6 h-6" />
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 leading-tight relative z-10">
                {cert.name}
              </h3>
              
              <p className="text-white/60 font-medium mb-4 flex items-center gap-2 text-sm relative z-10">
                <ShieldCheck className="w-4 h-4 text-[#f97316]/70" />
                {cert.issuer}
              </p>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4 text-sm text-white/40">
                  {cert.issued && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>Issued {cert.issued}</span>
                    </div>
                  )}
                  {cert.expires && (
                    <div className="flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-white/20" />
                      <span>Expires {cert.expires}</span>
                    </div>
                  )}
                </div>

                {cert.skills && cert.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                    {cert.skills.map((skill, skillIdx) => (
                      <span 
                        key={skillIdx} 
                        className="px-2.5 py-1 rounded-md bg-[#16161a] text-white/70 text-xs border border-white/5"
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
