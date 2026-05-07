/* oxlint-disable */
import type { Ref } from 'vue';

import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useAppUserStore } from '#/store/app-user';

export interface UsePinStorageReturn {
  pinnedPaths: Ref<string[]>;
}

/**
 * 钉选字段持久化（按 userId + route.path 隔离，多页面/多实例不冲突）
 */
export function usePinStorage(): UsePinStorageReturn {
  const route = useRoute();
  const userStore = useAppUserStore();

  const storageKey = computed(() => {
    const userId = userStore.getUserInfo?.userId ?? 'anonymous';
    return `pro-crud-pin_${userId}_${route.path}`;
  });

  function load(): string[] {
    try {
      const raw = localStorage.getItem(storageKey.value);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function save(paths: string[]) {
    try {
      localStorage.setItem(storageKey.value, JSON.stringify(paths));
    } catch {
      /* ignore */
    }
  }

  const pinnedPaths = ref<string[]>(load());

  watch(pinnedPaths, (val) => save(val));

  return { pinnedPaths };
}
