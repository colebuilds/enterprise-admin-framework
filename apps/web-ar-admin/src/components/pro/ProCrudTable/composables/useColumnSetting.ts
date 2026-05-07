/* oxlint-disable */
import type { ComputedRef } from 'vue';

import type { ProColumn, Recordable } from '../../types';
import type { ColumnSettingItem } from './useColumnSettingStorage';

import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useDebounceFn } from '@vueuse/core';

import { useAppUserStore } from '#/store/app-user';

import { getColumnSetting, saveColumnSetting } from './useColumnSettingStorage';

export type { ColumnSettingItem };

export interface UseColumnSettingOptions<T extends Recordable = Recordable> {
  columns: ComputedRef<ProColumn<T>[]>;
  columnSettingVersion?: ComputedRef<number | string | undefined>;
}

/**
 * 按列设置中的 order 字段归一化排序。
 *
 * 说明：
 * - 钉选列会通过更新 order 排到固定分区前面，但数组本身不一定同步重排。
 * - 持久化和恢复都应以 order 为准，避免重新登录后顺序错乱、fixed 分区失效。
 */
function normalizeColumnSettingOrder(
  settings: ColumnSettingItem[],
): ColumnSettingItem[] {
  return settings
    .map((item, index) => ({ item, index }))
    .toSorted((left, right) => {
      const leftOrder =
        Number.isFinite(left.item.order) && left.item.order >= 0
          ? left.item.order
          : left.index;
      const rightOrder =
        Number.isFinite(right.item.order) && right.item.order >= 0
          ? right.item.order
          : right.index;
      return leftOrder - rightOrder || left.index - right.index;
    })
    .map(({ item }, order) => ({ ...item, order }));
}

/** djb2 hash → 6 位十六进制 */
function djb2Hash(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
  }
  return (hash & 0xFF_FF_FF).toString(16).padStart(6, '0');
}

/** 提取可设置列（排除选择列、操作列等结构性列） */
function isSettableColumn<T extends Recordable = Recordable>(
  col: ProColumn<T>,
): boolean {
  const key = String(col.key ?? '');
  return (
    !!key &&
    key !== '__action__' &&
    (col as any).type !== 'selection' &&
    (col as any).type !== 'expand'
  );
}

export function useColumnSetting<T extends Recordable = Recordable>(
  options: UseColumnSettingOptions<T>,
) {
  const route = useRoute();
  const userStore = useAppUserStore();

  // 列配置状态
  const columnSettings = ref<ColumnSettingItem[]>([]);
  const isReady = ref(false);
  // 重置计数器，用于强制 NDataTable 重新渲染以清除内部 resize 状态
  const resetKey = ref(0);
  // 防止 watch 触发的 save 覆盖正在加载的 DB 数据
  let dbLoaded = false;

  // 生成 tableId
  const tableId = computed(() => {
    const keys = options.columns.value
      .filter(isSettableColumn)
      .map((c) => String(c.key))
      .join(',');
    const version = options.columnSettingVersion?.value;
    const fingerprint =
      version === undefined ? keys : `${keys}__${String(version)}`;
    return `${route.path}_${djb2Hash(fingerprint)}`;
  });

  // 存储 key
  const storageKey = computed(() => {
    const userId = userStore.getUserInfo?.userId ?? 'anonymous';
    return `${userId}_${tableId.value}`;
  });

  // 从 props.columns 生成默认配置
  function getDefaultSettings(): ColumnSettingItem[] {
    return normalizeColumnSettingOrder(
      options.columns.value.filter(isSettableColumn).map((col, index) => {
        const item: ColumnSettingItem = {
          key: String(col.key),
          visible: col.hideInTable !== true,
          order: index,
        };
        if (col.fixed !== undefined) item.fixed = col.fixed;
        return item;
      }),
    );
  }

  // 合并策略：保留已保存排序和显隐，新列追加末尾，已删除列移除
  function mergeSettings(
    saved: ColumnSettingItem[],
    current: ColumnSettingItem[],
  ): ColumnSettingItem[] {
    const currentKeySet = new Set(current.map((c) => c.key));
    const savedKeySet = new Set(saved.map((c) => c.key));
    const currentMap = new Map(current.map((c) => [c.key, c]));

    // 保留 saved 中仍然存在的列（包括 width、fixed）
    const merged = saved
      .filter((s) => currentKeySet.has(s.key))
      .map((s) => {
        const currentItem = currentMap.get(s.key);
        const item: ColumnSettingItem = {
          key: s.key,
          visible: s.visible,
          order:
            Number.isFinite(s.order) && s.order >= 0
              ? s.order
              : (currentItem?.order ?? current.length),
        };
        if (s.width !== undefined) item.width = s.width;
        if (s.fixed !== undefined) item.fixed = s.fixed;
        else if (currentItem?.fixed !== undefined)
          item.fixed = currentItem.fixed;
        return item;
      });

    // 追加新增列
    const newColumns = current.filter((c) => !savedKeySet.has(c.key));
    newColumns.forEach((c) => {
      merged.push({
        key: c.key,
        visible: c.visible,
        order: merged.length,
        ...(c.width === undefined ? {} : { width: c.width }),
        ...(c.fixed === undefined ? {} : { fixed: c.fixed }),
      });
    });

    return normalizeColumnSettingOrder(merged);
  }

  // 从 IndexedDB 异步加载已保存配置（覆盖默认值）
  async function loadFromStorage() {
    try {
      const saved = await getColumnSetting(storageKey.value);
      if (saved && saved.length > 0) {
        const defaults = getDefaultSettings();
        columnSettings.value = mergeSettings(saved, defaults);
      }
    } catch (error) {
      console.error('加载列设置失败:', error);
    } finally {
      dbLoaded = true;
    }
  }

  // 防抖持久化
  const debouncedSave = useDebounceFn(() => {
    if (!dbLoaded) return;
    saveColumnSetting(
      storageKey.value,
      normalizeColumnSettingOrder(columnSettings.value),
    ).catch((error) => {
      console.error('保存列设置失败:', error);
    });
  }, 300);

  // 监听变化自动持久化
  watch(columnSettings, debouncedSave, { deep: true });

  // 输出：按设置重排并设置 hideInTable
  const settledColumns = computed<ProColumn<T>[]>(() => {
    if (!isReady.value) return options.columns.value;

    const settingMap = new Map(columnSettings.value.map((s) => [s.key, s]));

    // 收集可设置列并按 order 排序
    const settable = options.columns.value.filter(isSettableColumn);
    const sorted = [...settable].toSorted((a, b) => {
      const oa = settingMap.get(String(a.key))?.order ?? 0;
      const ob = settingMap.get(String(b.key))?.order ?? 0;
      return oa - ob;
    });

    // 设置 hideInTable、自定义宽度和固定悬浮
    return sorted.map((col) => {
      const setting = settingMap.get(String(col.key));
      let result = col;

      if (setting && !setting.visible) {
        result = { ...result, hideInTable: true };
      } else if (setting && setting.visible && col.hideInTable) {
        const { hideInTable: _, ...rest } = result;
        result = rest as ProColumn<T>;
      }

      // 应用用户自定义列宽
      if (setting?.width !== undefined) {
        result = { ...result, width: setting.width };
      }

      // 应用用户设置的固定悬浮
      if (setting && 'fixed' in setting) {
        if (setting.fixed) {
          result = { ...result, fixed: setting.fixed };
        } else if ((result as any).fixed) {
          // 用户显式取消固定时，移除列原有的 fixed 配置。
          const { fixed: _, ...rest } = result as any;
          result = rest as ProColumn<T>;
        }
      }

      return result;
    });
  });

  // 切换列显隐
  function toggleColumnVisibility(key: string) {
    const item = columnSettings.value.find((s) => s.key === key);
    if (item) {
      item.visible = !item.visible;
      columnSettings.value = normalizeColumnSettingOrder(columnSettings.value);
    }
  }

  // 切换列固定悬浮
  function toggleColumnFixed(key: string) {
    const item = columnSettings.value.find((s) => s.key === key);
    if (!item) return;

    if (item.fixed) {
      // 取消固定，显式记录为 false，避免默认 fixed 被自动恢复。
      item.fixed = false;
    } else {
      // 设为固定
      item.fixed = 'left';
    }

    // 重排 order：固定列在前，非固定列在后，各自内部保持相对顺序
    const fixedItems = columnSettings.value
      .filter((s) => s.fixed)
      .toSorted((a, b) => a.order - b.order);
    const normalItems = columnSettings.value
      .filter((s) => !s.fixed)
      .toSorted((a, b) => a.order - b.order);
    [...fixedItems, ...normalItems].forEach((s, i) => {
      s.order = i;
    });

    // 同步数组顺序与 order，避免持久化后恢复顺序错乱。
    columnSettings.value = normalizeColumnSettingOrder(columnSettings.value);
  }

  // 更新列排序（接收新的 key 数组顺序）
  function updateColumnOrder(orderedKeys: string[]) {
    const settingMap = new Map(columnSettings.value.map((s) => [s.key, s]));
    columnSettings.value = normalizeColumnSettingOrder(
      orderedKeys.map((key, index) => {
        const existing = settingMap.get(key);
        return existing
          ? { ...existing, order: index }
          : { key, visible: true, order: index };
      }),
    );
  }

  // 重置为默认（清除所有自定义固定）
  function resetToDefault() {
    columnSettings.value = getDefaultSettings().map(
      ({ key, visible, order }) => ({
        key,
        visible,
        order,
      }),
    );
    // 强制 NDataTable 重新渲染，清除内部 resizable 缓存
    resetKey.value++;
  }

  // 更新列宽
  function updateColumnWidth(key: string, width: number) {
    const item = columnSettings.value.find((s) => s.key === key);
    if (item) {
      item.width = width;
    }
  }

  // 全选/全不选
  function setAllVisible(visible: boolean) {
    columnSettings.value = columnSettings.value.map((s) => ({
      ...s,
      visible,
    }));
  }

  // 同步初始化：直接从当前 columns 生成默认设置
  const initialColumns = options.columns.value;
  if (initialColumns.length > 0) {
    columnSettings.value = getDefaultSettings();
    // Bug fix: isReady 延迟到 DB 加载完成后，避免竞态
    loadFromStorage().then(() => {
      isReady.value = true;
    });
  } else {
    // 监听 columns 变化（处理动态列场景）
    const stopWatch = watch(options.columns, (cols) => {
      if (cols.length > 0 && columnSettings.value.length === 0) {
        columnSettings.value = getDefaultSettings();
        loadFromStorage().then(() => {
          isReady.value = true;
        });
        stopWatch();
      }
    });
  }

  return {
    columnSettings,
    settledColumns,
    isReady,
    resetKey,
    toggleColumnVisibility,
    toggleColumnFixed,
    updateColumnOrder,
    updateColumnWidth,
    resetToDefault,
    setAllVisible,
  };
}
