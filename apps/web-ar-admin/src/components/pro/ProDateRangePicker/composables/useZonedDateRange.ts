/* oxlint-disable */
import type { Ref } from 'vue';

import type {
  DateRangeShortcuts,
  DateRangeTimezone,
  QuickDateItem,
} from '../../types';
import type {
  ExternalRangeValue,
  OutboundRangeTuple,
  ZonedRangeDraft,
} from '../utils/rangeValueCodec';
import type { ZonedDateTimeParts } from '../utils/zonedDateMath';

import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { useEffectiveDateRangeTimezone } from '../useDateRange';
import {
  decodeExternalValue,
  encodeExternalValue,
  normalizeDraftForConfirm,
} from '../utils/rangeValueCodec';
import {
  addMonths,
  compareDateParts,
  compareParts,
  diffCalendarDays,
  endOfDay,
  nowInZone,
  resolveTimezoneId,
  startOfDay,
} from '../utils/zonedDateMath';
import {
  createZonedShortcutItems,
  matchZonedShortcutIndex,
} from './useZonedShortcuts';

export interface UseZonedDateRangeOptions {
  value: Ref<ExternalRangeValue>;
  valueFormat: Ref<'string' | 'timestamp'>;
  valueStringPattern: Ref<string>;
  timezone: Ref<DateRangeTimezone | undefined>;
  showTime: Ref<boolean>;
  maxDays: Ref<number>;
  allowFuture: Ref<boolean>;
  shortcuts: Ref<DateRangeShortcuts | undefined>;
  shortcutPreset: Ref<'default' | 'report' | 'simple'>;
  onUpdateValue: (value: OutboundRangeTuple) => void;
  onConfirm: (value: OutboundRangeTuple) => void;
  onReset: () => void;
}

export function useZonedDateRange(options: UseZonedDateRangeOptions) {
  const { t } = useI18n();
  const draft = ref<ZonedRangeDraft>({ start: null, end: null });
  const errorMessage = ref('');
  const effectiveTimezone = useEffectiveDateRangeTimezone(options.timezone);
  const timezoneId = computed(() => resolveTimezoneId(effectiveTimezone.value));
  const visibleMonth = ref(toMonthCursor(nowInZone(timezoneId.value)));

  const currentShortcuts = computed<QuickDateItem[]>(() => {
    const shortcuts = options.shortcuts.value;
    if (Array.isArray(shortcuts)) return shortcuts;
    if (shortcuts === false) return [];
    return createZonedShortcutItems(
      timezoneId.value,
      options.shortcutPreset.value,
      t,
    );
  });

  const activeShortcutIndex = computed(() =>
    matchZonedShortcutIndex(
      draft.value,
      currentShortcuts.value,
      effectiveTimezone.value,
    ),
  );

  const leftMonth = computed(() => visibleMonth.value);
  const rightMonth = computed(() =>
    toMonthCursor(addMonths(monthCursorToParts(visibleMonth.value), 1)),
  );

  watch(
    [
      () => options.value.value,
      () => options.valueFormat.value,
      () => options.valueStringPattern.value,
      () => effectiveTimezone.value,
    ] as const,
    ([value]) => {
      const next = decodeExternalValue(value, {
        valueFormat: options.valueFormat.value,
        valueStringPattern: options.valueStringPattern.value,
        timezone: effectiveTimezone.value,
      });
      draft.value = next;
      errorMessage.value = validateDraft(next);
      if (next.start) visibleMonth.value = toMonthCursor(next.start);
    },
    { immediate: true },
  );

  function goPrevMonth() {
    visibleMonth.value = toMonthCursor(
      addMonths(monthCursorToParts(visibleMonth.value), -1),
    );
  }

  function goNextMonth() {
    visibleMonth.value = toMonthCursor(
      addMonths(monthCursorToParts(visibleMonth.value), 1),
    );
  }

  function goPrevYear() {
    visibleMonth.value = toMonthCursor(
      addMonths(monthCursorToParts(visibleMonth.value), -12),
    );
  }

  function goNextYear() {
    visibleMonth.value = toMonthCursor(
      addMonths(monthCursorToParts(visibleMonth.value), 12),
    );
  }

  function handleDateSelect(dateParts: ZonedDateTimeParts) {
    const dateStart = startOfDay(dateParts);
    const dateEnd = endOfDay(dateParts);
    const current = draft.value;

    if (!current.start || current.end) {
      draft.value = { start: dateStart, end: null };
      errorMessage.value = '';
      return;
    }

    draft.value =
      compareDateParts(dateStart, current.start) < 0
        ? {
            start: dateStart,
            end: endOfDay(current.start),
          }
        : {
            start: current.start,
            end: dateEnd,
          };
    errorMessage.value = validateDraft(draft.value);
  }

  function handleHoverDate(parts: null | ZonedDateTimeParts) {
    hoveredDate.value = parts;
  }

  const hoveredDate = ref<null | ZonedDateTimeParts>(null);

  function handleStartTimeUpdate(parts: ZonedDateTimeParts) {
    draft.value = { ...draft.value, start: parts };
    errorMessage.value = validateDraft(draft.value);
  }

  function handleEndTimeUpdate(parts: ZonedDateTimeParts) {
    draft.value = { ...draft.value, end: parts };
    errorMessage.value = validateDraft(draft.value);
  }

  function handleShortcut(item: QuickDateItem) {
    const next = decodeExternalValue(item.value, {
      valueFormat: 'timestamp',
      valueStringPattern: options.valueStringPattern.value,
      timezone: effectiveTimezone.value,
    });
    draft.value = next;
    errorMessage.value = validateDraft(next);
    if (!errorMessage.value) handleConfirm();
  }

  function handleReset() {
    draft.value = { start: null, end: null };
    errorMessage.value = '';
    options.onReset();
  }

  function handleConfirm() {
    const normalized = normalizeDraftForConfirm(
      draft.value,
      options.showTime.value,
    );
    const error = validateDraft(normalized);
    errorMessage.value = error;
    if (error) return;

    const outbound = encodeExternalValue(normalized, {
      valueFormat: options.valueFormat.value,
      valueStringPattern: options.valueStringPattern.value,
      timezone: effectiveTimezone.value,
    });
    if (!outbound) return;

    draft.value = normalized;
    options.onUpdateValue(outbound);
    options.onConfirm(outbound);
  }

  function isDateDisabled(parts: ZonedDateTimeParts): boolean {
    if (options.allowFuture.value) return false;
    return compareDateParts(parts, nowInZone(timezoneId.value)) > 0;
  }

  function validateDraft(value: ZonedRangeDraft): string {
    if (!value.start || !value.end) return '';
    if (compareParts(value.start, value.end) > 0)
      return t('common.dateRange.startAfterEnd');
    if (
      !options.allowFuture.value &&
      compareParts(value.end, endOfDay(nowInZone(timezoneId.value))) > 0
    ) {
      return t('common.dateRange.noFuture');
    }
    const days = diffCalendarDays(value.start, value.end) + 1;
    if (days > options.maxDays.value)
      return t('common.dateRange.maxDays', { n: options.maxDays.value });
    return '';
  }

  return {
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
  };
}

function toMonthCursor(parts: ZonedDateTimeParts): {
  month: number;
  year: number;
} {
  return { year: parts.year, month: parts.month };
}

function monthCursorToParts(cursor: {
  month: number;
  year: number;
}): ZonedDateTimeParts {
  return {
    year: cursor.year,
    month: cursor.month,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  };
}
