<!-- oxlint-disable -->
<script setup lang="ts">
import type { CalendarCell, ZonedDateTimeParts } from '../utils/zonedDateMath';

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  LeftOutlined,
  RightOutlined,
} from '@vicons/antd';
import { NButton, NIcon } from 'naive-ui';

import {
  compareDateParts,
  formatParts,
  getMonthGrid,
  isSameDate,
} from '../utils/zonedDateMath';

defineOptions({ name: 'ZonedCalendarGrid' });

const props = withDefaults(
  defineProps<{
    disabledDate?: (parts: ZonedDateTimeParts) => boolean;
    hoveredDate?: null | ZonedDateTimeParts;
    month: number;
    selectedEnd?: null | ZonedDateTimeParts;
    selectedStart?: null | ZonedDateTimeParts;
    timezoneId: string;
    year: number;
  }>(),
  {
    selectedStart: null,
    selectedEnd: null,
    hoveredDate: null,
    disabledDate: undefined,
  },
);

const emit = defineEmits<{
  'hover-date': [parts: null | ZonedDateTimeParts];
  next: [];
  'next-year': [];
  prev: [];
  'prev-year': [];
  select: [parts: ZonedDateTimeParts];
}>();

const { t } = useI18n();

const weekdayLabels = computed(() => [
  t('common.dateRange.weekdays.mon'),
  t('common.dateRange.weekdays.tue'),
  t('common.dateRange.weekdays.wed'),
  t('common.dateRange.weekdays.thu'),
  t('common.dateRange.weekdays.fri'),
  t('common.dateRange.weekdays.sat'),
  t('common.dateRange.weekdays.sun'),
]);

const title = computed(() =>
  formatParts(
    {
      year: props.year,
      month: props.month,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    },
    'yyyy-MM',
  ),
);

const cells = computed(() =>
  getMonthGrid(props.year, props.month, props.timezoneId),
);

function getCellClass(cell: CalendarCell) {
  const start = props.selectedStart;
  const end = props.selectedEnd;
  const hoverEnd =
    !end && start && props.hoveredDate ? props.hoveredDate : null;
  const rangeEnd = end ?? hoverEnd;
  const canPaintRangeState = cell.inCurrentMonth;
  const isStart = canPaintRangeState && isSameDate(cell.parts, start);
  const isEnd = canPaintRangeState && isSameDate(cell.parts, rangeEnd);
  const inRange =
    canPaintRangeState &&
    start &&
    rangeEnd &&
    compareDateParts(cell.parts, start) >= 0 &&
    compareDateParts(cell.parts, rangeEnd) <= 0;

  return {
    'is-outside': !cell.inCurrentMonth,
    'is-today': canPaintRangeState && cell.isToday,
    'is-selected-start': isStart,
    'is-selected-end': isEnd,
    'is-in-range': inRange,
    'is-disabled': isDisabled(cell.parts),
  };
}

function isDisabled(parts: ZonedDateTimeParts) {
  return props.disabledDate?.(parts) ?? false;
}

function handleSelect(parts: ZonedDateTimeParts) {
  if (isDisabled(parts)) return;
  emit('select', parts);
}
</script>

<template>
  <div class="zoned-calendar-grid box-border select-none">
    <div
      class="zoned-calendar-grid__header grid items-center justify-items-center"
    >
      <NButton
        text
        size="tiny"
        class="zoned-calendar-grid__nav"
        @click="$emit('prev-year')"
      >
        <NIcon size="14">
          <DoubleLeftOutlined />
        </NIcon>
      </NButton>
      <NButton
        text
        size="tiny"
        class="zoned-calendar-grid__nav"
        @click="$emit('prev')"
      >
        <NIcon size="14">
          <LeftOutlined />
        </NIcon>
      </NButton>
      <span class="zoned-calendar-grid__title">{{ title }}</span>
      <NButton
        text
        size="tiny"
        class="zoned-calendar-grid__nav"
        @click="$emit('next')"
      >
        <NIcon size="14">
          <RightOutlined />
        </NIcon>
      </NButton>
      <NButton
        text
        size="tiny"
        class="zoned-calendar-grid__nav"
        @click="$emit('next-year')"
      >
        <NIcon size="14">
          <DoubleRightOutlined />
        </NIcon>
      </NButton>
    </div>

    <div
      class="zoned-calendar-grid__weekdays grid items-center justify-items-center text-center"
    >
      <span
        v-for="weekday in weekdayLabels"
        :key="weekday"
        class="zoned-calendar-grid__weekday"
        >{{ weekday }}</span>
    </div>

    <div
      class="zoned-calendar-grid__days grid grid-cols-7 grid-rows-6 items-center justify-items-center"
    >
      <button
        v-for="cell in cells"
        :key="cell.key"
        type="button"
        class="zoned-calendar-grid__day relative z-0 cursor-pointer border-0 bg-transparent text-center"
        :class="getCellClass(cell)"
        :disabled="isDisabled(cell.parts)"
        @mouseenter="$emit('hover-date', cell.parts)"
        @mouseleave="$emit('hover-date', null)"
        @click="handleSelect(cell.parts)"
      >
        <span>{{ cell.label }}</span>
      </button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.zoned-calendar-grid {
  --zoned-date-font-size: var(--font-size, 14px);
  --zoned-date-title-font-size: var(--font-size, 14px);
  --zoned-date-days-font-size: var(--font-size, 14px);
  --zoned-date-item-font-size: var(--font-size, 14px);
  --zoned-date-item-size: 24px;
  --zoned-date-cell-width: 38px;
  --zoned-date-cell-height: 32px;
  --zoned-date-radius: var(--border-radius-small, 3px);
  --zoned-date-primary: var(--primary-color, #18a058);
  --zoned-date-primary-soft: color-mix(
    in srgb,
    var(--primary-color, #18a058) 12%,
    transparent
  );
  --zoned-date-hover: var(--hover-color, rgba(46, 51, 56, 0.09));

  width: calc(var(--zoned-date-cell-width) * 7 + 24px);
  padding: 4px 12px;
  color: var(--text-color-2);
  font-family: inherit;
  font-size: var(--zoned-date-font-size);

  &__header {
    grid-template-columns: 28px 28px 1fr 28px 28px;
    height: 28px;
    padding: 0;
    font-size: var(--zoned-date-title-font-size);
  }

  &__nav {
    width: 14px;
    height: 14px;
    line-height: 0;
    color: var(--text-color-2);
  }

  &__title {
    border-radius: var(--border-radius, 3px);
    padding: 6px 8px;
    color: var(--text-color-1);
    font-size: var(--zoned-date-title-font-size);
    font-weight: var(--font-weight-strong, 600);
    line-height: var(--zoned-date-title-font-size);
    text-align: center;
    transition: background-color 0.3s var(--bezier);
  }

  &__weekdays {
    grid-template-columns: repeat(7, var(--zoned-date-cell-width));
    grid-template-rows: var(--zoned-date-cell-height);
    margin: 0 auto 4px;
    border-bottom: 1px solid var(--divider-color);
  }

  &__weekday {
    display: flex;
    width: var(--zoned-date-item-size);
    align-items: center;
    justify-content: center;
    color: var(--text-color-2);
    font-size: var(--zoned-date-days-font-size);
    line-height: 15px;
    white-space: nowrap;
  }

  &__days {
    grid-template-columns: repeat(7, var(--zoned-date-cell-width));
    grid-auto-rows: var(--zoned-date-cell-height);
    margin: auto;
  }

  &__day {
    width: var(--zoned-date-item-size);
    height: var(--zoned-date-item-size);
    border-radius: var(--zoned-date-radius);
    color: var(--text-color-2);
    font-size: var(--zoned-date-item-font-size);
    line-height: var(--zoned-date-item-size);
    transition:
      background-color 0.2s var(--bezier),
      color 0.2s var(--bezier);

    &::before {
      position: absolute;
      z-index: -2;
      top: calc(
        (var(--zoned-date-item-size) - var(--zoned-date-cell-height)) / 2
      );
      bottom: calc(
        (var(--zoned-date-item-size) - var(--zoned-date-cell-height)) / 2
      );
      left: calc(
        (var(--zoned-date-item-size) - var(--zoned-date-cell-width)) / 2
      );
      right: calc(
        (var(--zoned-date-item-size) - var(--zoned-date-cell-width)) / 2
      );
      background: transparent;
      content: '';
    }

    &::after {
      position: absolute;
      z-index: -1;
      inset: 0;
      border-radius: inherit;
      background: transparent;
      content: '';
      transition: background-color 0.2s var(--bezier);
    }

    span {
      position: relative;
      z-index: 0;
    }

    &.is-outside {
      color: var(--text-color-disabled);
    }

    &.is-today span::after {
      position: absolute;
      top: 0;
      right: -4px;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: var(--zoned-date-primary);
      content: '';
    }

    &.is-in-range {
      color: var(--zoned-date-primary);

      &::before {
        background: var(--zoned-date-primary-soft);
      }
    }

    &.is-selected-start,
    &.is-selected-end {
      color: #fff;

      &::after {
        background: var(--zoned-date-primary);
      }
    }

    &.is-selected-start::before {
      left: 50%;
    }

    &.is-selected-end::before {
      right: 50%;
    }

    &.is-selected-start.is-selected-end::before {
      background: transparent;
    }

    &.is-selected-start span::after,
    &.is-selected-end span::after {
      background: #fff;
    }

    &.is-disabled {
      color: var(--text-color-disabled);
      cursor: not-allowed;
    }

    &:not(.is-disabled):not(.is-selected-start):not(
        .is-selected-end
      ):hover::after {
      background: var(--zoned-date-hover);
    }
  }
}
</style>
