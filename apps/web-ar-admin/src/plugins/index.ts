import type { App } from 'vue';

import { permission } from '#/directives/permission';

// Phase 1 迁入：注册高频 naive-ui 组件
export function setupNaive(_app: App) {}

// Phase 1 迁入：createDiscreteApi（message/dialog/notification 在组件外调用）
export function setupNaiveDiscreteApi() {}

export function setupDirectives(app: App) {
  app.directive('permission', permission);
}
