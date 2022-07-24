import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  // ssr: false,
  srcDir: 'src',
  css: [
    'primevue/resources/themes/lara-light-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeflex/primeflex.css',
    'primeicons/primeicons.css',
    '@/assets/base.scss',
  ],
  buildModules: ['@pinia/nuxt'],
  runtimeConfig: {
    gitHubAccessToken: process.env.NUXT_GITHUB_PERSONAL_ACCESS_TOKEN || '',
    openCollectiveApiKey: process.env.NUXT_OPEN_COLLECTIVE_API_KEY || '',
  },
  modules: ['@nuxt/content'],
  build: {
    transpile: ['primevue'],
  },
});
