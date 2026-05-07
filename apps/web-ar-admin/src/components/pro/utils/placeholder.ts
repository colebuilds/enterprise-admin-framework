/* oxlint-disable */
import type { ProComponentType, ProFieldValueType } from '../types';

import { i18n } from '#/i18n';

// 必须用函数式 alias 而非顶层解构 i18n.global —— Rolldown 在 manualChunks 拆分下，
// 业务 chunk 反向 import @/i18n 容易触发 ESM 循环 + TDZ，顶层读 .global 会得到 undefined。
// 重载形式让无参调用直接走 i18n.global.t(key)，避免传 undefined。
function t(key: string): string;
function t(key: string, named: Record<string, unknown>): string;
function t(key: string, named?: Record<string, unknown>): string {
  return named === undefined ? i18n.global.t(key) : i18n.global.t(key, named);
}

/**
 * 输入类组件
 */
const INPUT_COMPONENTS: ProComponentType[] = [
  'NInput',
  'NInputNumber',
  'NAutoComplete',
  'NMention',
];

/**
 * 选择类组件
 */
const SELECT_COMPONENTS: ProComponentType[] = [
  'NSelect',
  'TenantSelect',
  'DictSelect',
  'NDatePicker',
  'NTimePicker',
  'NCascader',
  'NTreeSelect',
  'NCheckbox',
  'NCheckboxGroup',
  'NRadio',
  'NRadioGroup',
  'NSwitch',
  'NColorPicker',
  'NTransfer',
];

/**
 * 根据组件类型生成占位符
 */
export function createPlaceholder(
  component: ProComponentType,
  label?: string,
): string {
  const isInput = INPUT_COMPONENTS.includes(component as any);
  const isSelect = SELECT_COMPONENTS.includes(component as any);

  if (isInput) {
    return label
      ? t('common.input_placeholder', { label })
      : t('common.please_input');
  }

  if (isSelect) {
    return label
      ? t('common.select_placeholder', { label })
      : t('common.please_select');
  }

  return '';
}

/**
 * 根据值类型生成占位符
 */
export function createPlaceholderByValueType(
  valueType: ProFieldValueType,
  label?: string,
): [string, string] | string {
  switch (valueType) {
    case 'cascader':
    case 'checkbox':
    case 'checkboxGroup':
    case 'dictSelect':

    case 'multiSelect':
    case 'radio':
    case 'radioGroup':
    case 'select':
    case 'switch':
    case 'tenantSelect':
    case 'treeSelect': {
      return label
        ? t('common.select_placeholder', { label })
        : t('common.please_select');
    }
    case 'date':
    case 'datetime':
    case 'month':
    case 'quarter':

    case 'time':
    case 'week':
    case 'year': {
      return label
        ? t('common.select_placeholder', { label })
        : t('common.please_select');
    }
    case 'dateRange':
    case 'datetimeRange':
    case 'timeRange': {
      return [t('common.start_placeholder'), t('common.end_placeholder')];
    }
    case 'number':

    case 'password':
    case 'text':
    case 'textarea': {
      return label
        ? t('common.input_placeholder', { label })
        : t('common.please_input');
    }

    default: {
      return '';
    }
  }
}

/**
 * 获取日期格式
 */
export function getDateFormat(valueType: ProFieldValueType): string {
  switch (valueType) {
    case 'date':
    case 'dateRange': {
      return 'yyyy-MM-dd';
    }
    case 'datetime':
    case 'datetimeRange': {
      return 'yyyy-MM-dd HH:mm:ss';
    }
    case 'month': {
      return 'yyyy-MM';
    }
    case 'quarter': {
      return 'yyyy-QQQ';
    }
    case 'time':
    case 'timeRange': {
      return 'HH:mm:ss';
    }
    case 'week': {
      return 'yyyy-ww';
    }
    case 'year': {
      return 'yyyy';
    }
    default: {
      return 'yyyy-MM-dd';
    }
  }
}

/**
 * 获取日期选择器类型
 */
export function getDatePickerType(
  valueType: ProFieldValueType,
):
  | 'date'
  | 'daterange'
  | 'datetime'
  | 'datetimerange'
  | 'month'
  | 'quarter'
  | 'week'
  | 'year' {
  switch (valueType) {
    case 'date': {
      return 'date';
    }
    case 'dateRange': {
      return 'daterange';
    }
    case 'datetime': {
      return 'datetime';
    }
    case 'datetimeRange': {
      return 'datetimerange';
    }
    case 'month': {
      return 'month';
    }
    case 'quarter': {
      return 'quarter';
    }
    case 'week': {
      return 'week';
    }
    case 'year': {
      return 'year';
    }
    default: {
      return 'date';
    }
  }
}

/**
 * 获取时间选择器格式
 */
export function getTimePickerFormat(valueType: ProFieldValueType): string {
  switch (valueType) {
    case 'time':
    case 'timeRange': {
      return 'HH:mm:ss';
    }
    default: {
      return 'HH:mm:ss';
    }
  }
}

/**
 * 生成必填规则消息
 */
export function createRequiredMessage(label?: string): string {
  if (label) {
    return t('common.required_placeholder', { label });
  }
  return t('common.required_field');
}

/**
 * 生成长度验证消息
 */
export function createLengthMessage(min: number, max: number): string {
  return t('common.length_range', { min, max });
}

/**
 * 生成范围验证消息
 */
export function createRangeMessage(min: number, max: number): string {
  return t('common.value_range', { min, max });
}

/**
 * 常用正则表达式
 */
export const PATTERNS = {
  /** 邮箱 */
  email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
  /** 手机号 */
  phone: /^1[3-9]\d{9}$/,
  /** URL */
  url: /^https?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/,
  /** 身份证 */
  idCard: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
  /** 中文 */
  chinese: /^[\u4E00-\u9FA5]+$/,
  /** 英文 */
  english: /^[a-zA-Z]+$/,
  /** 数字 */
  number: /^\d+$/,
  /** 字母数字 */
  alphanumeric: /^[a-zA-Z0-9]+$/,
  /** 用户名 (字母、数字、下划线) */
  username: /^[a-zA-Z0-9_]+$/,
  /** IP 地址 */
  ip: /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/,
  /** MAC 地址 */
  mac: /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/,
};
