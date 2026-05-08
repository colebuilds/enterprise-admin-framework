import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/system',
    name: 'System',
    redirect: '/system/user',
    meta: {
      authority: ['SystemManage'],
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
          authority: ['SystemManage:SysUser'],
          icon: 'lucide:users',
          keepAlive: false,
          title: 'menu.user',
        },
      },
    ],
  },
];

export default routes;
