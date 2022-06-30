import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Markdown from 'vite-plugin-md';
import anchor from 'markdown-it-anchor';

const slugify = (s: string) => encodeURIComponent(String(s).trim().toLowerCase().replace('/', '').replace(/\s+/g, '-'));

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/],
    }),
    Markdown({
      markdownItSetup(md) {
        // add anchor links to your H[x] tags
        md.use(anchor, {
          permalink: anchor.permalink.headerLink(),
          slugify,
        });
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~docs': fileURLToPath(new URL('../../docs', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7071',
        changeOrigin: true,
      },
    },
  },
});
