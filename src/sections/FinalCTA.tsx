import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Send, CheckCircle2, ArrowUpRight, Copy, Check } from 'lucide-react';
import { RevealLines, SECTION_COUNT } from '../components/SectionHeader';

const EMAIL = 'rohanmukka07@gmail.com';
const EASE = [0.16, 1, 0.3, 1] as const;

const SOCIALS = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/rohanmukka' },
  { label: 'GitHub', href: 'https://github.com/rohanmukka' },
];

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block space-y-2">
    <span className="block hud text-primary-tertiary">{label}</span>
    {children}
  </label>
);

const inputClass =
  'w-full bg-surface-subtle border border-glass-border rounded-xl px-4 py-3 text-primary-text placeholder:text-primary-tertiary outline-none focus:border-accent transition-colors';

const UnderlineLink = ({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="group inline-flex items-center gap-2 py-2 hud text-primary-text"
  >
    <span className="relative">
      {children}
      <span className="absolute left-0 -bottom-1 h-px w-full bg-primary-text/60 origin-right group-hover:scale-x-0 transition-transform duration-500" />
      <span className="absolute left-0 -bottom-1 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
    </span>
    <ArrowUpRight size={15} className="transition-transform duration-500 group-hover:rotate-45 group-hover:text-accent" />
  </a>
);

// Contact closes the story: the scene gathers into a ring and the closing
// line sits inside it (the heading carries data-ring, which the 3D stage
// follows), its letters rising in as it arrives. Below it, the email with a
// copy button and the contact form.
const FinalCTA = () => {
  const [formState, setFormState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [copied, setCopied] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { scrollYProgress: p } = useScroll({ target: headingRef, offset: ['start 95%', 'start 40%'] });
  const count = String(SECTION_COUNT).padStart(2, '0');

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
    <section id="contact" data-chapter="contact" className="relative px-6 pt-24 md:pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 hud text-primary-secondary">
          <span className="flex items-center gap-4">
            <span className="text-accent">{count}</span>
            <span className="h-px w-10 bg-primary-text/25" />
            <span>Contact</span>
          </span>
          <span className="text-primary-tertiary">( {count} / {count} )</span>
        </div>

        <div className="min-h-[85vh] flex flex-col items-center justify-center text-center">
          <h2
            ref={headingRef}
            data-ring
            aria-label="Let’s talk."
            className="font-display font-extrabold leading-[0.85] tracking-[-0.05em] text-primary-text text-[clamp(4.5rem,12vw,12rem)]"
          >
            <RevealLines title={'Let’s\n*talk.*'} progress={p} />
          </h2>
          <motion.p
            className="mt-10 hud text-primary-secondary"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          >
            <span className="text-accent">●</span> Available for work
          </motion.p>
        </div>

        <div className="pb-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <motion.div
            className="lg:col-span-6 flex flex-col gap-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <p className="max-w-md text-lg md:text-xl text-primary-secondary leading-relaxed">
              Whether you have a question, a project idea, or just want to say hi — my inbox is always open.
            </p>

            <div>
              <span className="block hud text-primary-tertiary mb-3">Email</span>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${EMAIL}`}
                  className="group inline-flex items-center gap-3 font-display font-semibold tracking-[-0.03em] text-primary-text text-[clamp(1.4rem,2.6vw,2.4rem)]"
                >
                  <span className="relative">
                    {EMAIL}
                    <span className="absolute left-0 -bottom-1 h-px w-full bg-primary-text origin-right group-hover:scale-x-0 transition-transform duration-500" />
                    <span className="absolute left-0 -bottom-1 h-px w-full bg-accent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-100" />
                  </span>
                  <ArrowUpRight className="w-6 h-6 transition-transform duration-500 group-hover:rotate-45 group-hover:text-accent" />
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-primary-text/20 hud text-primary-text hover:border-accent hover:text-accent transition-colors"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {SOCIALS.map((s) => (
                <React.Fragment key={s.label}>
                  <UnderlineLink href={s.href} external>
                    {s.label}
                  </UnderlineLink>
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="lg:col-span-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
          >
            <div className="glass-card rounded-[22px] p-6 md:p-8">
              <AnimatePresence mode="wait">
                {formState === 'success' || formState === 'error' ? (
                  <motion.div
                    key={formState}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-12"
                  >
                    <CheckCircle2 size={44} className={formState === 'success' ? 'text-primary-text' : 'text-accent'} />
                    <h3 className="mt-5 text-3xl font-display font-bold text-primary-text">
                      {formState === 'success' ? 'Message received.' : 'Something went wrong.'}
                    </h3>
                    <p className="mt-2 text-primary-secondary">
                      {formState === 'success'
                        ? "Thanks for reaching out. I'll get back to you soon."
                        : 'Please try again, or email me directly.'}
                    </p>
                    <button onClick={() => setFormState('idle')} className="mt-8 text-sm font-semibold text-primary-text underline underline-offset-4">
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
                      className="w-full py-4 rounded-xl bg-primary-text text-background font-semibold flex items-center justify-center gap-2 group hover:bg-accent hover:text-white transition-colors disabled:opacity-70"
                    >
                      {formState === 'sending' ? (
                        <span className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin" />
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
    </section>
  );
};

export default FinalCTA;
