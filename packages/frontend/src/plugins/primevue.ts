// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { defineNuxtPlugin } from '#app';
import PrimeVue from 'primevue/config';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue);
});
