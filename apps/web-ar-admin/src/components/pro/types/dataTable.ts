/* oxlint-disable */
import type {
  DataTableColumn,
  DataTableProps,
  DataTableRowKey,
} from 'naive-ui';

import type { VNode } from 'vue';

import type {
  ProAsyncOptions,
  ProComponentType,
  ProFieldMapping,
  ProFieldValueType,
  ProValueEnum,
  Recordable,
} from './common';

export interface ProTenantTimeZoneDisplayOptions {
  /** 搜索表单中的商户字段，默认 `tenantId` */
  searchTenantIdKey?: string;
  /** 行数据中的商户字段，默认 `tenantId` */
  rowTenantIdKey?: string;
  /** 自定义时间格式，使用 date-fns 格式化模板 */
  format?: string;
}

/**
 * ProDataTable 列定义 (pro-naive-ui 风格)
 */
export interface ProColumn<T extends Recordable = Recordable> extends Omit<
  DataTableColumn<T>,
  'key' | 'render' | 'title'
> {
  /** 列标识 */
  key: keyof T | string;

  /** 列标题 */
  title?: (() => VNode) | string;

  /** 自定义列面板展示文案，仅用于列设置等纯文本场景 */
  columnSettingTitle?: string;

  /** 日期类列是否展示商户时区，并按当前商户时区转换数值型时间戳 */
  showTenantTimeZone?: boolean | ProTenantTimeZoneDisplayOptions;

  /** 日期格式化模板 */
  dateFormat?: string;

  /** 数据索引 (key 别名) */
  dataIndex?: keyof T | string;

  /** 值类型 */
  valueType?: ProFieldValueType;

  /** 值枚举映射 */
  valueEnum?: ProValueEnum;

  /** 在表格中隐藏 */
  hideInTable?: boolean;

  /** 在搜索表单中隐藏 */
  hideInSearch?: boolean;

  /** 可复制 */
  copyable?: boolean;

  /** 文本省略 */
  ellipsis?: boolean | { lineClamp?: number; tooltip?: boolean | Recordable };

  /** 可排序（Naive UI DataTableBaseColumn.sortable 兼容：true 默认排序 / 'custom' 由后端托管） */
  sortable?: 'custom' | boolean;

  /** 默认排序 */
  defaultSortOrder?: 'ascend' | 'descend' | false;

  /** 可筛选 */
  filterable?: boolean;

  /** 筛选选项 */
  filterOptions?: { label: string; value: any }[];

  /** 默认筛选值 */
  defaultFilterValue?: any;

  /** 列顺序 */
  order?: number;

  /** 条件显示 */
  ifShow?: ((column: ProColumn<T>) => boolean) | boolean | true;

  /** 可编辑 */
  editable?: boolean;

  /** 编辑组件 */
  editComponent?: ProComponentType;

  /** 编辑组件属性 */
  editComponentProps?: Recordable;

  /** 编辑验证规则 */
  editRules?: any[];

  /** 编辑选项 */
  editOptions?: ProAsyncOptions;

  /** 编辑选项字段映射 */
  editFieldMapping?: ProFieldMapping;

  /** 自定义编辑渲染 */
  editRender?: (context: ProColumnEditContext<T>) => VNode;

  /** 自定义渲染 */
  render?: (
    rowData: T,
    rowIndex: number,
    column: ProColumn<T>,
  ) => null | number | string | VNode;

  /** 标题 tooltip */
  titleTooltip?: string;
}

/**
 * 列编辑上下文
 */
export interface ProColumnEditContext<T extends Recordable = Recordable> {
  row: T;
  rowIndex: number;
  column: ProColumn<T>;
  value: any;
  setValue: (value: any) => void;
  isEditing: boolean;
  save: () => Promise<boolean>;
  cancel: () => void;
}

/**
 * ProDataTable 扩展 Props (pro-naive-ui 风格)
 */
export interface ProDataTableExtendProps<T extends Recordable = Recordable> {
  /** 标题 */
  title?: string;

  /** 标题 tooltip */
  tooltip?: string | string[];

  /** 表格卡片配置 */
  tableCardProps?: Recordable;

  /** 拖拽排序配置 */
  dragSortOptions?: ProTableDragSortOptions<T>;
}

/**
 * ProDataTable Props (继承 DataTableProps)
 */
export interface ProDataTableProps<T extends Recordable = Recordable>
  extends
    Omit<DataTableProps, 'columns' | 'rowKey'>,
    ProDataTableExtendProps<T> {
  /** 列定义 */
  columns: ProColumn<T>[];

  /** 当前搜索参数，供列渲染按搜索态联动 */
  searchParams?: Recordable;

  /** 弹性高度 */
  flexHeight?: boolean;

  /** 行键 */
  rowKey?: ((row: T) => DataTableRowKey) | string;
}

/**
 * 拖拽排序配置
 */
export interface ProTableDragSortOptions<T extends Recordable = Recordable> {
  /** 动画时长 */
  animation?: number;

  /** 拖拽手柄选择器 */
  handle?: boolean | string;

  /** 拖拽结束回调 */
  onEnd?: (event: { newIndex: number; oldIndex: number }, data: T[]) => void;

  /** 禁用拖拽 */
  disabled?: ((row: T, index: number) => boolean) | boolean;
}

/**
 * ProDataTable 实例方法 (pro-naive-ui 风格)
 */
export interface ProDataTableInstance<_T extends Recordable = Recordable> {
  /** 排序 */
  sort: (columnKey: null | string, order: 'ascend' | 'descend' | false) => void;

  /** 翻页 */
  page: (page: number) => void;

  /** 筛选 */
  filter: (filters: null | Recordable) => void;

  /** 获取筛选 */
  filters: (filters: null | Recordable) => void;

  /** 清除排序 */
  clearSorter: () => void;

  /** 清除单个筛选 */
  clearFilter: (columnKey: string) => void;

  /** 清除所有筛选 */
  clearFilters: () => void;

  /** 滚动到 */
  scrollTo: (options: { left?: number; row?: number; top?: number }) => void;

  /** 导出 CSV */
  downloadCsv: (options?: { fileName?: string }) => void;
}

/**
 * 列类型渲染器
 */
export interface ProColumnTypeRenderer<T extends Recordable = any> {
  /** 渲染函数 */
  render: (
    value: any,
    row: T,
    index: number,
    column: ProColumn<T>,
  ) => null | string | VNode;
  /** 默认属性 */
  defaultProps?: Recordable;
  /** 值转换 */
  transform?: (value: any) => any;
}

/**
 * 内置列类型
 */
export type ProColumnType =
  | 'action'
  | 'boolean'
  | 'code'
  | 'copy'
  | 'date'
  | 'datetime'
  | 'drag'
  | 'expand'
  | 'image'
  | 'index'
  | 'link'
  | 'money'
  | 'number'
  | 'percent'
  | 'progress'
  | 'selection'
  | 'status'
  | 'tag'
  | 'tags'
  | 'text'
  | 'time';
