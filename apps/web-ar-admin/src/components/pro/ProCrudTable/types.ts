/* oxlint-disable */
import type { ButtonProps, DataTableRowKey, PaginationProps } from 'naive-ui';

/**
 * @description ProCrudTable 类型声明：定义快捷日期、请求参数、响应结构、操作列、组件 Props 与实例方法。
 * @date.  26-04-30
 * @scope src/components/ProComponents/ProCrudTable
 */
import type { MaybeRef, VNode } from 'vue';

import type {
  DateRangeTimezone,
  ProColumn,
  ProSearchFormColumn,
  QuickDateItem,
  Recordable,
} from '../types';

/**
 * ProCrudTable 内置快捷日期按钮配置
 *
 * 传入后会在工具栏右侧渲染今/昨/周/月 等快捷按钮，点击后自动把对应时间范围写入
 * 指定的搜索字段并触发第一页查询。手动选日期区间若匹配到某个快捷项也会自动高亮。
 */
export interface ProCrudTableQuickDateConfig {
  /**
   * 对应 searchColumns 里列的 `path`，同时默认作为写入 form 的字段名。
   * 也用于在 searchColumns 中定位该列以解析 `valueFormat` / `timezone` 等 componentProps。
   */
  field: string;
  /**
   * 展平写入模式：若配置，点击快捷按钮时按下标写入两个 form 字段（起 → `modelKeys[0]`，止 → `modelKeys[1]`），
   * 而不再写 `field`；高亮判断时也会从这两个分字段拼回数组。
   *
   * 一般**无需在这里重复声明**：若 searchColumns 里 `path === field` 的 proDateRange 列
   * 已在 `componentProps.modelKeys` 配置，ProCrudTable 会自动沿用同一对分字段，
   * 所以常规用法直接 `quick-date="myField"` 字符串简写即可。
   */
  modelKeys?: [string, string];
  /** 自定义快捷项列表，不传则使用内置 6 项（今日/昨日/本周/上周/本月/上月） */
  shortcuts?: QuickDateItem[];
  /** 按钮尺寸，默认 tiny */
  size?: 'medium' | 'small' | 'tiny';
  /**
   * 商户时区，与 `proDateRange` 列的 `timezone` 语义一致。
   * string=自定义；false=强制 UTC；未传=列配置 > CrudTable 上下文 > 当前默认商户。
   * 支持 getter（响应式切换商户时建议用 getter）。
   */
  timezone?: (() => DateRangeTimezone | undefined) | DateRangeTimezone;
}

/**
 * 请求参数
 */
export interface CrudRequestParams {
  /** 当前页 */
  pageNo: number;
  /** 每页条数 */
  pageSize: number;
  /** 排序字段 */
  sortField?: string;
  /** 排序方向 */
  sortOrder?: 'ascend' | 'descend';
  /** 搜索参数 */
  [key: string]: any;
}

/**
 * 请求结果
 */
export interface CrudRequestResult<T = Recordable> {
  /** 数据列表 */
  list: T[];
  /** 总条数 */
  total?: number;
  totalCount?: number;
}

/**
 * 操作列配置
 */
export interface CrudActionColumn<T = Recordable> {
  /** 列宽 */
  width?: number;
  /** 标题 */
  title?: MaybeRef<string>;
  /** 固定位置 */
  fixed?: 'left' | 'right';
  /** 对齐方式 */
  align?: 'center' | 'left' | 'right';
  /** 渲染函数 */
  render: (row: T, index: number) => VNode;
}

/**
 * ProCrudTable Props
 */
export interface ProCrudTableProps<T extends Recordable = Recordable> {
  /** 标题 */
  title?: string;

  /** 搜索列配置 */
  searchColumns?: ProSearchFormColumn[];

  /** 表格列配置 */
  columns: ProColumn<T>[];

  /** 列设置版本号，用于重置历史持久化配置 */
  columnSettingVersion?: number | string;

  /** 操作列配置 */
  actionColumn?: MaybeRef<CrudActionColumn<T> | undefined>;

  /** 数据请求函数 */
  request: (params: CrudRequestParams) => Promise<CrudRequestResult<T>>;

  /** 请求前处理 */
  beforeRequest?: (
    params: CrudRequestParams,
  ) => CrudRequestParams | Promise<CrudRequestParams>;

  /** 请求后处理 */
  afterRequest?: (data: T[]) => Promise<T[]> | T[];

  /** 行键 */
  rowKey?: ((row: T) => DataTableRowKey) | string;

  /** 行属性 */
  rowProps?: (rowData: T, rowIndex: number) => Record<string, any>;

  /** 分页配置 */
  pagination?: false | Partial<PaginationProps>;

  /** 默认分页大小 */
  defaultPageSize?: number;

  /** 分页大小选项 */
  pageSizes?: number[];

  /** 挂载时自动加载 */
  autoLoad?: boolean;

  /** 行选择配置 */
  rowSelection?:
    | boolean
    | {
        disabled?: (row: T) => boolean;
        fixed?: 'left' | 'right' | boolean;
        type?: 'checkbox' | 'radio';
      };

  /**
   * 批量操作
   * @property auth 权限码或权限码数组；命中任一返回 true 才显示。未声明时不做权限过滤
   */
  batchActions?: Array<{
    auth?: string | string[];
    key: string;
    label: string;
  }>;

  /** 显示搜索表单 */
  showSearch?: boolean;

  /** 搜索表单标签宽度 */
  searchLabelWidth?: number | string;

  /** 搜索表单列数 */
  searchCols?: number | string;

  /** 搜索表单布局 */
  searchLayout?: 'flex' | 'grid';

  /** 搜索表单横向间距 */
  searchXGap?: number | string;

  /** 搜索表单纵向间距 */
  searchYGap?: number | string;

  /** 搜索表单组件宽度 */
  searchComponentWidth?: number | string;

  /** 搜索表单默认是否收起 */
  searchDefaultCollapsed?: boolean;

  /** 搜索表单初始值 */
  searchInitialValues?: Recordable;

  /** 头部折叠条横向偏移量，正值向右，负值向左 */
  collapseBarOffsetX?: number | string;

  /** 表格边框 */
  bordered?: boolean;

  /** 是否输出根节点 pro-crud-table 样式类 */
  rootClassEnabled?: boolean;

  /** 表格滚动宽度 */
  scrollX?: number | string;

  /** 表格最大高度 */
  maxHeight?: number | string;

  /** 自动计算表格高度（使表格适应视口，底部工具栏始终可见） */
  autoHeight?: boolean;

  /** 自动高度时的底部偏移量（用于微调） */
  autoHeightOffset?: number;

  /** 搜索按钮属性 */
  searchButtonProps?: false | Partial<ButtonProps>;

  /** 重置按钮属性 */
  resetButtonProps?: false | Partial<ButtonProps>;

  /** 卡片边框 */
  cardBordered?: boolean;
}

/**
 * ProCrudTable 实例方法
 */
export interface ProCrudTableInstance<T extends Recordable = Recordable> {
  /**
   * 重新加载。不传保留当前页；传 number 先跳到该页再加载；传对象作为 extraParams；
   * 也可同时传 `(pageNo, extraParams)`
   */
  reload: (
    pageNoOrExtra?: number | Recordable,
    extraParams?: Recordable,
  ) => Promise<void>;

  /** 回到第一页重新加载（保留当前搜索表单值） */
  searchFromFirstPage: (extraParams?: Recordable) => Promise<void>;

  /** 重置并加载 (回到第一页) */
  reset: () => Promise<void>;

  /** 获取数据源 */
  getDataSource: () => T[];

  /** 获取搜索参数 */
  getSearchParams: () => Recordable;

  /** 设置搜索参数 */
  setSearchParams: (params: Recordable) => void;

  /**
   * 同步覆盖搜索表单的「重置基准」（initialValuesRef）。
   * 用于解决以下时序问题：
   * - 外部 hook 在 `@reset` 回调里翻转开关导致 props.searchInitialValues 重算时，
   *   ProCrudTable 内部的 `searchForm.reset()` 是 emit('reset') 之后**同步**执行的，
   *   它依赖 initialValuesRef；而 props.searchInitialValues 的 watch 即使是 sync flush，
   *   在跨组件 + KeepAlive 场景下也可能晚于 reset() 才同步，造成"重置一次没清空"。
   * - 此方法允许 hook 在 emit('reset') 同步段直接覆盖基准，下一行的 reset() 必然用上新值。
   */
  setSearchInitialValues: (values: Recordable) => void;

  /** 获取选中行 */
  getSelectedRows: () => T[];

  /** 获取选中行键 */
  getSelectedRowKeys: () => DataTableRowKey[];

  /** 设置选中行键 */
  setSelectedRowKeys: (keys: DataTableRowKey[]) => void;

  /** 清除选择 */
  clearSelection: () => void;

  /** 获取分页信息 */
  getPagination: () => { pageNo: number; pageSize: number; total: number };

  /** 获取加载状态 */
  getLoading: () => boolean;

  /** 设置表格滚动位置 */
  scrollTo: (options: { left?: number; row?: number; top?: number }) => void;

  /** 触发搜索表单校验（仅校验，不发起请求） */
  validateSearch: () => Promise<void>;

  /** 获取头部折叠状态 */
  isHeaderCollapsed: () => boolean;

  /** 设置头部折叠状态 */
  setHeaderCollapsed: (collapsed: boolean) => void;

  /** 切换头部折叠状态 */
  toggleHeaderCollapse: () => void;

  /** 重置列设置为默认 */
  resetColumnSetting: () => void;

  /** 重新计算表格高度（用于 v-show 切换后修复虚拟滚动表头丢失问题） */
  recalculate: () => void;

  /**
   * 写入 picker 共享时区。供页面自定义 select（如 statistics 的 n-select、system/log 的 siteId）
   * 在选中变化时手动调用，让 ProDateRangePicker 跟随该字段切换 wall-clock 时区。
   * 标准的 ProTenantSelect 已自动写入，无需调用。
   */
  setTimezoneId: (tz: null | string) => void;
}
