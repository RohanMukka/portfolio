import React from "react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  /** Two-digit running number, e.g. "02". */
  index: string;
  /** Small label beside the number, e.g. "Work". */
  label: string;
  title: React.ReactNode;
  subtitle?: string;
  /** Optional controls (filters, toggles) aligned to the title's baseline. */
  children?: React.ReactNode;
  className?: string;
}

// Editorial section opener: "02 — Work", a very large left-aligned title,
// an optional one-line subtitle and a hairline rule underneath.
const SectionHeader = ({ index, label, title, subtitle, children, className = "" }: SectionHeaderProps) => (
  <motion.header
    className={`w-full text-left ${className}`}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-10%" }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
  >
    <div className="flex items-center gap-4 mb-6 text-xs font-medium uppercase tracking-[0.3em] text-primary-secondary">
      <span className="text-accent tabular-nums">{index}</span>
      <span className="h-px w-10 bg-primary-text/25" />
      <span>{label}</span>
    </div>
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div>
        <h2 className="text-[clamp(2.75rem,7vw,6.5rem)] font-bold leading-[0.92] tracking-[-0.045em] text-primary-text">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-6 max-w-xl text-lg md:text-xl text-primary-secondary leading-relaxed">{subtitle}</p>
        )}
      </div>
      {children}
    </div>
    <div className="mt-10 h-px w-full bg-primary-text/10" />
  </motion.header>
);

export default SectionHeader;
