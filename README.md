# Rohan Mukka - Portfolio

This project contains the source code for my personal portfolio website built with **React**, **TypeScript** and **Vite**. It showcases my work, skills and experience using a modern, responsive design powered by Tailwind CSS.

## Features

- **Responsive design** built with Tailwind CSS components.
- **Animated sections** including a typewriter effect (via `useTypewriter`) and Lottie animations.
- **Dark theme** with a radial background gradient.
- **Data driven**: portfolio details are loaded from `data.tsx` and validated with TypeScript interfaces.
- **Quick setup** using Vite with optional environment variables.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The app opens on <http://localhost:5173> by default.
3. Build for production:
   ```bash
   npm run build
   ```
   Compiled files are output to the `dist` folder and can be deployed to any static host.
4. Preview the production build locally:
   ```bash
   npm run preview
   ```

## Customization

- **Personal data**: Update your name, links and project information in [`data.tsx`](data.tsx).
- **Site metadata**: Edit [`metadata.json`](metadata.json) or the `<head>` tags in [`index.html`](index.html).
- **Theme**: Modify fonts and colors in [`index.html`](index.html). Fonts are imported from Google Fonts and Fontshare.
- **Environment variables**: Create a `.env` file and set `GEMINI_API_KEY` if your build needs it. Vite exposes it as `process.env.GEMINI_API_KEY`.
- **Resume file**: Place `rohan_resume.pdf` in the `public/` directory. It's referenced using `import.meta.env.BASE_URL` so the link works even when the site is deployed to a subpath.

## Project Structure

- `index.html` – Entry HTML file using an import map.
- `index.tsx` – Mounts the `App` component.
- `components/` – Common UI elements and page sections.
- `hooks/` – Custom hooks such as `useTypewriter`.
- `data.tsx` – Profile and project information.
- `types.ts` – Shared TypeScript interfaces.

## Styling and Theme

Tailwind CSS is extended with custom fonts and colors. The default fonts are **Inter** and **Fira Code**:

```html
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
```

You can further customize the palette and fonts in `tailwind.config` inside `index.html`.

### Color Palette

The background uses a radial gradient (`#1a1a1a` to `#0f0f0f`) and accent elements use purple and pink shades. Feel free to tweak these values to match your own style.

## License

This project is licensed under the [MIT License](LICENSE).
