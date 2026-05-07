<!-- oxlint-disable -->
<script lang="ts" setup>
import type { CSSProperties } from 'vue';

import type { Recordable } from '../../types';

import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { ChevronDownOutline, FunnelOutline } from '@vicons/ionicons5';
import { NBadge, NIcon } from 'naive-ui';

import { useProCrudTableContext } from '../../context/crudTableContext';

defineOptions({ name: 'ProAdvancedSearchTrigger' });

const ctx = useProCrudTableContext();
const { t } = useI18n();

// ============ 锚点 & 面板定位 ============
const triggerRef = ref<HTMLElement | null>(null);
const panelStyle = ref<CSSProperties>({});

function updatePanelPosition() {
  const trigger = triggerRef.value;
  if (!trigger) return;
  const header =
    trigger.closest('.pro-crud-table__header') || trigger.parentElement;
  const triggerRect = trigger.getBoundingClientRect();
  const headerRect = header?.getBoundingClientRect();
  panelStyle.value = {
    position: 'fixed',
    top: `${triggerRect.bottom + 4}px`,
    left: `${headerRect?.left ?? triggerRect.left}px`,
    width: `${headerRect?.width ?? 760}px`,
    zIndex: 2000,
  };
}

function startPositionListeners() {
  window.addEventListener('resize', updatePanelPosition);
  window.addEventListener('scroll', updatePanelPosition, true);
}

function stopPositionListeners() {
  window.removeEventListener('resize', updatePanelPosition);
  window.removeEventListener('scroll', updatePanelPosition, true);
}

watch(
  () => ctx.advancedSearchOpen.value,
  (val) => {
    if (val) {
      nextTick(updatePanelPosition);
      startPositionListeners();
    } else {
      stopPositionListeners();
    }
  },
);

onBeforeUnmount(stopPositionListeners);

// ============ 激活计数 ============
const activeCount = computed(() => {
  const values = ctx.advancedSearchForm.values.value as Recordable;
  return ctx.advancedColumns.value.filter((col) => {
    const val = values[col.path];
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val)) return val.length > 0;
    return true;
  }).length;
});

function toggle() {
  ctx.advancedSearchOpen.value = !ctx.advancedSearchOpen.value;
}

function close() {
  ctx.advancedSearchOpen.value = false;
}
</script>

<template>
  <div
    ref="triggerRef"
    class="pro-advanced-trigger"
    :class="{ 'is-active': ctx.advancedSearchOpen.value }"
    @click="toggle"
  >
    <NIcon :size="14" class="pro-advanced-trigger__funnel">
      <FunnelOutline />
    </NIcon>
    <span>{{ t('components.proAdvancedSearch.title') }}</span>
    <NBadge v-if="activeCount > 0" :value="activeCount" :max="99" />
    <NIcon
      :size="12"
      class="pro-advanced-trigger__arrow"
      :class="{ 'is-open': ctx.advancedSearchOpen.value }"
    >
      <ChevronDownOutline />
    </NIcon>
  </div>
  <!-- 浮动面板（Teleport 到 body） -->
  <Teleport to="body">
    <Transition name="pro-advanced-fade">
      <div
        v-if="ctx.advancedSearchOpen.value"
        class="pro-advanced-search__mask"
        @click.self="close"
      >
        <div class="pro-advanced-search__panel" :style="panelStyle">
          <slot></slot>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="less" scoped>
.pro-advanced-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: auto;
  min-width: 120px;
  padding: 0 10px;
  height: 28px;
  border: 1px solid var(--n-border-color, #e0e0e6);
  border-radius: 4px;
  font-size: 13px;
  color: var(--n-text-color-2, #333639);
  cursor: pointer;
  user-select: none;
  white-space: nowrap;
  background: var(--n-card-color, #fff);
  transition: all 0.15s;

  &:hover,
  &.is-active {
    color: var(--n-primary-color, #2080f0);
    border-color: var(--n-primary-color, #2080f0);
  }
}

.pro-advanced-trigger__funnel {
  flex-shrink: 0;
}

.pro-advanced-trigger__arrow {
  flex-shrink: 0;
  transition: transform 0.2s ease;

  &.is-open {
    transform: rotate(180deg);
  }
}
</style>

<!-- Teleport 到 body 的面板容器，不能 scoped -->
<style lang="less">
.pro-advanced-search__mask {
  position: fixed;
  inset: 0;
  z-index: 1999;
}

.pro-advanced-search__panel {
  border: 1px solid #e0e0e6;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  min-height: 200px;
  max-height: 480px;
}

.pro-advanced-fade-enter-active,
.pro-advanced-fade-leave-active {
  transition: opacity 0.2s ease;
}
.pro-advanced-fade-enter-from,
.pro-advanced-fade-leave-to {
  opacity: 0;
}
</style>
