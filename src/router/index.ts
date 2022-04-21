import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import Upload from '@/views/Run report/children/Upload.vue';
import RunReportView from '@/views/Run report/RunReportView.vue';
import SelectExecutionMethodView from '@/views/Run report/children/SelectExecutionMethodView.vue';

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
        { path: '', component: SelectExecutionMethodView, alias: 'select' },
        {
          path: '/run',
          component: HomeView,
          children: [
            {
              path: '/upload-or-paste',
              name: 'upload-or-paste',
              component: Upload,
            },
            {
              path: '/github',
              name: 'github',
              component: HomeView,
              children: [
                { path: '/log-in', name: 'log-in', component: HomeView },
                { path: '/select-repository', name: 'select-repository', component: HomeView },
              ],
            },
            {
              path: '/public-repo',
              name: 'public-repo',
              component: HomeView,
              children: [{ path: '/insert-url', name: 'insert-url', component: HomeView }],
            },
          ],
        },
      ],
    },
    {
      path: '/confirm',
      name: 'confirm',
      component: HomeView,
    },
    {
      path: '/results',
      name: 'results',
      component: HomeView,
    },
  ],
});

export default router;
