import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = (): { theme: Theme; toggleTheme: () => void } => {
  const getInitialTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark', theme === 'dark');
      document.body.classList.toggle('light', theme === 'light');
    }
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
};
