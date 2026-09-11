import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import { useSectionSpy } from "../lib/useSectionSpy";
import { useAmbient } from "../lib/ambient";
import "./Navbar.css";

const SECTION_IDS = [
  "architecture",
  "projects",
  "skills",
  "education",
  "certifications",
  "contact",
];

const links = [
  { name: "About", href: "#architecture" },
  { name: "Work", href: "#projects" },
  { name: "Skills", href: "#skills" },
  { name: "Education", href: "#education" },
  { name: "Certifications", href: "#certifications" },
  { name: "Contact", href: "#contact" },
];

interface NavbarProps {
  isScrolled?: boolean;
}

const Navbar = ({ isScrolled = false }: NavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [theme, setTheme] = useState(
    () => document.documentElement.getAttribute("data-theme") || "light",
  );
  const activeTab = useSectionSpy(SECTION_IDS);

  const listRef = useRef<HTMLDivElement>(null);
  const progressRef = useAmbient<HTMLSpanElement>("progress");
  const [pill, setPill] = useState<{ x: number; w: number } | null>(null);

  // The highlight is one element that slides between items. Its position is
  // measured only when the target changes, never on scroll or hover frames.
  const target = hovered ?? links.find((l) => l.href === `#${activeTab}`)?.name;
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || !target) {
      setPill(null);
      return;
    }
    const el = list.querySelector<HTMLElement>(`[data-nav="${target}"]`);
    if (!el) {
      setPill(null);
      return;
    }
    setPill({ x: el.offsetLeft, w: el.offsetWidth });
  }, [target]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <>
      <nav className="navbar">
        <div
          className={`navbar-bar surface surface-glass${isScrolled ? " is-scrolled" : ""}`}
          data-elev={isScrolled ? "3" : "2"}
        >
          <span
            className="navbar-progress scroll-progress"
            aria-hidden="true"
            ref={progressRef}
          />

          <a href="#hero" className="navbar-brand">
            Rohan Mukka
          </a>

          <div className="navbar-links" ref={listRef}>
            {pill && (
              <span
                className="navbar-pill"
                aria-hidden="true"
                style={{
                  transform: `translate3d(${pill.x}px, 0, 0)`,
                  width: `${pill.w}px`,
                }}
              />
            )}
            {links.map((link) => (
              <a
                key={link.name}
                href={link.href}
                data-nav={link.name}
                className={`navbar-link${
                  activeTab === link.href.slice(1) ? " is-active" : ""
                }`}
                onMouseEnter={() => setHovered(link.name)}
                onMouseLeave={() => setHovered(null)}
              >
                {link.name}
              </a>
            ))}
            <span className="navbar-divider" />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>

          <div className="navbar-mobile-controls">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button
              type="button"
              className="navbar-burger"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Menu"
              aria-expanded={mobileOpen}
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                {mobileOpen ? (
                  <path d="M18 6L6 18M6 6l12 12" />
                ) : (
                  <path d="M3 12h18M3 6h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`navbar-sheet${mobileOpen ? " is-open" : ""}`}
        hidden={!mobileOpen}
      >
        <div className="navbar-sheet-glow" aria-hidden="true" />
        <button
          type="button"
          className="navbar-sheet-close surface"
          data-elev="3"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        >
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <nav className="navbar-sheet-links">
          {links.map((link, i) => (
            <a
              key={link.name}
              href={link.href}
              style={{ transitionDelay: `${0.05 + i * 0.05}s` }}
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="navbar-sheet-foot">
          © {new Date().getFullYear()} Rohan Mukka
        </div>
      </div>
    </>
  );
};

export default Navbar;
