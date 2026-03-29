import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  plugins: [
    {
      name: 'serve-static-articles',
      configureServer(server) {
        // Serve index.html from public subdirectories (e.g. /article-slug/)
        // This runs BEFORE Vite's SPA fallback, so static articles get served
        // while the main app's hash-based routing still works at /
        server.middlewares.use((req, res, next) => {
          const url = (req.url || '').split('?')[0];
          if (url !== '/' && url.endsWith('/')) {
            const filePath = path.join(process.cwd(), 'public', url, 'index.html');
            if (fs.existsSync(filePath)) {
              res.setHeader('Content-Type', 'text/html; charset=utf-8');
              res.end(fs.readFileSync(filePath, 'utf-8'));
              return;
            }
          }
          next();
        });
      },
    },
  ],
});
