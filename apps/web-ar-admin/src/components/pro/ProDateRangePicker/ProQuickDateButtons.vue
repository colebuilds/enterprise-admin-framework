<!-- oxlint-disable -->
<script setup lang="ts">
import type {
  DateRangeShortcuts,
  DateRangeTimezone,
  QuickDateItem,
} from '../types';

import { computed, ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  matchShortcutIndexByRange,
  useZonedShortcuts,
} from './composables/useZonedShortcuts';

defineOptions({ name: 'ProQuickDateButtons' });

const props = withDefaults(
  defineProps<{
    /** 当前选中索引（v-model） */
    modelValue?: number;
    /** 内置预设：'default'(10 项) / 'simple'(4 项) / 'report'(11 项) */
    preset?: 'default' | 'report' | 'simple';
    /** 是否使用次要样式（ProDateRangePicker 面板内用） */
    secondary?: boolean;
    /** 快捷项：false 隐藏，true/不传使用内置 default 预设，数组使用外部自定义 */
    shortcuts?: DateRangeShortcuts;
    /** 按钮尺寸 */
    size?: 'medium' | 'small' | 'tiny';
    /**
     * 当前时间范围值，传入后自动反向匹配高亮。
     * 用于搜索/重置后同步高亮状态。
     */
    timeRange?: [number, number] | null | number[];
    /** 时区 IANA 名；false 强制 UTC；不传时走 CrudTable 上下文或默认商户时区 */
    timezone?: DateRangeTimezone;
  }>(),
  {
    shortcuts: undefined,
    modelValue: undefined,
    size: 'tiny',
    secondary: false,
    timeRange: undefined,
    timezone: null,
    preset: 'default',
  },
);

const emit = defineEmits<{
  select: [idx: number, item: QuickDateItem];
  'update:modelValue': [idx: number | undefined];
}>();
const { t } = useI18n();
// 内置快捷项：通过 useZonedShortcuts 计算，按 timezone 锚点；自定义 shortcuts 透传短路
const resolvedShortcuts = useZonedShortcuts({
  timezone: toRef(props, 'timezone'),
  preset: toRef(props, 'preset'),
  customShortcuts: toRef(props, 'shortcuts'),
  t,
});

// 内部状态 + v-model 双向绑定
const internalIndex = ref<number | undefined>(props.modelValue);

const activeIndex = computed({
  get: () => props.modelValue ?? internalIndex.value,
  set: (val) => {
    internalIndex.value = val;
    emit('update:modelValue', val);
  },
});

// 外部 modelValue 变化时同步内部状态（重置场景）
watch(
  () => props.modelValue,
  (val) => {
    internalIndex.value = val;
  },
);

// 监听 timeRange 自动匹配高亮（按 UTC 日级反向匹配）
watch([() => props.timeRange, resolvedShortcuts], ([range, items]) => {
  if (range === undefined) return;
  activeIndex.value = matchShortcutIndexByRange(range, items);
});

function handleClick(idx: number, item: QuickDateItem) {
  activeIndex.value = idx;
  emit('select', idx, item);
}

defineExpose({
  matchIndex: (range: [number, number] | null | number[] | undefined) =>
    matchShortcutIndexByRange(range, resolvedShortcuts.value),
});
</script>

<template>
  <div v-if="resolvedShortcuts.length > 0" class="pro-quick-date-buttons">
    <n-button
      v-for="(d, i) in resolvedShortcuts"
      :key="d.key"
      :size="size"
      :type="activeIndex === i ? 'primary' : 'default'"
      :secondary="secondary"
      @click="handleClick(i, d)"
    >
      {{ d.label }}
    </n-button>
  </div>
</template>

<style scoped>
.pro-quick-date-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}
</style>
