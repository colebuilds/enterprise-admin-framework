import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    redirect: '/dashboard/welcome',
    meta: {
      icon: 'ant-design:dashboard-outlined',
      order: 0,
      title: 'menu.dashboard',
    },
    children: [
      {
        path: 'welcome',
        name: 'DashboardWelcome',
        component: () => import('#/views/dashboard/welcome/index.vue'),
        meta: {
          title: 'menu.welcome',
        },
      },
    ],
  },
];

export default routes;
