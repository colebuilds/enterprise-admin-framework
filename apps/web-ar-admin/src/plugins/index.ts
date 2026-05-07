import type { App } from 'vue';

// Phase 1 迁入：注册高频 naive-ui 组件
export function setupNaive(_app: App) {}

// Phase 1 迁入：createDiscreteApi（message/dialog/notification 在组件外调用）
export function setupNaiveDiscreteApi() {}

// Phase 1.3 迁入：v-permission 指令
export function setupDirectives(_app: App) {}
