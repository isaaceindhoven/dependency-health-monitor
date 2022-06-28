import { defineNuxtConfig } from 'nuxt';

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  ssr: false,
  srcDir: 'src',
  css: [
    'primeflex/primeflex.css',
    'primeicons/primeicons.css',
    'primevue/resources/primevue.min.css',
    'primevue/resources/themes/lara-light-blue/theme.css',
    '@/assets/base.css',
  ],
  buildModules: ['@pinia/nuxt'],
  runtimeConfig: {
    gitHubAccessToken: process.env.NUXT_GITHUB_PERSONAL_ACCESS_TOKEN || '',
    openCollectiveApiKey: process.env.NUXT_OPEN_COLLECTIVE_API_KEY || '',
  },
});
