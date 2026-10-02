import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Send, CheckCircle2, ArrowUpRight, Copy, Check } from 'lucide-react';
import GradientField from './hero/GradientField';
import { RevealLines, SECTION_COUNT } from '../components/SectionHeader';

const EMAIL = 'rohanmukka07@gmail.com';

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/rohanmukka' },
  { label: 'GitHub', href: 'https://github.com/rohanmukka' },
];

const Corner = ({ className }: { className: string }) => (
  <span className={`absolute w-[18px] h-[18px] border-white/45 ${className}`} aria-hidden="true" />
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-2">
    <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-white/70">{label}</span>
    {children}
  </label>
);

const inputClass =
  'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-white/60 focus:bg-white/15 transition-colors';

// Contact closes the page the way the hero opens it: a rounded panel of
// drifting colour, a giant line whose letters rise in as it scrolls into
// view, the email with a copy button, and the contact form in frosted glass.
const FinalCTA = () => {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress: p } = useScroll({ target: headingRef, offset: ['start 95%', 'start 45%'] });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('sending');
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${EMAIL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          _subject: formData.subject || 'New Portfolio Contact Form Submission',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          _template: 'table',
        }),
      });
      if (response.ok) {
        setFormState('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setFormState('error');
      }
    } catch {
      setFormState('error');
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked; the mailto link still works
    }
  };

  return (
    <section id="contact" className="relative p-2.5 md:p-3.5 mt-16 md:mt-24">
      <div data-nav-light className="relative overflow-hidden rounded-[22px] md:rounded-[28px] text-white">
        <GradientField />

        <Corner className="top-4 md:top-6 left-4 md:left-7 border-t border-l" />
        <Corner className="top-4 md:top-6 right-4 md:right-7 border-t border-r" />
        <Corner className="bottom-4 md:bottom-6 left-4 md:left-7 border-b border-l" />
        <Corner className="bottom-4 md:bottom-6 right-4 md:right-7 border-b border-r" />

        <div className="relative z-[1] px-6 md:px-14 pt-14 md:pt-20 pb-14 md:pb-20">
          <div className="flex items-center justify-between gap-4 text-[10px] md:text-[11px] font-medium uppercase tracking-[0.3em] text-white/75">
            <span className="flex items-center gap-4">
              <span className="text-[#ffb38a] tabular-nums">06</span>
              <span className="h-px w-10 bg-white/40" />
              <span>Contact</span>
            </span>
            <span className="tabular-nums tracking-[0.22em]">( 06 / {String(SECTION_COUNT).padStart(2, '0')} )</span>
          </div>

          <h2
            ref={headingRef}
            aria-label="Let’s talk."
            className="mt-10 md:mt-14 font-display font-extrabold leading-[0.85] tracking-[-0.05em] text-[clamp(4.5rem,15vw,15rem)]"
          >
            <RevealLines title={'Let’s *talk.*'} progress={p} accentClassName="text-[#ffd2b8]" />
          </h2>

          <div className="mt-12 md:mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left: email, socials, status */}
            <motion.div
              className="lg:col-span-6 flex flex-col gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="max-w-md text-lg md:text-xl text-white/85 leading-relaxed">
                Whether you have a question, a project idea, or just want to say hi — my inbox is always open.
              </p>

              <div>
                <span className="block text-[10px] font-medium uppercase tracking-[0.22em] text-white/70 mb-3">Email</span>
                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={`mailto:${EMAIL}`}
                    className="group inline-flex items-center gap-3 font-display font-semibold tracking-[-0.03em] text-[clamp(1.4rem,2.6vw,2.4rem)]"
                  >
                    <span className="relative">
                      {EMAIL}
                      <span className="absolute left-0 -bottom-1 h-px w-full bg-white origin-right group-hover:scale-x-0 transition-transform duration-500" />
                      <span className="absolute left-0 -bottom-1 h-px w-full bg-[#ffb38a] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
                    </span>
                    <ArrowUpRight className="w-6 h-6 transition-transform duration-500 group-hover:rotate-45 group-hover:text-[#ffb38a]" />
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-white/30 text-[10px] font-medium uppercase tracking-[0.2em] hover:bg-white/10 transition-colors"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-8 gap-y-2">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 py-2 text-xs md:text-sm font-medium uppercase tracking-[0.22em]"
                  >
                    <span className="relative">
                      {s.label}
                      <span className="absolute left-0 -bottom-1 h-px w-full bg-white/70 origin-right group-hover:scale-x-0 transition-transform duration-500" />
                      <span className="absolute left-0 -bottom-1 h-px w-full bg-[#ffb38a] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
                    </span>
                    <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45 group-hover:text-[#ffb38a]" />
                  </a>
                ))}
              </div>

              <div className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.22em] text-white/75">
                <span className="text-[#ffb38a]">●</span> Available for work
              </div>
            </motion.div>

            {/* Right: form */}
            <motion.div
              className="lg:col-span-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            >
              <div className="rounded-[22px] border border-white/20 bg-white/[0.07] backdrop-blur-md p-6 md:p-8">
                <AnimatePresence mode="wait">
                  {formState === 'success' || formState === 'error' ? (
                    <motion.div
                      key={formState}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center text-center py-12"
                    >
                      <CheckCircle2 size={44} className={formState === 'success' ? 'text-white' : 'text-[#ffb38a]'} />
                      <h3 className="mt-5 text-3xl font-display font-bold">
                        {formState === 'success' ? 'Message received.' : 'Something went wrong.'}
                      </h3>
                      <p className="mt-2 text-white/80">
                        {formState === 'success'
                          ? "Thanks for reaching out. I'll get back to you soon."
                          : 'Please try again, or email me directly.'}
                      </p>
                      <button onClick={() => setFormState('idle')} className="mt-8 text-sm font-semibold underline underline-offset-4">
                        {formState === 'success' ? 'Send another message' : 'Try again'}
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Field label="Full name">
                          <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required type="text" placeholder="Jane Doe" className={inputClass} />
                        </Field>
                        <Field label="Email address">
                          <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required type="email" placeholder="jane@example.com" className={inputClass} />
                        </Field>
                      </div>
                      <Field label="Subject">
                        <input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required type="text" placeholder="Project inquiry" className={inputClass} />
                      </Field>
                      <Field label="Message">
                        <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required rows={4} placeholder="Hello, I'd like to talk about..." className={`${inputClass} resize-none`} />
                      </Field>
                      <button
                        disabled={formState === 'sending'}
                        className="w-full py-4 rounded-xl bg-white text-[#002366] font-semibold flex items-center justify-center gap-2 group hover:bg-[#ffd2b8] transition-colors disabled:opacity-70"
                      >
                        {formState === 'sending' ? (
                          <span className="w-6 h-6 border-2 border-[#002366]/30 border-t-[#002366] rounded-full animate-spin" />
                        ) : (
                          <>
                            <span>Send message</span>
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
