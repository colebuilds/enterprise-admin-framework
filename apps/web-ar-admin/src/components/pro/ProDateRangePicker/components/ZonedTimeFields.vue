<!-- oxlint-disable -->
<script setup lang="ts">
import type { ZonedDateTimeParts } from '../utils/zonedDateMath';

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { NTimePicker } from 'naive-ui';

import { nowInZone } from '../utils/zonedDateMath';

defineOptions({ name: 'ZonedTimeFields' });

const props = defineProps<{
  label?: string;
  timezoneId: string;
  value: null | ZonedDateTimeParts;
}>();

const emit = defineEmits<{
  'update:value': [value: ZonedDateTimeParts];
}>();

const { t } = useI18n();
const timePickerActions: Array<'confirm' | 'now'> = ['now', 'confirm'];

const timeValue = computed(() => {
  if (!props.value) return null;
  return new Date(
    1970,
    0,
    1,
    props.value.hour,
    props.value.minute,
    props.value.second,
    props.value.millisecond,
  ).getTime();
});

function handleTimeUpdate(value: null | number) {
  if (!props.value || value == null) return;
  const date = new Date(value);
  emit('update:value', {
    ...props.value,
    hour: date.getHours(),
    minute: date.getMinutes(),
    second: date.getSeconds(),
    millisecond: 0,
  });
}

function handleNowClick() {
  if (!props.value) return;
  const now = nowInZone(props.timezoneId);
  emit('update:value', {
    ...props.value,
    hour: now.hour,
    minute: now.minute,
    second: now.second,
    millisecond: 0,
  });
}

function handleTimePickerClickCapture(event: MouseEvent) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const button = target.closest('button');
  if (!button?.closest('.n-time-picker-actions')) return;
  if (button.textContent?.trim() !== t('common.dateRange.now')) return;

  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
  handleNowClick();
}
</script>

<template>
  <div
    class="zoned-time-fields flex items-center gap-1"
    :class="{ 'is-disabled': !value }"
    @click.capture="handleTimePickerClickCapture"
  >
    <span v-if="label" class="text-xs text-[var(--text-color-2)]">{{
      label
    }}</span>
    <NTimePicker
      :value="timeValue"
      format="HH:mm:ss"
      size="small"
      :actions="timePickerActions"
      :to="false"
      :show-icon="false"
      :clearable="false"
      :disabled="!value"
      class="w-[112px]"
      @update:value="handleTimeUpdate"
    />
  </div>
</template>

<style lang="less" scoped>
.zoned-time-fields {
  &.is-disabled {
    opacity: 0.6;
  }
}

.zoned-time-fields ::v-deep(.n-time-picker-panel) {
  min-width: 168px;
}

.zoned-time-fields ::v-deep(.n-time-picker-actions) {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  white-space: nowrap;
}

.zoned-time-fields ::v-deep(.n-time-picker-actions .n-button) {
  padding-inline: 8px;
}
</style>
