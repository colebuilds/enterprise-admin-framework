<!-- oxlint-disable -->
<script lang="ts" setup>
import type { ButtonProps } from 'naive-ui';

import type { PropType } from 'vue';

import type {
  CreateProSearchFormReturn,
  ProSearchFormColumn,
  Recordable,
} from '../../types';

import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { ReloadOutlined, SearchOutlined } from '@vicons/antd';
import { ChevronDown } from '@vicons/ionicons5';
import { NButton, NFormItem, NIcon, NSpace } from 'naive-ui';

import { useProCrudTableContextSafe } from '../../context/crudTableContext';
import ProField from '../../ProField/ProField.vue';
import ProForm from '../../ProForm/ProForm.vue';
import { useResponsiveGrid } from '../composables/useResponsiveGrid';
import ProAdvancedSearchPanel from './ProAdvancedSearchPanel.vue';
import ProAdvancedSearchTrigger from './ProAdvancedSearchTrigger.vue';

defineOptions({ name: 'ProSearchBar' });

const props = defineProps({
  form: {
    type: Object as PropType<CreateProSearchFormReturn<any>>,
    required: true,
  },
  columns: {
    type: Array as PropType<ProSearchFormColumn[]>,
    default: () => [],
  },
  searchButtonProps: {
    type: [Object, Boolean] as PropType<false | Partial<ButtonProps>>,
    default: () => ({}),
  },
  resetButtonProps: {
    type: [Object, Boolean] as PropType<false | Partial<ButtonProps>>,
    default: () => ({}),
  },
  collapseButtonProps: {
    type: [Object, Boolean] as PropType<false | Partial<ButtonProps>>,
    default: () => ({}),
  },
  showSuffixGridItem: { type: Boolean, default: true },
  showLabel: { type: Boolean, default: true },
  labelWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 'auto',
  },
  labelPlacement: { type: String as PropType<'left' | 'top'>, default: 'left' },
  size: {
    type: String as PropType<'large' | 'medium' | 'small'>,
    default: 'small',
  },
  layout: { type: String as PropType<'flex' | 'grid'>, default: 'grid' },
  componentWidth: {
    type: [Number, String] as PropType<number | string>,
    default: 200,
  },
  xGap: { type: [Number, String] as PropType<number | string>, default: 12 },
  yGap: { type: [Number, String] as PropType<number | string>, default: 8 },
  cols: { type: [Number, String] as PropType<number | string>, default: 4 },
  collapsedRows: { type: Number, default: 1 },
  autoSpan: { type: Boolean, default: false },
  /** 外部加载态（通常由表格请求 loading 注入），用于搜索/重置按钮的联动防连击 */
  loading: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (e: 'search', values: Recordable): void;
  (e: 'reset'): void;
  (e: 'collapse', collapsed: boolean): void;
}>();

/** 与 `ProCrudTable` 中间折叠条箭头同尺寸，保证两处旋转动画观感一致 */
const COLLAPSE_CHEVRON_ICON_SIZE = 14;

const { t } = useI18n();
const ctx = useProCrudTableContextSafe();
const hasAdvancedColumns = computed(
  () => (ctx?.advancedColumns.value.length ?? 0) > 0,
);
const actualLabelWidth = computed(() =>
  props.layout === 'flex' ? 'auto' : props.labelWidth,
);
const showActions = computed(
  () => props.showSuffixGridItem || hasAdvancedColumns.value,
);

const contentRef = ref<HTMLElement | null>(null);
const actionsInnerRef = ref<HTMLElement | null>(null);
const containerEl = computed<HTMLElement | null>(() => contentRef.value);

// composables — 响应式网格 + 折叠/展开统一处理
const {
  containerStyle,
  getItemStyle,
  visibleColumns,
  isColumnVisible,
  isOverflow,
  showCollapseButton,
  actionsStyle,
} = useResponsiveGrid({
  cols: computed(() => props.cols),
  layout: computed(() => props.layout),
  xGap: computed(() => props.xGap),
  yGap: computed(() => props.yGap),
  componentWidth: computed(() => props.componentWidth),
  labelWidth: computed(() => props.labelWidth),
  labelPlacement: computed(() => props.labelPlacement),
  autoSpan: computed(() => props.autoSpan),
  containerRef: containerEl,
  actionsRef: actionsInnerRef,
  form: props.form,
  columns: computed(() => props.columns),
  collapsedRows: computed(() => props.collapsedRows),
  showActions,
});

// 防连击：本地搜索锁 + 外部 loading 共同决定按钮与 enter 键是否可触发，
// 覆盖校验耗时（isSearching）+ 表格请求耗时（props.loading）全程。
const isSearching = ref(false);
const isBusy = computed(() => isSearching.value || props.loading);

// 按钮属性
const mergedSearchButtonProps = computed(() => {
  const base =
    props.searchButtonProps === false ? {} : { ...props.searchButtonProps };
  return {
    ...base,
    loading: isBusy.value || Boolean(base.loading),
    disabled: isBusy.value || Boolean(base.disabled),
  };
});
const mergedResetButtonProps = computed(() => {
  const base =
    props.resetButtonProps === false ? {} : { ...props.resetButtonProps };
  return {
    ...base,
    disabled: isBusy.value || Boolean(base.disabled),
  };
});
const mergedCollapseButtonProps = computed(() =>
  props.collapseButtonProps === false ? {} : { ...props.collapseButtonProps },
);

// 事件处理
async function handleSearch() {
  if (isBusy.value) return;
  isSearching.value = true;
  try {
    const result = await props.form.search();
    emit('search', result);
  } catch {
    // 验证失败
  } finally {
    isSearching.value = false;
  }
}

function handleReset() {
  if (isBusy.value) return;
  props.form.reset();
  emit('reset');
}

function handleToggleCollapse() {
  props.form.toggleCollapsed();
  emit('collapse', props.form.collapsed.value);
}

function renderColumn(column: ProSearchFormColumn) {
  if (!column.render) return null;
  return column.render({
    formModel: props.form.values.value,
    field: column.path,
    setValue: (value: any) => props.form.setFieldValue(column.path, value),
  });
}

defineExpose({
  getSearchParams: () => props.form.getSearchParams(),
  search: handleSearch,
  reset: handleReset,
});
</script>

<template>
  <ProForm
    :form="form"
    :label-width="actualLabelWidth"
    :label-placement="labelPlacement"
    :size="size"
    class="pro-search-form"
    @keydown.enter.prevent="handleSearch"
  >
    <div
      ref="contentRef"
      class="pro-search-form-content"
      :class="{ 'is-flex-layout': layout === 'flex' }"
      :style="containerStyle"
    >
      <template v-for="column in visibleColumns" :key="column.path">
        <div
          v-if="isColumnVisible(column)"
          class="pro-search-form-item"
          :style="getItemStyle(column)"
        >
          <NFormItem
            v-if="column.render"
            :path="column.path"
            :label="column.label"
            :label-width="column.labelWidth || 'auto'"
            :show-label="showLabel"
            :rule="column.rules"
            v-bind="column.formItemProps"
          >
            <component :is="renderColumn(column)" />
          </NFormItem>
          <ProField
            v-else
            :path="column.path"
            :label="column.label"
            :label-message="column.labelMessage"
            :label-width="column.labelWidth || 'auto'"
            :value-type="column.valueType || 'text'"
            :component="column.component"
            :component-props="column.componentProps"
            :default-value="column.defaultValue"
            :rules="column.rules"
            :required="column.required"
            :required-message="column.requiredMessage"
            :placeholder="column.placeholder"
            :options="column.options"
            :field-mapping="column.fieldMapping"
            :show="column.show"
            :disabled="column.disabled"
            :readonly="column.readonly"
            :dependencies="column.dependencies"
            :transform-in="column.transformIn"
            :transform-out="column.transformOut"
            :form-item-props="{ showLabel, ...column.formItemProps }"
            :span="column.span"
          />
        </div>
      </template>

      <div
        v-if="showActions"
        class="pro-search-form-actions"
        :style="actionsStyle"
      >
        <div ref="actionsInnerRef" class="pro-search-form-actions-inner">
          <slot name="suffix" :overflow="isOverflow">
            <NSpace :wrap="false" :justify="isOverflow ? 'end' : 'start'">
              <NButton
                v-if="searchButtonProps !== false"
                type="primary"
                size="small"
                v-bind="mergedSearchButtonProps"
                @click="handleSearch"
              >
                <template #icon>
                  <NIcon><SearchOutlined /></NIcon>
                </template>
                <slot name="search-text">
                  {{ t('components.proSearchForm.search') }}
                </slot>
              </NButton>

              <NButton
                v-if="resetButtonProps !== false"
                size="small"
                v-bind="mergedResetButtonProps"
                @click="handleReset"
              >
                <template #icon>
                  <NIcon><ReloadOutlined /></NIcon>
                </template>
                <slot name="reset-text">{{ t('common.reset') }}</slot>
              </NButton>
              <ProAdvancedSearchTrigger v-if="hasAdvancedColumns">
                <ProAdvancedSearchPanel />
              </ProAdvancedSearchTrigger>
              <NButton
                v-if="showCollapseButton && collapseButtonProps !== false"
                text
                type="primary"
                size="small"
                v-bind="mergedCollapseButtonProps"
                @click="handleToggleCollapse"
              >
                <slot name="collapse-text">
                  {{
                    t(
                      form.collapsed.value
                        ? 'components.proSearchForm.expand'
                        : 'components.proSearchForm.collapse',
                    )
                  }}
                </slot>
                <template #icon>
                  <NIcon
                    :size="COLLAPSE_CHEVRON_ICON_SIZE"
                    class="pro-search-form-collapse-icon"
                    :class="{
                      'pro-search-form-collapse-icon--expanded':
                        !form.collapsed.value,
                    }"
                  >
                    <ChevronDown />
                  </NIcon>
                </template>
              </NButton>
            </NSpace>
          </slot>
        </div>
      </div>
    </div>
  </ProForm>
</template>

<style lang="less" scoped>
.pro-search-form-content {
  width: 100%;
}

.pro-search-form {
  ::v-deep(.n-form-item) {
    margin-bottom: 8px;

    /**
       * ⚠️ 搜索表单验证提示样式 —— 请勿修改！
       * 将 NFormItem 的 feedback 区域折叠为零高度，
       * 验证提示浮动显示在输入框下方（translateY(2px)）。
       * 如果改回负值偏移会导致提示跑到输入框上方，与产品要求不符。
       */
    .n-form-item-feedback-wrapper {
      min-height: 0 !important;
      height: 0 !important;
      overflow: visible !important;
      padding: 0 !important;
      margin: 0 !important;
      transition: none !important;
      pointer-events: none;

      .n-form-item-feedback {
        position: relative;
        z-index: 10;
        font-size: 11px;
        line-height: 1;
        padding: 2px 8px;
        border-radius: 4px;
        white-space: nowrap;
        width: fit-content;
        /* 验证提示显示在输入框下方，禁止改为负值偏移 */
        transform: translateY(2px);
      }
    }
  }

  .pro-search-form-collapse-icon {
    transform-origin: center;
    transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .pro-search-form-collapse-icon--expanded {
    transform: rotate(180deg);
  }
}

.pro-search-form-content.is-flex-layout {
  .pro-search-form-item {
    flex: 0 0 auto;

    ::v-deep(.n-form-item) {
      grid-template-columns: auto var(--pro-search-component-width, 200px);
    }
  }
}

.pro-search-form-actions {
  justify-self: end;
  padding-right: 6px;
}

.pro-search-form-actions-inner {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  flex-wrap: wrap;
}

.pro-search-form-actions-trigger {
  display: flex;
  align-items: center;
}
</style>
