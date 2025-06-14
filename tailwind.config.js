/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './**/*.{ts,tsx,js,jsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"PP Neue Montreal"', 'Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      },
      colors: {
        'dark-bg': '#0A0A14',
        'accent-black': '#000000'
      }
    }
  },
  plugins: []
};
