/* oxlint-disable */
/**
 * ProField 字段尺寸规格表
 *
 * 定义每种 valueType 的三档宽度约束（纯组件宽度，不含 label）。
 * 实际布局时由 useResponsiveGrid.getColumnSizeBounds 加上 labelBudget 得到整体宽度。
 *
 * - min:       压缩�����，低于此值组件���可用
 * - preferred: 理想宽度，内容展示最佳
 * - max:       拉伸极限，超过此值浪费空间（0 = 无限制，可撑满容器）
 * - fixed:     是否固定宽度，不参与弹性分配
 */
import type { Recordable } from '../../types';

export interface FieldSizeSpec {
  min: number;
  preferred: number;
  max: number;
  fixed?: boolean;
}

type SizeResolver = (componentProps?: Recordable) => FieldSizeSpec;

// ===================== 操作按钮规格 =====================

export const ACTIONS_SPEC: FieldSizeSpec = {
  min: 120,
  preferred: 160,
  max: 200,
};

// ===================== 字段尺寸规格表 =====================
// 纯组件宽度（不含 label），布局时由 getColumnSizeBounds 叠加 labelBudget

const FIELD_SIZE_MAP: Record<string, FieldSizeSpec | SizeResolver> = {
  // ---- 文本输入 ----
  text: { min: 140, preferred: 200, max: 320 },
  password: { min: 140, preferred: 200, max: 320 },
  textarea: { min: 200, preferred: 280, max: 400 },
  number: { min: 100, preferred: 140, max: 220 },

  // ---- 选择（与 text 保持一致，同行视觉对齐） ----
  select: { min: 140, preferred: 200, max: 320 },
  multiSelect: { min: 160, preferred: 220, max: 340 },
  tenantSelect: { min: 140, preferred: 200, max: 320 },
  dictSelect: { min: 140, preferred: 200, max: 320 },

  // ---- 单日期/时间 ----
  date: { min: 140, preferred: 180, max: 220 }, // 2026-04-03
  datetime: { min: 200, preferred: 240, max: 300 }, // 2026-04-03 14:30:45
  time: { min: 100, preferred: 140, max: 180 }, // 14:30:45
  week: { min: 120, preferred: 160, max: 200 }, // 2026-14周
  month: { min: 120, preferred: 160, max: 200 }, // 2026-04
  year: { min: 80, preferred: 120, max: 160 }, // 2026
  quarter: { min: 120, preferred: 160, max: 200 }, // 2026-Q2

  // ---- 日期/时间区间 ----
  dateRange: { min: 260, preferred: 320, max: 400 }, // 2026-04-03 ~ 2026-04-10
  datetimeRange: { min: 340, preferred: 400, max: 480 }, // 2026-04-03 14:30:45 ~ ...
  timeRange: { min: 200, preferred: 240, max: 300 }, // 14:30:45 ~ 23:59:59

  // ---- ProDateRangePicker（根据 showTime 动态） ----
  proDateRange: (props) => {
    // showTime 在 ProDateRangeInput 中默认为 true，仅显式传 false 时走窄规格
    if (props?.showTime !== false) {
      return { min: 300, preferred: 350, max: 350 }; // datetime range display
    }
    return { min: 180, preferred: 200, max: 200 }; // date range display
  },

  // ---- ProSelectDateRange（select + date input 组合） ----
  proSelectDateRange: (props) => {
    const selectW = props?.selectWidth ?? 80;
    // showTime 在 ProSelectDateRange 中默认为 true，仅显式传 false 时走窄规格
    if (props?.showTime !== false) {
      return {
        min: selectW + 300,
        preferred: selectW + 350,
        max: selectW + 350,
      };
    }
    return { min: selectW + 180, preferred: selectW + 200, max: selectW + 200 };
  },

  // ---- 开关/选项组 ----
  checkbox: { min: 20, preferred: 40, max: 120 },
  checkboxGroup: { min: 140, preferred: 200, max: 320 },
  radio: { min: 20, preferred: 40, max: 120 },
  radioGroup: { min: 140, preferred: 200, max: 320 },
  switch: { min: 40, preferred: 40, max: 40, fixed: true },

  // ---- 树/级联 ----
  cascader: { min: 180, preferred: 240, max: 340 },
  treeSelect: { min: 180, preferred: 240, max: 340 },

  // ---- 其他 ----
  upload: { min: 200, preferred: 280, max: 400 },
  slider: { min: 160, preferred: 220, max: 280 },
  rate: { min: 80, preferred: 120, max: 160 },
  color: { min: 40, preferred: 60, max: 80 },
  custom: { min: 140, preferred: 200, max: 320 },
};

// ===================== 默认规格 =====================

const DEFAULT_SPEC: FieldSizeSpec = { min: 140, preferred: 200, max: 320 };

// ===================== 查询接口 =====================

/**
 * 获取字段尺寸规格（纯组件宽度，不含 label）
 */
export function getFieldSizeSpec(
  valueType: string | undefined,
  componentProps?: ((model: Recordable) => Recordable) | Recordable,
): FieldSizeSpec {
  if (!valueType) return DEFAULT_SPEC;

  const spec = FIELD_SIZE_MAP[valueType];
  if (!spec) return DEFAULT_SPEC;

  if (typeof spec === 'function') {
    const resolved =
      typeof componentProps === 'function'
        ? componentProps({})
        : componentProps;
    return spec(resolved || {});
  }
  return spec;
}

/**
 * 获取字段最小宽度（兼容旧接口）
 */
export function getFieldMinWidth(
  valueType: string | undefined,
  componentProps?: ((model: Recordable) => Recordable) | Recordable,
): number {
  return getFieldSizeSpec(valueType, componentProps).min;
}
