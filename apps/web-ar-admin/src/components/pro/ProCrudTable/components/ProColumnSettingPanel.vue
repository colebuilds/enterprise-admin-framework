<!-- oxlint-disable -->
<script lang="ts" setup>
import type { VNode } from 'vue';

import type { ProColumn } from '../../types';

import {
  computed,
  defineComponent,
  h,
  nextTick,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  ref,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';

import {
  HolderOutlined,
  PushpinFilled,
  PushpinOutlined,
  SettingOutlined,
} from '@vicons/antd';
import { NButton, NCheckbox, NIcon, NPopover } from 'naive-ui';
import Sortable from 'sortablejs';

import { useProCrudTableContext } from '../../context/crudTableContext';

defineOptions({ name: 'ProColumnSettingPanel' });

const ctx = useProCrudTableContext();
const { t } = useI18n();

const listRef = ref<HTMLElement | null>(null);
let sortableInstance: null | Sortable = null;

const sortedSettings = computed(() =>
  [...ctx.columnSettings.value].toSorted((a, b) => a.order - b.order),
);

const visibleCount = computed(
  () => ctx.columnSettings.value.filter((s) => s.visible).length,
);
const isAllChecked = computed(
  () => visibleCount.value === ctx.columnSettings.value.length,
);
const isIndeterminate = computed(
  () =>
    visibleCount.value > 0 &&
    visibleCount.value < ctx.columnSettings.value.length,
);

type ColumnTitleContent = string | VNode;

function getColumnTitle(key: string): ColumnTitleContent {
  const col = ctx.columns.value.find((c: ProColumn) => String(c.key) === key);
  if (!col) return key;
  if (col.columnSettingTitle) return col.columnSettingTitle;
  if (typeof col.title === 'function') return col.title();
  return col.title ?? key;
}

const ColumnSettingTitle = defineComponent({
  name: 'ColumnSettingTitle',
  props: {
    columnKey: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const title = getColumnTitle(props.columnKey);
      return typeof title === 'string'
        ? title
        : h('span', { class: 'column-setting-panel__title' }, [title]);
    };
  },
});

function handleCheckAll(checked: boolean) {
  ctx.setAllVisible(checked);
}

function handleReset() {
  ctx.resetColumnSetting();
}

function destroySortable() {
  try {
    sortableInstance?.destroy();
  } catch {
    /* ignore */
  }
  sortableInstance = null;
}

function initSortable() {
  if (!listRef.value) return;
  destroySortable();
  sortableInstance = Sortable.create(listRef.value, {
    animation: 200,
    handle: '.column-setting-panel__drag-handle',
    onMove: (evt) => {
      const draggedFixed = evt.dragged.dataset.fixed === '1';
      const relatedFixed = evt.related.dataset.fixed === '1';
      if (draggedFixed !== relatedFixed) return false;
    },
    onEnd: () => {
      if (!listRef.value) return;
      const items = listRef.value.querySelectorAll('[data-key]');
      const keys = [...items].map((el) => (el as HTMLElement).dataset.key!);
      ctx.updateColumnOrder(keys);
    },
  });
}

onMounted(() => nextTick(initSortable));
onActivated(() => nextTick(initSortable));
watch(listRef, (el) => {
  if (el) nextTick(initSortable);
});
onDeactivated(destroySortable);
onBeforeUnmount(destroySortable);
</script>

<template>
  <NPopover trigger="click" placement="bottom-end" :width="220">
    <template #trigger>
      <NButton size="small">
        <template #icon>
          <NIcon :size="14">
            <SettingOutlined />
          </NIcon>
        </template>
        {{ t('components.proColumnSetting.customColumns') }}
      </NButton>
    </template>

    <div class="column-setting-panel">
      <div class="column-setting-panel__header">
        <NCheckbox
          :checked="isAllChecked"
          :indeterminate="isIndeterminate"
          @update:checked="handleCheckAll"
        >
          {{ t('components.proColumnSetting.columnDisplay') }}
        </NCheckbox>
        <NButton text size="small" @click="handleReset">
          {{ t('common.reset') }}
        </NButton>
      </div>

      <div ref="listRef" class="column-setting-panel__list">
        <div
          v-for="(item, index) in sortedSettings"
          :key="item.key"
          :data-key="item.key"
          :data-fixed="item.fixed ? '1' : '0'"
          class="column-setting-panel__item"
        >
          <NIcon class="column-setting-panel__drag-handle" :size="14">
            <HolderOutlined />
          </NIcon>
          <NCheckbox
            :checked="item.visible"
            @update:checked="() => ctx.toggleColumnVisibility(item.key)"
          >
            <ColumnSettingTitle :column-key="item.key" />
          </NCheckbox>
          <NIcon
            class="column-setting-panel__pin-btn"
            :class="{ 'is-pinned': !!item.fixed }"
            :size="14"
            @click="() => ctx.toggleColumnFixed(item.key)"
          >
            <PushpinFilled v-if="item.fixed" />
            <PushpinOutlined v-else />
          </NIcon>
          <div
            v-if="
              item.fixed &&
              !sortedSettings[index + 1]?.fixed &&
              index < sortedSettings.length - 1
            "
            class="column-setting-panel__divider"
          ></div>
        </div>
      </div>
    </div>
  </NPopover>
</template>

<style lang="less" scoped>
.column-setting-panel {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
    border-bottom: 1px solid var(--n-divider-color, #efeff5);
    margin-bottom: 4px;
  }

  &__list {
    max-height: 300px;
    overflow-y: auto;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 5px 0;
    cursor: default;
    position: relative;
  }

  &__drag-handle {
    cursor: grab;
    color: #999;
    flex-shrink: 0;

    &:active {
      cursor: grabbing;
    }

    &:hover {
      color: #666;
    }
  }

  &__pin-btn {
    margin-left: auto;
    cursor: pointer;
    color: #999;
    flex-shrink: 0;
    transition: color 0.2s;

    &:hover {
      color: #666;
    }

    &.is-pinned {
      color: var(--n-text-color-focus, #18a058);
    }
  }

  &__divider {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 1px;
    background: var(--n-divider-color, #efeff5);
  }

  &__title {
    display: inline-flex;
    align-items: center;
    min-width: 0;
  }
}
</style>
