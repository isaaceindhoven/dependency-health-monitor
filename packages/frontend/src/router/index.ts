import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/about/AboutView.vue';
import RunReportView from '@/views/run-report/RunReportView.vue';
import PasteOrUploadView from '@/views/run-report/children/PasteOrUploadView.vue';
import SelectExecutionMethodView from '@/views/run-report/children/SelectExecutionMethodView.vue';
import ConfirmAndExecute from '@/views/run-report/children/ConfirmAndExecuteView.vue';
import Results from '@/views/run-report/children/ResultsView.vue';
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
      name: 'report',
      component: RunReportView,
      children: [
        { path: 'select', name: 'select', component: SelectExecutionMethodView, alias: '' },
        {
          path: 'paste-or-upload',
          name: 'paste-or-upload',
          component: PasteOrUploadView,
        },
        { path: 'github-log-in', name: 'log-in', component: HomeView },
        { path: 'github-select-repository', name: 'select-repository', component: HomeView },
        {
          path: 'public-repo',
          name: 'public-repo',
          component: HomeView,
        },
        {
          path: 'confirm',
          name: 'confirm',
          component: ConfirmAndExecute,
        },
        {
          path: 'results',
          name: 'results',
          component: Results,
        },
      ],
    },
  ],
});

export default router;
