/* oxlint-disable */
import type { ComputedRef } from 'vue';

import type {
  DateRangeDefaultShortcut,
  DateRangeShortcutPreset,
  DateRangeShortcuts,
  DateRangeTimezone,
  MaybeRef,
  QuickDateItem,
} from '../../types';
import type { ZonedDateTimeParts } from '../utils/zonedDateMath';

import { computed, unref } from 'vue';

import { useEffectiveDateRangeTimezone } from '../useDateRange';
import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  endOfWeek,
  formatUtcMsInZone,
  nowInZone,
  partsToUtcMs,
  resolveTimezoneId,
  startOfDay,
  startOfMonth,
  startOfWeek,
  toDateKey,
  utcMsToParts,
} from '../utils/zonedDateMath';

type TranslateFn = (key: string, params?: Record<string, unknown>) => string;

export function useZonedShortcuts(options: {
  customShortcuts?: MaybeRef<DateRangeShortcuts | undefined>;
  preset?: MaybeRef<DateRangeShortcutPreset>;
  t: TranslateFn;
  timezone?: MaybeRef<DateRangeTimezone | undefined>;
}): ComputedRef<QuickDateItem[]> {
  const propTimezone = computed<DateRangeTimezone | undefined>(() =>
    unref(options.timezone),
  );
  const effectiveTimezone = useEffectiveDateRangeTimezone(propTimezone);

  return computed(() => {
    return resolveZonedShortcutItems({
      shortcuts: unref(options.customShortcuts),
      timezoneId: resolveTimezoneId(effectiveTimezone.value),
      preset: unref(options.preset) ?? 'default',
      t: options.t,
    });
  });
}

/**
 * 按 UTC 日级（`Math.floor(ms / 86400000)`）反向匹配 `[ms, ms]` 元组对应的快捷项索引。
 * 用于 ProQuickDateButtons / useRechargeQuickDate 这种已经持有 UTC ms 范围的场景；
 * 面板内部用 PlainDateTime 的版本走 `matchZonedShortcutIndex`。
 */
export function matchShortcutIndexByRange(
  range: [number, number] | null | number[] | undefined,
  shortcuts: QuickDateItem[],
): number | undefined {
  if (!Array.isArray(range) || range.length !== 2) return undefined;
  const dayMs = 86_400_000;
  const startDay = Math.floor(range[0] / dayMs);
  const endDay = Math.floor(range[1] / dayMs);
  for (const [i, shortcut] of shortcuts.entries()) {
    const [s, e] = shortcut.value;
    if (Math.floor(s / dayMs) === startDay && Math.floor(e / dayMs) === endDay)
      return i;
  }
  return undefined;
}

export function matchZonedShortcutIndex(
  draft: { end: null | ZonedDateTimeParts; start: null | ZonedDateTimeParts },
  shortcuts: QuickDateItem[],
  timezone: null | string | undefined,
): number | undefined {
  if (!draft.start || !draft.end) return undefined;
  const timezoneId = resolveTimezoneId(timezone);
  const startKey = toDateKey(draft.start);
  const endKey = toDateKey(draft.end);

  for (const [i, shortcut] of shortcuts.entries()) {
    const [start, end] = shortcut.value;
    const shortcutStart = utcMsToParts(start, timezoneId);
    const shortcutEnd = utcMsToParts(end, timezoneId);
    if (!shortcutStart || !shortcutEnd) continue;
    if (
      toDateKey(shortcutStart) === startKey &&
      toDateKey(shortcutEnd) === endKey
    ) {
      return i;
    }
  }

  return undefined;
}

export function createZonedShortcutItems(
  timezoneId: string,
  preset: DateRangeShortcutPreset,
  t: TranslateFn,
): QuickDateItem[] {
  const builtIns = createZonedBaseShortcutItems(timezoneId, t);
  const now = nowInZone(timezoneId);
  const todayEnd = endOfDay(now);
  const lastN = (n: number, key: string) =>
    createItem(
      key,
      t(`common.dateShortcuts.${key}`),
      startOfDay(addDays(now, -(n - 1))),
      todayEnd,
      timezoneId,
    );
  const defaults = [
    ...builtIns,
    lastN(3, 'last3Days'),
    lastN(7, 'last7Days'),
    lastN(15, 'last15Days'),
    lastN(30, 'last30Days'),
  ];

  // simple: today / yesterday / last7Days / last30Days
  if (preset === 'simple')
    return [defaults[0], defaults[1], defaults[7], defaults[9]];
  if (preset === 'report') return [...defaults, lastN(90, 'last90Days')];

  return defaults;
}

export function createZonedBaseShortcutItems(
  timezoneId: string,
  t: TranslateFn,
): QuickDateItem[] {
  const now = nowInZone(timezoneId);
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const yesterday = addDays(todayStart, -1);
  const thisWeekStart = startOfWeek(now);
  const lastWeekStart = addDays(thisWeekStart, -7);
  const thisMonthStart = startOfMonth(now);
  const lastMonthStart = startOfMonth(addMonths(now, -1));

  return [
    createItem(
      'today',
      t('common.dateShortcuts.today'),
      todayStart,
      todayEnd,
      timezoneId,
    ),
    createItem(
      'yesterday',
      t('common.dateShortcuts.yesterday'),
      startOfDay(yesterday),
      endOfDay(yesterday),
      timezoneId,
    ),
    createItem(
      'thisWeek',
      t('common.dateShortcuts.thisWeek'),
      thisWeekStart,
      todayEnd,
      timezoneId,
    ),
    createItem(
      'lastWeek',
      t('common.dateShortcuts.lastWeek'),
      lastWeekStart,
      endOfWeek(lastWeekStart),
      timezoneId,
    ),
    createItem(
      'thisMonth',
      t('common.dateShortcuts.thisMonth'),
      thisMonthStart,
      todayEnd,
      timezoneId,
    ),
    createItem(
      'lastMonth',
      t('common.dateShortcuts.lastMonth'),
      lastMonthStart,
      endOfMonth(lastMonthStart),
      timezoneId,
    ),
  ];
}

export function createZonedDefaultShortcutValue(options: {
  defaultShortcut: DateRangeDefaultShortcut | undefined;
  preset: DateRangeShortcutPreset;
  t: TranslateFn;
  timezoneId: string;
  valueFormat: 'string' | 'timestamp';
  valueStringPattern: string;
}): [number, number] | [string, string] | null {
  const key = options.defaultShortcut;
  if (!key) return null;

  const shortcuts = createZonedShortcutItems(
    options.timezoneId,
    options.preset,
    options.t,
  );
  const shortcut = shortcuts.find((item) => item.key === key);
  if (!shortcut) return null;

  if (options.valueFormat === 'string') {
    return [
      formatUtcMsInZone(
        shortcut.value[0],
        options.timezoneId,
        options.valueStringPattern,
      ),
      formatUtcMsInZone(
        shortcut.value[1],
        options.timezoneId,
        options.valueStringPattern,
      ),
    ];
  }

  return shortcut.value;
}

function resolveZonedShortcutItems(options: {
  preset: DateRangeShortcutPreset;
  shortcuts: DateRangeShortcuts | undefined;
  t: TranslateFn;
  timezoneId: string;
}): QuickDateItem[] {
  if (Array.isArray(options.shortcuts)) return options.shortcuts;
  if (options.shortcuts === false) return [];
  return createZonedShortcutItems(
    options.timezoneId,
    options.preset,
    options.t,
  );
}

function createItem(
  key: string,
  label: string,
  start: ZonedDateTimeParts,
  end: ZonedDateTimeParts,
  timezoneId: string,
): QuickDateItem {
  return {
    key,
    label,
    value: [partsToUtcMs(start, timezoneId), partsToUtcMs(end, timezoneId)],
  };
}
