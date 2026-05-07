<!-- oxlint-disable -->
<script lang="ts" setup generic="T extends Recordable = Recordable">
import type { DataTableColumn, DataTableRowKey } from 'naive-ui';

import type { VNode } from 'vue';

import type {
  ProColumn,
  ProTableDragSortOptions,
  ProTenantTimeZoneDisplayOptions,
  Recordable,
} from '../types';

import {
  computed,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
} from 'vue';

import { QuestionCircleOutlined } from '@vicons/antd';
import { NDataTable, NIcon, NTooltip } from 'naive-ui';

import { useTenantOptions } from '#/hooks';

import { useColumnRenderer } from '../composables/useColumnRenderer';
import { useDragSort } from '../composables/useDragSort';
import { ProTableContextKey } from '../context';

defineOptions({
  name: 'ProDataTable',
  inheritAttrs: false,
});

const props = withDefaults(defineProps<ProDataTableComponentProps<T>>(), {
  columns: () => [],
  data: () => [],
  loading: false,
  flexHeight: false,
  rowKey: 'id',
  virtualScroll: false,
});

interface ProDataTableComponentProps<TData extends Recordable = Recordable> {
  /** 列定义 */
  columns?: ProColumn<TData>[];
  /** 数据源 */
  data?: TData[];
  /** 加载状态 */
  loading?: boolean;
  /** 弹性高度 */
  flexHeight?: boolean;
  /** 行键 */
  rowKey?: ((row: TData) => DataTableRowKey) | string;
  /** 横向滚动宽度 */
  scrollX?: number | string;
  /** 最大高度 */
  maxHeight?: number | string;
  /** 虚拟滚动（大数据量时开启，需配合 maxHeight 使用） */
  virtualScroll?: boolean;
  /** 拖拽排序配置 */
  dragSortOptions?: ProTableDragSortOptions<TData>;
  /** 当前搜索参数，供列渲染按搜索态联动 */
  searchParams?: Recordable;
}

// Refs
const tableRef = ref<InstanceType<typeof NDataTable> | null>(null);
const tableContainerRef = ref<HTMLElement | null>(null);

function findHorizontalScrollableElement(
  root: HTMLElement,
): HTMLElement | null {
  const candidates = [...root.querySelectorAll<HTMLElement>('*')];
  for (const el of candidates) {
    if (el.scrollWidth <= el.clientWidth + 1) continue;
    const style = window.getComputedStyle(el);
    const overflowX = style.overflowX;
    if (
      overflowX !== 'auto' &&
      overflowX !== 'scroll' &&
      overflowX !== 'overlay'
    )
      continue;
    return el;
  }
  if (root.scrollWidth > root.clientWidth + 1) return root;
  return null;
}

const handleWheel = (event: WheelEvent) => {
  if (!event.shiftKey) return;
  const container = tableContainerRef.value;
  if (!container) return;
  const target = event.target as Node | null;
  if (!target || !container.contains(target)) return;
  const dataTableRoot = container.querySelector<HTMLElement>('.n-data-table');
  if (
    dataTableRoot &&
    target instanceof Node &&
    !dataTableRoot.contains(target)
  )
    return;

  const scrollEl = dataTableRoot
    ? findHorizontalScrollableElement(dataTableRoot)
    : null;
  if (!scrollEl) return;

  const canScroll = scrollEl.scrollWidth > scrollEl.clientWidth + 1;
  if (!canScroll) return;

  const delta =
    Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ? event.deltaX
      : event.deltaY;
  if (!delta) return;

  event.preventDefault();
  scrollEl.scrollLeft += delta;
};

onMounted(async () => {
  await nextTick();
  tableContainerRef.value?.addEventListener('wheel', handleWheel, {
    passive: false,
  });
});

onBeforeUnmount(() => {
  tableContainerRef.value?.removeEventListener(
    'wheel',
    handleWheel as EventListener,
  );
});

// 列渲染器
const { renderColumnWithEllipsis } = useColumnRenderer();
const {
  activeTenantId,
  renderTenantDateTimeColumnTitle,
  formatTenantDateTime,
} = useTenantOptions();

type TenantTimeZoneResolvedOptions = ProTenantTimeZoneDisplayOptions &
  Required<
    Pick<
      ProTenantTimeZoneDisplayOptions,
      'rowTenantIdKey' | 'searchTenantIdKey'
    >
  >;

// 拖拽排序
const dragSortResult = props.dragSortOptions
  ? useDragSort({
      dataSource: computed(() => props.data),
      options: props.dragSortOptions,
      containerRef: tableContainerRef,
    })
  : { isDragging: ref(false), dragHandleId: '' };

const { isDragging } = dragSortResult;

// 行键函数
const rowKeyFn = computed(() => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey;
  }
  return (row: T) => (row as Recordable)[props.rowKey as string];
});

function normalizeTenantId(value: unknown) {
  const tenantId = Number(value);
  return Number.isFinite(tenantId) && tenantId > 0 ? tenantId : undefined;
}

function normalizeDateFormat(format?: string) {
  if (!format) return undefined;
  return format.replaceAll('YYYY', 'yyyy').replaceAll('DD', 'dd');
}

function normalizeTimestampValue(value: number) {
  return Math.abs(value) < 1e12 ? value * 1000 : value;
}

function createTextDisplayColumn(column: ProColumn<T>): ProColumn {
  return {
    key: String(column.key),
    title: typeof column.title === 'string' ? column.title : undefined,
    copyable: column.copyable,
    ellipsis: column.ellipsis,
    valueType: 'text',
  };
}

function resolveTenantTimeZoneOptions(
  column: ProColumn<T>,
): null | TenantTimeZoneResolvedOptions {
  if (!column.showTenantTimeZone) return null;

  if (column.showTenantTimeZone === true) {
    return {
      searchTenantIdKey: 'tenantId',
      rowTenantIdKey: 'tenantId',
    };
  }

  return {
    searchTenantIdKey: 'tenantId',
    rowTenantIdKey: 'tenantId',
    ...column.showTenantTimeZone,
  };
}

function resolveSearchTenantId(options: {
  rowTenantIdKey?: string;
  searchTenantIdKey?: string;
}) {
  return (
    normalizeTenantId(
      props.searchParams?.[options.searchTenantIdKey ?? 'tenantId'],
    ) ?? normalizeTenantId(activeTenantId.value)
  );
}

function resolveRowTenantId(
  rowData: T,
  options: {
    rowTenantIdKey?: string;
    searchTenantIdKey?: string;
  },
) {
  return normalizeTenantId(
    (rowData as Recordable)[options.rowTenantIdKey ?? 'tenantId'],
  );
}

function renderTenantTimeZoneValue(
  value: unknown,
  rowData: T,
  rowIndex: number,
  column: ProColumn<T>,
  options: TenantTimeZoneResolvedOptions,
) {
  const textDisplayColumn = createTextDisplayColumn(column);

  if (value === null || value === undefined || value === '') {
    return renderColumnWithEllipsis(
      '-',
      rowData as Recordable,
      rowIndex,
      textDisplayColumn,
    );
  }

  if (typeof value === 'string') {
    return renderColumnWithEllipsis(
      value,
      rowData as Recordable,
      rowIndex,
      textDisplayColumn,
    );
  }

  const tenantId =
    resolveSearchTenantId(options) ?? resolveRowTenantId(rowData, options);

  if (typeof value === 'number' || value instanceof Date) {
    const normalizedValue =
      typeof value === 'number' ? normalizeTimestampValue(value) : value;
    const formattedText = formatTenantDateTime(
      normalizedValue,
      tenantId,
      options.format ?? normalizeDateFormat(column.dateFormat),
      '-',
    );

    return renderColumnWithEllipsis(
      formattedText,
      rowData as Recordable,
      rowIndex,
      textDisplayColumn,
    );
  }

  return renderColumnWithEllipsis(
    value,
    rowData as Recordable,
    rowIndex,
    textDisplayColumn,
  );
}

// 处理后的列配置
const processedColumns = computed<DataTableColumn<T>[]>(() => {
  const columns: DataTableColumn<T>[] = [];

  for (const col of props.columns) {
    // 特殊列（选择列）直接透传
    const colType = 'type' in col ? (col as { type?: string }).type : undefined;
    if (colType === 'selection' || colType === 'expand') {
      columns.push(col as DataTableColumn<T>);
      continue;
    }

    // 隐藏列
    if (col.hideInTable) continue;

    // 条件显示
    if (col.ifShow !== undefined) {
      const show =
        typeof col.ifShow === 'function' ? col.ifShow(col) : col.ifShow;
      if (!show) continue;
    }

    const dataKey = (col.dataIndex || col.key) as string;
    const tenantTimeZoneOptions = resolveTenantTimeZoneOptions(col);
    const columnTitle =
      tenantTimeZoneOptions === null
        ? col.title
        : renderTenantDateTimeColumnTitle(
            col.title ?? String(col.key),
            resolveSearchTenantId(tenantTimeZoneOptions),
          );

    const column: DataTableColumn<T> = {
      key: col.key as string,
      title: columnTitle,
      width: col.width,
      minWidth: col.minWidth,
      maxWidth: col.maxWidth,
      fixed: col.fixed,
      align: col.align || 'center',
      titleAlign: col.titleAlign,
      ellipsis: col.ellipsis
        ? (typeof col.ellipsis === 'object'
          ? col.ellipsis
          : { tooltip: true })
        : undefined,
      resizable: col.resizable,
      sorter: col.sortable ? true : undefined,
      defaultSortOrder: col.defaultSortOrder,
      filter: col.filterable ? true : undefined,
      filterOptions: col.filterOptions,
      defaultFilterOptionValue: col.defaultFilterValue,
      className: col.className,
      cellProps: col.cellProps,
      render: col.render
        ? (rowData: T, rowIndex: number) => col.render!(rowData, rowIndex, col)
        : (rowData: T, rowIndex: number) => {
            const value = dataKey
              ? (dataKey.includes('.')
                ? dataKey
                    .split('.')
                    .reduce(
                      (obj: Recordable | undefined, key) => obj?.[key],
                      rowData,
                    )
                : (rowData as Recordable)[dataKey])
              : undefined;

            if (tenantTimeZoneOptions !== null) {
              return renderTenantTimeZoneValue(
                value,
                rowData,
                rowIndex,
                col,
                tenantTimeZoneOptions,
              ) as VNode;
            }

            return renderColumnWithEllipsis(
              value,
              rowData as Recordable,
              rowIndex,
              col as ProColumn<Recordable>,
            ) as VNode;
          },
    };

    // 标题 tooltip
    if (col.titleTooltip) {
      const typedColumn = column as DataTableColumn<T> & {
        title?: typeof columnTitle;
      };
      const titleContent = typedColumn.title;
      typedColumn.title = () =>
        h(
          'span',
          {
            style: { display: 'inline-flex', alignItems: 'center', gap: '4px' },
          },
          [
            typeof titleContent === 'function'
              ? (titleContent as (column: DataTableColumn<T>) => VNode)(
                  typedColumn,
                )
              : (titleContent ?? ''),
            h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(
                    NIcon,
                    { size: 14, style: { cursor: 'help', color: '#999' } },
                    () => h(QuestionCircleOutlined),
                  ),
                default: () => col.titleTooltip,
              },
            ),
          ],
        );
    }

    columns.push(column);
  }

  return columns;
});

// 暴露 NDataTable 方法
const exposedMethods = {
  sort: (columnKey: null | string, order: 'ascend' | 'descend' | false) => {
    tableRef.value?.sort(columnKey as any, order);
  },
  page: (page: number) => {
    tableRef.value?.page(page);
  },
  filter: (filters: null | Recordable) => {
    tableRef.value?.filter(filters);
  },
  clearSorter: () => {
    tableRef.value?.clearSorter();
  },
  clearFilters: () => {
    tableRef.value?.clearFilters();
  },
  scrollTo: (options: { left?: number; row?: number; top?: number }) => {
    tableRef.value?.scrollTo(options);
  },
};

defineExpose(exposedMethods);

// 提供上下文
provide(ProTableContextKey, {
  tableRef,
  columns: computed(() => props.columns as ProColumn<Recordable>[]),
  dataSource: computed(() => props.data as Recordable[]),
  loading: computed(() => props.loading),
});
</script>

<template>
  <div
    ref="tableContainerRef"
    class="pro-data-table"
    :class="{
      'pro-data-table--tr-dragging': isDragging,
      'pro-data-table--flex-height': flexHeight,
    }"
  >
    <slot name="extra"></slot>
    <NDataTable
      ref="tableRef"
      :columns="processedColumns"
      :data="data"
      :loading="loading"
      :row-key="rowKeyFn"
      :scroll-x="scrollX"
      :max-height="maxHeight"
      :virtual-scroll="virtualScroll"
      bordered
      striped
      :single-line="false"
      v-bind="$attrs"
    />
    <slot name="table"></slot>
  </div>
</template>

<style lang="less" scoped>
.pro-data-table {
  &--tr-dragging {
    ::v-deep(.n-data-table-tr--dragging) {
      opacity: 0.5;
      background-color: var(--n-color-hover);
    }
  }

  &--flex-height {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  // 列拖拽调整宽度：改为边框线样式
  ::v-deep(.n-data-table-resize-button) {
    width: 8px !important;
    right: -4px !important;

    &::after {
      width: 1px !important;
      height: 100% !important;
      top: 0 !important;
      transform: none !important;
      left: 50% !important;
      background-color: transparent !important;
      transition: background-color 0.2s ease !important;
    }

    &:hover::after {
      background-color: var(--n-th-icon-color-active) !important;
    }

    &--active::after {
      background-color: var(--n-th-icon-color-active) !important;
    }
  }
}
</style>
