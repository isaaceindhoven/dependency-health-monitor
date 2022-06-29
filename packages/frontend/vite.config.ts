import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Markdown from 'vite-plugin-md';
import anchor from 'markdown-it-anchor';

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
});
