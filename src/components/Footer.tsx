import { Github, Linkedin, Mail, ExternalLink, Send, Activity, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { siLeetcode, siMonkeytype, siDevpost } from 'simple-icons';

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [monkeyStats, setMonkeyStats] = useState<any>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  useEffect(() => {
    // Visitor Count logic
    fetch('https://api.counterapi.dev/v1/rohanmukka/portfolio/up')
      .then(res => res.json())
      .then(data => {
        if (data && data.count) setVisitorCount(data.count);
      })
      .catch(err => console.error('Failed to fetch visitor count', err));

    // MonkeyType Stats fetch
    const fetchMonkeyType = async () => {
      try {
        const [pbRes, statsRes] = await Promise.all([
          fetch('https://api.monkeytype.com/users/personalBests?mode=time', {
            headers: { 'Authorization': 'ApeKey NjliNjM5MzZiN2NkZWRkNWM2YzMxNTQ0Lkx3ekdtdllfYzVRb1V2bHhPdUY1U0pxbjR1eGdfMTJJ' }
          }),
          fetch('https://api.monkeytype.com/users/stats', {
            headers: { 'Authorization': 'ApeKey NjliNjM5MzZiN2NkZWRkNWM2YzMxNTQ0Lkx3ekdtdllfYzVRb1V2bHhPdUY1U0pxbjR1eGdfMTJJ' }
          })
        ]);
        
        const pbData = await pbRes.json();
        const statsData = await statsRes.json();
        
        if (pbData.data && statsData.data) {
           setMonkeyStats({ pb: pbData.data, stats: statsData.data });
        }
      } catch (err) {
        console.error("Monkeytype fetch error:", err);
      }
    };
    fetchMonkeyType();

    // Theme observer logic
    const currentTheme = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'dark';
    setTheme(currentTheme);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          const newTheme = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
          setTheme(newTheme);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="relative pt-20 pb-12 mt-20 bg-surface-subtle/20">
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
              {/* LeetCode */}
              <div className="relative group/lc">
                <a href="https://leetcode.com/u/rohan_mukka/" target="_blank" rel="noopener noreferrer" className="block p-2.5 rounded-xl bg-bg-elevated/50 border border-glass-border hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1" aria-label="LeetCode">
                  <svg role="img" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d={siLeetcode.path} />
                  </svg>
                </a>
                {/* LeetCode Hover Stats */}
                <div className="absolute bottom-full left-0 mb-4 opacity-0 invisible group-hover/lc:opacity-100 group-hover/lc:visible transition-all duration-300 z-50 pointer-events-none w-[90vw] max-w-[450px]">
                  <div className="p-2 rounded-2xl bg-bg-elevated backdrop-blur-xl border border-glass-border shadow-2xl transform origin-bottom-left translate-y-2 group-hover/lc:translate-y-0 transition-transform duration-300">
                    <img src={`https://leetcard.jacoblin.cool/rohan_mukka?theme=${theme === 'dark' ? 'dark' : 'light'}&font=Syne&ext=activity`} alt="LeetCode Stats" className="w-full rounded-xl" />
                  </div>
                </div>
              </div>
              
              {/* GitHub */}
              <div className="relative group/gh">
                <a href="https://github.com/rohanmukka" target="_blank" rel="noopener noreferrer" className="block p-2.5 rounded-xl bg-bg-elevated/50 border border-glass-border hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1" aria-label="GitHub">
                  <Github size={20} />
                </a>
                {/* GitHub Hover Stats */}
                <div className="absolute bottom-full left-0 mb-4 opacity-0 invisible group-hover/gh:opacity-100 group-hover/gh:visible transition-all duration-300 z-50 pointer-events-none w-[90vw] max-w-[450px]">
                  <div className="p-2 rounded-2xl bg-bg-elevated backdrop-blur-xl border border-glass-border shadow-2xl transform origin-bottom-left translate-y-2 group-hover/gh:translate-y-0 transition-transform duration-300 flex flex-col gap-2">
                    <img src={`https://github-readme-stats.vercel.app/api?username=rohanmukka&show_icons=true&theme=${theme === 'dark' ? 'transparent' : 'default'}&hide_border=true&title_color=00B8FF&text_color=${theme === 'dark' ? 'a3a3a3' : '333333'}&icon_color=8b5cf6`} alt="GitHub Stats" className={`w-full rounded-xl ${theme === 'dark' ? 'bg-[#0d1117]' : 'bg-transparent'}`} />
                    <img src={`https://github-readme-activity-graph.vercel.app/graph?username=rohanmukka&bg_color=${theme === 'dark' ? '0d1117' : 'ffffff'}&color=00B8FF&line=00B8FF&point=8b5cf6&area=true&hide_border=true`} alt="GitHub Activity Graph" className="w-full rounded-xl" />
                  </div>
                </div>
              </div>
              {/* LinkedIn */}
              <a href="https://linkedin.com/in/rohanmukka" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-bg-elevated/50 border border-glass-border hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
              {/* Devpost */}
              <a href="https://devpost.com/rohan-mukka-1" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl bg-bg-elevated/50 border border-glass-border hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1" aria-label="Devpost">
                <svg role="img" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                  <path d={siDevpost.path} />
                </svg>
              </a>
              {/* MonkeyType */}
              <div className="relative group/mt">
                <a href="https://monkeytype.com/profile/kunnu" target="_blank" rel="noopener noreferrer" className="block p-2.5 rounded-xl bg-bg-elevated/50 border border-glass-border hover:border-accent/50 hover:bg-accent/5 hover:text-accent transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1" aria-label="MonkeyType">
                  <svg role="img" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                    <path d={siMonkeytype.path} />
                  </svg>
                </a>
                {/* MonkeyType Hover Stats */}
                <div className="absolute bottom-full left-0 mb-4 opacity-0 invisible group-hover/mt:opacity-100 group-hover/mt:visible transition-all duration-300 z-50 pointer-events-none w-[90vw] md:w-[350px]">
                  {monkeyStats && (
                    <div className={`p-5 rounded-2xl backdrop-blur-xl border shadow-2xl transform origin-bottom-left translate-y-2 group-hover/mt:translate-y-0 transition-transform duration-300 flex flex-col gap-4 font-sans ${theme === 'dark' ? 'bg-[#0d1117]/95 border-glass-border' : 'bg-white/95 border-gray-200'}`}>
                      <div className={`flex items-center gap-3 border-b pb-3 ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
                        <div className="w-10 h-10 rounded-full bg-[#e2b714]/20 flex items-center justify-center text-[#e2b714]">
                          <svg role="img" viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d={siMonkeytype.path} /></svg>
                        </div>
                        <div>
                          <h4 className="text-[#e2b714] font-bold text-lg leading-tight uppercase tracking-wider">Monkeytype</h4>
                          <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Top Performance</p>
                        </div>
                        <div className="ml-auto text-right">
                          <div className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                            {Math.round(monkeyStats.pb['15']?.[0]?.wpm || 0)} <span className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>WPM</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        {[15, 30, 60].map(time => {
                            const stat = monkeyStats.pb[time.toString()]?.[0];
                            return stat ? (
                              <div key={time} className={`rounded-xl p-3 flex flex-col items-center border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                                <span className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{time}s</span>
                                <span className="text-xl font-bold text-[#e2b714]">{Math.round(stat.wpm)}</span>
                                <span className={`text-[10px] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>{Math.round(stat.acc)}% acc</span>
                              </div>
                            ) : null;
                        })}
                      </div>
                      
                      <div className={`flex justify-between items-center rounded-xl p-3 border ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Tests Started</span>
                          <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{monkeyStats.stats.startedTests.toLocaleString()}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Tests Completed</span>
                          <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{monkeyStats.stats.completedTests.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
            <div className="relative h-[42px]">
              <AnimatePresence mode="wait">
                {newsletterStatus === 'success' ? (
                  <motion.div 
                    key="success"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex items-center gap-2 text-green-500 h-full px-2 font-medium"
                  >
                    <CheckCircle2 size={20} />
                    <span className="text-sm">Thanks for subscribing!</span>
                  </motion.div>
                ) : (
                  <motion.form 
                    key="form"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="flex gap-2 h-full"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setNewsletterStatus('sending');
                      try {
                        const res = await fetch("https://formsubmit.co/ajax/rohanmukka07@gmail.com", {
                          method: "POST",
                          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                          body: JSON.stringify({ 
                            _subject: "New Newsletter Subscriber!", 
                            email: newsletterEmail,
                            _template: "table"
                          })
                        });
                        if (res.ok) {
                          setNewsletterStatus('success');
                          setNewsletterEmail('');
                          setTimeout(() => setNewsletterStatus('idle'), 3000);
                        } else {
                          setNewsletterStatus('idle');
                        }
                      } catch {
                        setNewsletterStatus('idle');
                      }
                    }}
                  >
                    <input 
                      type="email" 
                      required
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      placeholder="email@example.com" 
                      className="flex-grow bg-bg-elevated/50 border-2 border-glass-border rounded-xl px-4 py-2 text-sm text-primary-text outline-none focus:border-accent/50 transition-all placeholder:text-text-tertiary"
                    />
                    <button 
                      type="submit"
                      disabled={newsletterStatus === 'sending'}
                      className="p-2 rounded-xl bg-accent text-white hover:bg-accent/90 transition-all disabled:opacity-50 min-w-[42px] flex justify-center items-center"
                    >
                      {newsletterStatus === 'sending' ? (
                        <div className="w-[18px] h-[18px] border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 border-t border-glass-border grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-xs text-primary-secondary font-medium relative z-10 w-full">
          {/* Left - Copyright */}
          <div className="flex justify-center md:justify-start text-center md:text-left">
            <span>© {new Date().getFullYear()} Rohan Mukka. Built with React, Framer Motion, and Coffee.</span>
          </div>

          {/* Center - Counter Badge */}
          <div className="flex justify-center flex-1">
            {visitorCount !== null && (
               <div className="flex items-center gap-2.5 px-5 py-2 rounded-full bg-surface-subtle border border-glass-border shadow-sm hover:border-accent/50 hover:shadow-md transition-all duration-300 group cursor-default overflow-hidden">
                <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
                  <motion.div 
                    animate={{ x: ["-50%", "0%"] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="flex text-accent drop-shadow-[0_0_8px_var(--accent)] absolute left-0"
                  >
                    <div className="w-5 flex-shrink-0 flex justify-center">
                      <Activity className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    </div>
                    <div className="w-5 flex-shrink-0 flex justify-center">
                      <Activity className="w-[18px] h-[18px]" strokeWidth={2.5} />
                    </div>
                  </motion.div>
                </div>
                <div className="flex items-center">
                  <span className="text-base font-bold text-primary-text font-display relative z-10">
                    {visitorCount.toLocaleString()}
                  </span>
                  <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-300 ease-in-out">
                    <div className="overflow-hidden flex items-center">
                      <span className="text-[10px] uppercase tracking-widest font-semibold text-primary-secondary whitespace-nowrap pl-2">
                        Profile Views
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right - Links (Removed for minimalist approach) */}
          <div className="hidden md:block"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
