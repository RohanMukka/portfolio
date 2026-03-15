import { Github, Linkedin, Mail, ExternalLink, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://api.counterapi.dev/v1/rohanmukka/portfolio/up')
      .then(res => res.json())
      .then(data => {
        if (data && data.count) setVisitorCount(data.count);
      })
      .catch(err => console.error('Failed to fetch visitor count', err));
  }, []);

  return (
    <footer className="relative pt-20 pb-12 mt-20 overflow-hidden bg-surface-subtle/20">
      {/* Premium Separator Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-text/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex flex-col gap-1">
              <span className="text-2xl font-display font-bold text-primary-text tracking-tight italic">Rohan Mukka</span>
              <span className="text-sm text-primary-secondary font-medium tracking-wide">Full Stack Engineer & AI Architect</span>
            </div>
            <p className="text-base text-primary-secondary leading-relaxed max-w-sm">
              Designing and developing high-performance applications with a focus on user experience and architectural cleaniness.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/rohanmukka" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-bg-elevated/50 border border-glass-border hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                <Github size={20} />
              </a>
              <a href="https://linkedin.com/in/rohanmukka" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-bg-elevated/50 border border-glass-border hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Sitemaps */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-sm font-bold text-primary-text uppercase tracking-widest">Sitemap</h4>
            <ul className="space-y-3">
              {['About', 'Work', 'Skills', 'Education', 'Contact'].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase().replace('about', 'architecture')}`} className="text-primary-secondary hover:text-accent transition-colors text-sm font-medium">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="md:col-span-2 space-y-6">
            <h4 className="text-sm font-bold text-primary-text uppercase tracking-widest">External</h4>
            <ul className="space-y-3">
              {[
                { name: 'Devpost', href: 'https://devpost.com/rohan-mukka-1' },
                { name: 'CV/Resume', href: '#' },
                { name: 'Source Code', href: 'https://github.com/rohanmukka/web-engineering-portfolio' },
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary-secondary hover:text-accent transition-colors text-sm font-medium">
                    {item.name}
                    <ExternalLink size={12} className="opacity-50" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-6">
            <h4 className="text-sm font-bold text-primary-text uppercase tracking-widest">Stay Updated</h4>
            <p className="text-sm text-primary-secondary leading-relaxed">
              Subscribe to my monthly newsletter for insights on web engineering and AI.
            </p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="flex-grow bg-bg-elevated/50 border-2 border-glass-border rounded-xl px-4 py-2 text-sm text-primary-text outline-none focus:border-accent/50 transition-all placeholder:text-text-tertiary"
              />
              <button className="p-2 rounded-xl bg-accent text-white hover:bg-accent/90 transition-all">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 border-t border-glass-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-primary-secondary font-medium relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <span>© {new Date().getFullYear()} Rohan Mukka. Built with React, Framer Motion, and Coffee.</span>
            {visitorCount !== null && (
              <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-subtle/50 border border-white/5 text-primary-text shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan animate-pulse shadow-[0_0_8px_rgba(0,184,255,0.8)]"></span>
                Profile Views: {visitorCount.toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-primary-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary-text transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
