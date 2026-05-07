/* oxlint-disable */
/**
 * Pro 日期范围触发器的共用 hook 集合。
 *
 * 本文件集中管理 ProDateRangeInput / ProSelectDateRange 两个触发器组件的共享逻辑。
 * 日期面板本体已经迁移到 `composables/useZonedDateRange`。
 *
 *   1. Types            —— 公用类型（`RangeValue`）
 *   2. Pure helpers     —— 触发器显示用纯工具函数（resolveTs）
 *   3. Timezone helper  —— 外层 prop + inject 兜底 —— 文件私有
 *   4. Public composable `useDateRangeTrigger`
 *                         被 ProDateRangeInput / ProSelectDateRange 使用，管触发器层的显示、
 *                         string 规范化、tz 切换重算
 *
 * 不对外暴露的工具都以小写命名的函数形式存在，通过 public composable 间接使用。
 */

import type { ComputedRef, Ref } from 'vue';

import type { DateRangeTimezone } from '../types';

import { computed, watch } from 'vue';

import { format, parse } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

import { useTenantOptions } from '#/hooks';

import { useProCrudTableContextSafe } from '../context/crudTableContext';
import { externalToPanelTimestamp, normalizeTimezone } from './tzUtils';

// ============================================================================
// 1. Types
// ============================================================================

/**
 * 共用的区间值类型。
 *
 * - `[number, number]` — timestamp 模式的毫秒时间戳元组
 * - `[string, string]` — string 模式按 `valueStringPattern` 格式化的字符串元组
 * - `null` — 未选择
 */
export type RangeValue = [number, number] | [string, string] | null;

// ============================================================================
// 2. Pure helpers（文件私有，无响应式）
// ============================================================================

/**
 * 把 `string | number` 形式的值解析成 epoch 毫秒 ts。
 *
 * - number：有限数直接返回，`NaN` / `Infinity` → `null`
 * - string：按 `pattern` parse；parse 失败 → `null`
 *
 * 用于 `formatItem` 和 `toPanelRange` 里统一处理"外部值 → ts"。
 */
function resolveTs(v: number | string, pattern: string): null | number {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  const ts = parse(v, pattern, new Date()).getTime();
  return Number.isNaN(ts) ? null : ts;
}

// ============================================================================
// 3. Timezone helper（文件私有）
// ============================================================================

/**
 * 合成"实际生效的时区"：
 *  - 外层显式传入 string 时取它
 *  - 外层显式传入 false 时强制 UTC，不读 CrudTable 上下文和默认商户
 *  - 未显式设置时先读最近祖先 ProCrudTable 的 context.timezoneId
 *  - CrudTable 未设置时回退当前默认商户时区
 *  - 都取不到 → null（面板走 UTC）
 */
export function useEffectiveDateRangeTimezone(
  propTimezone: Ref<DateRangeTimezone | undefined>,
): ComputedRef<null | string> {
  const ctx = useProCrudTableContextSafe();
  const { defaultTenantId, getTenantTimeZone } = useTenantOptions();

  return computed<null | string>(() => {
    const raw = propTimezone.value;
    if (raw === false) return null;
    if (typeof raw === 'string' && raw.trim()) return raw;
    if (ctx?.timezoneId.value) return ctx.timezoneId.value;

    const tenantId = defaultTenantId.value;
    return tenantId == null ? null : getTenantTimeZone(tenantId) || null;
  });
}

// ============================================================================
// 4. Public: useDateRangeTrigger（触发器层共用）
// ============================================================================

/**
 * `useDateRangeTrigger` 的选项。
 *
 * `value` 和 `externalValue` 是两个概念，主要为 `ProDateRangeInput` 区分"本地 modelValue"
 * 和"props.value"而存在：
 *  - `value`：触发器要显示的当前值，以及 tz 切换重算时的值来源
 *  - `externalValue`：真正的"外部入站"值，仅用于 string 规范化 watch
 *
 * `ProSelectDateRange` 没有本地 ref，两者都指向同一个 `props.dateValue`。
 */
export interface UseDateRangeTriggerOptions {
  /** 触发器显示用的当前值（Input 的 modelValue 或 SelectDateRange 的 props.dateValue） */
  value: Ref<RangeValue>;
  /** 规范化 watch 监听源（一般是外部 prop） */
  externalValue: Ref<RangeValue>;
  valueFormat: Ref<'string' | 'timestamp'>;
  valueStringPattern: Ref<string>;
  displayFormat: Ref<string>;
  /** 外层显式传入的 timezone（优先级 > inject 兜底 > 默认商户） */
  propTimezone: Ref<DateRangeTimezone | undefined>;

  /**
   * string 模式下入站是 number 元组时的规范化回调。
   * 外层决定怎么把规范化结果落盘（commitValue / emit update:value / emit update:dateValue）。
   */
  onStringNormalize: (normalized: [string, string]) => void;
}

/**
 * 触发器侧共用状态机。ProDateRangeInput 和 ProSelectDateRange 都使用。
 *
 * 负责 3 件事：
 *   1. 合成 `effectiveTimezone`（显式 prop > ProCrudTable.context.timezoneId > 默认商户）
 *   2. `startDisplay` / `endDisplay` 按 `valueFormat` + `timezone` 格式化触发器文本
 *   3. string 模式下入站 number 元组自动规范化成 string 元组（保证 form 字段类型稳定）
 *
 * 不负责：popover 开关、清除按钮、面板内部交互（那些是外壳组件和 zoned panel 的事）。
 * 不负责切 tz 时写回 modelValue；默认值重置由输入组件外壳处理。
 *
 * @example
 * ```ts
 * const { pickerTimezone, startDisplay, endDisplay } = useDateRangeTrigger({
 *   value: modelValue,
 *   externalValue: toRef(props, 'value'),
 *   valueFormat: toRef(props, 'valueFormat'),
 *   ...
 *   onStringNormalize: (normalized) => commitValue(normalized),
 * });
 * ```
 */
export function useDateRangeTrigger(opts: UseDateRangeTriggerOptions) {
  const effectiveTimezone = useEffectiveDateRangeTimezone(opts.propTimezone);
  const pickerTimezone = computed<DateRangeTimezone>(() =>
    opts.propTimezone.value === false ? false : effectiveTimezone.value,
  );

  // `normalizeTimezone` 的结果做成 computed 缓存：
  // `formatItem` 在 startDisplay/endDisplay 里各调一次，memoize 后每次面板渲染只执行 1 次
  const normalizedTimezone = computed(() =>
    normalizeTimezone(effectiveTimezone.value),
  );

  /**
   * 单侧值格式化。三条路径：
   *  A. 不走时区：`valueFormat='string'` 或 timestamp 模式收到 string 值 —— 走 `resolveTs + format`
   *  B. 商户时区：timestamp 模式 + number 值 + 有 tz —— 走 `formatInTimeZone`
   *  C. UTC+0 字面协议：timestamp 模式 + number 值 + 无 tz（legacy）
   */
  function formatItem(v: number | string): string {
    try {
      const pattern = opts.displayFormat.value;
      if (opts.valueFormat.value === 'string' || typeof v === 'string') {
        const ts = resolveTs(v, opts.valueStringPattern.value);
        if (ts === null) return typeof v === 'string' ? v : '';
        return format(ts, pattern);
      }
      if (!Number.isFinite(v)) return '';
      const tz = normalizedTimezone.value;
      if (tz) return formatInTimeZone(v, tz, pattern);
      return format(externalToPanelTimestamp(v, null), pattern);
    } catch (error) {
      console.warn('[useDateRangeTrigger] formatItem failed', error);
      return '';
    }
  }

  const startDisplay = computed(() => {
    const v = opts.value.value;
    return v && v.length === 2 ? formatItem(v[0]) : '';
  });
  const endDisplay = computed(() => {
    const v = opts.value.value;
    return v && v.length === 2 ? formatItem(v[1]) : '';
  });

  // string 模式下入站 number 元组：规范化成 string 元组回写，保证字段类型稳定
  watch(
    () => opts.externalValue.value,
    (val) => {
      if (
        opts.valueFormat.value !== 'string' ||
        !Array.isArray(val) ||
        val.length !== 2 ||
        typeof val[0] !== 'number' ||
        typeof val[1] !== 'number'
      ) {
        return;
      }
      opts.onStringNormalize([
        format(val[0], opts.valueStringPattern.value),
        format(val[1], opts.valueStringPattern.value),
      ]);
    },
    { immediate: true },
  );

  // 时区切换的默认值重置由 ProDateRangeInput 处理；这里仅提供 pickerTimezone 和展示文本。

  return {
    effectiveTimezone,
    pickerTimezone,
    startDisplay,
    endDisplay,
  };
}
