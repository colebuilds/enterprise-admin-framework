<!-- oxlint-disable -->
<script lang="ts" setup>
import type { PropType } from 'vue';

import type { ProColumn, ProSize } from '../types';

import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  ColumnHeightOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  QuestionCircleOutlined,
  ReloadOutlined,
  SettingOutlined,
} from '@vicons/antd';
import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NIcon,
  NPopover,
  NPopselect,
  NSpace,
  NTooltip,
} from 'naive-ui';

const props = defineProps({
  /** 标题 */
  title: {
    type: String,
    default: '',
  },
  /** 标题提示 */
  titleTooltip: {
    type: String,
    default: '',
  },
  /** 列配置 */
  columns: {
    type: Array as PropType<ProColumn[]>,
    default: () => [],
  },
  /** 当前尺寸 */
  size: {
    type: String as PropType<ProSize>,
    default: 'medium',
  },
  /** 加载中 */
  loading: {
    type: Boolean,
    default: false,
  },
  /** 显示右侧工具栏 */
  showToolbarRight: {
    type: Boolean,
    default: true,
  },
  /** 显示列设置 */
  showColumnSetting: {
    type: Boolean,
    default: true,
  },
  /** 显示全屏 */
  showFullscreen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'reload'): void;
  (e: 'update:size', size: ProSize): void;
  (e: 'update:columns', columns: ProColumn[]): void;
  (e: 'fullscreen', isFullscreen: boolean): void;
}>();

const { t } = useI18n();

// 尺寸选项
const sizeOptions = computed(() => [
  { label: t('components.proDataTable.densityDefault'), value: 'medium' },
  { label: t('components.proDataTable.densityMiddle'), value: 'small' },
  { label: t('components.proDataTable.densityCompact'), value: 'small' },
]);

// 当前尺寸
const sizeValue = ref(props.size);

// 全屏状态
const isFullscreen = ref(false);

// 可设置列 (排除特殊列)
const settableColumns = computed(() => {
  return props.columns.filter((col) => {
    const key = String(col.key);
    return !['action', 'expand', 'selection'].includes(key) && col.title;
  });
});

// 初始列配置
const initialColumnKeys = ref<string[]>([]);

// 已选中列
const checkedColumns = computed(() => {
  return settableColumns.value
    .filter((col) => col.hideInTable !== true)
    .map((col) => String(col.key));
});

// 是否全选
const isAllChecked = computed(() => {
  return checkedColumns.value.length === settableColumns.value.length;
});

// 是否半选
const isIndeterminate = computed(() => {
  const len = checkedColumns.value.length;
  return len > 0 && len < settableColumns.value.length;
});

// 初始化
if (initialColumnKeys.value.length === 0) {
  initialColumnKeys.value = settableColumns.value.map((col) => String(col.key));
}

// 刷新
function handleReload() {
  emit('reload');
}

// 尺寸变化
function handleSizeChange(value: ProSize) {
  sizeValue.value = value;
  emit('update:size', value);
}

// 全选/取消全选
function handleCheckAll(checked: boolean) {
  const newColumns = props.columns.map((col) => {
    if (settableColumns.value.find((sc) => sc.key === col.key)) {
      return { ...col, hideInTable: !checked };
    }
    return col;
  });
  emit('update:columns', newColumns);
}

// 列变化
function handleColumnChange(values: string[]) {
  const newColumns = props.columns.map((col) => {
    const key = String(col.key);
    if (settableColumns.value.find((sc) => String(sc.key) === key)) {
      return { ...col, hideInTable: !values.includes(key) };
    }
    return col;
  });
  emit('update:columns', newColumns);
}

// 重置列
function handleResetColumns() {
  const newColumns = props.columns.map((col) => {
    const key = String(col.key);
    if (settableColumns.value.find((sc) => String(sc.key) === key)) {
      return { ...col, hideInTable: !initialColumnKeys.value.includes(key) };
    }
    return col;
  });
  emit('update:columns', newColumns);
}

// 全屏
function handleFullscreen() {
  isFullscreen.value = !isFullscreen.value;
  emit('fullscreen', isFullscreen.value);
}
</script>

<template>
  <div class="pro-table-toolbar">
    <div class="pro-table-toolbar-left">
      <!-- 标题 -->
      <div v-if="title" class="pro-table-toolbar-title">
        <span>{{ title }}</span>
        <NTooltip v-if="titleTooltip" trigger="hover">
          <template #trigger>
            <NIcon class="pro-table-toolbar-title-tooltip" :size="14">
              <QuestionCircleOutlined />
            </NIcon>
          </template>
          {{ titleTooltip }}
        </NTooltip>
      </div>

      <!-- 左侧插槽 -->
      <slot name="left"></slot>
    </div>

    <div class="pro-table-toolbar-right">
      <!-- 右侧插槽 -->
      <slot name="right"></slot>

      <!-- 工具按钮 -->
      <NSpace v-if="showToolbarRight" :size="12">
        <!-- 刷新 -->
        <NTooltip trigger="hover">
          <template #trigger>
            <NButton text :loading="loading" @click="handleReload">
              <template #icon>
                <NIcon :size="18">
                  <ReloadOutlined />
                </NIcon>
              </template>
            </NButton>
          </template>
          {{ t('common.refresh') }}
        </NTooltip>

        <!-- 密度 -->
        <NPopselect
          v-model:value="sizeValue"
          :options="sizeOptions"
          trigger="click"
          @update:value="handleSizeChange"
        >
          <NTooltip trigger="hover">
            <template #trigger>
              <NButton text>
                <template #icon>
                  <NIcon :size="18">
                    <ColumnHeightOutlined />
                  </NIcon>
                </template>
              </NButton>
            </template>
            {{ t('common.density') }}
          </NTooltip>
        </NPopselect>

        <!-- 列设置 -->
        <NPopover
          v-if="showColumnSetting"
          trigger="click"
          placement="bottom-end"
          :width="200"
        >
          <template #trigger>
            <NTooltip trigger="hover">
              <template #trigger>
                <NButton text>
                  <template #icon>
                    <NIcon :size="18">
                      <SettingOutlined />
                    </NIcon>
                  </template>
                </NButton>
              </template>
              {{ t('components.proColumnSetting.customColumns') }}
            </NTooltip>
          </template>

          <div class="column-setting-content">
            <div class="column-setting-header">
              <NCheckbox
                :checked="isAllChecked"
                :indeterminate="isIndeterminate"
                @update:checked="handleCheckAll"
              >
                {{ t('components.proColumnSetting.columnDisplay') }}
              </NCheckbox>
              <NButton text size="small" @click="handleResetColumns">
                {{ t('components.proColumnSetting.reset') }}
              </NButton>
            </div>

            <NCheckboxGroup
              :value="checkedColumns"
              @update:value="handleColumnChange"
            >
              <div class="column-setting-list">
                <div
                  v-for="col in settableColumns"
                  :key="String(col.key)"
                  class="column-setting-item"
                >
                  <NCheckbox
                    :value="String(col.key)"
                    :label="String(col.title || col.key)"
                  />
                </div>
              </div>
            </NCheckboxGroup>
          </div>
        </NPopover>

        <!-- 全屏 -->
        <NTooltip v-if="showFullscreen" trigger="hover">
          <template #trigger>
            <NButton text @click="handleFullscreen">
              <template #icon>
                <NIcon :size="18">
                  <component
                    :is="
                      isFullscreen ? FullscreenExitOutlined : FullscreenOutlined
                    "
                  />
                </NIcon>
              </template>
            </NButton>
          </template>
          {{
            isFullscreen
              ? t('components.aiAssistant.panel.exitFullscreen')
              : t('components.aiAssistant.panel.fullscreen')
          }}
        </NTooltip>
      </NSpace>
    </div>
  </div>
</template>

<style lang="less" scoped>
.pro-table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  gap: 16px;

  &-left {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  &-title {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 16px;
    font-weight: 500;

    &-tooltip {
      color: var(--n-text-color-3);
      cursor: help;
    }
  }
}

.column-setting-content {
  .column-setting-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--n-divider-color);
    margin-bottom: 8px;
  }

  .column-setting-list {
    max-height: 300px;
    overflow-y: auto;
  }

  .column-setting-item {
    padding: 4px 0;
  }
}
</style>
