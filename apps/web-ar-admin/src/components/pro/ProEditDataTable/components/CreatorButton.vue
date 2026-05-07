<!-- oxlint-disable -->
<script lang="ts" setup>
import type { ButtonProps } from 'naive-ui';

import type { PropType } from 'vue';

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { PlusOutlined } from '@vicons/antd';
import { NButton, NIcon } from 'naive-ui';

defineOptions({
  name: 'ProCreatorButton',
});

const props = defineProps({
  /** 按钮位置 */
  position: {
    type: String as PropType<'bottom' | 'top'>,
    default: 'bottom',
  },
  /** 按钮文本 */
  text: {
    type: String,
    default: undefined,
  },
  /** 按钮属性 */
  buttonProps: {
    type: Object as PropType<Partial<ButtonProps>>,
    default: () => ({}),
  },
  /** 禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();
const { t } = useI18n();
const buttonText = computed(
  () => props.text ?? t('components.proEditDataTable.addRow'),
);

function handleClick() {
  emit('click');
}
</script>

<template>
  <div class="pro-creator-button" :class="`position-${position}`">
    <NButton
      type="primary"
      dashed
      block
      :disabled="disabled"
      v-bind="buttonProps"
      @click="handleClick"
    >
      <template #icon>
        <NIcon>
          <PlusOutlined />
        </NIcon>
      </template>
      {{ buttonText }}
    </NButton>
  </div>
</template>

<style lang="less" scoped>
.pro-creator-button {
  padding: 8px 0;

  &.position-top {
    padding-top: 0;
    padding-bottom: 16px;
  }

  &.position-bottom {
    padding-top: 16px;
    padding-bottom: 0;
  }
}
</style>
