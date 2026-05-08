import { watch } from 'vue';

import { preferences } from '@vben/preferences';
import { useAccessStore } from '@vben/stores';

import { api } from '#/api';
import { invalidateDicts } from '#/store/dict';

/**
 * 监听语言切换，触发两个副作用：
 *   1. invalidateDicts() — 所有字典 cache 标记 stale，active useQuery 自动 refetch
 *   2. api.system.changeLanguage() — 已登录时同步后端语言偏好（fire-and-forget）
 *
 * 在 App.vue setup 中调用一次（全局单例，不需要 onUnmounted 清理）。
 */
export function useLocaleSync() {
  let skipInitial = true;

  watch(
    () => preferences.app.locale,
    async (locale, prevLocale) => {
      if (skipInitial) {
        skipInitial = false;
        return;
      }
      if (locale === prevLocale) return;

      invalidateDicts();

      const accessStore = useAccessStore();
      if (accessStore.accessToken) {
        api.system.changeLanguage().catch(() => {});
      }
    },
  );
}
