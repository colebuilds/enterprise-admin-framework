<!-- oxlint-disable -->
<script lang="ts" setup>
import type { ProDateRangePickerProps } from '../types';

import ZonedDateRangePanel from './components/ZonedDateRangePanel.vue';

/**
 * 日期范围选择面板 facade。
 * 外部 API 沿用 ProDateRangePickerProps，内部实现切到时区原生的 ZonedDateRangePanel。
 */
defineOptions({ name: 'ProDateRangePicker' });

withDefaults(defineProps<ProDateRangePickerProps>(), {
  value: null,
  valueFormat: 'timestamp',
  valueStringPattern: 'yyyy-MM-dd HH:mm:ss',
  timezone: null,
  maxDays: 31,
  allowFuture: false,
  shortcutPreset: 'default',
  showTime: true,
});

const emit = defineEmits<{
  confirm: [value: [number, number] | [string, string]];
  reset: [];
  'update:value': [value: [number, number] | [string, string] | null];
}>();
</script>

<template>
  <ZonedDateRangePanel
    :value="value"
    :value-format="valueFormat"
    :value-string-pattern="valueStringPattern"
    :timezone="timezone"
    :max-days="maxDays"
    :allow-future="allowFuture"
    :shortcuts="shortcuts"
    :shortcut-preset="shortcutPreset"
    :show-time="showTime"
    @update:value="emit('update:value', $event)"
    @confirm="emit('confirm', $event)"
    @reset="emit('reset')"
  />
</template>
