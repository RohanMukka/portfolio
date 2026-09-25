import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const LIVE_SITE = 'https://portfolio-rohan03.vercel.app';

// /api/views is a Vercel function, so `vite dev` can't run it and the footer
// counter stays hidden locally. In dev, answer it with the live count instead.
// Always a GET, so local visits never bump the real counter.
const devViewsCounter = (): Plugin => ({
  name: 'dev-views-counter',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use('/api/views', async (_req, res) => {
      try {
        const live = await fetch(`${LIVE_SITE}/api/views`);
        res.statusCode = live.status;
        res.setHeader('Content-Type', 'application/json');
        res.end(await live.text());
      } catch {
        res.statusCode = 502;
        res.end();
      }
    });
  },
});

export default defineConfig({
  base: '/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [
    react(),
    tailwindcss(),
    devViewsCounter(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});
