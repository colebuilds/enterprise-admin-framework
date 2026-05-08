<!-- oxlint-disable -->
<!--
/**
 * @description ProCrudTable 通用查询表格容器：负责搜索区、快捷日期、工具栏、数据表格、汇总区、分页、列设置与根节点样式类开关。
 * @date.  26-04-30
 * @scope src/components/ProComponents/ProCrudTable
 */
-->
<script lang="ts" setup generic="T extends Recordable = Recordable">
import type { ButtonProps, DataTableRowKey, PaginationProps } from 'naive-ui';

import type { QuickDateItem } from '../types';
import type { ProColumn, ProSearchFormColumn, Recordable } from '../types';
import type {
  CrudActionColumn,
  CrudRequestParams,
  CrudRequestResult,
  ProCrudTableInstance,
  ProCrudTableQuickDateConfig,
} from './types';

/**
 * @description 通用 CRUD 表格容器：负责搜索区、工具栏、表格、汇总区、底部操作条与自适应高度计算。
 * @author sum
 * @date 2026-04-17
 * @scope 全局通用组件
 */
import {
  computed,
  nextTick,
  onMounted,
  ref,
  toRaw,
  unref,
  useSlots,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';

import { DownOutlined } from '@vicons/antd';
import { ChevronDown } from '@vicons/ionicons5';
import { format, parse } from 'date-fns';
import {
  NButton,
  NCheckbox,
  NDropdown,
  NEl,
  NIcon,
  NPagination,
} from 'naive-ui';

import { useTenantOptions } from '#/hooks';
import { usePermission } from '#/hooks/usePermission';

import { createProSearchForm } from '../composables/createProSearchForm';
import { createProCrudTableContext } from '../context/crudTableContext';
import ProDataTable from '../ProDataTable/ProDataTable.vue';
import { ProQuickDateButtons } from '../ProDateRangePicker';
import { createZonedBaseShortcutItems } from '../ProDateRangePicker/composables/useZonedShortcuts';
import {
  externalToPanelTimestamp,
  panelToExternalTimestamp,
} from '../ProDateRangePicker/tzUtils';
import {
  formatUtcMsInZone,
  parseParts,
  partsToUtcMs,
  resolveTimezoneId,
} from '../ProDateRangePicker/utils/zonedDateMath';
import { deepClone } from '../utils';
import ProColumnSettingPanel from './components/ProColumnSettingPanel.vue';
import ProSearchBar from './components/ProSearchBar.vue';
import { useAutoHeight } from './composables/useAutoHeight';
import { useColumnSetting } from './composables/useColumnSetting';
import { useCrudRequest } from './composables/useCrudRequest';
import { usePinStorage } from './composables/usePinStorage';
import { useRowSelection } from './composables/useRowSelection';

defineOptions({ name: 'ProCrudTable' });

const props = withDefaults(defineProps<ProCrudTableComponentProps<T>>(), {
  searchColumns: () => [],
  showSearch: true,
  searchLabelWidth: 80,
  searchCols: '1 s:1 m:2 l:3 xl:3 2xl:5',
  searchLayout: 'grid',
  searchXGap: 12,
  searchYGap: 0,
  searchComponentWidth: 200,
  searchDefaultCollapsed: true,
  searchInitialValues: () => ({}),
  collapseBarOffsetX: 0,
  searchButtonProps: () => ({}),
  resetButtonProps: () => ({}),
  searchAutoSpan: false,
  advancedSearchCols: 4,
  maxPinCount: 8,
  rowKey: 'id',
  autoHeight: true,
  autoHeightOffset: 0,
  rowSelection: false,
  batchActions: () => [],
  pagination: () => ({}),
  defaultPageSize: 10,
  pageSizes: () => [10, 20, 50, 100],
  autoLoad: true,
  bordered: true,
  rootClassEnabled: true,
  showColumnSetting: true,
  quickDate: false,
});

// ===================== Emits =====================
const emit = defineEmits<{
  (e: 'load', data: T[]): void;
  (e: 'search', params: Recordable): void;
  (e: 'reset'): void;
  (e: 'selection-change', keys: DataTableRowKey[], rows: T[]): void;
  (e: 'batch-action', key: string, rows: T[]): void;
}>();

/** 与 `ProSearchBar` 内「展开/收起」箭头同尺寸 */
const COLLAPSE_CHEVRON_ICON_SIZE = 14;

const { t } = useI18n();

interface ProDataTablePublicInstance {
  scrollTo: (options: { left?: number; row?: number; top?: number }) => void;
}

// ===================== Props =====================
interface ProCrudTableComponentProps<TData extends Recordable = Recordable> {
  searchColumns?: ProSearchFormColumn[];
  showSearch?: boolean;
  searchLabelWidth?: number | string;
  searchCols?: number | string;
  searchLayout?: 'flex' | 'grid';
  searchXGap?: number | string;
  searchYGap?: number | string;
  searchComponentWidth?: number | string;
  searchDefaultCollapsed?: boolean;
  searchInitialValues?: Recordable;
  collapseBarOffsetX?: number | string;
  searchButtonProps?: false | Partial<ButtonProps>;
  resetButtonProps?: false | Partial<ButtonProps>;
  /** 启用后根据 valueType 自动计算搜索字段 span，关闭时所有字段等宽 */
  searchAutoSpan?: boolean;
  advancedSearchCols?: number;
  maxPinCount?: number;
  columns: ProColumn<TData>[];
  columnSettingVersion?: number | string;
  actionColumn?: CrudActionColumn<TData>;
  rowKey?: ((row: TData) => DataTableRowKey) | string;
  scrollX?: number | string;
  maxHeight?: number | string;
  autoHeight?: boolean;
  autoHeightOffset?: number;
  rowProps?: (rowData: Recordable, rowIndex: number) => Record<string, any>;
  summary?: (pageData: Recordable[]) => any;
  rowSelection?:
    | boolean
    | {
        disabled?: (row: any) => boolean;
        fixed?: 'left' | 'right' | boolean;
        type?: 'checkbox' | 'radio';
      };
  batchActions?: Array<{
    auth?: string | string[];
    key: string;
    label: string;
  }>;
  pagination?: false | Partial<PaginationProps>;
  defaultPageSize?: number;
  pageSizes?: number[];
  request: (params: CrudRequestParams) => Promise<CrudRequestResult<TData>>;
  beforeRequest?: (
    params: CrudRequestParams,
  ) => CrudRequestParams | Promise<CrudRequestParams>;
  afterRequest?: (data: TData[]) => Promise<TData[]> | TData[];
  autoLoad?: boolean;
  bordered?: boolean;
  /** 是否输出根节点 pro-crud-table 样式类；关闭后内部结构类仍保留 */
  rootClassEnabled?: boolean;
  /** 是否显示「自定义列」按钮，默认 true */
  showColumnSetting?: boolean;
  /**
   * 内置快捷日期按钮。传入后在工具栏右侧渲染今/昨/周/月 快捷按钮。
   * - `false` / 不传 → 不渲染（默认）
   * - 字符串 → 简写形式，等价于 `{ field: 字符串 }`
   * - 对象 → 完整配置（可定制 shortcuts / size）
   */
  quickDate?: false | ProCrudTableQuickDateConfig | string;
}

const slots = useSlots();
const dataTableRef = ref<null | ProDataTablePublicInstance>(null);
const containerRef = ref<HTMLElement | null>(null);
const summaryRef = ref<HTMLElement | null>(null);
const footerRef = ref<HTMLElement | null>(null);
const isHeaderCollapsed = ref(false);
const advancedSearchOpen = ref(false);
const collapseBarStyle = computed(() => {
  const offset =
    typeof props.collapseBarOffsetX === 'number'
      ? `${props.collapseBarOffsetX}px`
      : String(props.collapseBarOffsetX ?? '0');
  return {
    '--pro-crud-table-collapse-bar-offset-x': offset,
  };
});

// ===================== 1. 搜索表单 =====================
const searchForm = createProSearchForm({
  initialValues: props.searchInitialValues,
  defaultCollapsed: props.searchDefaultCollapsed,
});
const advancedSearchForm = createProSearchForm({
  initialValues: props.searchInitialValues,
});

/**
 * `searchInitialValues` 常为页面 computed，晚于表格挂载后才得到默认商户等；
 * 若不同步到表单内部的「重置基准」，点「重置」仍会回到挂载瞬间的快照（例如商户被清空）。
 * 在已有 `initialValuesRef` 上合并 props，避免只下发部分字段时丢失其它初始键。
 *
 * `flush: 'sync'`：当外部在 emit('reset') 回调中翻转开关导致 searchInitialValues
 * 重算时（例如 useRechargeChannelPage.handleSearchReset 的 isResetTriggered），
 * 这里需要在同一同步段内立刻 setInitialValues，否则下一行 onReset() 内的
 * searchForm.reset() 会用**未同步的旧 initialValuesRef** 还原表单，造成"重置一次没清空、
 * 要再点一次才生效"的体验。handler 仅改表单 internal，不回写 props，sync 安全无循环。
 */
watch(
  () => props.searchInitialValues,
  (next) => {
    if (!next || typeof next !== 'object') return;
    const patch = deepClone(next) as Recordable;
    const mergedSearch = {
      ...(toRaw(searchForm.initialValues.value) as Recordable),
      ...patch,
    };
    const mergedAdvanced = {
      ...(toRaw(advancedSearchForm.initialValues.value) as Recordable),
      ...patch,
    };
    searchForm.setInitialValues(mergedSearch);
    advancedSearchForm.setInitialValues(mergedAdvanced);
  },
  { deep: true, immediate: true, flush: 'sync' },
);

// ===================== 2. 钉选持久化 =====================
const { pinnedPaths: userPinnedPaths } = usePinStorage();

const pinnedColumns = computed(() => {
  const allCols = props.searchColumns || [];
  const pinSet = new Set(userPinnedPaths.value);
  return allCols.filter((col) => col.pin !== false || pinSet.has(col.path));
});
const advancedColumns = computed(() => {
  const allCols = props.searchColumns || [];
  const pinSet = new Set(userPinnedPaths.value);
  return allCols.filter((col) => col.pin === false && !pinSet.has(col.path));
});

// ===================== 3. 列设置 =====================
const {
  columnSettings,
  settledColumns,
  isReady: isColumnSettingReady,
  toggleColumnVisibility,
  toggleColumnFixed,
  updateColumnOrder,
  updateColumnWidth,
  resetKey: columnResetKey,
  resetToDefault: resetColumnSetting,
  setAllVisible,
} = useColumnSetting<T>({
  columns: computed(() => props.columns),
  columnSettingVersion: computed(() => props.columnSettingVersion),
});

// ===================== 4. 数据加载 =====================
const {
  loading,
  tableData,
  paginationState,
  loadData,
  handleSearch: onSearch,
  handleReset: onReset,
  handlePageChange,
  handlePageSizeChange,
  handleSorterChange,
  getSearchParams,
} = useCrudRequest<T>({
  request: props.request,
  beforeRequest: props.beforeRequest,
  afterRequest: props.afterRequest,
  defaultPageSize: props.defaultPageSize,
  searchForm,
  advancedSearchForm,
  hasAdvancedColumns: () => advancedColumns.value.length > 0,
  onLoad: (data) => emit('load', data),
});

// emit 转发（搜索/重置时同时触发外部事件）
function handleSearchWithEmit(values: Recordable) {
  emit('search', values);
  onSearch(values);
}
function handleResetWithEmit() {
  // 内置快捷日期清空高亮
  quickDateIndex.value = undefined;
  emit('reset');
  onReset();
}

// ===================== 5. 行选择 =====================
const rowKeyFn = computed(() => {
  return typeof props.rowKey === 'function'
    ? props.rowKey
    : (row: T) => (row as Recordable)[props.rowKey as string];
});

const rowSelectionDisabledFn = computed(() => {
  const config =
    typeof props.rowSelection === 'object' ? props.rowSelection : {};
  return config.disabled;
});

const {
  checkedRowKeys,
  isAllCurrentPageSelected,
  isIndeterminate,
  getSelectedRows,
  handleCheckedRowKeysChange,
  handleSelectAllCurrentPage,
  clearSelection,
  setSelectedRowKeys,
} = useRowSelection<T>({
  tableData,
  rowKeyFn,
  disabledFn: rowSelectionDisabledFn,
  onSelectionChange: (keys, rows) => emit('selection-change', keys, rows),
});

function handleBatchAction(key: string) {
  emit('batch-action', key, getSelectedRows());
}

// 批量操作权限过滤：未声明 auth 的项保持原样显示，命中权限的项才进入 dropdown
const { hasPermission } = usePermission();
const visibleBatchActions = computed(() =>
  (props.batchActions ?? []).filter((item) => {
    if (!item.auth) return true;
    const codes = Array.isArray(item.auth) ? item.auth : [item.auth];
    return hasPermission(codes);
  }),
);

// ===================== 6. 高度自适应 =====================
const { actualMaxHeight, recalculate, lockHeight, unlockHeight } =
  useAutoHeight({
    containerRef,
    summaryRef,
    footerRef,
    autoHeight: computed(() => props.autoHeight),
    autoHeightOffset: computed(() => props.autoHeightOffset),
    maxHeight: computed(() => props.maxHeight),
  });

// ===================== 时区上下文 =====================
// ProCrudTable 仅作为时区状态的存储容器：暴露 timezoneId ref + setTimezoneId 方法。
// 任何切换组件（ProTenantSelect / 自定义 select / 页面 setup）通过 ctx.setTimezoneId() 写入；
// picker（ProDateRangeInput）通过 useProCrudTableContext().timezoneId 读取。
// ProCrudTable 自身不做 tenantId → timezone 的派生计算。
const timezoneIdState = ref<null | string>(null);
const setTimezoneId = (tz: null | string) => {
  timezoneIdState.value = tz;
};
const { defaultTenantId, getTenantTimeZone } = useTenantOptions();
const defaultTenantTimezone = computed<null | string>(() => {
  const tenantId = defaultTenantId.value;
  return tenantId == null ? null : getTenantTimeZone(tenantId) || null;
});

// ===================== 7. 内置快捷日期 =====================
/**
 * 内置快捷日期按钮接线：
 * - 配置后在工具栏右侧渲染按钮组
 * - 点击按钮自动写入 config.field 并触发第一页查询
 * - 手动选日期范围若匹配到快捷项会自动高亮
 * - 重置搜索时清空高亮
 *
 * quickDate prop 支持 3 种形式，统一规范化为对象后使用：
 * - `false` / 不传          → normalizedQuickDate = null（不渲染）
 * - `'timeRange'` 字符串     → { field: 'timeRange' }
 * - `{ field, shortcuts?, size? }` 对象 → 直接使用
 */
const quickDateIndex = ref<number | undefined>();

const normalizedQuickDate = computed<null | ProCrudTableQuickDateConfig>(() => {
  const raw = props.quickDate;
  if (!raw) return null;
  if (typeof raw === 'string') return { field: raw };
  return raw;
});

/**
 * 解析 quickDate 所在列的 componentProps（用于拿 timezone / valueFormat / valueStringPattern）。
 * `field` 始终代表 searchColumns 里列的 path，无论是否启用 modelKeys 展平模式。
 */
function resolveQuickDateColumnProps(): Recordable {
  const config = normalizedQuickDate.value;
  if (!config) return {};
  const col = (props.searchColumns ?? []).find((c) => c.path === config.field);
  if (!col) return {};
  const cp = col.componentProps;
  const resolved =
    typeof cp === 'function' ? cp((searchForm as any).model?.value ?? {}) : cp;
  return (resolved ?? {}) as Recordable;
}

/**
 * 解析 quickDate 当前生效的 timezone：
 *  1. `quickDate.timezone` 显式配置（支持字符串或 getter）优先
 *  2. 自动从 `searchColumns` 中 `path === field` 那一列的 `componentProps.timezone` 取
 *  3. 兜底：context 里的 `timezoneId`（由页面或单选 ProTenantSelect 写入）
 *  4. CrudTable 内部没有设置时回退当前默认商户时区
 *  5. 显式 `false` 表示强制 UTC，不读 context 和默认商户
 */
const quickDateTimezone = computed<null | string>(() => {
  const config = normalizedQuickDate.value;
  if (!config) return null;
  if (config.timezone !== undefined) {
    const raw =
      typeof config.timezone === 'function'
        ? config.timezone()
        : config.timezone;
    return raw === false ? null : (raw ?? null);
  }
  const tz = resolveQuickDateColumnProps().timezone;
  if (tz === false) return null;
  if (tz) return tz as string;
  return timezoneIdState.value ?? defaultTenantTimezone.value;
});

/**
 * 顶部快捷日期默认项必须按当前商户时区生成。
 * 自定义 shortcuts 仍按调用方传入值处理，避免改变外部显式配置语义。
 */
const quickDateShortcuts = computed<QuickDateItem[] | undefined>(() => {
  const config = normalizedQuickDate.value;
  if (!config) return undefined;
  if (config.shortcuts) return config.shortcuts;
  return createZonedBaseShortcutItems(
    resolveTimezoneId(quickDateTimezone.value),
    t,
  );
});

const quickDateUsesZonedShortcuts = computed(() => {
  const config = normalizedQuickDate.value;
  return !!config && !config.shortcuts;
});

/**
 * 解析 quickDate 最终生效的 modelKeys：
 *  1. `config.modelKeys` 显式配置 → 优先
 *  2. 否则从 `searchColumns` 里 `path === field` 的列 `componentProps.modelKeys` 推断
 *  3. 都没有 → null，走旧的单字段写入协议
 *
 * 这样日期列和 quickDate 只需在列上声明一次 modelKeys，模板里直接 `quick-date="<field>"` 字符串简写。
 */
function resolveQuickDateModelKeys(): [string, string] | null {
  const config = normalizedQuickDate.value;
  if (!config) return null;
  if (Array.isArray(config.modelKeys) && config.modelKeys.length >= 2) {
    return [config.modelKeys[0], config.modelKeys[1]];
  }
  const inherited = resolveQuickDateColumnProps().modelKeys;
  if (Array.isArray(inherited) && inherited.length >= 2) {
    return [inherited[0] as string, inherited[1] as string];
  }
  return null;
}

/** 字符串 / 数字 → 时间戳（给高亮匹配用）。不识别的返回 null。 */
function quickDateParseToTs(v: unknown, pattern: string): null | number {
  if (v == null || v === '') return null;
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v === 'string') {
    if (quickDateUsesZonedShortcuts.value) {
      const parts = parseParts(v, pattern);
      return parts
        ? partsToUtcMs(parts, resolveTimezoneId(quickDateTimezone.value))
        : null;
    }
    const ts = parse(v, pattern, new Date()).getTime();
    return Number.isNaN(ts) ? null : ts;
  }
  return null;
}

/**
 * 搜索表单里存的字段值（出站格式：真实 UTC 或 UTC+0 字面）。
 * - 非 modelKeys 模式：读 `field` 单字段，保持旧行为
 * - modelKeys 模式：读 `[startKey, endKey]` 两字段拼回数组；若写的是字符串（valueFormat: 'string'），按列 valueStringPattern 先 parse 回时间戳，这样下游 quickDateMatchRange 与按钮高亮匹配仍能按时间戳工作
 */
const currentQuickDateRange = computed<
  [number, number] | null | number[] | undefined
>(() => {
  const config = normalizedQuickDate.value;
  if (!config) return undefined;
  const mk = resolveQuickDateModelKeys();
  if (mk) {
    const [startKey, endKey] = mk;
    const cp = resolveQuickDateColumnProps();
    // 与 ProDateRangeInput 的 effectivePattern 对齐：valueStringPattern → displayFormat → 兜底
    const pattern =
      (cp.valueStringPattern as string) ??
      (cp.displayFormat as string) ??
      'yyyy-MM-dd HH:mm:ss';
    const s = quickDateParseToTs(searchForm.getFieldValue(startKey), pattern);
    const e = quickDateParseToTs(searchForm.getFieldValue(endKey), pattern);
    if (s == null || e == null) return null;
    return [s, e];
  }
  const val = searchForm.getFieldValue(config.field);
  return val as [number, number] | null | number[] | undefined;
});

/**
 * 传给 ProQuickDateButtons 的 timeRange：
 * - 默认 zoned shortcuts：快捷项本身已经是商户时区边界对应的真实 UTC，直接比对当前出站值
 * - 自定义 shortcuts：保留旧的本地 wall clock 语义，有 timezone 时先反解回面板域再比对
 */
const quickDateMatchRange = computed<
  [number, number] | null | number[] | undefined
>(() => {
  const range = currentQuickDateRange.value;
  const tz = quickDateTimezone.value;
  if (quickDateUsesZonedShortcuts.value) return range;
  if (!tz || !Array.isArray(range) || range.length !== 2) return range;
  return [
    externalToPanelTimestamp(range[0] as number, tz),
    externalToPanelTimestamp(range[1] as number, tz),
  ];
});

/** 监听范围和时区快捷项变化，反向匹配快捷按钮高亮 */
watch([quickDateMatchRange, quickDateShortcuts], ([range, shortcuts]) => {
  if (range === undefined) return;
  quickDateIndex.value = matchQuickDateIndex(range, shortcuts ?? []);
});

function matchQuickDateIndex(
  range: [number, number] | null | number[] | undefined,
  shortcuts: QuickDateItem[],
): number | undefined {
  if (!Array.isArray(range) || range.length !== 2) return undefined;
  const dayMs = 86_400_000;
  const startDay = Math.floor(range[0] / dayMs);
  const endDay = Math.floor(range[1] / dayMs);
  for (const [i, shortcut] of shortcuts.entries()) {
    const [start, end] = shortcut.value;
    if (
      Math.floor(start / dayMs) === startDay &&
      Math.floor(end / dayMs) === endDay
    ) {
      return i;
    }
  }
  return undefined;
}

function createQuickDateWriteValue(
  item: QuickDateItem,
  valueFormat: string,
  pattern: string,
  timezone: null | string,
): [number, number] | [string, string] {
  if (quickDateUsesZonedShortcuts.value) {
    const timezoneId = resolveTimezoneId(timezone);
    return valueFormat === 'string'
      ? [
          formatUtcMsInZone(item.value[0], timezoneId, pattern),
          formatUtcMsInZone(item.value[1], timezoneId, pattern),
        ]
      : [item.value[0], item.value[1]];
  }

  return valueFormat === 'string'
    ? [format(item.value[0], pattern), format(item.value[1], pattern)]
    : (timezone
      ? [
          panelToExternalTimestamp(item.value[0], timezone),
          panelToExternalTimestamp(item.value[1], timezone),
        ]
      : [item.value[0], item.value[1]]);
}

/**
 * 点击快捷按钮：按所在列的 valueFormat 把时间戳转成最终出站值，再写入 form。
 *  - 默认 zoned shortcuts：item.value 已经是商户时区边界对应的真实 UTC，timestamp 直接写入
 *  - 自定义 shortcuts：沿旧协议，有 tz 则面板 ts → 外部 UTC，无 tz 则直接写入
 *  - `valueFormat === 'string'`：按相同语义格式化成字符串
 *
 * 写入目标：
 *  - 配了 `modelKeys`：按下标分别写入两个 form 字段
 *  - 否则：写入 `field` 单字段（旧行为）
 */
function handleQuickDateSelect(_idx: number, item: QuickDateItem) {
  const config = normalizedQuickDate.value;
  if (!config) return;
  const tz = quickDateTimezone.value;
  const cp = resolveQuickDateColumnProps();
  const valueFormat = (cp.valueFormat as string | undefined) ?? 'timestamp';
  // 与 ProDateRangeInput 的 effectivePattern 对齐：valueStringPattern → displayFormat → 兜底
  const pattern =
    (cp.valueStringPattern as string) ??
    (cp.displayFormat as string) ??
    'yyyy-MM-dd HH:mm:ss';

  const valueToWrite: [number, number] | [string, string] =
    createQuickDateWriteValue(item, valueFormat, pattern, tz);

  const mk = resolveQuickDateModelKeys();
  if (mk) {
    const [startKey, endKey] = mk;
    searchForm.setFieldValue(startKey, valueToWrite[0]);
    searchForm.setFieldValue(endKey, valueToWrite[1]);
    advancedSearchForm.setFieldValue(startKey, valueToWrite[0]);
    advancedSearchForm.setFieldValue(endKey, valueToWrite[1]);
  } else {
    searchForm.setFieldValue(config.field, valueToWrite);
    advancedSearchForm.setFieldValue(config.field, valueToWrite);
  }
  paginationState.value.page = 1;
  loadData();
}

// ===================== Computed =====================
const hasHeader = computed(() => {
  return (
    (props.showSearch && props.searchColumns?.length) || slots['table-alert']
  );
});

const mergedColumns = computed<ProColumn<T>[]>(() => {
  const cols: ProColumn<T>[] = [];
  if (props.rowSelection) {
    const config =
      typeof props.rowSelection === 'object' ? props.rowSelection : {};
    cols.push({
      type: 'selection',
      ...(config.type === 'radio' ? { multiple: false } : {}),
      fixed: config.fixed ?? 'left',
      width: 50,
      ...(config.disabled ? { disabled: config.disabled } : {}),
    } as unknown as ProColumn<T>);
  }
  cols.push(
    ...settledColumns.value.map((col) => ({
      ...col,
      resizable: col.resizable !== false,
    })),
  );
  const actionColumn = unref(props.actionColumn);
  if (actionColumn) {
    cols.push({
      key: '__action__',
      title: unref(actionColumn.title) || t('components.proCrudTable.action'),
      width: actionColumn.width || 200,
      fixed: actionColumn.fixed || 'right',
      titleAlign: 'center',
      align: actionColumn.align || 'center',
      render: (rowData: T, rowIndex: number) =>
        actionColumn.render(rowData, rowIndex),
    });
  }
  return cols;
});

const computedScrollX = computed(() => {
  if (props.scrollX !== undefined) return props.scrollX;
  return mergedColumns.value.reduce((sum, col) => {
    const w = col.width || col.minWidth || 100;
    return (
      sum + (typeof w === 'number' ? w : Number.parseFloat(String(w)) || 100)
    );
  }, 20);
});

const paginationPrefix = ({ itemCount }: { itemCount?: number }) =>
  t('components.proCrudTable.totalCount', { count: itemCount ?? 0 });

const currentSearchParams = computed(() => getSearchParams());

/** 头部 grid 折叠动画约 220ms，结束后重算表格可视高度避免留白或裁切。 */
function scheduleRecalculateAfterHeaderTransition() {
  window.setTimeout(() => {
    void nextTick(recalculate);
  }, 230);
}

// ===================== 折叠切换 =====================
function toggleHeaderCollapse() {
  lockHeight();
  isHeaderCollapsed.value = !isHeaderCollapsed.value;
  unlockHeight();
  scheduleRecalculateAfterHeaderTransition();
}

// ===================== 列宽拖拽 =====================
function handleColumnResize(
  resizedWidth: number,
  _: number,
  column: { key?: string },
) {
  if (column?.key) {
    updateColumnWidth(String(column.key), Math.max(resizedWidth, 50));
  }
}

// ===================== Shift + 滚轮 强制横向滚动 =====================
// Windows 部分鼠标驱动在 Shift+滚轮 时会同时给出 deltaX/deltaY，导致表格纵向与横向同时滚动；
// Mac 浏览器默认则只横向。此处统一接管为"只横向"，保证两系统行为一致。
function handleTableWheel(event: WheelEvent) {
  if (!event.shiftKey || event.deltaY === 0) return;
  const scroller = findHorizontalScroller(event.target);
  if (!scroller) return;
  event.preventDefault();
  scroller.scrollLeft += event.deltaY;
}

function findHorizontalScroller(
  target: EventTarget | null,
): HTMLElement | null {
  let el = target instanceof Element ? target : null;
  while (el instanceof HTMLElement) {
    if (el.scrollWidth > el.clientWidth) {
      const overflowX = getComputedStyle(el).overflowX;
      if (
        overflowX === 'auto' ||
        overflowX === 'scroll' ||
        overflowX === 'overlay'
      ) {
        return el;
      }
    }
    el = el.parentElement;
  }
  return null;
}

// ===================== Provide Context =====================
createProCrudTableContext<T>({
  searchForm,
  advancedSearchForm,
  advancedSearchOpen,
  searchColumns: computed(() => props.searchColumns || []),
  pinnedColumns,
  advancedColumns,
  userPinnedPaths,
  searchLabelWidth: computed(() => props.searchLabelWidth),
  searchAutoSpan: computed(() => props.searchAutoSpan),
  advancedSearchCols: computed(() => props.advancedSearchCols),
  maxPinCount: computed(() => props.maxPinCount),
  columns: computed(() => props.columns),
  columnSettings,
  toggleColumnVisibility,
  toggleColumnFixed,
  updateColumnOrder,
  resetColumnSetting,
  setAllVisible,
  tableData,
  loading,
  checkedRowKeys,
  isAllCurrentPageSelected,
  isIndeterminate,
  handleCheckedRowKeysChange,
  handleSelectAllCurrentPage,
  getSelectedRows,
  handleSearch: handleSearchWithEmit,
  handleReset: handleResetWithEmit,
  loadData,
  timezoneId: timezoneIdState,
  setTimezoneId,
});

// ===================== Expose =====================
const exposedMethods: ProCrudTableInstance<T> = {
  recalculate: () => nextTick(recalculate),
  reload: async (
    pageNoOrExtra?: number | Recordable,
    extraParams?: Recordable,
  ) => {
    // 允许 `reload(3)` 直接跳到指定页再加载；`reload({ ... })` 作为 extraParams；
    // 也支持同时传 `reload(pageNo, extraParams)`
    let extras: Recordable | undefined;
    if (typeof pageNoOrExtra === 'number') {
      paginationState.value.page = pageNoOrExtra;
      extras = extraParams;
    } else {
      extras = pageNoOrExtra;
    }
    await loadData(extras);
  },
  searchFromFirstPage: async (extraParams?: Recordable) => {
    paginationState.value.page = 1;
    await loadData(extraParams);
  },
  reset: async () => {
    paginationState.value.page = 1;
    searchForm.reset();
    advancedSearchForm.reset();
    await loadData();
  },
  getDataSource: () => tableData.value,
  getSearchParams,
  setSearchParams: (params: Recordable) => {
    searchForm.setFieldsValue(params);
    advancedSearchForm.setFieldsValue(params);
  },
  // 同步覆盖搜索表单的「重置基准」，详见 ProCrudTableInstance 类型注释。
  setSearchInitialValues: (values: Recordable) => {
    searchForm.setInitialValues(values);
    advancedSearchForm.setInitialValues(values);
  },
  getSelectedRows,
  getSelectedRowKeys: () => checkedRowKeys.value,
  setSelectedRowKeys,
  clearSelection,
  getPagination: () => ({
    pageNo: paginationState.value.page,
    pageSize: paginationState.value.pageSize,
    total: paginationState.value.itemCount,
  }),
  getLoading: () => loading.value,
  scrollTo: (options: { left?: number; row?: number; top?: number }) => {
    dataTableRef.value?.scrollTo(options);
  },
  isHeaderCollapsed: () => isHeaderCollapsed.value,
  setHeaderCollapsed: (collapsed: boolean) => {
    if (isHeaderCollapsed.value === collapsed) return;
    lockHeight();
    isHeaderCollapsed.value = collapsed;
    unlockHeight();
    scheduleRecalculateAfterHeaderTransition();
  },
  toggleHeaderCollapse,
  resetColumnSetting,
  validateSearch: async () => {
    try {
      await searchForm.search();
    } catch {
      // 校验失败时静默，仅触发 UI 提示
    }
  },
  setTimezoneId,
};

defineExpose(exposedMethods);

// ===================== Lifecycle =====================
onMounted(() => {
  nextTick(recalculate);

  if (props.autoLoad) {
    if (isColumnSettingReady.value) {
      loadData();
    } else {
      const unwatch = watch(isColumnSettingReady, (ready) => {
        if (ready) {
          unwatch();
          loadData();
        }
      });
    }
  }
});
</script>

<template>
  <NEl
    tag="div"
    :class="{
      'pro-crud-table': rootClassEnabled,
      'pro-crud-table--borderless': !bordered && rootClassEnabled,
    }"
  >
    <!-- 可折叠的头部区域 -->
    <div
      v-if="hasHeader"
      class="pro-crud-table__header"
      :class="{ 'is-collapsed': isHeaderCollapsed }"
    >
      <div class="pro-crud-table__header-sizer">
        <!-- 搜索表单（含高级筛选按钮）；高度由外层 grid 折叠动画控制，不再使用 v-show -->
        <ProSearchBar
          v-if="
            showSearch &&
            (pinnedColumns.length > 0 || advancedColumns.length > 0)
          "
          :form="searchForm"
          :columns="pinnedColumns"
          :label-width="searchLabelWidth"
          :cols="searchCols"
          :layout="searchLayout"
          :x-gap="searchXGap"
          :y-gap="searchYGap"
          :component-width="searchComponentWidth"
          :auto-span="searchAutoSpan"
          :search-button-props="searchButtonProps"
          :reset-button-props="resetButtonProps"
          :loading="loading"
          @search="handleSearchWithEmit"
          @reset="handleResetWithEmit"
        >
          <template v-for="(_, name) in $slots" :key="name" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps"></slot>
          </template>
        </ProSearchBar>
        <div v-if="slots['table-alert']" class="pro-crud-table__alert">
          <slot name="table-alert"></slot>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="pro-crud-table__toolbar-settings">
      <div class="pro-crud-table__toolbar-left">
        <slot name="table-header"></slot>
        <!-- 内置快捷日期按钮（右对齐） -->
        <ProQuickDateButtons
          v-if="normalizedQuickDate"
          v-model="quickDateIndex"
          :shortcuts="quickDateShortcuts"
          :size="normalizedQuickDate.size ?? 'tiny'"
          :time-range="quickDateMatchRange"
          class="pro-crud-table__quick-date"
          @select="handleQuickDateSelect"
        />
      </div>
      <div
        v-if="hasHeader"
        class="pro-crud-table__collapse-bar"
        :style="collapseBarStyle"
        @click="toggleHeaderCollapse"
      >
        <NIcon
          :size="COLLAPSE_CHEVRON_ICON_SIZE"
          class="pro-crud-table__collapse-bar-icon"
          :class="{
            'pro-crud-table__collapse-bar-icon--expanded': !isHeaderCollapsed,
          }"
        >
          <ChevronDown />
        </NIcon>
        <span>{{
          t(
            isHeaderCollapsed
              ? 'components.proCrudTable.expand'
              : 'components.proCrudTable.collapse',
          )
        }}</span>
      </div>
      <div class="pro-crud-table__toolbar-right">
        <slot name="toolbar-right"></slot>
        <ProColumnSettingPanel v-if="showColumnSetting" />
      </div>
    </div>

    <!-- 表格容器 -->
    <div
      class="pro-crud-table__table-wrapper"
      ref="containerRef"
      @wheel="handleTableWheel"
    >
      <ProDataTable
        ref="dataTableRef"
        :key="columnResetKey"
        :columns="mergedColumns"
        :search-params="currentSearchParams"
        :data="tableData"
        :loading="loading"
        :row-key="rowKey"
        :scroll-x="computedScrollX"
        :max-height="actualMaxHeight"
        :row-props="rowProps"
        :summary="summary"
        virtual-scroll
        :checked-row-keys="checkedRowKeys"
        :pagination="false"
        size="small"
        remote
        @update:checked-row-keys="handleCheckedRowKeysChange"
        @update:sorter="handleSorterChange"
        @unstable-column-resize="handleColumnResize"
      />

      <div
        v-if="slots['table-summary']"
        ref="summaryRef"
        class="pro-crud-table__summary"
      >
        <slot name="table-summary"></slot>
      </div>

      <!-- 底部 -->
      <div ref="footerRef" class="pro-crud-table__footer">
        <div class="pro-crud-table__footer-left">
          <NCheckbox
            v-if="rowSelection"
            :checked="isAllCurrentPageSelected"
            :indeterminate="isIndeterminate"
            @update:checked="handleSelectAllCurrentPage"
          >
            {{ t('components.proCrudTable.selectCurrentPage') }}
          </NCheckbox>
          <slot name="batch-actions">
            <NDropdown
              v-if="rowSelection && visibleBatchActions.length > 0"
              trigger="click"
              :options="visibleBatchActions"
              @select="handleBatchAction"
            >
              <NButton :disabled="checkedRowKeys.length === 0">
                {{ t('components.proCrudTable.batchAction') }}
                <template #icon>
                  <NIcon><DownOutlined /></NIcon>
                </template>
              </NButton>
            </NDropdown>
          </slot>
          <span
            v-if="rowSelection && checkedRowKeys.length > 0"
            class="pro-crud-table__selected-info"
          >
            {{
              t('components.proCrudTable.selectedCount', {
                count: checkedRowKeys.length,
              })
            }}
          </span>
          <slot name="footer-left"></slot>
        </div>
        <div class="pro-crud-table__footer-right">
          <slot name="footer-right"></slot>
          <NPagination
            v-if="pagination !== false"
            v-model:page="paginationState.page"
            v-model:page-size="paginationState.pageSize"
            :item-count="paginationState.itemCount"
            :page-sizes="pageSizes"
            show-size-picker
            show-quick-jumper
            :prefix="paginationPrefix"
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
          />
        </div>
      </div>
    </div>
    <slot name="table-footer"></slot>
  </NEl>
</template>

<style lang="less" scoped>
.pro-crud-table {
  // naive-ui theme vars（由外层 <n-el> 暴露）：card 背景 + 标准圆角 + 分割线色描边
  background: var(--card-color);
  border: 1px solid var(--divider-color);
  border-radius: var(--border-radius);
  padding: 12px 12px 0;

  &__alert {
    margin-bottom: 8px;
  }

  &__header {
    display: grid;
    grid-template-rows: 1fr;
    overflow: hidden;
    transition: grid-template-rows 0.22s cubic-bezier(0.4, 0, 0.2, 1);

    &.is-collapsed {
      grid-template-rows: 0fr;

      .pro-crud-table__header-sizer {
        pointer-events: none;
      }
    }

    &-sizer {
      min-height: 0;
      overflow: hidden;
    }

    ::v-deep(
      .pro-search-form .n-form-item-label.n-form-item-label--right-mark
    ) {
      padding: 0 6px 0 0;
    }
  }

  // ---- 工具栏 ----
  &__toolbar-settings {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 6px 6px;
  }

  &__toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }

  // 内置快捷日期按钮：在工具栏左侧区域内靠右对齐，与 #table-header slot 共存
  &__quick-date {
    margin-left: auto;
  }

  &__toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    margin-left: 8px;
  }

  &__collapse-bar {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(
      calc(-50% + var(--pro-crud-table-collapse-bar-offset-x, 0px))
    );
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 20px;
    padding: 0 5px;
    cursor: pointer;
    color: #fff;
    font-size: 12px;
    background-color: var(--ui-accent-solid);
    border-radius: 6px 6px 0 0;
    transition: opacity 0.2s ease;
    z-index: 1;

    &:hover {
      opacity: 0.85;
    }
  }

  &__collapse-bar-icon {
    flex-shrink: 0;
    transform-origin: center;
    transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &__collapse-bar-icon--expanded {
    transform: rotate(180deg);
  }

  // ---- 表格 ----
  &__table-wrapper {
    overflow: hidden;
  }

  &__summary {
    flex-shrink: 0;
  }

  // ---- 底部 ----
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 6px;
  }

  &__footer-left,
  &__footer-right {
    display: flex;
    align-items: center;
  }

  &__footer-left {
    gap: 16px;
  }

  &__footer-right {
    gap: 8px;
  }

  &__selected-info {
    color: var(--text-color-3, #666);
    font-size: 13px;

    strong {
      color: var(--ui-accent-solid);
      font-weight: 600;
    }
  }
  // ---- 无边框变体 ----
  &--borderless {
    padding: 0;
    border: none;
    box-shadow: none;
    background: transparent;

    .pro-crud-table__footer {
      padding: 12px 0px;
      border-top: none;
    }
  }
}
</style>
