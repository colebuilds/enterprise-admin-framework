/* oxlint-disable */
import { format, isValid, parse } from 'date-fns';
import { formatInTimeZone, fromZonedTime, toZonedTime } from 'date-fns-tz';

export const DEFAULT_TIMEZONE_ID = 'UTC';

export interface ZonedDateTimeParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
}

export interface CalendarCell {
  key: string;
  label: string;
  parts: ZonedDateTimeParts;
  inCurrentMonth: boolean;
  isToday: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * 只接受 IANA timezone id。后端混合串如 `(UTC+5:30)Asia/Kolkata` 会抽取
 * `Asia/Kolkata`；裸 offset 不再作为核心时区语义。
 */
export function normalizeTimezoneId(
  raw: null | string | undefined,
): null | string {
  if (!raw) return null;
  const trimmed = String(raw).trim();
  if (!trimmed) return null;

  const ianaMatch = trimmed.match(/[A-Za-z_]+(?:\/[A-Za-z_]+)+/);
  const timezoneId = ianaMatch?.[0] ?? trimmed;

  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezoneId });
    return timezoneId;
  } catch {
    return null;
  }
}

export function resolveTimezoneId(raw: null | string | undefined): string {
  return normalizeTimezoneId(raw) ?? DEFAULT_TIMEZONE_ID;
}

export function utcMsToParts(
  utcMs: number,
  timezoneId: string,
): null | ZonedDateTimeParts {
  if (!Number.isFinite(utcMs)) return null;
  const zoned = toZonedTime(utcMs, timezoneId);
  if (Number.isNaN(zoned.getTime())) return null;
  return {
    year: zoned.getFullYear(),
    month: zoned.getMonth() + 1,
    day: zoned.getDate(),
    hour: zoned.getHours(),
    minute: zoned.getMinutes(),
    second: zoned.getSeconds(),
    millisecond: zoned.getMilliseconds(),
  };
}

export function partsToUtcMs(
  parts: ZonedDateTimeParts,
  timezoneId: string,
): number {
  const wallClockCarrier = new Date(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond,
  );
  return fromZonedTime(wallClockCarrier, timezoneId).getTime();
}

export function formatUtcMsInZone(
  utcMs: number,
  timezoneId: string,
  pattern: string,
): string {
  return formatInTimeZone(utcMs, timezoneId, pattern);
}

export function nowInZone(timezoneId: string): ZonedDateTimeParts {
  return (
    utcMsToParts(Date.now(), timezoneId) ?? {
      year: 1970,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    }
  );
}

export function startOfDay(parts: ZonedDateTimeParts): ZonedDateTimeParts {
  return { ...parts, hour: 0, minute: 0, second: 0, millisecond: 0 };
}

export function endOfDay(parts: ZonedDateTimeParts): ZonedDateTimeParts {
  return { ...parts, hour: 23, minute: 59, second: 59, millisecond: 999 };
}

export function startOfMonth(parts: ZonedDateTimeParts): ZonedDateTimeParts {
  return startOfDay({ ...parts, day: 1 });
}

export function endOfMonth(parts: ZonedDateTimeParts): ZonedDateTimeParts {
  return endOfDay({ ...parts, day: getDaysInMonth(parts.year, parts.month) });
}

export function startOfWeek(parts: ZonedDateTimeParts): ZonedDateTimeParts {
  const day = new Date(
    Date.UTC(parts.year, parts.month - 1, parts.day),
  ).getUTCDay();
  const mondayBasedOffset = (day + 6) % 7;
  return startOfDay(addDays(parts, -mondayBasedOffset));
}

export function endOfWeek(parts: ZonedDateTimeParts): ZonedDateTimeParts {
  return endOfDay(addDays(startOfWeek(parts), 6));
}

export function addDays(
  parts: ZonedDateTimeParts,
  amount: number,
): ZonedDateTimeParts {
  const d = new Date(
    Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
      parts.millisecond,
    ),
  );
  d.setUTCDate(d.getUTCDate() + amount);
  return fromUtcCarrier(d);
}

export function addMonths(
  parts: ZonedDateTimeParts,
  amount: number,
): ZonedDateTimeParts {
  const monthIndex = parts.year * 12 + (parts.month - 1) + amount;
  const year = Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;
  const day = Math.min(parts.day, getDaysInMonth(year, month));
  return { ...parts, year, month, day };
}

export function compareParts(
  a: ZonedDateTimeParts,
  b: ZonedDateTimeParts,
): number {
  const av = partsComparableValue(a);
  const bv = partsComparableValue(b);
  return av === bv ? 0 : (av > bv ? 1 : -1);
}

export function compareDateParts(
  a: ZonedDateTimeParts,
  b: ZonedDateTimeParts,
): number {
  const av = Date.UTC(a.year, a.month - 1, a.day);
  const bv = Date.UTC(b.year, b.month - 1, b.day);
  return av === bv ? 0 : (av > bv ? 1 : -1);
}

export function diffCalendarDays(
  start: ZonedDateTimeParts,
  end: ZonedDateTimeParts,
): number {
  const sv = Date.UTC(start.year, start.month - 1, start.day);
  const ev = Date.UTC(end.year, end.month - 1, end.day);
  return Math.round((ev - sv) / DAY_MS);
}

export function toDateKey(parts: ZonedDateTimeParts): string {
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function isSameDate(
  a: null | ZonedDateTimeParts,
  b: null | ZonedDateTimeParts,
): boolean {
  return (
    !!a && !!b && a.year === b.year && a.month === b.month && a.day === b.day
  );
}

export function formatParts(
  parts: ZonedDateTimeParts,
  pattern: string,
): string {
  return format(
    new Date(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second,
      parts.millisecond,
    ),
    pattern,
  );
}

export function parseParts(
  value: string,
  pattern: string,
): null | ZonedDateTimeParts {
  const parsed = parse(value, pattern, new Date(0));
  if (!isValid(parsed)) return null;
  return {
    year: parsed.getFullYear(),
    month: parsed.getMonth() + 1,
    day: parsed.getDate(),
    hour: parsed.getHours(),
    minute: parsed.getMinutes(),
    second: parsed.getSeconds(),
    millisecond: parsed.getMilliseconds(),
  };
}

export function getMonthGrid(
  year: number,
  month: number,
  timezoneId: string,
): CalendarCell[] {
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const mondayBasedOffset = (firstDay + 6) % 7;
  const today = nowInZone(timezoneId);
  const cells: CalendarCell[] = [];

  for (let i = 0; i < 42; i++) {
    const day = 1 - mondayBasedOffset + i;
    const carrier = new Date(Date.UTC(year, month - 1, day));
    const parts: ZonedDateTimeParts = {
      year: carrier.getUTCFullYear(),
      month: carrier.getUTCMonth() + 1,
      day: carrier.getUTCDate(),
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    };
    cells.push({
      key: toDateKey(parts),
      label: String(parts.day),
      parts,
      inCurrentMonth: parts.month === month,
      isToday: isSameDate(parts, today),
    });
  }

  return cells;
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function fromUtcCarrier(d: Date): ZonedDateTimeParts {
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    millisecond: d.getUTCMilliseconds(),
  };
}

function partsComparableValue(parts: ZonedDateTimeParts): number {
  return Date.UTC(
    parts.year,
    parts.month - 1,
    parts.day,
    parts.hour,
    parts.minute,
    parts.second,
    parts.millisecond,
  );
}

function pad(value: number): string {
  return String(value).padStart(2, '0');
}
