import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useActiveSection } from "../lib/useActiveSection";
import { currentTheme, setTheme, type Theme } from "../lib/theme";
import { setPageScrollPaused } from "../lib/smoothScroll";

const LINKS = [
  { name: "About", id: "architecture" },
  { name: "Work", id: "projects" },
  { name: "Skills", id: "skills" },
  { name: "Credentials", id: "credentials" },
  { name: "Contact", id: "contact" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const ThemeButton = ({ theme, onToggle }: { theme: Theme; onToggle: () => void }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
    className="relative grid place-items-center w-9 h-9 rounded-full border border-primary-text/15 text-primary-text hover:border-accent hover:text-accent transition-colors"
  >
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        {theme === "dark" ? <Moon size={15} /> : <Sun size={15} />}
      </motion.span>
    </AnimatePresence>
  </button>
);

// A slim bar across the top: the name with a readout of the section you're
// in, the sections as small caps (the current one underlined), and a theme
// button. It stays off the landing page until the visitor scrolls, and a
// hairline along its top fills with the page's progress. Phones get a
// full-screen menu.
const Navbar = ({ isScrolled = false }: { isScrolled?: boolean }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setThemeState] = useState<Theme>(currentTheme);
  const active = useActiveSection(LINKS.map((l) => l.id), 100);
  const activeIndex = LINKS.findIndex((l) => l.id === active);
  const shown = isScrolled || mobileOpen;

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setThemeState(next);
    setTheme(next);
  };

  useEffect(() => {
    if (!mobileOpen) return;
    setPageScrollPaused(true);
    return () => setPageScrollPaused(false);
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        className="fixed top-0 inset-x-0 z-50"
        inert={!shown}
        initial={{ y: "-110%" }}
        animate={{ y: shown ? 0 : "-110%" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav-bar">
          <motion.div className="absolute top-0 left-0 h-px w-full bg-accent origin-left" style={{ scaleX: progress }} />
          <div className="flex items-center justify-between gap-6 px-5 md:px-10 py-4">
            <a href="#" className="flex items-baseline gap-4 min-w-0">
              <span className="font-display font-semibold text-lg tracking-tight text-primary-text">Rohan Mukka</span>
              <span className="hud text-primary-tertiary hidden sm:inline truncate">
                {activeIndex >= 0 ? `( ${pad(activeIndex + 1)} / ${pad(LINKS.length)} ) ${LINKS[activeIndex].name}` : "( Portfolio )"}
              </span>
            </a>

            <div className="hidden md:flex items-center gap-8">
              {LINKS.map((link) => {
                const isActive = active === link.id;
                return (
                  <a
                    key={link.id}
                    href={`#${link.id}`}
                    className={`group relative hud transition-colors ${isActive ? "text-primary-text" : "text-primary-secondary hover:text-primary-text"}`}
                  >
                    {link.name}
                    <span
                      className={`absolute left-0 -bottom-1.5 h-px w-full bg-accent transition-transform duration-500 ${
                        isActive ? "scale-x-100 origin-left" : "scale-x-0 origin-right group-hover:scale-x-100 group-hover:origin-left"
                      }`}
                    />
                  </a>
                );
              })}
              <ThemeButton theme={theme} onToggle={toggleTheme} />
            </div>

            <div className="flex md:hidden items-center gap-3">
              <ThemeButton theme={theme} onToggle={toggleTheme} />
              <button
                type="button"
                onClick={() => setMobileOpen((o) => !o)}
                aria-expanded={mobileOpen}
                className="hud px-3 py-2 rounded-full border border-primary-text/15 text-primary-text"
              >
                {mobileOpen ? "Close" : "Menu"}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-background flex flex-col justify-end px-6 pb-16 pt-28"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col gap-2">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-baseline gap-4 py-2 border-b border-primary-text/10"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="hud text-accent">{pad(i + 1)}</span>
                  <span className="font-display font-bold text-5xl tracking-[-0.04em] text-primary-text">{link.name}</span>
                </motion.a>
              ))}
            </nav>
            <p className="mt-10 hud text-primary-tertiary">© {new Date().getFullYear()} Rohan Mukka</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
