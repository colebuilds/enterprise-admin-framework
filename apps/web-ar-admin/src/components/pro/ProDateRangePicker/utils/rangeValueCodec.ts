/* oxlint-disable */
import type { ZonedDateTimeParts } from './zonedDateMath';

import {
  endOfDay,
  formatParts,
  parseParts,
  partsToUtcMs,
  resolveTimezoneId,
  startOfDay,
  utcMsToParts,
} from './zonedDateMath';

export type ExternalRangeValue = [number, number] | [string, string] | null;
export type OutboundRangeTuple = [number, number] | [string, string];

export interface ZonedRangeDraft {
  start: null | ZonedDateTimeParts;
  end: null | ZonedDateTimeParts;
}

export interface RangeValueCodecOptions {
  valueFormat: 'string' | 'timestamp';
  valueStringPattern: string;
  timezone: null | string | undefined;
}

export function decodeExternalValue(
  value: ExternalRangeValue,
  options: RangeValueCodecOptions,
): ZonedRangeDraft {
  if (!value || value.length !== 2) return { start: null, end: null };
  const [start, end] = value;
  const timezoneId = resolveTimezoneId(options.timezone);

  if (typeof start === 'number' && typeof end === 'number') {
    return {
      start: utcMsToParts(start, timezoneId),
      end: utcMsToParts(end, timezoneId),
    };
  }

  if (typeof start === 'string' && typeof end === 'string') {
    return {
      start: parseParts(start, options.valueStringPattern),
      end: parseParts(end, options.valueStringPattern),
    };
  }

  return { start: null, end: null };
}

export function encodeExternalValue(
  draft: ZonedRangeDraft,
  options: RangeValueCodecOptions,
): null | OutboundRangeTuple {
  if (!draft.start || !draft.end) return null;
  const timezoneId = resolveTimezoneId(options.timezone);

  if (options.valueFormat === 'string') {
    return [
      formatParts(draft.start, options.valueStringPattern),
      formatParts(draft.end, options.valueStringPattern),
    ];
  }

  return [
    partsToUtcMs(draft.start, timezoneId),
    partsToUtcMs(draft.end, timezoneId),
  ];
}

export function normalizeDraftForConfirm(
  draft: ZonedRangeDraft,
  showTime: boolean,
): ZonedRangeDraft {
  if (!draft.start || !draft.end) return draft;

  if (showTime) {
    return {
      start: { ...draft.start, millisecond: 0 },
      end: { ...draft.end, millisecond: 999 },
    };
  }

  return {
    start: startOfDay(draft.start),
    end: endOfDay(draft.end),
  };
}
