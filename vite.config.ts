/// <reference types="vitest/config" />
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// In production, /fr and /en are answered with the prerendered dist/{fr,en}/index.html.
// `vite preview` would fall back to the SPA shell for those paths (it only resolves a
// directory index when the URL ends with a slash), so mirror production here.
function servePrerenderedLocales(): Plugin {
  return {
    name: 'serve-prerendered-locales',
    configurePreviewServer(server) {
      server.middlewares.use((req, _res, next) => {
        req.url = req.url?.replace(/^\/(fr|en)(?=$|\?)/, '/$1/index.html');
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), servePrerenderedLocales()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    exclude: ['node_modules', 'tests/**'],
  },
});
