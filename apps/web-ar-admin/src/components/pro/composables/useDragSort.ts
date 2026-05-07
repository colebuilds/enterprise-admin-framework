/* oxlint-disable */
import type { Ref } from 'vue';

import type { ProTableDragSortOptions, Recordable } from '../types';

import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue';

import Sortable from 'sortablejs';

export interface UseDragSortOptions<T extends Recordable = Recordable> {
  /** 数据源 */
  dataSource: Ref<T[]>;

  /** 拖拽配置 */
  options?: ProTableDragSortOptions<T>;

  /** 表格容器引用 */
  containerRef: Ref<HTMLElement | null>;

  /** 是否启用 */
  enabled?: Ref<boolean>;
}

export interface UseDragSortReturn {
  /** 是否正在拖拽 */
  isDragging: Ref<boolean>;

  /** 当前拖拽的索引 */
  dragIndex: Ref<null | number>;

  /** 拖拽手柄 ID */
  dragHandleId: string;

  /** 启用拖拽 */
  enableDrag: () => void;

  /** 禁用拖拽 */
  disableDrag: () => void;

  /** 重新初始化 */
  reinitialize: () => void;

  /** 销毁 Sortable 实例 */
  destroy: () => void;

  /** 手动移动行 */
  moveRow: (fromIndex: number, toIndex: number) => void;
}

/**
 * 拖拽排序 composable
 *
 * @example
 * ```ts
 * const containerRef = ref<HTMLElement | null>(null)
 * const dataSource = ref([...])
 *
 * const { isDragging, moveRow } = useDragSort({
 *   dataSource,
 *   containerRef,
 *   options: {
 *     animation: 150,
 *     onEnd: (event, data) => {
 *       console.log('Sorted:', data)
 *     }
 *   }
 * })
 * ```
 */
export function useDragSort<T extends Recordable = Recordable>(
  options: UseDragSortOptions<T>,
): UseDragSortReturn {
  const {
    dataSource,
    options: dragOptions = {},
    containerRef,
    enabled = ref(true),
  } = options;

  const {
    animation = 150,
    handle = '.drag-handle',
    onEnd,
    disabled: disabledFn,
  } = dragOptions;

  // 状态
  const isDragging = ref(false);
  const dragIndex = ref<null | number>(null);
  const sortableInstance = ref<null | Sortable>(null);

  // 唯一的拖拽手柄 ID
  const dragHandleId = `drag-handle-${Math.random().toString(36).slice(2, 9)}`;

  // 缓存 tbody 元素引用
  let cachedTbody: HTMLElement | null = null;
  let cachedContainerRef: HTMLElement | null = null;

  // 静态选择器数组 (避免每次调用时重新创建)
  const TBODY_SELECTORS = [
    '.n-data-table-tbody',
    '.n-data-table tbody',
    'tbody',
  ] as const;

  /**
   * 获取表格 tbody 元素 (带缓存)
   */
  function getTbody(): HTMLElement | null {
    if (!containerRef.value) {
      cachedTbody = null;
      cachedContainerRef = null;
      return null;
    }

    // 如果容器没变且缓存有效,直接返回缓存
    if (
      containerRef.value === cachedContainerRef &&
      cachedTbody && // 验证缓存的元素仍在 DOM 中
      cachedTbody.isConnected
    ) {
      return cachedTbody;
    }

    // 更新容器引用
    cachedContainerRef = containerRef.value;

    // 尝试多种选择器
    for (const selector of TBODY_SELECTORS) {
      const tbody = containerRef.value.querySelector(selector);
      if (tbody) {
        cachedTbody = tbody as HTMLElement;
        return cachedTbody;
      }
    }

    cachedTbody = null;
    return null;
  }

  /**
   * 清除缓存
   */
  function clearCache(): void {
    cachedTbody = null;
    cachedContainerRef = null;
  }

  /**
   * 初始化 Sortable
   */
  function initSortable(): void {
    const tbody = getTbody();
    if (!tbody || sortableInstance.value) return;

    const handleSelector =
      typeof handle === 'string' ? handle : `.${dragHandleId}`;

    sortableInstance.value = Sortable.create(tbody, {
      animation,
      handle: handleSelector,
      ghostClass: 'pro-table-row-ghost',
      chosenClass: 'pro-table-row-chosen',
      dragClass: 'pro-table-row-drag',
      filter: '.no-drag, .n-data-table-expand-trigger',
      preventOnFilter: true,
      forceFallback: true,
      fallbackClass: 'pro-table-row-fallback',

      onStart(evt) {
        isDragging.value = true;
        dragIndex.value = evt.oldIndex ?? null;
      },

      onMove(evt) {
        // 检查目标行是否禁用拖拽
        if (disabledFn) {
          const targetIndex = [...evt.to.children].indexOf(evt.related);
          if (targetIndex !== -1 && targetIndex < dataSource.value.length) {
            const targetRow = dataSource.value[targetIndex];
            if (disabledFn(targetRow, targetIndex)) {
              return false;
            }
          }
        }
        return true;
      },

      onEnd(evt) {
        isDragging.value = false;
        dragIndex.value = null;

        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;

        if (
          oldIndex !== undefined &&
          newIndex !== undefined &&
          oldIndex !== newIndex
        ) {
          // 更新数据
          const newData = [...dataSource.value];
          const [movedItem] = newData.splice(oldIndex, 1);
          newData.splice(newIndex, 0, movedItem);
          dataSource.value = newData;

          // 触发回调
          onEnd?.({ oldIndex, newIndex }, newData);
        }
      },
    });
  }

  /**
   * 销毁 Sortable
   */
  function destroy(): void {
    if (sortableInstance.value) {
      sortableInstance.value.destroy();
      sortableInstance.value = null;
    }
    clearCache();
  }

  /**
   * 重新初始化
   */
  function reinitialize(): void {
    destroy();
    nextTick(() => {
      if (enabled.value) {
        initSortable();
      }
    });
  }

  /**
   * 启用拖拽
   */
  function enableDrag(): void {
    if (sortableInstance.value) {
      sortableInstance.value.option('disabled', false);
    }
  }

  /**
   * 禁用拖拽
   */
  function disableDrag(): void {
    if (sortableInstance.value) {
      sortableInstance.value.option('disabled', true);
    }
  }

  /**
   * 手动移动行
   */
  function moveRow(fromIndex: number, toIndex: number): void {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= dataSource.value.length) return;
    if (toIndex < 0 || toIndex >= dataSource.value.length) return;

    const newData = [...dataSource.value];
    const [movedItem] = newData.splice(fromIndex, 1);
    newData.splice(toIndex, 0, movedItem);
    dataSource.value = newData;

    onEnd?.({ oldIndex: fromIndex, newIndex: toIndex }, newData);
  }

  // 监听容器变化
  watch(
    containerRef,
    (newContainer) => {
      if (newContainer && enabled.value) {
        nextTick(() => initSortable());
      }
    },
    { immediate: true },
  );

  // 监听启用状态
  watch(enabled, (isEnabled) => {
    if (isEnabled) {
      initSortable();
    } else {
      destroy();
    }
  });

  // 生命周期
  onMounted(() => {
    if (enabled.value) {
      nextTick(() => initSortable());
    }
  });

  onUnmounted(() => {
    destroy();
  });

  return {
    isDragging,
    dragIndex,
    dragHandleId,
    enableDrag,
    disableDrag,
    reinitialize,
    destroy,
    moveRow,
  };
}

/**
 * 拖拽排序样式
 */
export const dragSortStyles = `
.pro-table-row-ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.pro-table-row-chosen {
  background: #e6f7ff;
}

.pro-table-row-drag {
  opacity: 1;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.pro-table-row-fallback {
  opacity: 1;
}

.drag-handle {
  cursor: grab;
  padding: 4px 8px;
  color: #999;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
}

.drag-handle:hover {
  color: #1890ff;
}

.drag-handle:active {
  cursor: grabbing;
}

.drag-handle--disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
`;

export default useDragSort;
