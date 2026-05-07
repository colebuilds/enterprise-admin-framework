/* oxlint-disable */
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

/**
 * 把项目内的各种时区字符串归一化为 date-fns-tz 能接受的格式。
 *
 * 后端 `tenant.timeZone` 常见格式：
 *  - `'(UTC+5:30)Asia/Kolkata'`  ← AR SaaS 实际下发格式
 *  - `'Asia/Kolkata'`
 *  - `'UTC+8'` / `'UTC+5:30'` / `'UTC+08:00'`
 *  - `'+05:30'` / `'-08:00'`
 *
 * 策略：
 *  1. 优先抽取字符串里的 IANA 名（自带 DST 信息）
 *  2. 回退到单 token IANA（`'UTC'`、`'Zulu'` 等）
 *  3. 回退到 UTC/GMT 前缀偏移 → `'±HH:mm'`
 *  4. 回退到裸偏移 → `'±HH:mm'`
 *  5. 无法识别返回 null（调用方退化为浏览器本地时区）
 */
export function normalizeTimezone(
  tz: null | string | undefined,
): null | string {
  if (!tz) return null;
  const trimmed = String(tz).trim();
  if (!trimmed) return null;
  // 1. 从字符串中抽取 IANA 名（支持多段：Asia/Kolkata、America/Argentina/Buenos_Aires）
  const ianaMatch = trimmed.match(/[A-Za-z_]+(?:\/[A-Za-z_]+)+/);
  if (ianaMatch) return ianaMatch[0];
  // 2. 单 token IANA（date-fns-tz 认 'UTC'）
  if (/^[A-Za-z_]+$/.test(trimmed)) return trimmed;
  // 3. UTC/GMT 前缀或裸偏移
  const matched = trimmed.match(
    /(?:UTC|GMT)?\s*([+-])\s*(\d{1,2})(?::?(\d{2}))?/i,
  );
  if (!matched) return null;
  const sign = matched[1];
  const hours = String(Math.abs(Number(matched[2]))).padStart(2, '0');
  const minutes = String(Math.abs(Number(matched[3] ?? 0))).padStart(2, '0');
  return `${sign}${hours}:${minutes}`;
}

/**
 * 面板域时间戳 → 出站 timestamp。
 *
 * 约定：panel 的 `new Date(panelTs)` 的 local 字段就是用户在面板上看到的 wall clock
 * （例：用户点的 2026-04-20 00:00:00，getFullYear/Month/... 读出来就是这些字段，
 * 与浏览器所处的真实时区是哪一个无关）。
 *
 *  - 传 timezone：把这个 wall clock 解释成“商户时区的本地时间”，再换算成真实 UTC。
 *    例：面板 2026-04-20 00:00:00，商户 UTC+5:30 → 2026-04-19T18:30:00Z
 *  - 未传 timezone：按旧的 UTC+0 字面协议编码（与 NDatePicker 原生行为兼容），
 *    保留给尚未接入商户时区的调用方。
 */
export function panelToExternalTimestamp(
  panelTs: number,
  tz?: null | string,
): number {
  if (!Number.isFinite(panelTs)) return panelTs;
  const normalized = normalizeTimezone(tz);
  if (normalized) {
    // fromZonedTime 通过 Date 的 local 字段（getFullYear/Month/...）取 wall clock，
    // 与面板所存的 local 字段一致，因此直接传 Date 即可。
    return fromZonedTime(new Date(panelTs), normalized).getTime();
  }
  const d = new Date(panelTs);
  return Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds(),
  );
}

/**
 * 出站 timestamp → 面板域时间戳（与 `panelToExternalTimestamp` 互逆）。
 *
 * 结果的 `new Date(panelTs)` 的 local 字段就是要在面板/触发器上展示的 wall clock：
 * 浏览器在任何时区运行，面板读出来的都是那个字面（例：2026-04-20 00:00:00），
 * 触发器的 format 也会照抄同一字面，避免上下错位。
 *
 *  - 传 timezone：把真实 UTC 转成商户时区的 wall clock；`toZonedTime` 返回的 Date
 *    本身就把这些 wall clock 字段写在 local 位上（setFullYear/setHours 是 local 方法），
 *    所以直接取 `.getTime()` 作为面板 ts 即可，不要再去读 UTC 字段重建，否则会把
 *    浏览器时区差再叠加一次。
 *  - 未传 timezone：按旧 UTC+0 字面协议解码。
 */
export function externalToPanelTimestamp(
  extTs: number,
  tz?: null | string,
): number {
  if (!Number.isFinite(extTs)) return extTs;
  const normalized = normalizeTimezone(tz);
  if (normalized) {
    return toZonedTime(extTs, normalized).getTime();
  }
  const d = new Date(extTs);
  return new Date(
    d.getUTCFullYear(),
    d.getUTCMonth(),
    d.getUTCDate(),
    d.getUTCHours(),
    d.getUTCMinutes(),
    d.getUTCSeconds(),
    d.getUTCMilliseconds(),
  ).getTime();
}
