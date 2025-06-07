# Rohan Mukka - Portfolio

This repository contains the source code for my personal portfolio website. It is built with **React**, **TypeScript**, and **Vite** and showcases my projects, skills, and experience.

## Features

- Responsive layout built with [Tailwind CSS](https://tailwindcss.com/) and React components.
- Animated sections including a typewriter effect (`useTypewriter` hook) and Lottie animations.
- Animated radial background with a dark theme.
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

## Styling and Theme

The project relies on Tailwind CSS and a small amount of custom CSS. Fonts are loaded
from Google Fonts and then referenced in Tailwind via an inline configuration.

### Fonts

- **Inter** is the default sans‑serif font.
- **Fira Code** is used for any monospaced text.

Both fonts are imported in `index.html` using a `@import` rule:

```html
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
```

Tailwind is customized with these fonts by extending the `fontFamily` section of the
`tailwind.config` object also defined in `index.html`:

```javascript
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },
            // additional color overrides can be added here
        },
    },
}
```

### Color Palette

The background uses a radial gradient defined with CSS custom properties. The gradient
transitions from `#1a1a1a` to `#0f0f0f`. Accent elements primarily use Tailwind's
purple and pink shades for gradients and hover states.

Feel free to fork this repository or use it as inspiration for your own portfolio.



## License

This project is licensed under the [MIT License](LICENSE).
