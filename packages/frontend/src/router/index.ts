import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import PasteOrUploadView from '@/views/run-report/children/PasteOrUploadView.vue';
import ResultsView from '@/views/run-report/children/ResultsView.vue';
import AboutView from '@/views/about/AboutView.vue';
import ScoringTheFinancialHealthMdView from '@/views/about/children/ScoringTheFinancialHealthMdView.vue';
import ScoringTheEquityMdView from '@/views/about/children/ScoringTheEquityMdView.vue';
import IntroductionView from '@/views/about/children/introduction/IntroductionView.vue';

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
      children: [
        {
          path: '',
          component: IntroductionView,
        },
        {
          path: 'scoring-the-financial-health',
          component: ScoringTheFinancialHealthMdView,
        },
        {
          path: 'scoring-the-equity',
          component: ScoringTheEquityMdView,
        },
      ],
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
