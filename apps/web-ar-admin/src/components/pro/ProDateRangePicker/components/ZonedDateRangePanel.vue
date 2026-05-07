<!-- oxlint-disable -->
<script setup lang="ts">
import type { ProDateRangePickerProps } from '../../types';

import { computed, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { NButton, NEl, NInput } from 'naive-ui';

import { useZonedDateRange } from '../composables/useZonedDateRange';
import ProQuickDateButtons from '../ProQuickDateButtons.vue';
import { formatParts, formatUtcMsInZone } from '../utils/zonedDateMath';
import ZonedCalendarGrid from './ZonedCalendarGrid.vue';
import ZonedTimeFields from './ZonedTimeFields.vue';

defineOptions({ name: 'ZonedDateRangePanel' });

const props = withDefaults(defineProps<ProDateRangePickerProps>(), {
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

const { t } = useI18n();

const {
  draft,
  hoveredDate,
  errorMessage,
  timezoneId,
  leftMonth,
  rightMonth,
  currentShortcuts,
  activeShortcutIndex,
  goPrevYear,
  goPrevMonth,
  goNextMonth,
  goNextYear,
  handleDateSelect,
  handleHoverDate,
  handleStartTimeUpdate,
  handleEndTimeUpdate,
  handleShortcut,
  handleReset,
  handleConfirm,
  isDateDisabled,
} = useZonedDateRange({
  value: toRef(props, 'value'),
  valueFormat: toRef(props, 'valueFormat'),
  valueStringPattern: toRef(props, 'valueStringPattern'),
  timezone: toRef(props, 'timezone'),
  showTime: toRef(props, 'showTime'),
  maxDays: toRef(props, 'maxDays'),
  allowFuture: toRef(props, 'allowFuture'),
  shortcuts: toRef(props, 'shortcuts'),
  shortcutPreset: toRef(props, 'shortcutPreset'),
  onUpdateValue: (value) => emit('update:value', value),
  onConfirm: (value) => emit('confirm', value),
  onReset: () => emit('reset'),
});

const startDateText = computed(() =>
  draft.value.start ? formatParts(draft.value.start, 'yyyy-MM-dd') : '',
);
const endDateText = computed(() =>
  draft.value.end ? formatParts(draft.value.end, 'yyyy-MM-dd') : '',
);
const timezoneOffsetDisplay = computed(() => {
  const offset = formatUtcMsInZone(Date.now(), timezoneId.value, 'XXX');
  return offset === 'Z' ? 'UTC+00:00' : `UTC${offset}`;
});
const timezoneDisplay = computed(
  () => `${timezoneOffsetDisplay.value} ${timezoneId.value}`,
);
</script>

<template>
  <NEl
    tag="div"
    class="zoned-date-range-panel relative my-1 w-fit min-w-[600px] rounded bg-[var(--card-color)] text-[var(--text-color)]"
  >
    <span
      class="pointer-events-none absolute right-3 -top-[8px] z-10 text-sm leading-4 text-[var(--primary-color)]"
      :title="timezoneDisplay"
    >
      {{ timezoneOffsetDisplay }}
    </span>
    <div
      v-if="showTime"
      class="flex w-full items-center justify-between gap-2 border-b border-[var(--border-color)] py-2"
    >
      <NInput
        :value="startDateText"
        readonly
        size="small"
        class="min-w-0 flex-1"
        :placeholder="t('common.dateRange.placeholder')"
      />
      <ZonedTimeFields
        :value="draft.start"
        :timezone-id="timezoneId"
        @update:value="handleStartTimeUpdate"
      />
      <NInput
        :value="endDateText"
        readonly
        size="small"
        class="min-w-0 flex-1"
        :placeholder="t('common.dateRange.placeholder')"
      />
      <ZonedTimeFields
        :value="draft.end"
        :timezone-id="timezoneId"
        @update:value="handleEndTimeUpdate"
      />
    </div>

    <div class="grid justify-center [grid-template-columns:auto_1px_auto]">
      <ZonedCalendarGrid
        :year="leftMonth.year"
        :month="leftMonth.month"
        :timezone-id="timezoneId"
        :selected-start="draft.start"
        :selected-end="draft.end"
        :hovered-date="hoveredDate"
        :disabled-date="isDateDisabled"
        @prev-year="goPrevYear"
        @prev="goPrevMonth"
        @next="goNextMonth"
        @next-year="goNextYear"
        @select="handleDateSelect"
        @hover-date="handleHoverDate"
      />
      <div class="w-px bg-[var(--divider-color)]"></div>
      <ZonedCalendarGrid
        :year="rightMonth.year"
        :month="rightMonth.month"
        :timezone-id="timezoneId"
        :selected-start="draft.start"
        :selected-end="draft.end"
        :hovered-date="hoveredDate"
        :disabled-date="isDateDisabled"
        @prev-year="goPrevYear"
        @prev="goPrevMonth"
        @next="goNextMonth"
        @next-year="goNextYear"
        @select="handleDateSelect"
        @hover-date="handleHoverDate"
      />
    </div>

    <div
      class="flex items-center justify-between gap-3 border-t border-[var(--border-color)] px-4 pt-2"
    >
      <ProQuickDateButtons
        v-if="currentShortcuts.length > 0"
        :shortcuts="currentShortcuts"
        :model-value="activeShortcutIndex"
        size="tiny"
        secondary
        class="min-w-0 flex-1"
        @select="(_, item) => handleShortcut(item)"
      />
      <div class="ml-auto flex flex-none items-center gap-2">
        <span
          v-if="errorMessage"
          class="max-w-[220px] truncate text-xs text-[var(--error-color)]"
          >{{ errorMessage }}</span>
        <NButton size="small" @click="handleReset">
          {{ t('common.dateRange.reset') }}
        </NButton>
        <NButton
          type="primary"
          size="small"
          :disabled="!!errorMessage"
          @click="handleConfirm"
        >
          {{ t('common.dateRange.confirm') }}
        </NButton>
      </div>
    </div>
  </NEl>
</template>
