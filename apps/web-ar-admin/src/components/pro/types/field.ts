/* oxlint-disable */
import type { FormItemProps, GridItemProps } from 'naive-ui';

import type { VNode } from 'vue';

import type {
  ProAsyncOptions,
  ProComponentType,
  ProFieldMapping,
  ProFieldValueType,
  ProTransformFn,
  ProValidationRule,
  Recordable,
} from './common';

/**
 * ProField Schema 定义
 * @template T 表单数据类型
 * @template K 字段键类型
 */
export interface ProFieldSchema<
  T extends Recordable = Recordable,
  K extends keyof T = keyof T,
> {
  /** 字段路径 (支持嵌套路径如 'user.name') */
  path: K | string;

  /** 显示标签 */
  label?: string;

  /** 标签提示信息 */
  labelMessage?: string;

  /** 标签宽度 */
  labelWidth?: number | string;

  /** 值类型 (用于自动选择组件) */
  valueType?: ProFieldValueType;

  /** 显式指定组件类型 */
  component?: ProComponentType;

  /** 组件属性 (支持函数动态计算) */
  componentProps?: ((formModel: T) => Recordable) | Recordable;

  /** 默认值 */
  defaultValue?: T[K];

  /** 验证规则 */
  rules?: ProValidationRule | ProValidationRule[];

  /** 是否必填 (自动添加必填规则) */
  required?: boolean;

  /** 必填提示消息 */
  requiredMessage?: string;

  /** 占位符文本 */
  placeholder?: [string, string] | string;

  /** 字段下方帮助文本 */
  help?: string;

  /** 字段后额外内容 */
  extra?: (() => VNode) | string;

  /** 标签 tooltip */
  tooltip?: string;

  /** 选项数据 (select/checkbox/radio) */
  options?: ProAsyncOptions;

  /** 选项字段映射 */
  fieldMapping?: ProFieldMapping;

  /** 条件显示 */
  show?: ((formModel: T) => boolean) | boolean;

  /** 条件禁用 */
  disabled?: ((formModel: T) => boolean) | boolean;

  /** 只读模式 */
  readonly?: ((formModel: T) => boolean) | boolean;

  /** 自定义渲染函数 */
  render?: (context: ProFieldRenderContext<T, K>) => VNode;

  /** 自定义插槽名称 */
  slot?: string;

  /** 字段后插槽名称 */
  suffix?: string;

  /** Grid Item 属性 */
  giProps?: Partial<GridItemProps>;

  /** 是否占满整行 */
  isFull?: boolean;

  /** 依赖字段 (用于响应式更新) */
  dependencies?: (keyof T)[];

  /** 值显示转换 (存储值 -> 显示值) */
  transformIn?: ProTransformFn<T[K], any>;

  /** 值存储转换 (显示值 -> 存储值) */
  transformOut?: ProTransformFn<any, T[K]>;

  /** 表单项属性透传 */
  formItemProps?: Partial<FormItemProps>;

  /** 权限控制 */
  auth?: string | string[];

  /** 列跨度 */
  span?: number;

  /** 排序 */
  order?: number;
}

/**
 * ProField 渲染上下文
 */
export interface ProFieldRenderContext<
  T extends Recordable = Recordable,
  K extends keyof T = keyof T,
> {
  /** 当前表单数据 */
  formModel: T;
  /** 字段路径 */
  field: K;
  /** 当前字段值 */
  value: T[K];
  /** 设置字段值 */
  setValue: (value: T[K]) => void;
  /** 是否禁用 */
  disabled: boolean;
  /** 是否只读 */
  readonly: boolean;
  /** 组件属性 */
  componentProps: Recordable;
}

/**
 * ProField 组件 Props
 */
export interface ProFieldProps<_T extends Recordable = Recordable> {
  /** 字段路径 */
  path: string;

  /** 显示标签 */
  label?: string;

  /** 标签提示信息 */
  labelMessage?: string;

  /** 标签宽度 */
  labelWidth?: number | string;

  /** 值类型 */
  valueType?: ProFieldValueType;

  /** 组件类型 */
  component?: ProComponentType;

  /** 组件属性 */
  componentProps?: Recordable;

  /** 验证规则 */
  rules?: ProValidationRule | ProValidationRule[];

  /** 是否必填 */
  required?: boolean;

  /** 占位符 */
  placeholder?: [string, string] | string;

  /** 选项数据 */
  options?: ProAsyncOptions;

  /** 选项字段映射 */
  fieldMapping?: ProFieldMapping;

  /** 是否显示 */
  show?: boolean;

  /** 是否禁用 */
  disabled?: boolean;

  /** 是否只读 */
  readonly?: boolean;

  /** Grid Item 属性 */
  giProps?: Partial<GridItemProps>;

  /** 是否占满整行 */
  isFull?: boolean;

  /** 值显示转换 */
  transformIn?: ProTransformFn;

  /** 值存储转换 */
  transformOut?: ProTransformFn;

  /** 表单项属性 */
  formItemProps?: Partial<FormItemProps>;
}

/**
 * ProField 实例方法
 */
export interface ProFieldInstance {
  /** 获取字段值 */
  getValue: () => any;
  /** 设置字段值 */
  setValue: (value: any) => void;
  /** 验证字段 */
  validate: () => Promise<boolean>;
  /** 清除验证 */
  clearValidate: () => void;
  /** 重置字段 */
  reset: () => void;
  /** 聚焦 */
  focus: () => void;
  /** 失焦 */
  blur: () => void;
}

/**
 * 字段注册信息
 */
export interface ProFieldRegistration {
  path: string;
  instance: ProFieldInstance;
  schema: ProFieldSchema;
}

/**
 * 值类型到组件的映射
 */
export const VALUE_TYPE_COMPONENT_MAP: Record<
  ProFieldValueType,
  ProComponentType
> = {
  text: 'NInput',
  password: 'NInput',
  textarea: 'NInput',
  number: 'NInputNumber',
  select: 'NSelect',
  multiSelect: 'NSelect',
  tenantSelect: 'TenantSelect',
  dictSelect: 'DictSelect',
  date: 'NDatePicker',
  dateRange: 'NDatePicker',
  datetime: 'NDatePicker',
  datetimeRange: 'NDatePicker',
  time: 'NTimePicker',
  timeRange: 'NTimePicker',
  week: 'NDatePicker',
  month: 'NDatePicker',
  year: 'NDatePicker',
  quarter: 'NDatePicker',
  checkbox: 'NCheckbox',
  checkboxGroup: 'NCheckboxGroup',
  radio: 'NRadio',
  radioGroup: 'NRadioGroup',
  switch: 'NSwitch',
  cascader: 'NCascader',
  cascadeSelect: 'ProCascadeSelect',
  treeSelect: 'NTreeSelect',
  upload: 'NUpload',
  slider: 'NSlider',
  rate: 'NRate',
  color: 'NColorPicker',
  custom: 'NInput',
  proDateRange: 'ProDateRangeInput',
  proSelectDateRange: 'ProSelectDateRange',
};

/**
 * 值类型到默认组件属性的映射
 */
export const VALUE_TYPE_PROPS_MAP: Partial<
  Record<ProFieldValueType, Recordable>
> = {
  password: { type: 'password', showPasswordOn: 'click' },
  textarea: { type: 'textarea', rows: 3 },
  number: { style: { width: '100%' } },
  multiSelect: { multiple: true },
  dateRange: { type: 'daterange' },
  datetime: { type: 'datetime' },
  datetimeRange: { type: 'datetimerange' },
  timeRange: { type: 'timerange' },
  week: { type: 'week' },
  month: { type: 'month' },
  year: { type: 'year' },
  quarter: { type: 'quarter' },
};
