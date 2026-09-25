import React from "react";
import { setDemoVariant, useDemoVariant } from "../lib/demoVariant";

const OPTIONS = [
  ["list", "1 · Editorial list"],
  ["timeline", "2 · Timeline"],
  ["badges", "3 · Badge wall"],
  ["stack", "4 · Sticky stack"],
  ["papers", "5 · Certificate papers"],
  ["accordion", "6 · Accordion columns"],
] as const;

// Local-only panel for comparing the Certifications design options.
const DemoSwitcher = () => {
  const current = useDemoVariant("certs", "list");
  return (
    <div className="fixed bottom-6 left-6 z-[80] flex flex-col gap-2 p-3 rounded-2xl glass-card text-sm">
      <a href="#certifications" className="text-[10px] uppercase tracking-[0.3em] text-accent font-bold hover:underline">
        Certifications demo ↓
      </a>
      {OPTIONS.map(([value, label]) => (
        <button
          key={value}
          onClick={() => setDemoVariant("certs", value)}
          className={`px-3 py-1.5 rounded-full text-left text-xs font-semibold transition-colors ${
            current === value ? "bg-primary-text text-background" : "text-primary-text hover:bg-surface-subtle"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default DemoSwitcher;
