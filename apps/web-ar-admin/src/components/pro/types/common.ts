/* oxlint-disable */
import type { FormItemRule, SelectOption } from 'naive-ui';

import type { Component, ComputedRef, Ref, VNode } from 'vue';

// ============== 工具类型 ==============

/** 深度可选 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/** 可能是 Ref */
export type MaybeRef<T> = Ref<T> | T;

/** 可能是 ComputedRef */
export type MaybeComputedRef<T> = ComputedRef<T> | T;

/** 记录类型 */
export type Recordable<T = any> = Record<string, T>;

/** 可空类型 */
export type Nullable<T> = null | T;

/** 函数类型 */
export type Fn<T = any, R = void> = (...args: T[]) => R;

/** 异步函数类型 */
export type AsyncFn<T = any, R = void> = (...args: T[]) => Promise<R>;

// ============== 字段值类型 ==============

export type ProFieldValueType =
  | 'cascader'
  | 'cascadeSelect'
  | 'checkbox'
  | 'checkboxGroup'
  | 'color'
  | 'custom'
  | 'date'
  | 'dateRange'
  | 'datetime'
  | 'datetimeRange'
  | 'dictSelect'
  | 'month'
  | 'multiSelect'
  | 'number'
  | 'password'
  | 'proDateRange'
  | 'proSelectDateRange'
  | 'quarter'
  | 'radio'
  | 'radioGroup'
  | 'rate'
  | 'select'
  | 'slider'
  | 'switch'
  | 'tenantSelect'
  | 'text'
  | 'textarea'
  | 'time'
  | 'timeRange'
  | 'treeSelect'
  | 'upload'
  | 'week'
  | 'year';

// ============== 组件类型 ==============

export type ProComponentType =
  | 'DictSelect'
  | 'NAutoComplete'
  | 'NCascader'
  | 'NCheckbox'
  | 'NCheckboxGroup'
  | 'NColorPicker'
  | 'NDatePicker'
  | 'NDynamicTags'
  | 'NInput'
  | 'NInputNumber'
  | 'NMention'
  | 'NRadio'
  | 'NRadioGroup'
  | 'NRate'
  | 'NSelect'
  | 'NSlider'
  | 'NSwitch'
  | 'NTimePicker'
  | 'NTransfer'
  | 'NTreeSelect'
  | 'NUpload'
  | 'ProCascadeSelect'
  | 'ProDateRangeInput'
  | 'ProSelectDateRange'
  | 'TenantSelect'
  | Component;

// ============== 选项类型 ==============

export interface ProOptionItem<V = any> {
  label: string;
  value: V;
  disabled?: boolean;
  children?: ProOptionItem<V>[];
  [key: string]: any;
}

/** 异步选项加载器 */
export type ProAsyncOptions<V = any> =
  | ((params?: Recordable) => Promise<ProOptionItem<V>[] | SelectOption[]>)
  | ProOptionItem<V>[]
  | SelectOption[];

/** 字段映射配置 */
export interface ProFieldMapping {
  label?: string;
  value?: string;
  children?: string;
  disabled?: string;
}

// ============== 验证类型 ==============

export interface ProValidationRule extends FormItemRule {
  /** 异步验证器 */
  asyncValidator?: (
    value: any,
    rule: ProValidationRule,
    callback: (error?: Error) => void,
  ) => Promise<void>;
  /** 条件验证 */
  when?: (formModel: Recordable) => boolean;
  /** 值转换 */
  transform?: (value: any) => any;
  /** 消息模板 */
  messageTemplate?: string;
  /** 优先级 */
  priority?: number;
}

/** 验证结果 */
export interface ProValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

/** 验证状态 */
export interface ProValidationState {
  isValid: boolean;
  isValidating: boolean;
  errors: string[];
  warnings: string[];
}

// ============== 值枚举类型 ==============

export interface ProValueEnumItem {
  text: string;
  status?: 'default' | 'error' | 'info' | 'processing' | 'success' | 'warning';
  color?: string;
  disabled?: boolean;
}

export type ProValueEnum = Record<number | string, ProValueEnumItem | string>;

// ============== 事件类型 ==============

export interface ProFormEvents<T = Recordable> {
  submit: (values: T) => void;
  reset: (values: T) => void;
  valuesChange: (changedValues: Partial<T>, allValues: T) => void;
  validateFail: (errors: Recordable<string[]>) => void;
}

export interface ProTableEvents<T = Recordable> {
  fetchSuccess: (result: { items: T[]; total: number }) => void;
  fetchError: (error: Error) => void;
  rowClick: (row: T, index: number) => void;
  rowDblclick: (row: T, index: number) => void;
  selectionChange: (keys: (number | string)[], rows: T[]) => void;
}

// ============== 布局类型 ==============

export type ProFormLayout = 'horizontal' | 'inline' | 'vertical';
export type ProLabelPlacement = 'left' | 'top';
export type ProLabelAlign = 'left' | 'right';
export type ProSize = 'large' | 'medium' | 'small';

// ============== 触发器类型 ==============

export type ProValidateTrigger = 'blur' | 'change' | 'focus' | 'input';

// ============== 通用回调类型 ==============

export type ProTransformFn<T = any, R = any> = (value: T) => R;
export type ProRenderFn<T = any> = (
  context: T,
) => null | string | VNode | VNode[];
