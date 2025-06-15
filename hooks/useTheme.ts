import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';

export const useTheme = (): { theme: Theme } => {
  const getPreferredTheme = (): Theme => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    return 'dark';
  };

  const [theme, setTheme] = useState<Theme>(getPreferredTheme);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('dark', theme === 'dark');
      document.body.classList.toggle('light', theme === 'light');
    }
  }, [theme]);

  return { theme };
};
