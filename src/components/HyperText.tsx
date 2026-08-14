import React, { useEffect, useRef, useState } from 'react';

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+";

interface HyperTextProps {
  text: string;
  className?: string;
}

const HyperText: React.FC<HyperTextProps> = ({ text, className = "" }) => {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<number | null>(null);

  const startScramble = () => {
    let iteration = 0;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    intervalRef.current = window.setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((_, index) => {
            if (index < iteration) return text[index];
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );

      if (iteration >= text.length && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      iteration += 1 / 3;
    }, 30);
  };

  useEffect(() => {
    startScramble();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [text]);

  return (
    <span 
      className={`${className} cursor-default font-mono text-inherit`}
      onMouseEnter={startScramble}
    >
      {displayText}
    </span>
  );
};

export default HyperText;
