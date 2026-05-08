/* oxlint-disable */
import type { DataTableRowKey, PaginationProps } from 'naive-ui';

import type {
  ProColumn,
  ProDataTableInstance,
  ProEditDataTableInstance,
  ProEditState,
  Recordable,
} from '../types';

import type { ComputedRef, InjectionKey, Ref } from 'vue';
import { inject, provide } from 'vue';

/**
 * ProDataTable 上下文接口
 */
export interface ProTableContext<T extends Recordable = Recordable> {
  /** 数据源 */
  dataSource: ComputedRef<T[]> | Ref<T[]>;

  /** 表格配置 */
  config?: ComputedRef<Recordable>;

  /** 列定义 */
  columns: ComputedRef<ProColumn<T>[]>;

  /** 加载状态 */
  loading: ComputedRef<boolean> | Ref<boolean>;

  /** 选中行键 */
  selectedRowKeys?: Ref<DataTableRowKey[]>;

  /** 展开行键 */
  expandedRowKeys?: Ref<DataTableRowKey[]>;

  /** 分页配置 */
  pagination?: Ref<false | PaginationProps>;

  /** 表格实例 */
  instance?: ProDataTableInstance<T>;

  /** 获取行键 */
  getRowKey?: (row: T, index: number) => DataTableRowKey;

  /** 刷新数据 */
  reload?: (params?: Recordable) => Promise<void>;

  /** 设置选中行 */
  setSelectedRowKeys?: (keys: DataTableRowKey[]) => void;

  /** 设置展开行 */
  setExpandedRowKeys?: (keys: DataTableRowKey[]) => void;

  /** NDataTable 引用 */
  tableRef: Ref<any>;
}

/**
 * ProDataTable 上下文注入键
 */
export const ProTableContextKey: InjectionKey<ProTableContext> =
  Symbol('ProTableContext');

/**
 * 创建并提供 ProTable 上下文
 */
export function createProTableContext<T extends Recordable = Recordable>(
  context: ProTableContext<T>,
): void {
  provide(ProTableContextKey, context as ProTableContext);
}

/**
 * 注入 ProTable 上下文
 */
export function useProTableContext<
  T extends Recordable = Recordable,
>(): ProTableContext<T> {
  const context = inject(ProTableContextKey);
  if (!context) {
    throw new Error(
      '[ProComponents] useProTableContext must be used within a ProDataTable component',
    );
  }
  return context as ProTableContext<T>;
}

/**
 * 安全注入 ProTable 上下文
 */
export function useProTableContextSafe<
  T extends Recordable = Recordable,
>(): null | ProTableContext<T> {
  return inject(ProTableContextKey, null) as null | ProTableContext<T>;
}

/**
 * ProEditDataTable 上下文接口
 */
export interface ProEditTableContext<
  T extends Recordable = Recordable,
> extends ProTableContext<T> {
  /** 编辑状态 */
  editState: Ref<ProEditState>;

  /** 可编辑行键 */
  editableKeys: Ref<DataTableRowKey[]>;

  /** 原始数据 (编辑前) */
  originalData: Ref<Map<DataTableRowKey, T>>;

  /** 变更记录 */
  changedRows: Ref<{
    added: Set<DataTableRowKey>;
    deleted: Set<DataTableRowKey>;
    updated: Set<DataTableRowKey>;
  }>;

  /** 编辑表格实例 */
  editInstance: ProEditDataTableInstance<T>;

  /** 开始编辑行 */
  startEdit: (rowIndex: number) => void;

  /** 保存编辑 */
  saveEdit: (rowIndex?: number) => Promise<boolean>;

  /** 取消编辑 */
  cancelEdit: (rowIndex?: number) => void;

  /** 开始编辑单元格 */
  startCellEdit: (rowIndex: number, columnKey: string) => void;

  /** 是否正在编辑行 */
  isRowEditing: (rowIndex: number) => boolean;

  /** 是否正在编辑单元格 */
  isCellEditing: (rowIndex: number, columnKey: string) => boolean;

  /** 新增行 */
  addRow: (row?: Partial<T>, index?: number) => void;

  /** 删除行 */
  deleteRow: (rowIndex: number) => Promise<boolean>;

  /** 更新单元格值 */
  updateCellValue: (rowIndex: number, columnKey: string, value: any) => void;

  /** 获取行验证状态 */
  getRowValidation: (rowIndex: number) => boolean;
}

/**
 * ProEditDataTable 上下文注入键
 */
export const ProEditTableContextKey: InjectionKey<ProEditTableContext> = Symbol(
  'ProEditTableContext',
);

/**
 * 创建并提供 ProEditTable 上下文
 */
export function createProEditTableContext<T extends Recordable = Recordable>(
  context: ProEditTableContext<T>,
): void {
  provide(ProEditTableContextKey, context as ProEditTableContext);
}

/**
 * 注入 ProEditTable 上下文
 */
export function useProEditTableContext<
  T extends Recordable = Recordable,
>(): ProEditTableContext<T> {
  const context = inject(ProEditTableContextKey);
  if (!context) {
    throw new Error(
      '[ProComponents] useProEditTableContext must be used within a ProEditDataTable component',
    );
  }
  return context as ProEditTableContext<T>;
}

/**
 * 安全注入 ProEditTable 上下文
 */
export function useProEditTableContextSafe<
  T extends Recordable = Recordable,
>(): null | ProEditTableContext<T> {
  return inject(ProEditTableContextKey, null) as null | ProEditTableContext<T>;
}

/**
 * 列上下文 (用于列内部组件)
 */
export interface ProColumnContext<T extends Recordable = Recordable> {
  /** 列定义 */
  column: ProColumn<T>;

  /** 列索引 */
  columnIndex: number;

  /** 是否可编辑 */
  editable: ComputedRef<boolean>;
}

/**
 * 列上下文注入键
 */
export const ProColumnContextKey: InjectionKey<ProColumnContext> =
  Symbol('ProColumnContext');

/**
 * 创建并提供列上下文
 */
export function createProColumnContext<T extends Recordable = Recordable>(
  context: ProColumnContext<T>,
): void {
  provide(ProColumnContextKey, context as ProColumnContext);
}

/**
 * 注入列上下文
 */
export function useProColumnContext<
  T extends Recordable = Recordable,
>(): null | ProColumnContext<T> {
  return inject(ProColumnContextKey, null) as null | ProColumnContext<T>;
}

/**
 * 行上下文 (用于行内组件)
 */
export interface ProRowContext<T extends Recordable = Recordable> {
  /** 行数据 */
  row: T;

  /** 行索引 */
  rowIndex: number;

  /** 行键 */
  rowKey: DataTableRowKey;

  /** 是否正在编辑 */
  isEditing: ComputedRef<boolean>;

  /** 是否新增行 */
  isNew: ComputedRef<boolean>;
}

/**
 * 行上下文注入键
 */
export const ProRowContextKey: InjectionKey<ProRowContext> =
  Symbol('ProRowContext');

/**
 * 创建并提供行上下文
 */
export function createProRowContext<T extends Recordable = Recordable>(
  context: ProRowContext<T>,
): void {
  provide(ProRowContextKey, context as ProRowContext);
}

/**
 * 注入行上下文
 */
export function useProRowContext<
  T extends Recordable = Recordable,
>(): null | ProRowContext<T> {
  return inject(ProRowContextKey, null) as null | ProRowContext<T>;
}
