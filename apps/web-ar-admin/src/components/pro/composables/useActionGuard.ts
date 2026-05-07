/* oxlint-disable */
import type { ComputedRef, Ref } from 'vue';

import type { ProEditGuards, Recordable } from '../types';

import { computed, ref } from 'vue';

export interface ActionGuardOptions<T extends Recordable = Recordable> {
  /** 操作守卫配置 */
  guards?: ProEditGuards<T>;

  /** 设置加载状态 */
  setLoading?: (loading: boolean) => void;

  /** 超时时间 (ms) */
  timeout?: number;

  /** 错误处理 */
  onError?: (error: Error, action: string) => void;
}

export interface UseActionGuardReturn<T extends Recordable = Recordable> {
  /** 是否正在执行守卫 */
  isGuardRunning: ComputedRef<boolean>;

  /** 当前执行的守卫名称 */
  currentGuard: Ref<null | string>;

  /** 通用守卫调度 — 按 guardName 分发到对应方法 */
  executeGuard: (guardName: string, ...args: any[]) => Promise<any>;

  /** 是否可以编辑 */
  canEdit: (row: T, rowIndex: number) => Promise<boolean>;

  /** 是否可以保存 */
  canSave: (
    row: T,
    rowIndex: number,
    isNew: boolean,
    originalRow?: T,
  ) => Promise<boolean>;

  /** 是否可以取消 */
  canCancel: (row: T, rowIndex: number) => Promise<boolean>;

  /** 是否可以删除 */
  canDelete: (row: T, rowIndex: number) => Promise<boolean>;

  /** 是否可以新增 */
  canAdd: (defaultRow?: Partial<T>) => Promise<boolean | Partial<T>>;

  /** 是否可以拖拽排序 */
  canDragSort: (from: number, to: number) => Promise<boolean>;

  /** 执行编辑后回调 */
  afterEdit: (row: T, rowIndex: number) => void;

  /** 执行保存后回调 */
  afterSave: (row: T, rowIndex: number, isNew: boolean) => void;

  /** 执行取消后回调 */
  afterCancel: (row: T, rowIndex: number) => void;

  /** 执行删除后回调 */
  afterDelete: (row: T, rowIndex: number) => void;

  /** 执行新增后回调 */
  afterAdd: (row: T, rowIndex: number) => void;

  /** 执行拖拽后回调 */
  afterDragSort: (from: number, to: number, data: T[]) => void;
}

/**
 * 操作守卫 composable
 *
 * @example
 * ```ts
 * const { canEdit, canSave, canDelete } = useActionGuard({
 *   guards: {
 *     beforeEdit: async (row, index) => {
 *       return row.status !== 'locked'
 *     },
 *     beforeSave: async (row, index, isNew) => {
 *       return await validateRow(row)
 *     },
 *     beforeDelete: async (row, index) => {
 *       return await confirm('确定删除?')
 *     }
 *   }
 * })
 *
 * // 使用
 * async function handleEdit(row, index) {
 *   if (await canEdit(row, index)) {
 *     startEdit(index)
 *   }
 * }
 * ```
 */
export function useActionGuard<T extends Recordable = Recordable>(
  options: ActionGuardOptions<T> = {},
): UseActionGuardReturn<T> {
  const { guards = {}, setLoading, timeout = 10_000, onError } = options;

  const isRunning = ref(false);
  const currentGuard = ref<null | string>(null);

  /**
   * 执行守卫函数
   */
  async function runGuard<R = boolean>(
    guardName: string,
    guardFn: (() => Promise<R> | R) | undefined,
    defaultValue: R,
  ): Promise<R> {
    if (!guardFn) return defaultValue;

    isRunning.value = true;
    currentGuard.value = guardName;
    setLoading?.(true);

    try {
      // 带超时的 Promise
      const result = await Promise.race([
        Promise.resolve(guardFn()),
        new Promise<R>((_, reject) => {
          setTimeout(
            () => reject(new Error(`Guard "${guardName}" timeout`)),
            timeout,
          );
        }),
      ]);

      return result;
    } catch (error) {
      onError?.(error as Error, guardName);
      console.error(`[useActionGuard] Guard "${guardName}" failed:`, error);
      return defaultValue;
    } finally {
      isRunning.value = false;
      currentGuard.value = null;
      setLoading?.(false);
    }
  }

  /**
   * 是否可以编辑
   */
  async function canEdit(row: T, rowIndex: number): Promise<boolean> {
    return runGuard(
      'beforeEdit',
      guards.beforeEdit ? () => guards.beforeEdit!(row, rowIndex) : undefined,
      true,
    );
  }

  /**
   * 是否可以保存
   */
  async function canSave(
    row: T,
    rowIndex: number,
    isNew: boolean,
    _originalRow?: T,
  ): Promise<boolean> {
    return runGuard(
      'beforeSave',
      guards.beforeSave
        ? () => guards.beforeSave!(row, rowIndex, isNew)
        : undefined,
      true,
    );
  }

  /**
   * 是否可以取消
   */
  async function canCancel(row: T, rowIndex: number): Promise<boolean> {
    return runGuard(
      'beforeCancel',
      guards.beforeCancel
        ? () => guards.beforeCancel!(row, rowIndex)
        : undefined,
      true,
    );
  }

  /**
   * 是否可以删除
   */
  async function canDelete(row: T, rowIndex: number): Promise<boolean> {
    return runGuard(
      'beforeDelete',
      guards.beforeDelete
        ? () => guards.beforeDelete!(row, rowIndex)
        : undefined,
      true,
    );
  }

  /**
   * 是否可以新增
   */
  async function canAdd(
    _defaultRow?: Partial<T>,
  ): Promise<boolean | Partial<T>> {
    if (!guards.beforeAdd) return true;

    return runGuard<boolean | Partial<T>>(
      'beforeAdd',
      () => guards.beforeAdd!(),
      true,
    );
  }

  /**
   * 是否可以拖拽排序
   */
  async function canDragSort(from: number, to: number): Promise<boolean> {
    return runGuard(
      'beforeDragSort',
      guards.beforeDragSort
        ? () => guards.beforeDragSort!(from, to)
        : undefined,
      true,
    );
  }

  /**
   * 编辑后回调
   */
  function afterEdit(row: T, rowIndex: number): void {
    guards.afterEdit?.(row, rowIndex);
  }

  /**
   * 保存后回调
   */
  function afterSave(row: T, rowIndex: number, isNew: boolean): void {
    guards.afterSave?.(row, rowIndex, isNew);
  }

  /**
   * 取消后回调
   */
  function afterCancel(row: T, rowIndex: number): void {
    guards.afterCancel?.(row, rowIndex);
  }

  /**
   * 删除后回调
   */
  function afterDelete(row: T, rowIndex: number): void {
    guards.afterDelete?.(row, rowIndex);
  }

  /**
   * 新增后回调
   */
  function afterAdd(row: T, rowIndex: number): void {
    guards.afterAdd?.(row, rowIndex);
  }

  /**
   * 拖拽后回调
   */
  function afterDragSort(from: number, to: number, data: T[]): void {
    guards.afterDragSort?.(from, to, data);
  }

  /**
   * 通用守卫调度 — 按 guardName 分发到对应的 canXxx 方法
   */
  async function executeGuard(guardName: string, ...args: any[]): Promise<any> {
    switch (guardName) {
      case 'beforeAdd': {
        return canAdd(args[0]);
      }
      case 'beforeCancel': {
        return canCancel(args[0], args[1]);
      }
      case 'beforeDelete': {
        return canDelete(args[0], args[1]);
      }
      case 'beforeDragSort': {
        return canDragSort(args[0], args[1]);
      }
      case 'beforeEdit': {
        return canEdit(args[0], args[1]);
      }
      case 'beforeSave': {
        return canSave(args[0], args[1], args[2], args[3]);
      }
      default: {
        return true;
      }
    }
  }

  return {
    isGuardRunning: computed(() => isRunning.value),
    currentGuard,
    executeGuard,
    canEdit,
    canSave,
    canCancel,
    canDelete,
    canAdd,
    canDragSort,
    afterEdit,
    afterSave,
    afterCancel,
    afterDelete,
    afterAdd,
    afterDragSort,
  };
}

export default useActionGuard;
