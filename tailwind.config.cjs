/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: "var(--bg-primary)", secondary: "var(--bg-elevated)" },
        primary: {
          text: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        glass: {
          bg: "var(--glass-bg)",
          border: "var(--glass-border)",
          shadow: "var(--glass-shadow)",
        },
        surface: { subtle: "var(--surface-subtle)" },
        accent: "var(--accent)",
        "primary-blue": "var(--accent)",
        "electric-cyan": "var(--accent)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Syne", "sans-serif"],
      },
    },
  },
  plugins: [],
};
