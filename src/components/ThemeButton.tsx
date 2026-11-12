import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "../lib/theme";

// Switches between the light and dark themes. Used in the navbar and in a
// case study's header (which covers the navbar); both follow the page's
// theme, so they always agree.
const ThemeButton = () => {
  const theme = useTheme();
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
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
};

export default ThemeButton;
