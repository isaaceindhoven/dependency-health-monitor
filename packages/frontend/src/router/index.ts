import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import PasteOrUploadView from '@/views/run-report/children/PasteOrUploadView.vue';
import ResultsView from '@/views/run-report/children/ResultsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/run-report',
      name: 'run report',
      component: PasteOrUploadView,
    },
    {
      path: '/financial-report',
      name: 'financial report',
      component: ResultsView,
    },
  ],
});

export default router;
