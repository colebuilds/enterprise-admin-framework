<!-- oxlint-disable -->
<script setup lang="ts">
import type { PropType } from 'vue';

import { ref } from 'vue';

import { callInterceptor } from '#/utils/interceptor';

defineOptions({
  inheritAttrs: false,
});
/**
 * 表格内删除确认气泡；与 {@link TableAction} 搭配使用。
 * 当 {@link disabled} 为 true 时仅展示不可点击的删除按钮，不弹出确认框。
 */
const props = defineProps({
  onConfirm: {
    type: Function as PropType<
      (e: MouseEvent) => any | boolean | Promise<boolean>
    >,
  },
  onCancel: {
    type: Function as PropType<
      (e: MouseEvent) => any | boolean | Promise<boolean>
    >,
  },
  /** 为 true 时删除按钮禁用且不弹出确认 */
  disabled: {
    type: Boolean,
    default: false,
  },
});
const confirm = ref();
const loading = ref(false);
const done = () => {
  confirm.value?.setShow(false);
  loading.value = false;
};
const onBaseConfirm = () => {
  loading.value = true;
  callInterceptor(props.onConfirm, {
    args: [],
    done,
    canceled: done,
    error: done,
  });
};
const onBaseCancel = () => {
  callInterceptor(props.onCancel, {
    args: [],
    done,
    canceled: done,
    error: done,
  });
};
</script>

<template>
  <n-button v-if="props.disabled" type="error" text size="small" disabled>
    {{ $t('common.delete') }}
  </n-button>
  <n-popconfirm v-else ref="confirm">
    <template #trigger>
      <n-button type="error" text size="small">
        {{ $t('common.delete') }}
      </n-button>
    </template>
    <template #action>
      <n-button size="small" @click="onBaseCancel">
        {{ $t('common.cancel') }}
      </n-button>
      <n-button
        size="small"
        type="success"
        :loading="loading"
        @click="onBaseConfirm"
      >
        {{ $t('common.confirm') }}
      </n-button>
    </template>
    {{ $t('common.delete_confirm') }}
  </n-popconfirm>
</template>

<style scoped lang="less"></style>
