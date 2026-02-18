import React, { useState } from 'react';
import SectionContainer from '../components/SectionContainer';
import { Send, CheckCircle2, Mail, ExternalLink, Linkedin, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FinalCTA = () => {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    // Simulate API call
    setTimeout(() => setFormState('success'), 2000);
  };

  return (
    <SectionContainer id="contact" className="!py-0 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Left: Contact Info & Status */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 text-xs font-bold uppercase tracking-widest mb-6 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Available for New Opportunities
            </div>

            <h2 className="text-4xl md:text-6xl font-display font-bold text-primary-text mb-6">
              Let’s build something <span className="text-accent italic">extraordinary</span>.
            </h2>
            <p className="text-xl text-primary-secondary mb-10 leading-relaxed">
              Whether you have a question, a project idea, or just want to say hi—my inbox is always open.
            </p>

            <div className="space-y-6">
              <a href="mailto:rohanmukka03@gmail.com" className="flex items-center gap-4 group p-5 rounded-[2rem] bg-bg-elevated/50 border-2 border-glass-border hover:border-accent/40 hover:bg-bg-elevated transition-all duration-300 w-fit pr-12 shadow-sm hover:shadow-2xl hover:-translate-y-1">
                <div className="p-4 rounded-2xl bg-accent text-white group-hover:bg-accent/80 transition-all duration-500 shadow-inner">
                  <Mail size={28} />
                </div>
                <div>
                  <div className="text-xs text-primary-text font-black uppercase tracking-widest mb-1 opacity-60">Email Me</div>
                  <div className="text-xl font-bold text-primary-text group-hover:text-accent transition-colors">rohanmukka03@gmail.com</div>
                </div>
              </a>

              <div className="flex gap-4">
                <a href="https://linkedin.com/in/rohanmukka" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-surface-subtle border border-glass-border hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                  <Linkedin size={24} />
                </a>
                <a href="https://github.com/rohanmukka" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-surface-subtle border border-glass-border hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                  <Github size={24} />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8 md:p-10 rounded-[2rem] border border-white/10 relative"
          >
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-10"
                >
                  <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6 text-green-500">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-primary-text mb-2">Message Received!</h3>
                  <p className="text-primary-secondary">Thanks for reaching out. I'll get back to you soon.</p>
                  <button 
                    onClick={() => setFormState('idle')}
                    className="mt-8 text-accent font-bold hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-text uppercase tracking-wider px-1">Full Name</label>
                      <input required type="text" placeholder="John Doe" className="w-full bg-surface-subtle border-2 border-glass-border rounded-xl px-4 py-3 text-primary-text outline-none focus:border-accent/50 focus:bg-bg-elevated transition-all placeholder:text-text-tertiary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-primary-text uppercase tracking-wider px-1">Email Address</label>
                      <input required type="email" placeholder="john@example.com" className="w-full bg-surface-subtle border-2 border-glass-border rounded-xl px-4 py-3 text-primary-text outline-none focus:border-accent/50 focus:bg-bg-elevated transition-all placeholder:text-text-tertiary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary-text uppercase tracking-wider px-1">Subject</label>
                    <input required type="text" placeholder="Project Inquiry" className="w-full bg-surface-subtle border-2 border-glass-border rounded-xl px-4 py-3 text-primary-text outline-none focus:border-accent/50 focus:bg-bg-elevated transition-all placeholder:text-text-tertiary" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-primary-text uppercase tracking-wider px-1">Message</label>
                    <textarea required rows={4} placeholder="Hello, I'd like to talk about..." className="w-full bg-surface-subtle border-2 border-glass-border rounded-xl px-4 py-3 text-primary-text outline-none focus:border-accent/50 focus:bg-bg-elevated transition-colors resize-none placeholder:text-text-tertiary"></textarea>
                  </div>
                  
                  <button 
                    disabled={formState === 'sending'}
                    className="w-full btn-cta py-4 rounded-xl font-bold flex items-center justify-center gap-2 group shadow-xl shadow-accent/20"
                  >
                    {formState === 'sending' ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </SectionContainer>
  );
};

export default FinalCTA;
