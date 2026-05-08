<template>
  <div v-if="value">
    <template v-if="inline">{{ formattedText }}</template>
    <template v-else>
      <div>{{ datePart }}</div>
      <div>{{ timePart }}</div>
    </template>
  </div>
  <span v-else>--</span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { formatToCurrentZone } from '#/utils/dateUtil';

const props = withDefaults(
  defineProps<{
    value: any;
    /** 自定义格式化模板，如 'yyyy-MM-dd'、'HH:mm:ss'，默认 'yyyy-MM-dd HH:mm:ss' */
    format?: string;
    /** 单行显示，默认 false（两行：日期 + 时间） */
    inline?: boolean;
  }>(),
  {
    format: undefined,
    inline: false,
  },
);

const formatted = computed(() => {
  if (!props.value) return ['', ''];
  try {
    const result = formatToCurrentZone(props.value, false, props.format);
    return result?.split(' ') || ['', ''];
  } catch {
    return ['', ''];
  }
});

const formattedText = computed(() => formatted.value.join(' '));
const datePart = computed(() => formatted.value[0]);
const timePart = computed(() => formatted.value[1]);
</script>
