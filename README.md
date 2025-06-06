# Rohan Mukka - Portfolio

This repository contains the source code for my personal portfolio website. It is built with **React**, **TypeScript**, and **Vite** and showcases my projects, skills, and experience.

## Features

- Responsive layout built with [Tailwind CSS](https://tailwindcss.com/) and React components.
- Animated sections including a typewriter effect (`useTypewriter` hook) and Lottie animations.
- Data-driven design using `data.tsx` and typed interfaces in `types.ts`.
- Simple configuration via `vite.config.ts` with support for environment variables.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   This will open the app on <http://localhost:5173> by default.

3. To create a production build:
   ```bash
   npm run build
   ```
   The compiled files are output to the `dist` directory.

4. Preview the production build locally:
   ```bash
   npm run preview
   ```

## Project Structure

- `index.html` – entry HTML file using an import map to load dependencies from `esm.sh`.
- `index.tsx` – mounts the `App` component into the page.
- `components/` – React components for common UI elements and page sections.
- `hooks/` – custom React hooks such as `useTypewriter`.
- `data.tsx` – data describing projects, skills, and other profile information.
- `types.ts` – TypeScript interfaces used throughout the project.

Feel free to fork this repository or use it as inspiration for your own portfolio.



## License

This project is licensed under the [MIT License](LICENSE).
