<!-- oxlint-disable -->
<script lang="ts" setup>
import { HolderOutlined } from '@vicons/antd';
import { NIcon } from 'naive-ui';

defineOptions({
  name: 'ProDragHandle',
});

defineProps({
  /** 禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
});
</script>

<template>
  <div
    class="pro-drag-handle"
    :class="{ 'is-disabled': disabled }"
    :style="{ cursor: disabled ? 'not-allowed' : 'grab' }"
  >
    <NIcon :size="16">
      <HolderOutlined />
    </NIcon>
  </div>
</template>

<style lang="less" scoped>
.pro-drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: color 0.2s;

  &:hover:not(.is-disabled) {
    color: var(--n-primary-color);
  }

  &.is-disabled {
    opacity: 0.5;
  }
}
</style>
