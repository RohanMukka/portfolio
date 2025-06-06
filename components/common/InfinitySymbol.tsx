import React from "react";

interface InfinitySymbolProps {
  className?: string;
}

const InfinitySymbol: React.FC<InfinitySymbolProps> = ({ className }) => (
  <svg
    viewBox="0 0 200 100"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <defs>
      <linearGradient id="infGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#8A2BE2" />
        <stop offset="50%" stopColor="#ec4899" />
        <stop offset="100%" stopColor="#ef4444" />
      </linearGradient>
      <filter id="infShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.4" />
      </filter>
    </defs>
    <path
      d="M30,50 C30,20 70,20 100,50 C130,80 170,80 170,50 C170,20 130,20 100,50 C70,80 30,80 30,50 Z"
      fill="none"
      stroke="url(#infGrad)"
      strokeWidth="14"
      strokeLinecap="round"
      filter="url(#infShadow)"
    />
  </svg>
);

export default InfinitySymbol;
