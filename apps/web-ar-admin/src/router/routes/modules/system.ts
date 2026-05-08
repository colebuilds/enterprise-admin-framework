import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/user',
    meta: {
      authority: ['systemmanage'],
      icon: 'lucide:settings',
      order: 10,
      title: 'menu.system',
    },
    children: [
      {
        path: 'user',
        name: 'SystemUser',
        component: () => import('#/views/system/user/index.vue'),
        meta: {
          authority: ['systemmanage:sysuser'],
          icon: 'lucide:users',
          keepAlive: false,
          title: 'menu.user',
        },
      },
      {
        path: 'role',
        name: 'SystemRole',
        component: () => import('#/views/system/role/index.vue'),
        meta: {
          authority: ['systemmanage:sysrole'],
          icon: 'lucide:shield-check',
          keepAlive: false,
          title: 'menu.role',
        },
      },
    ],
  },
];

export default routes;
