<!-- oxlint-disable -->
<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import type { ProSearchFormColumn, Recordable } from '../../types';

import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { format } from 'date-fns';
import { NButton, NCheckbox, NFormItem, NTag } from 'naive-ui';

import { useProCrudTableContext } from '../../context/crudTableContext';
import ProField from '../../ProField/ProField.vue';
import ProForm from '../../ProForm/ProForm.vue';
import { getDateFormat } from '../../utils/placeholder';
import { useResponsiveGrid } from '../composables/useResponsiveGrid';

defineOptions({ name: 'ProAdvancedSearchPanel' });

interface SectionItem {
  group: string;
  columns: ProSearchFormColumn[];
}

const ctx = useProCrudTableContext();
const { t } = useI18n();

// 面板打开时重置钉选模式
const lockedPanelHeight = ref<null | number>(null);
const panelWidth = ref(0);
let panelResizeObserver: null | ResizeObserver = null;

function getPanelElement(): HTMLElement | null {
  return document.querySelector('.pro-advanced-search__panel');
}

function syncPanelWidth() {
  const panel = getPanelElement();
  if (!panel) return;
  panelWidth.value = Math.ceil(panel.getBoundingClientRect().width);
}

function clearPanelHeightLock() {
  const panel = getPanelElement();
  if (!panel) return;
  panel.style.height = '';
  panel.style.minHeight = '';
}

async function syncPanelHeightLock() {
  await nextTick();
  const panel = getPanelElement();
  if (!panel) return;
  syncPanelWidth();
  if (lockedPanelHeight.value == null) {
    lockedPanelHeight.value = Math.ceil(panel.getBoundingClientRect().height);
  }
  const height = `${lockedPanelHeight.value}px`;
  panel.style.height = height;
  panel.style.minHeight = height;
}

function startPanelResizeObserver() {
  syncPanelWidth();
  if (typeof ResizeObserver === 'undefined') return;
  const panel = getPanelElement();
  if (!panel) return;

  panelResizeObserver?.disconnect();
  panelResizeObserver = new ResizeObserver(() => {
    syncPanelWidth();
  });
  panelResizeObserver.observe(panel);
}

function stopPanelResizeObserver() {
  panelResizeObserver?.disconnect();
  panelResizeObserver = null;
  panelWidth.value = 0;
}

watch(
  () => ctx.advancedSearchOpen.value,
  async (val) => {
    if (val) {
      pinEditing.value = false;
      lockedPanelHeight.value = null;
      await syncPanelHeightLock();
      startPanelResizeObserver();
    } else {
      lockedPanelHeight.value = null;
      clearPanelHeightLock();
      stopPanelResizeObserver();
    }
  },
);

// ============ 分组 ============
const sections = computed<SectionItem[]>(() =>
  groupByField(ctx.advancedColumns.value),
);

const allSections = computed<SectionItem[]>(() => {
  const allColumns = ctx.searchColumns.value;
  const pinnable = allColumns.filter(
    (col) => col.pin !== undefined || col.group,
  );
  return pinnable.length > 0
    ? groupByField(pinnable)
    : groupByField(allColumns);
});

function groupByField(columns: ProSearchFormColumn[]): SectionItem[] {
  const map = new Map<string, ProSearchFormColumn[]>();
  for (const col of columns) {
    const group = col.group || t('components.proAdvancedSearch.groupOther');
    if (!map.has(group)) map.set(group, []);
    map.get(group)!.push(col);
  }
  return Array.from(map, ([group, columns]) => ({ group, columns }));
}

const ADVANCED_SEARCH_GRID_GAP = 16;
// span 算法已按 valueType 自动扩列，基础列宽只需容纳最窄字段（text + label ≈ 220px）
const ADVANCED_SEARCH_MIN_COL_WIDTH = 220;
const ADVANCED_SEARCH_COMPACT_MIN_COL_WIDTH = 180;
const ADVANCED_SEARCH_COMPACT_BREAKPOINT = 1360;
const ADVANCED_SEARCH_BODY_PADDING = 40; // 20px * 2

const advancedBodyRef = ref<HTMLElement | null>(null);

const useCompactAdvancedLayout = computed(() => {
  return (
    panelWidth.value > 0 &&
    panelWidth.value < ADVANCED_SEARCH_COMPACT_BREAKPOINT
  );
});

const advancedSearchLabelPlacement = computed(() =>
  useCompactAdvancedLayout.value ? 'top' : 'left',
);

const advancedSearchLabelWidth = computed(() =>
  useCompactAdvancedLayout.value ? 'auto' : ctx.searchLabelWidth.value,
);

const advancedSearchFormLayoutKey = computed(
  () => `${advancedSearchLabelPlacement.value}-${panelWidth.value || 0}`,
);

const advancedSearchMinColWidth = computed(() =>
  useCompactAdvancedLayout.value
    ? ADVANCED_SEARCH_COMPACT_MIN_COL_WIDTH
    : ADVANCED_SEARCH_MIN_COL_WIDTH,
);

// 根据面板宽度计算列数，复用 useResponsiveGrid 做字段 span 计算
// N 列需要 N * minColW + (N-1) * gap => N <= (bodyWidth + gap) / (minColW + gap)
const advancedCols = computed(() => {
  const bodyWidth =
    panelWidth.value > 0
      ? panelWidth.value - ADVANCED_SEARCH_BODY_PADDING
      : 800;
  const maxCols = Math.max(ctx.advancedSearchCols.value || 1, 1);
  const minColW = advancedSearchMinColWidth.value;
  const cols = Math.floor(
    (bodyWidth + ADVANCED_SEARCH_GRID_GAP) /
      (minColW + ADVANCED_SEARCH_GRID_GAP),
  );
  return Math.max(1, Math.min(maxCols, cols));
});

const {
  containerStyle: advancedContainerStyle,
  getColumnSpan: getAdvancedColumnSpan,
} = useResponsiveGrid({
  cols: advancedCols,
  layout: computed(() => 'grid' as const),
  xGap: computed(() => ADVANCED_SEARCH_GRID_GAP),
  yGap: computed(() => 10),
  componentWidth: computed(() => 200),
  labelWidth: advancedSearchLabelWidth,
  labelPlacement: advancedSearchLabelPlacement,
  autoSpan: ctx.searchAutoSpan,
  containerRef: advancedBodyRef,
});

function getAdvancedItemStyle(column: ProSearchFormColumn): CSSProperties {
  const span = getAdvancedColumnSpan(column);
  return span > 1 ? { gridColumn: `span ${span}` } : {};
}

// ============ 筛选条件标签 ============
interface ActiveTag {
  path: string;
  label: string;
  displayValue: string;
}

const activeTags = computed<ActiveTag[]>(() => {
  const values = ctx.advancedSearchForm.values.value as Recordable;
  const tags: ActiveTag[] = [];
  for (const col of ctx.advancedColumns.value) {
    const val = values[col.path];
    if (val === undefined || val === null || val === '') continue;
    if (Array.isArray(val) && val.length === 0) continue;
    tags.push({
      path: col.path,
      label: col.label || col.path,
      displayValue: formatTagValue(val, col),
    });
  }
  return tags;
});

const DATE_VALUE_TYPES = new Set([
  'date',
  'dateRange',
  'datetime',
  'datetimeRange',
  'month',
  'proDateRange',
  'quarter',
  'time',
  'timeRange',
  'week',
  'year',
]);

function getDateFormatStr(col: ProSearchFormColumn): string {
  // proDateRange 优先从 componentProps.displayFormat 取
  if (col.valueType === 'proDateRange') {
    const props =
      typeof col.componentProps === 'function'
        ? col.componentProps({})
        : col.componentProps;
    return props?.displayFormat || 'yyyy-MM-dd';
  }
  return getDateFormat(col.valueType as any);
}

function formatTimestamp(ts: unknown, fmt: string): string {
  if (typeof ts !== 'number') return String(ts);
  try {
    return format(ts, fmt);
  } catch {
    return String(ts);
  }
}

function formatTagValue(val: unknown, col: ProSearchFormColumn): string {
  const vt = col.valueType || 'text';

  // 日期/时间类型：timestamp → 格式化字符串
  if (DATE_VALUE_TYPES.has(vt)) {
    const fmt = getDateFormatStr(col);
    if (Array.isArray(val)) {
      return val.map((v) => formatTimestamp(v, fmt)).join(' ~ ');
    }
    return formatTimestamp(val, fmt);
  }

  if (Array.isArray(val)) {
    if (col.options) {
      const opts = typeof col.options === 'function' ? [] : col.options;
      const labels = val.map(
        (v) => opts.find((o: any) => o.value === v)?.label ?? v,
      );
      return labels.join(', ');
    }
    return val.join(', ');
  }
  if (col.options) {
    const opts = typeof col.options === 'function' ? [] : col.options;
    const matched = opts.find((o: any) => o.value === val);
    if (matched) return String(matched.label);
  }
  return String(val);
}

function clearField(path: string) {
  ctx.advancedSearchForm.setFieldValue(path, undefined);
}

function handleClearAll() {
  for (const col of ctx.advancedColumns.value) {
    ctx.advancedSearchForm.setFieldValue(col.path, undefined);
  }
}

function handleApply() {
  ctx.handleSearch(ctx.advancedSearchForm.getSearchParams());
  ctx.advancedSearchOpen.value = false;
}

function close() {
  ctx.advancedSearchOpen.value = false;
}

function renderColumn(column: ProSearchFormColumn) {
  if (!column.render) return null;
  return column.render({
    formModel: ctx.advancedSearchForm.values.value,
    field: column.path,
    setValue: (val: any) =>
      ctx.advancedSearchForm.setFieldValue(column.path, val),
  });
}

// ============ 钉选模式 ============
const pinEditing = ref(false);

function handleStartPin() {
  pinEditing.value = true;
}

function handleCancelPin() {
  pinEditing.value = false;
}

function handleResetPin() {
  const defaults = (ctx.searchColumns.value || [])
    .filter((col) => col.pin !== false)
    .map((col) => col.path);
  ctx.userPinnedPaths.value = defaults;
}

function handleClearAllPins() {
  ctx.userPinnedPaths.value = [];
}

function handlePinItemClick(path: string) {
  const paths = ctx.userPinnedPaths.value;
  const isChecked = paths.includes(path);
  if (!isChecked && paths.length >= ctx.maxPinCount.value) return;
  handlePinToggle(path, !isChecked);
}

function handlePinToggle(path: string, checked: boolean) {
  const paths = ctx.userPinnedPaths.value;
  if (checked && paths.length < ctx.maxPinCount.value) {
    ctx.userPinnedPaths.value = [...paths, path];
  } else if (!checked) {
    ctx.userPinnedPaths.value = paths.filter((p) => p !== path);
  }
}

onBeforeUnmount(() => {
  clearPanelHeightLock();
  stopPanelResizeObserver();
});
</script>

<template>
  <!-- 顶栏 -->
  <div class="pro-advanced-search__header">
    <div class="pro-advanced-search__header-main">
      <div class="pro-advanced-search__title">
        {{ t('components.proAdvancedSearch.panelTitle') }}
      </div>
      <span v-if="pinEditing" class="pro-advanced-search__pin-hint">
        {{
          t('components.proAdvancedSearch.pinHint', {
            max: ctx.maxPinCount.value,
          })
        }}
      </span>
    </div>
    <NButton
      text
      type="primary"
      size="small"
      @click="pinEditing ? handleCancelPin() : handleStartPin()"
    >
      {{
        pinEditing
          ? t('components.proAdvancedSearch.cancelEdit')
          : t('components.proAdvancedSearch.quickEdit')
      }}
    </NButton>
  </div>

  <!-- 筛选模式 -->
  <div
    v-if="!pinEditing"
    ref="advancedBodyRef"
    class="pro-advanced-search__body"
  >
    <ProForm
      :key="advancedSearchFormLayoutKey"
      :form="ctx.advancedSearchForm"
      :label-width="advancedSearchLabelWidth"
      :label-placement="advancedSearchLabelPlacement"
      size="small"
    >
      <section
        v-for="section in sections"
        :key="section.group"
        class="pro-advanced-search__section"
      >
        <div class="pro-advanced-search__section-title">
          {{ section.group }}
        </div>
        <div class="pro-advanced-search__grid" :style="advancedContainerStyle">
          <div
            v-for="column in section.columns"
            :key="column.path"
            class="pro-advanced-search__item"
            :style="getAdvancedItemStyle(column)"
          >
            <NFormItem
              v-if="column.render"
              :path="column.path"
              :label="column.label"
              :label-width="column.labelWidth"
              :show-feedback="false"
            >
              <component :is="renderColumn(column)" />
            </NFormItem>
            <ProField
              v-else
              :path="column.path"
              :label="column.label"
              :label-width="column.labelWidth"
              :value-type="column.valueType || 'text'"
              :component="column.component"
              :component-props="column.componentProps"
              :default-value="column.defaultValue"
              :rules="column.rules"
              :placeholder="column.placeholder"
              :options="column.options"
              :field-mapping="column.fieldMapping"
              :show="column.show"
              :disabled="column.disabled"
              :readonly="column.readonly"
              :dependencies="column.dependencies"
              :transform-in="column.transformIn"
              :transform-out="column.transformOut"
              :form-item-props="{
                showFeedback: false,
                ...column.formItemProps,
              }"
            />
          </div>
        </div>
      </section>
    </ProForm>
  </div>

  <!-- 钉选模式 -->
  <div v-else class="pro-advanced-search__body">
    <section
      v-for="section in allSections"
      :key="section.group"
      class="pro-advanced-search__section"
    >
      <div class="pro-advanced-search__section-title">{{ section.group }}</div>
      <div class="pro-advanced-search__pin-grid">
        <div
          v-for="column in section.columns"
          :key="column.path"
          class="pro-advanced-search__pin-item"
          :class="{
            'is-checked': ctx.userPinnedPaths.value.includes(column.path),
            'is-disabled':
              !ctx.userPinnedPaths.value.includes(column.path) &&
              ctx.userPinnedPaths.value.length >= ctx.maxPinCount.value,
          }"
          @click="handlePinItemClick(column.path)"
        >
          <NCheckbox
            :checked="ctx.userPinnedPaths.value.includes(column.path)"
            :disabled="
              !ctx.userPinnedPaths.value.includes(column.path) &&
              ctx.userPinnedPaths.value.length >= ctx.maxPinCount.value
            "
            @click.stop
            @update:checked="
              (val: boolean) => handlePinToggle(column.path, val)
            "
          />
          <span>{{ column.label }}</span>
        </div>
      </div>
    </section>
  </div>

  <!-- 底部 -->
  <div class="pro-advanced-search__footer">
    <!-- 筛选模式 -->
    <template v-if="!pinEditing">
      <div class="pro-advanced-search__footer-left">
        <NTag
          v-for="tag in activeTags"
          :key="tag.path"
          size="small"
          closable
          @close="clearField(tag.path)"
        >
          {{ tag.label }}: {{ tag.displayValue }}
        </NTag>
      </div>
      <div class="pro-advanced-search__footer-right">
        <NButton size="small" @click="close">
          {{ t('common.cancel') }}
        </NButton>
        <NButton
          size="small"
          :disabled="activeTags.length === 0"
          @click="handleClearAll"
        >
          {{ t('components.proAdvancedSearch.clearAll') }}
        </NButton>
        <NButton size="small" type="primary" @click="handleApply">
          {{ t('components.proAdvancedSearch.apply') }}
        </NButton>
      </div>
    </template>
    <!-- 编辑快捷区模式 -->
    <template v-else>
      <div class="pro-advanced-search__footer-left">
        <span class="pro-advanced-search__pin-count">
          {{
            t('components.proAdvancedSearch.pinCount', {
              count: ctx.userPinnedPaths.value.length,
              max: ctx.maxPinCount.value,
            })
          }}
        </span>
      </div>
      <div class="pro-advanced-search__footer-right">
        <NButton size="small" @click="handleCancelPin">
          {{ t('common.cancel') }}
        </NButton>
        <NButton
          size="small"
          :disabled="ctx.userPinnedPaths.value.length === 0"
          @click="handleClearAllPins"
        >
          {{ t('components.proAdvancedSearch.clearAll') }}
        </NButton>
        <NButton size="small" @click="handleResetPin">
          {{ t('common.reset') }}
        </NButton>
      </div>
    </template>
  </div>
</template>

<style lang="less">
/* 面板内容样式（容器样式由 ProAdvancedSearchTrigger 管理） */
.pro-advanced-search__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 20px 0;
  flex-shrink: 0;
}

.pro-advanced-search__header-main {
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: 8px;
}

.pro-advanced-search__title {
  flex-shrink: 0;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  color: #1f2329;
}

.pro-advanced-search__pin-hint {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  color: #999;
  line-height: 18px;
}

.pro-advanced-search__body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px 8px;

  .n-form-item-label.n-form-item-label--right-mark {
    padding: 0 6px 0 0;
  }
}

.pro-advanced-search__section + .pro-advanced-search__section {
  margin-top: 12px;
  padding-top: 6px;
  border-top: 1px dashed #efeff5;
}

.pro-advanced-search__section-title {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 10px;
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.pro-advanced-search__item {
  min-width: 0;
}

.pro-advanced-search__pin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 180px), 220px));
  gap: 8px 12px;
  align-content: start;
  justify-content: flex-start;

  @media (max-width: 1535px) {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 168px), 1fr));
  }

  @media (max-width: 639px) {
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 144px), 1fr));
  }
}

.pro-advanced-search__pin-item {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  min-height: 36px;
  padding: 6px 10px;
  border: 1px solid #efeff5;
  border-radius: 6px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    border-color: #2080f0;
  }
  &.is-checked {
    border-color: #2080f0;
    background: rgba(32, 128, 240, 0.06);
    color: #2080f0;
  }
  &.is-disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}

.pro-advanced-search__footer {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-top: 1px solid #efeff5;
}

.pro-advanced-search__footer-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  max-height: 52px;
}

.pro-advanced-search__footer-right {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pro-advanced-search__pin-count {
  font-size: 12px;
  color: #999;
}
</style>
