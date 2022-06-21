import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import 'primevue/resources/primevue.min.css';

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  await import('primevue/resources/themes/lara-dark-blue/theme.css');
} else {
  await import('primevue/resources/themes/lara-light-blue/theme.css');
}

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);

app.mount('#app');
