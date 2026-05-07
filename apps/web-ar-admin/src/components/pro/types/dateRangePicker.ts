/* oxlint-disable */
import type { QuickDateItem } from './quickDate';

export interface DateRangeValue {
  start: number;
  end: number;
}

/** 日期范围选择器的快捷项。结构与 `QuickDateItem` 一致，保留独立类型名仅用于语义区分 */
export type ShortcutItem = QuickDateItem;

/**
 * 日期范围选择器快捷项配置。
 * - false：隐藏快捷按钮
 * - true / undefined：显示内部默认快捷项
 * - ShortcutItem[]：显示外部自定义快捷项
 */
export type DateRangeShortcuts = boolean | ShortcutItem[];

/** 日期范围选择器内置快捷项集合 */
export type DateRangeShortcutPreset = 'default' | 'report' | 'simple';

/** 默认选中的快捷项 key。自定义 shortcuts 时允许传入自定义 key。 */
export type DateRangeDefaultShortcut =
  | 'last3Days'
  | 'last7Days'
  | 'last15Days'
  | 'last30Days'
  | 'last90Days'
  | 'lastMonth'
  | 'lastWeek'
  | 'thisMonth'
  | 'thisWeek'
  | 'today'
  | 'yesterday'
  | (string & {});

/**
 * 日期范围选择器时区入参。
 * - string：强制使用该自定义时区
 * - false：强制 UTC，不读取 CrudTable 上下文和当前默认商户
 * - null / undefined：未显式设置，先读 CrudTable 上下文，再回退当前默认商户时区
 */
export type DateRangeTimezone = false | null | string;

export interface ProDateRangePickerProps {
  /** 当前值 [start, end]。number 元组用于 timestamp 模式；string 元组仅 valueFormat='string' 时生效 */
  value?: [number, number] | [string, string] | null;
  /**
   * 出站格式。
   *  - 'timestamp'（默认）：emit 毫秒时间戳
   *     · 传了 `timezone`：真实 UTC（面板 wall clock 按商户时区解释）
   *     · 没传 `timezone`：UTC+0 字面协议（面板 wall clock 字段原样编码成 UTC 字段）
   *  - 'string'：emit 按 `valueStringPattern` 格式化的字符串，**不做任何时区处理**（面板读出来啥字面就是啥字面）
   */
  valueFormat?: 'string' | 'timestamp';
  /**
   * valueFormat='string' 时输出/解析的字符串格式。
   * 不传时自动 fallback 到 `displayFormat`（让"UI 显示粒度 = form 存储粒度"这一最常见场景只声明一次）；
   * 两者都不传才走最终默认 `'yyyy-MM-dd HH:mm:ss'`。
   */
  valueStringPattern?: string;
  /** 商户时区。仅 valueFormat='timestamp' 时生效；具体优先级见 DateRangeTimezone。 */
  timezone?: DateRangeTimezone;
  /** 最大可选天数 */
  maxDays?: number;
  /** 是否允许选择未来日期 */
  allowFuture?: boolean;
  /** 快捷选项：false 隐藏，true/不传显示默认，数组使用外部自定义 */
  shortcuts?: DateRangeShortcuts;
  /** 默认快捷选项集合: default | report | simple */
  shortcutPreset?: DateRangeShortcutPreset;
  /** 初始为空时按快捷项 key 写入默认区间，例如 today / yesterday */
  defaultShortcut?: DateRangeDefaultShortcut;
  /** 是否显示时分秒选择 */
  showTime?: boolean;
}
