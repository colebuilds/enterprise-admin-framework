/* oxlint-disable */
import type { ComputedRef, CSSProperties, Ref } from 'vue';

import type {
  CreateProSearchFormReturn,
  ProSearchFormColumn,
} from '../../types';

import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import { throttle } from 'lodash-es';

import { getFieldSizeSpec } from './fieldWidthSpec';

// ===================== 响应式断点 =====================
const BREAKPOINTS: Record<string, number> = {
  xs: 0, // 手机竖屏
  s: 640, // 手机横屏
  m: 768, // 平板竖屏
  l: 1024, // 平板横屏 / 小屏电脑
  xl: 1280, // 桌面电脑
  '2xl': 1536, // 大屏 / 外接显示器
};

function parseResponsiveCols(cols: number | string): Record<string, number> {
  if (typeof cols === 'number') return { default: cols };
  const result: Record<string, number> = {};
  for (const part of cols.trim().split(/\s+/)) {
    if (part.includes(':')) {
      const [bp, val] = part.split(':');
      result[bp] = Number.parseInt(val, 10);
    } else {
      result.default = Number.parseInt(part, 10);
    }
  }
  return result;
}

function getColsForWidth(
  config: Record<string, number>,
  width: number,
): number {
  let result = config.default || 4;
  const sorted = Object.entries(BREAKPOINTS).toSorted((a, b) => a[1] - b[1]);
  for (const [name, minWidth] of sorted) {
    if (width >= minWidth && config[name] !== undefined) result = config[name];
  }
  return result;
}

// ===================== 类型 =====================

export interface UseResponsiveGridOptions {
  cols: ComputedRef<number | string>;
  layout: ComputedRef<'flex' | 'grid'>;
  xGap: ComputedRef<number | string>;
  yGap: ComputedRef<number | string>;
  componentWidth: ComputedRef<number | string>;
  labelWidth?: ComputedRef<number | string>;
  labelPlacement?: ComputedRef<'left' | 'top'>;
  /** 启用时根据 valueType 自动计算字段 span；关闭时所有字段统一 span=1 */
  autoSpan?: ComputedRef<boolean>;
  /** 容器元素引用，用于测量实际列宽 */
  containerRef?: Ref<HTMLElement | null>;
  /** 操作区内容引用，用于测量实际按钮宽度 */
  actionsRef?: Ref<HTMLElement | null>;
  /** 搜索表单折叠相关 */
  form?: CreateProSearchFormReturn;
  columns?: ComputedRef<ProSearchFormColumn[]>;
  collapsedRows?: ComputedRef<number>;
  showActions?: ComputedRef<boolean>;
}

export interface UseResponsiveGridReturn {
  currentCols: Ref<number>;
  containerStyle: ComputedRef<CSSProperties>;
  getItemStyle: (column: ProSearchFormColumn) => CSSProperties;
  getColumnSpan: (column: ProSearchFormColumn) => number;
  /** 折叠相关（仅在传入 form + columns 时有效） */
  visibleColumns: ComputedRef<ProSearchFormColumn[]>;
  isColumnVisible: (column: ProSearchFormColumn) => boolean;
  isOverflow: ComputedRef<boolean>;
  showCollapseButton: ComputedRef<boolean>;
  actionsStyle: ComputedRef<CSSProperties>;
}

type ScreenTier = 'large' | 'mobile' | 'pc' | 'tablet';

function getScreenTier(width: number): ScreenTier {
  if (width < BREAKPOINTS.m) return 'mobile';
  if (width < BREAKPOINTS.xl) return 'tablet';
  if (width < BREAKPOINTS['2xl']) return 'pc';
  return 'large';
}

// ===================== Composable =====================

export function useResponsiveGrid(
  options: UseResponsiveGridOptions,
): UseResponsiveGridReturn {
  const parsedCols = computed(() => parseResponsiveCols(options.cols.value));
  const currentCols = ref(4);
  const screenTier = ref<ScreenTier>('pc');
  const containerWidth = ref(0);
  const actionsWidth = ref(0);

  // ---- 列数响应 ----
  function updateCols() {
    const width = window.innerWidth;
    currentCols.value = getColsForWidth(parsedCols.value, width);
    screenTier.value = getScreenTier(width);
  }

  // ---- 容器宽度测量 ----
  let resizeObserver: null | ResizeObserver = null;
  let actionsResizeObserver: null | ResizeObserver = null;

  function updateContainerWidth() {
    const el = options.containerRef?.value;
    if (el) containerWidth.value = el.clientWidth;
  }

  function setupObserver() {
    const el = options.containerRef?.value;
    if (!el) return;
    resizeObserver = new ResizeObserver(() => updateContainerWidth());
    resizeObserver.observe(el);
    updateContainerWidth();
  }

  function updateActionsWidth() {
    const el = options.actionsRef?.value;
    if (!el) {
      actionsWidth.value = 0;
      return;
    }
    actionsWidth.value = Math.max(
      el.scrollWidth,
      el.getBoundingClientRect().width,
    );
  }

  function setupActionsObserver() {
    const el = options.actionsRef?.value;
    if (!el) return;
    actionsResizeObserver = new ResizeObserver(() => updateActionsWidth());
    actionsResizeObserver.observe(el);
    updateActionsWidth();
  }

  function cleanupObserver() {
    resizeObserver?.disconnect();
    resizeObserver = null;
  }

  function cleanupActionsObserver() {
    actionsResizeObserver?.disconnect();
    actionsResizeObserver = null;
  }

  const throttledUpdate = throttle(updateCols, 100);

  watch(options.cols, updateCols, { immediate: false });

  if (options.containerRef) {
    watch(options.containerRef, (el) => {
      cleanupObserver();
      if (el) setupObserver();
    });
  }

  if (options.actionsRef) {
    watch(options.actionsRef, (el) => {
      cleanupActionsObserver();
      if (el) setupActionsObserver();
    });
  }

  onMounted(() => {
    updateCols();
    window.addEventListener('resize', throttledUpdate);
    setupObserver();
    setupActionsObserver();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', throttledUpdate);
    throttledUpdate.cancel();
    cleanupObserver();
    cleanupActionsObserver();
  });

  // ---- 实际列宽计算 ----
  const gap = computed(() => {
    const v = options.xGap.value;
    return typeof v === 'number' ? v : Number.parseFloat(String(v)) || 0;
  });

  function parsePixelLike(
    value: number | string | undefined,
    fallback: number,
  ): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = Number.parseFloat(value);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return fallback;
  }

  interface ColumnSizeBounds {
    min: number;
    preferred: number;
    max: number;
  }

  function getColumnSizeBounds(column: ProSearchFormColumn): ColumnSizeBounds {
    const spec = {
      ...getFieldSizeSpec(column.valueType, column.componentProps),
      ...column.sizeOverride,
    };

    const labelBudget =
      options.labelPlacement?.value === 'top'
        ? 0
        : parsePixelLike(column.labelWidth ?? options.labelWidth?.value, 80);

    const min = spec.min + labelBudget;
    const preferred = spec.preferred + labelBudget;
    const max =
      spec.max > 0 ? spec.max + labelBudget : Number.POSITIVE_INFINITY;

    return { min, preferred, max };
  }

  /** 单列实际像素宽度 */
  const colWidth = computed(() => {
    const cols = currentCols.value;
    if (cols <= 0) return 200;
    const availableWidth =
      containerWidth.value > 0 ? Math.max(containerWidth.value, 0) : 0;

    // 优先使用容器实测宽度
    if (availableWidth > 0) {
      return (availableWidth - (cols - 1) * gap.value) / cols;
    }

    // fallback: 按窗口宽度估算（content area ≈ 80%）
    const estContent = window.innerWidth * 0.8;
    return (estContent - (cols - 1) * gap.value) / cols;
  });

  function getSpanWidth(span: number): number {
    if (span <= 1) return colWidth.value;
    return span * colWidth.value + (span - 1) * gap.value;
  }

  function getMinSpanForWidth(width: number): number {
    if (width <= 0) return 0;
    for (let span = 1; span <= currentCols.value; span += 1) {
      if (getSpanWidth(span) >= width) return span;
    }
    return currentCols.value;
  }

  interface SpanCandidate {
    span: number;
    width: number;
  }

  function getSpanCandidates(bounds: ColumnSizeBounds): SpanCandidate[] {
    const candidates: SpanCandidate[] = [];

    for (let span = 1; span <= currentCols.value; span += 1) {
      const width = getSpanWidth(span);
      if (width >= bounds.min) {
        candidates.push({ span, width });
      }
    }

    return candidates;
  }

  function pickBestSpan(bounds: ColumnSizeBounds): number {
    const candidates = getSpanCandidates(bounds);

    if (candidates.length === 0) {
      return currentCols.value;
    }

    if (screenTier.value === 'mobile' || screenTier.value === 'tablet') {
      return candidates[0].span;
    }

    const inPreferredBand = candidates.filter(
      (candidate) =>
        candidate.width >= bounds.preferred && candidate.width <= bounds.max,
    );
    if (inPreferredBand.length > 0) {
      return inPreferredBand[0].span;
    }

    const belowPreferred = candidates.filter(
      (candidate) => candidate.width < bounds.preferred,
    );
    if (belowPreferred.length > 0) {
      return belowPreferred[belowPreferred.length - 1].span;
    }

    return candidates[0].span;
  }

  function getDisplayWidth(
    bounds: ColumnSizeBounds,
    spanWidth: number,
  ): number {
    // mobile / tablet / pc：直接撑满网格格子，保证同 span 字段等宽对齐
    if (screenTier.value !== 'large') {
      return spanWidth;
    }

    // large（≥1536px）：列宽富余，约束字段宽度避免过度拉伸
    if (spanWidth <= bounds.preferred) {
      return spanWidth;
    }

    if (spanWidth <= bounds.max) {
      return bounds.preferred;
    }

    return Number.isFinite(bounds.max) ? bounds.max : bounds.preferred;
  }

  const actionsRequiredWidth = computed(() => {
    if (!options.showActions?.value) return 0;
    return actionsWidth.value > 0 ? actionsWidth.value : 280;
  });

  const actionsMinSpan = computed(() =>
    getMinSpanForWidth(actionsRequiredWidth.value),
  );

  // ---- 动态 span 计算 ----
  function getColumnSpan(column: ProSearchFormColumn): number {
    // 用户显式指定 span 时直接使用
    if (column.span != null) {
      return Math.max(1, Math.min(column.span, currentCols.value));
    }

    // autoSpan 关闭时所有字段统一 span=1
    if (options.autoSpan && !options.autoSpan.value) {
      return 1;
    }

    return pickBestSpan(getColumnSizeBounds(column));
  }

  // ---- Grid 容器样式 ----
  const containerStyle = computed<CSSProperties>(() => {
    const colGap =
      typeof options.xGap.value === 'number'
        ? `${options.xGap.value}px`
        : options.xGap.value;
    const rGap =
      typeof options.yGap.value === 'number'
        ? `${options.yGap.value}px`
        : options.yGap.value;

    if (options.layout.value === 'flex') {
      return {
        display: 'flex',
        flexWrap: 'wrap',
        columnGap: colGap,
        rowGap: rGap,
        alignItems: 'flex-start',
      };
    }
    return {
      display: 'grid',
      gridTemplateColumns: `repeat(${currentCols.value}, minmax(0, 1fr))`,
      columnGap: colGap,
      rowGap: rGap,
    };
  });

  // ===================== 折叠/展开逻辑 =====================

  const { form, columns, collapsedRows } = options;

  function isColumnShown(column: ProSearchFormColumn): boolean {
    if (!form) return true;
    if (column.show === undefined || column.show === true) return true;
    if (column.show === false) return false;
    if (typeof column.show === 'function')
      return column.show(form.values.value);
    return true;
  }

  // 可见列（过滤 hideInSearch，按 order 排序）
  const visibleColumns = computed(() => {
    if (!columns) return [] as ProSearchFormColumn[];
    return columns.value
      .filter((col) => !col.hideInSearch)
      .toSorted((a, b) => (a.order ?? 0) - (b.order ?? 0));
  });

  // 参与布局的列
  const activeColumns = computed(() =>
    visibleColumns.value.filter(isColumnShown),
  );

  interface LayoutSimulation {
    visiblePaths: Set<string>;
    hiddenCount: number;
    lastRowUsed: number;
    lastRow: number;
    placements: Map<string, { row: number; span: number; start: number }>;
  }

  function simulateGridLayout(isCollapsed: boolean): LayoutSimulation {
    const gridCols = currentCols.value;
    const maxRows = collapsedRows?.value ?? 1;
    const result = new Set<string>();
    const placements = new Map<
      string,
      { row: number; span: number; start: number }
    >();
    let lastRowUsed = 0;
    let lastRow = 0;

    if (options.layout.value === 'flex') {
      activeColumns.value.forEach((col) => result.add(col.path));
      return {
        visiblePaths: result,
        hiddenCount: 0,
        lastRowUsed: 0,
        lastRow: 0,
        placements,
      };
    }

    let currentRow = 1;
    let rowUsed = 0;

    // 用队列管理待放置字段，支持回填
    const queue = activeColumns.value.map((col) => ({
      col,
      span: getColumnSpan(col),
    }));
    const placed = new Set<string>();

    let i = 0;
    while (i < queue.length) {
      const { col, span } = queue[i];
      if (placed.has(col.path)) {
        i++;
        continue;
      }

      if (rowUsed + span > gridCols) {
        // 当前字段放不下，从后面找一个能填入剩余空间的窄字段
        const remaining = gridCols - rowUsed;
        if (remaining > 0) {
          let filled = false;
          for (let j = i + 1; j < queue.length; j++) {
            if (!placed.has(queue[j].col.path) && queue[j].span <= remaining) {
              // 找到能填入的窄字段，先放它
              placements.set(queue[j].col.path, {
                row: currentRow,
                start: rowUsed + 1,
                span: queue[j].span,
              });
              result.add(queue[j].col.path);
              placed.add(queue[j].col.path);
              rowUsed += queue[j].span;
              lastRow = currentRow;
              filled = true;
              break;
            }
          }
          if (filled) continue; // 重新检查当前字段
        }
        currentRow++;
        rowUsed = 0;
      }

      if (isCollapsed) {
        if (currentRow > maxRows) break;

        // 折叠态最后一行要为操作区预留足够列数
        if (
          options.showActions?.value &&
          gridCols > 1 &&
          currentRow === maxRows &&
          actionsMinSpan.value > 0 &&
          actionsMinSpan.value < gridCols &&
          rowUsed + span > gridCols - actionsMinSpan.value
        ) {
          break;
        }
      }

      placements.set(col.path, {
        row: currentRow,
        start: rowUsed + 1,
        span,
      });
      result.add(col.path);
      placed.add(col.path);
      rowUsed += span;
      lastRow = currentRow;
      i++;
    }

    lastRowUsed = rowUsed;

    return {
      visiblePaths: result,
      hiddenCount: activeColumns.value.length - result.size,
      lastRowUsed,
      lastRow,
      placements,
    };
  }

  const collapsedSimulation = computed(() => simulateGridLayout(true));
  const currentSimulation = computed(() =>
    simulateGridLayout(form?.collapsed.value ?? false),
  );

  const isOverflow = computed(() => collapsedSimulation.value.hiddenCount > 0);
  const showCollapseButton = computed(() => isOverflow.value);

  function isColumnVisible(column: ProSearchFormColumn): boolean {
    return (
      isColumnShown(column) &&
      currentSimulation.value.visiblePaths.has(column.path)
    );
  }

  function toActualGridColumn(start: number, span: number): string {
    return `${start} / ${start + span}`;
  }

  // ---- 字段项样式 ----
  function getItemStyle(column: ProSearchFormColumn): CSSProperties {
    if (options.layout.value === 'flex') {
      // 优先使用列级显式宽度，其次参考 fieldWidthSpec preferred 宽度，最后回退全局默认
      const w =
        column.componentWidth ??
        getFieldSizeSpec(column.valueType, column.componentProps).preferred ??
        options.componentWidth.value;
      return {
        '--pro-search-component-width': typeof w === 'number' ? `${w}px` : w,
      } as CSSProperties;
    }

    const placement = currentSimulation.value.placements.get(column.path);
    const span = placement?.span ?? getColumnSpan(column);
    const row = placement?.row ?? 1;
    const start = placement?.start ?? 1;

    return {
      gridColumn: toActualGridColumn(start, span),
      gridRow: `${row}`,
      width: '100%',
    } as CSSProperties;
  }

  // 操作按钮区域样式
  const actionsStyle = computed<CSSProperties>(() => {
    if (options.layout.value === 'flex') {
      return { marginLeft: 'auto', display: 'flex', alignItems: 'flex-start' };
    }

    const gridCols = currentCols.value;
    const lastRowUsed = currentSimulation.value.lastRowUsed;
    const lastRow = Math.max(currentSimulation.value.lastRow, 1);
    const fullRowStart = 1;
    const fullRowEnd = gridCols + 1;
    const minActionSpan = actionsMinSpan.value;

    if (lastRowUsed <= 0) {
      return {
        gridRow: '1',
        gridColumn: `${fullRowStart} / ${fullRowEnd}`,
        display: 'flex',
        justifyContent: 'flex-end',
      };
    }

    const remaining = gridCols - lastRowUsed;

    if (minActionSpan >= gridCols || remaining < minActionSpan) {
      return {
        gridRow: `${lastRow + 1}`,
        gridColumn: `${fullRowStart} / ${fullRowEnd}`,
        display: 'flex',
        justifyContent: 'flex-end',
      };
    }

    return {
      gridRow: `${lastRow}`,
      gridColumn: toActualGridColumn(lastRowUsed + 1, remaining),
      display: 'flex',
      justifyContent: 'flex-end',
    };
  });

  return {
    currentCols,
    containerStyle,
    getItemStyle,
    getColumnSpan,
    visibleColumns,
    isColumnVisible,
    isOverflow,
    showCollapseButton,
    actionsStyle,
  };
}
