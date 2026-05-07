/* oxlint-disable */
import type { ButtonProps, DataTableRowKey } from 'naive-ui';

import type { Nullable, Recordable } from './common';
import type {
  ProColumn,
  ProDataTableInstance,
  ProDataTableProps,
} from './dataTable';

/**
 * 编辑模式
 */
export type ProEditMode = 'cell' | 'row' | 'table';

/**
 * 编辑触发方式
 */
export type ProEditTrigger = 'click' | 'dblclick';

/**
 * 编辑配置
 */
export interface ProEditConfig {
  /** 编辑模式 */
  mode?: ProEditMode;

  /** 编辑触发方式 */
  trigger?: ProEditTrigger;

  /** 失焦自动保存 */
  autoSave?: boolean;

  /** 显示操作按钮 */
  showActions?: boolean;

  /** 操作列位置 */
  actionPosition?: 'left' | 'right';

  /** 操作列宽度 */
  actionWidth?: number;

  /** 编辑按钮文本 */
  editText?: string;

  /** 保存按钮文本 */
  saveText?: string;

  /** 取消按钮文本 */
  cancelText?: string;

  /** 删除按钮文本 */
  deleteText?: string;

  /** 删除确认 */
  confirmDelete?: boolean;

  /** 删除确认文本 */
  deleteConfirmText?: string;

  /** 允许新增行 */
  allowAdd?: boolean;

  /** 允许删除行 */
  allowDelete?: boolean;

  /** 允许拖拽排序 */
  allowDragSort?: boolean;

  /** 显示拖拽手柄列 */
  dragHandleColumn?: boolean;

  /** 最大行数 */
  maxRows?: number;

  /** 最小行数 */
  minRows?: number;
}

/**
 * 操作守卫上下文
 */
export interface ProEditGuardContext<T extends Recordable = Recordable> {
  /** 行数据 */
  row: T;
  /** 行索引 */
  rowIndex: number;
  /** 是否新增行 */
  isNew?: boolean;
  /** 原始行数据 */
  originalRow?: T;
}

/**
 * 操作守卫
 */
export interface ProEditGuards<T extends Recordable = Recordable> {
  /** 编辑前守卫 */
  beforeEdit?: (row: T, rowIndex: number) => boolean | Promise<boolean>;

  /** 保存前守卫 */
  beforeSave?: (
    row: T,
    rowIndex: number,
    isNew: boolean,
  ) => boolean | Promise<boolean>;

  /** 取消前守卫 */
  beforeCancel?: (row: T, rowIndex: number) => boolean | Promise<boolean>;

  /** 删除前守卫 */
  beforeDelete?: (row: T, rowIndex: number) => boolean | Promise<boolean>;

  /** 新增前守卫 */
  beforeAdd?: () => boolean | Partial<T> | Promise<boolean | Partial<T>>;

  /** 拖拽排序前守卫 */
  beforeDragSort?: (from: number, to: number) => boolean | Promise<boolean>;

  /** 编辑后回调 */
  afterEdit?: (row: T, rowIndex: number) => void;

  /** 保存后回调 */
  afterSave?: (row: T, rowIndex: number, isNew: boolean) => void;

  /** 取消后回调 */
  afterCancel?: (row: T, rowIndex: number) => void;

  /** 删除后回调 */
  afterDelete?: (row: T, rowIndex: number) => void;

  /** 新增后回调 */
  afterAdd?: (row: T, rowIndex: number) => void;

  /** 拖拽排序后回调 */
  afterDragSort?: (from: number, to: number, data: T[]) => void;
}

/**
 * 新增行配置
 */
export interface ProRecordCreatorProps<T extends Recordable = Recordable> {
  /** 新增按钮位置 */
  position?: 'bottom' | 'top';

  /** 新增按钮文本 */
  text?: string;

  /** 新增按钮属性 */
  buttonProps?: Partial<ButtonProps>;

  /** 默认行数据 */
  defaultRecord?: (() => Partial<T>) | Partial<T>;

  /** 禁用新增 */
  disabled?: boolean;

  /** 权限控制 */
  auth?: string | string[];
}

/**
 * ProEditDataTable Props
 */
export interface ProEditDataTableProps<
  T extends Recordable = Recordable,
> extends Omit<ProDataTableProps<T>, 'dataSource'> {
  /** 数据源 (v-model) */
  modelValue?: T[];

  /** 编辑配置 */
  editConfig?: ProEditConfig;

  /** 操作守卫 */
  guards?: ProEditGuards<T>;

  /** 新增行配置 */
  recordCreator?: boolean | ProRecordCreatorProps<T>;

  /** 可编辑行键 */
  editableKeys?: DataTableRowKey[];

  /** 行编辑回调 */
  onEdit?: (row: T, rowIndex: number) => void;

  /** 行保存回调 */
  onSave?: (
    row: T,
    rowIndex: number,
    isNew: boolean,
  ) => Promise<boolean> | void;

  /** 行取消回调 */
  onCancel?: (row: T, rowIndex: number) => void;

  /** 行删除回调 */
  onDelete?: (row: T, rowIndex: number) => Promise<boolean> | void;

  /** 新增行回调 */
  onAdd?: (row: T) => void;

  /** 值变化回调 */
  onValuesChange?: (changedRow: T, allData: T[]) => void;

  /** 拖拽排序回调 */
  onDragSort?: (from: number, to: number, data: T[]) => void;

  /** 可编辑键变化回调 */
  onUpdateEditableKeys?: (keys: DataTableRowKey[]) => void;
}

/**
 * 编辑状态
 */
export interface ProEditState {
  /** 正在编辑的行索引 */
  rowIndex: Nullable<number>;
  /** 正在编辑的单元格键 */
  cellKey: Nullable<string>;
  /** 编辑模式 */
  mode: ProEditMode;
}

/**
 * 行变更记录
 */
export interface ProRowChangeRecord<T extends Recordable = Recordable> {
  /** 新增的行 */
  added: T[];
  /** 更新的行 */
  updated: T[];
  /** 删除的行 */
  deleted: T[];
}

/**
 * ProEditDataTable 实例方法
 */
export interface ProEditDataTableInstance<
  T extends Recordable = Recordable,
> extends ProDataTableInstance<T> {
  /** 开始编辑行 */
  startEdit: (rowIndex: number) => void;

  /** 保存编辑行 */
  saveEdit: (rowIndex?: number) => Promise<boolean>;

  /** 取消编辑行 */
  cancelEdit: (rowIndex?: number) => void;

  /** 开始编辑单元格 */
  startCellEdit: (rowIndex: number, columnKey: string) => void;

  /** 保存编辑单元格 */
  saveCellEdit: (rowIndex: number, columnKey: string) => Promise<boolean>;

  /** 取消编辑单元格 */
  cancelCellEdit: (rowIndex: number, columnKey: string) => void;

  /** 新增行 */
  addRow: (row?: Partial<T>, index?: number) => void;

  /** 删除行 */
  deleteRow: (rowIndex: number) => Promise<boolean>;

  /** 获取编辑状态 */
  getEditingState: () => ProEditState;

  /** 验证行 */
  validateRow: (rowIndex: number) => Promise<boolean>;

  /** 验证所有行 */
  validateAllRows: () => Promise<boolean>;

  /** 获取变更记录 */
  getChangedRows: () => ProRowChangeRecord<T>;

  /** 重置变更 */
  resetChanges: () => void;

  /** 获取可编辑键 */
  getEditableKeys: () => DataTableRowKey[];

  /** 设置可编辑键 */
  setEditableKeys: (keys: DataTableRowKey[]) => void;

  /** 是否有未保存变更 */
  hasChanges: () => boolean;

  /** 上移行 */
  moveUp: (rowIndex: number) => void;

  /** 下移行 */
  moveDown: (rowIndex: number) => void;

  /** 移动行 */
  move: (fromIndex: number, toIndex: number) => void;

  /** 插入行 */
  insert: (row: Partial<T>, index: number) => void;

  /** 移除行 */
  remove: (rowIndex: number) => void;

  /** 批量插入 */
  batchInsert: (rows: Partial<T>[], index?: number) => void;

  /** 批量删除 */
  batchRemove: (rowIndices: number[]) => void;
}

/**
 * useProEditDataTable Hook 返回类型
 */
export type UseProEditDataTableReturn<T extends Recordable = Recordable> = [
  /** 注册函数 */
  (instance: ProEditDataTableInstance<T>) => void,
  /** 编辑表格方法 */
  ProEditDataTableInstance<T>,
];

/**
 * 编辑单元格 Props
 */
export interface ProEditableCellProps<T extends Recordable = Recordable> {
  /** 行数据 */
  row: T;
  /** 行索引 */
  rowIndex: number;
  /** 列配置 */
  column: ProColumn<T>;
  /** 当前值 */
  value: any;
  /** 是否编辑中 */
  editing: boolean;
  /** 只读模式 */
  readonly?: boolean;
}

/**
 * 编辑单元格事件
 */
export interface ProEditableCellEmits {
  /** 值变化 */
  change: (value: any) => void;
  /** 保存 */
  save: () => void;
  /** 取消 */
  cancel: () => void;
  /** 开始编辑 */
  edit: () => void;
}

/**
 * 编辑行 Props
 */
export interface ProEditableRowProps<T extends Recordable = Recordable> {
  /** 行数据 */
  row: T;
  /** 行索引 */
  rowIndex: number;
  /** 列配置 */
  columns: ProColumn<T>[];
  /** 是否编辑中 */
  editing: boolean;
  /** 只读模式 */
  readonly?: boolean;
  /** 是否新增行 */
  isNew?: boolean;
}

/**
 * 行操作按钮配置
 */
export interface ProRowActionConfig {
  /** 显示编辑按钮 */
  showEdit?: boolean;
  /** 显示保存按钮 */
  showSave?: boolean;
  /** 显示取消按钮 */
  showCancel?: boolean;
  /** 显示删除按钮 */
  showDelete?: boolean;
  /** 编辑按钮属性 */
  editButtonProps?: Partial<ButtonProps>;
  /** 保存按钮属性 */
  saveButtonProps?: Partial<ButtonProps>;
  /** 取消按钮属性 */
  cancelButtonProps?: Partial<ButtonProps>;
  /** 删除按钮属性 */
  deleteButtonProps?: Partial<ButtonProps>;
}
