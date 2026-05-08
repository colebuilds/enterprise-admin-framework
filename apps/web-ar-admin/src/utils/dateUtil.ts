import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  format,
  isValid,
  parse,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from 'date-fns';

import { useAppUserStore } from '#/store/app-user';
const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm:ss';

type TimeZoneValue = null | string | undefined;

function isEmptyTimeValue(value: unknown) {
  return value === null || value === undefined || value === '';
}

function normalizeDateValue(value: Date | null | number | string | undefined) {
  if (isEmptyTimeValue(value)) return null;

  const dateValue = value instanceof Date ? value : new Date(value);
  return Number.isNaN(dateValue.getTime()) ? null : dateValue;
}

/**
 * @description 获取当前账号配置的时区编码
 * @returns {string} 时区编码，缺失时返回空字符串
 */
function getCurrentTimeZoneCode() {
  // TODO: fix type — useAppUserStore has no timeZoneList; wire to user info when available
  return (useAppUserStore().info as any)?.timeZoneList?.[0]?.timeZoneCode ?? '';
}

/**
 * @description 获取当前账号配置的时区偏移值
 * @returns {string} 时区偏移值，缺失时返回空字符串
 */
function getCurrentTimeZoneValue() {
  // TODO: fix type — useAppUserStore has no timeZoneList; wire to user info when available
  return (
    (useAppUserStore().info as any)?.timeZoneList?.[0]?.timeZoneValue ?? ''
  );
}

function extractTimeZoneOffsetParts(timeZoneValue?: TimeZoneValue) {
  const normalizedValue = String(timeZoneValue ?? '').trim();
  if (!normalizedValue) return null;

  const matched =
    normalizedValue.match(/UTC\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?/i) ??
    normalizedValue.match(/([+-])\s*(\d{1,2})(?::?(\d{2}))?/);

  if (!matched) return null;

  return {
    sign: matched[1] === '-' ? -1 : 1,
    hours: Number(matched[2]),
    minutes: Number(matched[3] ?? 0),
  };
}

export function getTimeZoneOffsetLabel(
  timeZoneValue?: TimeZoneValue,
  fallback = '',
) {
  const offsetParts = extractTimeZoneOffsetParts(timeZoneValue);
  if (!offsetParts) return fallback;

  const signText = offsetParts.sign < 0 ? '-' : '+';
  const minuteText = String(Math.abs(offsetParts.minutes)).padStart(2, '0');
  return `UTC${signText}${Math.abs(offsetParts.hours)}:${minuteText}`;
}

function parseTimeOffset(timeZoneValue?: TimeZoneValue) {
  const offsetParts = extractTimeZoneOffsetParts(timeZoneValue);
  if (!offsetParts) return null;

  return (
    offsetParts.sign *
    (Math.abs(offsetParts.hours) + Math.abs(offsetParts.minutes) / 60)
  );
}

function convertToTimeZoneTimestamp(
  value: Date | null | number | string | undefined,
  timeZoneValue?: TimeZoneValue,
) {
  const dateValue = normalizeDateValue(value);
  if (!dateValue) return null;

  const offset = parseTimeOffset(timeZoneValue);
  if (offset === null) return dateValue.getTime();

  const utc = dateValue.getTime() + dateValue.getTimezoneOffset() * 60_000;
  return utc + offset * 3_600_000;
}

/**
 * 把"浏览器本地 wall-clock 时间戳"重解释为"指定时区下的同 wall-clock 时刻"对应的真 UTC ms。
 * 用于搜索日期选择器 → 商户时区范围查询：picker 在浏览器本地选中的时间文字，
 * 视作商户时区同样文字的那一刻，再转成真 UTC ms 提交给后端。
 *
 * 例：浏览器 UTC+8 选中 2026-04-18 00:00（ts A），timeZoneValue=UTC+5:30，
 *     返回 2026-04-18 00:00 UTC+5:30 对应的 UTC ms（比 A 晚 2.5h）。
 */
export function convertLocalWallClockToZoneUtc(
  value: Date | null | number | string | undefined,
  timeZoneValue?: TimeZoneValue,
): null | number {
  const dateValue = normalizeDateValue(value);
  if (!dateValue) return null;

  const offset = parseTimeOffset(timeZoneValue);
  if (offset === null) return dateValue.getTime();

  const utcWallClock =
    dateValue.getTime() - dateValue.getTimezoneOffset() * 60_000;
  return utcWallClock - offset * 3_600_000;
}

export function formatToTimeZone(
  value: Date | null | number | string | undefined,
  timeZoneValue?: TimeZoneValue,
  formatStr = DATE_TIME_FORMAT,
  fallback = '',
) {
  if (value === 0) return '--';
  const timestamp = convertToTimeZoneTimestamp(value, timeZoneValue);
  if (timestamp === null) return fallback;
  return format(timestamp, formatStr);
}

export function formatToCurrentZone(
  value: Date | null | number | string | undefined,
  isTimer?: boolean,
  Format?: string,
  fallback = '',
) {
  if (isEmptyTimeValue(value)) return fallback;

  const zone = getCurrentTimeZoneValue() || getCurrentTimeZoneCode();
  const timestamp = convertToTimeZoneTimestamp(value, zone);
  if (timestamp === null) return fallback;

  if (isTimer) return timestamp;
  return format(timestamp, Format || DATE_TIME_FORMAT);
}

/**
 * 格式化日期到当前时区，空值返回 '-'
 * 适用于表格列 render 等场景
 */
export function formatDateStr(
  value: Date | null | number | string | undefined,
  fmt?: string,
) {
  return formatToCurrentZone(value, false, fmt, '--') as string;
}

export function getCurrentZone() {
  return parseTimeOffset(getCurrentTimeZoneCode()) ?? 0;
}
// 回复Peggy的方法
export function formatTimeToTimeZoneUnix(date: Date | number): number {
  if (!date) return 0;
  // const timeZone=store.getTimeZone;
  return date instanceof Date ? date.getTime() : date;
  // if(!timeZone) return date as number;
  // return fromZonedTime(date).getTime();
}

export function formatReportTime(value: any, typeType?: number) {
  switch (typeType) {
    case 1: {
      return format(value, 'yyyy-MM-dd');
    }
    case 2: {
      return format(value, 'yyyy-MM-dd');
    }
    case 3: {
      return format(value, DATE_TIME_FORMAT);
    }
  }
  return format(value, DATE_TIME_FORMAT);
}

/**
 * @param value 时间戳
 * @returns 返回当前站点时区的时间戳
 * @description eg.1758047400000 转为 1758083400000
 */
export function formatLocalToZoneTime(value: any, formatStr = '00:00:00') {
  if (isEmptyTimeValue(value)) return 0;
  const zone = getCurrentTimeZoneValue();
  if (!zone) return value;
  const now = new Date(format(value, `yyyy-MM-dd ${formatStr}`));
  const utc = now.getTime() - now.getTimezoneOffset() * 60_000;
  const offset = parseTimeOffset(zone);
  if (offset === null) return value;
  const localTime = new Date(utc - offset * 3_600_000);
  return localTime.getTime();
}
/**
 * @param value 时间戳
 * @returns 根据formatLocalToZoneTime 相反的处理
 * @description eg.1758083400000 转为  1758047400000
 */
export function formatZoneTimeToLocal(value: any) {
  if (isEmptyTimeValue(value)) return 0;
  const zone = getCurrentTimeZoneValue();
  if (!zone) return value;
  const now = new Date(value);
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const offset = parseTimeOffset(zone);
  if (offset === null) return value;
  const localTime = new Date(utc + offset * 3_600_000);
  return localTime.getTime();
}
/**
 *
 * @param value 时间戳
 * @description 查询时间转换  使用当前站点时间
 * @returns
 */
export const changeSearchTime = (value: number) => {
  // 查询时间转换  使用当前站点时间
  const ts = format(value, DATE_TIME_FORMAT);
  const timeZone = getCurrentTimeZoneCode();
  if (!timeZone) return value;
  const date = new Date(`${ts} ${timeZone}`);
  return new Date(date).getTime();
};

/**
 *
 * @description 解析搜索表单中的日期值，兼容时间戳、Date 和 ProField 输出的格式化字符串
 * @param {string | number | Date | null | undefined} value 搜索表单中的日期值
 * @returns {number | undefined} 可继续参与时区换算的时间戳
 */
export function parseSearchDateValue(
  value: Date | null | number | string | undefined,
) {
  if (value === undefined || value === null || value === '') return undefined;

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value.getTime();
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : undefined;
  }

  const normalizedValue = String(value).trim();

  if (!normalizedValue) return undefined;

  const numericValue = Number(normalizedValue);
  if (Number.isFinite(numericValue)) {
    return numericValue;
  }

  const dateTimeValue = parse(normalizedValue, DATE_TIME_FORMAT, new Date());
  if (isValid(dateTimeValue)) {
    return dateTimeValue.getTime();
  }

  const dateValue = parse(normalizedValue, 'yyyy-MM-dd', new Date());
  if (isValid(dateValue)) {
    return dateValue.getTime();
  }

  const nativeDate = new Date(normalizedValue);
  return Number.isNaN(nativeDate.getTime()) ? undefined : nativeDate.getTime();
}

/**
 * 搜索表单「操作时间」等日期范围字段的默认当天区间（本地日历日 00:00:00～23:59:59.999 的毫秒时间戳）。
 * 与 ProDateRange（`[number, number]`）及 `resolveTimeRange` / `parseSearchDateValue` 链路兼容。
 *
 * @param referenceDate - 基准日期，默认当前时刻所在日
 * @returns 起止时间戳元组
 */
export function getSearchDefaultTodayRange(
  referenceDate: Date = new Date(),
): [number, number] {
  return [
    startOfDay(referenceDate).getTime(),
    endOfDay(referenceDate).getTime(),
  ];
}

/**
 *
 * @param value 时间戳
 * @description 查询时间转换  使用当前站点时间
 * @returns {string} 格式化之后的字符串
 */
export const getTenantTimeFormat = (value: number, typeType?: number) => {
  // 查询时间转换  使用当前站点时间
  const timeZone = getCurrentTimeZoneValue() || getCurrentTimeZoneCode();
  if (!timeZone) {
    switch (typeType) {
      case 1: {
        return format(value, 'yyyy-MM-dd');
      }
      case 2: {
        return format(value, 'yyyy-MM-dd');
      }
      case 3: {
        return format(value, DATE_TIME_FORMAT);
      }
    }
    return format(value, DATE_TIME_FORMAT);
  }
  const timeValue = convertToTimeZoneTimestamp(value, timeZone) ?? value;

  switch (typeType) {
    case 1: {
      return format(timeValue, 'yyyy-MM-dd');
    }
    case 2: {
      return format(timeValue, 'yyyy-MM-dd');
    }
    case 3: {
      return format(timeValue, DATE_TIME_FORMAT);
    }
  }
  return format(timeValue, DATE_TIME_FORMAT);
};

export function formatToDateTime(
  date: Date | number,
  formatStr = DATE_TIME_FORMAT,
): string {
  if (!date) return '--';
  return format(date, formatStr);
}
export function formatTimeZone(
  date: Date | number,
  formatStr = 'yyyy-MM-dd HH:mm z',
): string {
  if (!date) return '--';
  return format(date, formatStr);
}

// 获取当天开始时间和结束时间
export const startDate = () => startOfDay(formatToCurrentZone(Date.now()));
export const endDate = () => endOfDay(formatToCurrentZone(Date.now()));
// 获取昨天开始时间和结束时间
export const yesterdayStart = () =>
  startOfDay(formatToCurrentZone(Date.now() - 24 * 60 * 60 * 1000));
export const yesterdayEnd = () =>
  endOfDay(formatToCurrentZone(Date.now() - 24 * 60 * 60 * 1000));
// 获取本周开始时间和结束时间
export const weekFirstDay = () =>
  startOfDay(startOfWeek(new Date(startDate()), { weekStartsOn: 1 }));
export const weekEndDay = () => endDate();
// 获取上周开始时间和结束时间
export const startWeekDay = () =>
  startOfDay(
    subWeeks(startOfWeek(new Date(startDate()), { weekStartsOn: 1 }), 1),
  );
export const endWeekDay = () =>
  endOfWeek(
    subWeeks(startOfWeek(new Date(startDate()), { weekStartsOn: 1 }), 1),
    {
      weekStartsOn: 1,
    },
  );
// 获取本月开始时间和结束时间 算上时差(formatToCurrentZone)
export const mouthFirstDay = () =>
  startOfMonth(new Date(formatToCurrentZone(Date.now())));
export const mouthEndDay = () => endDate();
// 获取上月开始时间和结束时间
export const startOfMonthDay = () =>
  startOfMonth(subMonths(formatToCurrentZone(Date.now()), 1));
export const endOfMonthDay = () =>
  endOfMonth(subMonths(formatToCurrentZone(Date.now()), 1));

// 日期格式化,将年月日时间转换为时间戳 如果时年月日时分秒的话则直接使用changeSearchTime
export function formatDate(
  date: number,
  format = '00:00:00',
  isTime = false,
): number | string {
  if (!date) return '';
  const zomeTime = changeSearchTime(date);
  if (isTime) return zomeTime;
  const dateStr = formatToDateTime(zomeTime, `yyyy-MM-dd ${format}`);
  const timeZone = getCurrentTimeZoneCode();
  if (!timeZone) {
    return new Date(dateStr).getTime();
  }
  const newDate = new Date(`${dateStr} ${timeZone}`);
  return new Date(newDate).getTime();
}
