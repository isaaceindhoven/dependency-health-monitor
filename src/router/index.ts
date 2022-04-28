import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import RunReportView from '@/views/run-report/RunReportView.vue';
import PasteOrUploadView from '@/views/run-report/children/PasteOrUploadView.vue';
import SelectExecutionMethodView from '@/views/run-report/children/SelectExecutionMethodView.vue';
import ConfirmAndExecute from '@/views/run-report/children/ConfirmAndExecuteView.vue';

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
          component: HomeView,
        },
      ],
    },
  ],
});

export default router;
