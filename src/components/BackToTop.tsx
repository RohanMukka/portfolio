import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { useAmbient } from "../lib/ambient";
import "./BackToTop.css";

/**
 * Scroll-to-top control with a progress ring.
 *
 * The ring is driven by --scrollp from the ambient engine through
 * stroke-dashoffset, so it needs no animation library and no scroll subscription
 * of its own. Only the show/hide threshold lives in React state, and that flips
 * at most once per crossing.
 */
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const ringRef = useAmbient<SVGCircleElement>("progress");

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 300);
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility();
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () =>
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });

  return (
    <button
      onClick={scrollToTop}
      className={`back-to-top surface surface-glass${isVisible ? " is-visible" : ""}`}
      aria-label="Back to top"
      tabIndex={isVisible ? 0 : -1}
      aria-hidden={!isVisible}
      data-elev="3"
    >
      <svg
        className="back-to-top-ring"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="46" className="back-to-top-track" />
        <circle cx="50" cy="50" r="46" className="back-to-top-fill" ref={ringRef} />
      </svg>
      <ArrowUp size={22} strokeWidth={2.5} className="back-to-top-arrow" />
    </button>
  );
};

export default BackToTop;
