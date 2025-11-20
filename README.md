# Rohan Mukka — Portfolio

[Live Site](https://portfolio-rohan03.vercel.app/)

A personal portfolio built with React, Vite, Tailwind CSS, and Framer Motion. Includes an animated particles background.

## Tech Stack

- React 19 + Vite 6
- Tailwind CSS 4
- Framer Motion
- Particles.js (via CDN)

## Getting Started

Prerequisites: Node.js 18+ and npm

- Install dependencies: `npm install`
- Start dev server: `npm run dev`
- Build for production: `npm run build`
- Preview production build: `npm run preview`

## Particles Background

An animated particles layer is rendered behind the app content.

- Config file: `public/particlesjs-config.json`
- Loader and container: `index.html`
  - Container div: `<div id="particles-js"></div>`
  - CDN script: `https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js`
  - Loads config with: `particlesJS.load('particles-js', '/particlesjs-config.json', ...)`
- Layering: the canvas is fixed full-screen with `pointer-events: none`, and the React `#root` sits above it.

### Customize

Edit `public/particlesjs-config.json` to adjust behavior:

- Count: `particles.number.value`
- Color: `particles.color.value`
- Speed: `particles.move.speed`
- Links: `particles.line_linked.enable`
- Interactivity: `interactivity.events` and `interactivity.modes`

## Project Structure (high level)

- `index.html` — HTML shell, Tailwind setup, particles container/loader
- `index.tsx` — React entry
- `App.tsx` — Main layout and sections
- `components/` — UI components
- `hooks/` — Custom hooks
- `data.ts` — Portfolio content (experience, projects, skills)
- `types.ts` — TypeScript interfaces
- `public/` — Static assets (including `particlesjs-config.json`)


