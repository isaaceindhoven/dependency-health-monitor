import { fileURLToPath, URL } from 'url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mdPlugin, { Mode } from 'vite-plugin-markdown';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    mdPlugin({
      mode: [Mode.VUE],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '~docs': fileURLToPath(new URL('../../docs', import.meta.url)),
    },
  },
});
