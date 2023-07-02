// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PrimeVue from 'primevue/config';
import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(PrimeVue, { ripple: true });
});
