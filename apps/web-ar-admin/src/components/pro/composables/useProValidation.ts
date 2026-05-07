/* oxlint-disable */
import type { ComputedRef, Ref } from 'vue';

import type {
  ProValidationRule,
  ProValidationState,
  Recordable,
} from '../types';

import { computed, ref } from 'vue';

import { debounce } from 'lodash-es';

import { i18n } from '#/i18n';

const t = (key: string, params: Record<string, unknown> = {}): string =>
  String(i18n.global.t(key, params));

export interface UseProValidationOptions {
  /** 表单模型 */
  formModel: Ref<Recordable>;

  /** 验证规则 */
  rules: ComputedRef<Record<string, ProValidationRule[]>>;

  /** 验证策略 */
  strategy?: 'all' | 'first' | 'firstError';

  /** 去抖时间 */
  debounceMs?: number;

  /** 滚动到错误 */
  scrollToError?: boolean;
}

export interface UseProValidationReturn {
  /** 验证单个字段 */
  validateField: (
    field: string,
  ) => Promise<{ errors: string[]; isValid: boolean }>;

  /** 验证多个字段 */
  validateFields: (
    fields?: string[],
  ) => Promise<{ errors: Map<string, string[]>; isValid: boolean }>;

  /** 清除字段验证 */
  clearFieldValidation: (field: string) => void;

  /** 清除所有验证 */
  clearAllValidation: () => void;

  /** 获取字段验证状态 */
  getFieldValidation: (field: string) => ProValidationState;

  /** 设置字段验证状态 */
  setFieldValidation: (field: string, state: ProValidationState) => void;

  /** 验证状态 Map */
  validationState: Ref<Map<string, ProValidationState>>;

  /** 是否有错误 */
  hasErrors: ComputedRef<boolean>;

  /** 错误数量 */
  errorCount: ComputedRef<number>;
}

/**
 * 验证系统 composable
 */
export function useProValidation(
  options: UseProValidationOptions,
): UseProValidationReturn {
  const {
    formModel,
    rules,
    strategy = 'all',
    debounceMs = 0,
    scrollToError: _scrollToError = false,
  } = options;

  // 验证状态
  const validationState = ref(new Map<string, ProValidationState>());

  // 默认验证状态
  const defaultState: ProValidationState = {
    isValid: true,
    isValidating: false,
    errors: [],
    warnings: [],
  };

  /**
   * 执行单个规则验证
   */
  async function executeRule(
    value: any,
    rule: ProValidationRule,
    _field: string,
  ): Promise<null | string> {
    // 条件验证
    if (rule.when && !rule.when(formModel.value)) {
      return null;
    }

    // 值转换
    const transformedValue = rule.transform ? rule.transform(value) : value;

    // 必填验证
    if (rule.required) {
      const isEmpty =
        transformedValue === undefined ||
        transformedValue === null ||
        transformedValue === '' ||
        (Array.isArray(transformedValue) && transformedValue.length === 0);

      if (isEmpty) {
        return rule.message || t('common.validation.required');
      }
    }

    // 类型验证
    if (rule.type && transformedValue != null) {
      const typeValidators: Record<string, (v: any) => boolean> = {
        string: (v) => typeof v === 'string',
        number: (v) => typeof v === 'number' && !isNaN(v),
        boolean: (v) => typeof v === 'boolean',
        array: (v) => Array.isArray(v),
        object: (v) => typeof v === 'object' && v !== null && !Array.isArray(v),
        email: (v) => /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(v),
        url: (v) => /^https?:\/\/.+/.test(v),
        integer: (v) => Number.isInteger(v),
      };

      const validator = typeValidators[rule.type];
      if (validator && !validator(transformedValue)) {
        return (
          rule.message ||
          t('common.validation.typeRequired', { type: rule.type })
        );
      }
    }

    // 长度验证
    if (rule.min !== undefined || rule.max !== undefined) {
      const length = Array.isArray(transformedValue)
        ? transformedValue.length
        : String(transformedValue || '').length;

      if (rule.min !== undefined && length < rule.min) {
        return (
          rule.message || t('common.validation.minLength', { min: rule.min })
        );
      }
      if (rule.max !== undefined && length > rule.max) {
        return (
          rule.message || t('common.validation.maxLength', { max: rule.max })
        );
      }
    }

    // 正则验证
    if (rule.pattern) {
      const pattern =
        typeof rule.pattern === 'string'
          ? new RegExp(rule.pattern)
          : rule.pattern;

      if (!pattern.test(String(transformedValue || ''))) {
        return rule.message || t('common.validation.invalidFormat');
      }
    }

    // 枚举验证
    if (rule.enum && !rule.enum.includes(transformedValue)) {
      return (
        rule.message ||
        t('common.validation.enumOneOf', { values: rule.enum.join(', ') })
      );
    }

    // 自定义验证器
    if (rule.validator) {
      try {
        const result = await rule.validator(rule, transformedValue);
        if (result === false) {
          return rule.message || t('common.validation.failed');
        }
        if (result instanceof Error) {
          return result.message;
        }
        if (typeof result === 'string') {
          return result;
        }
      } catch (error: any) {
        return error.message || t('common.validation.failed');
      }
    }

    // 异步验证器
    if (rule.asyncValidator) {
      return new Promise((resolve) => {
        rule.asyncValidator!(transformedValue, rule, (error) => {
          resolve(error ? error.message : null);
        });
      });
    }

    return null;
  }

  /**
   * 验证单个字段
   */
  async function validateField(
    field: string,
  ): Promise<{ errors: string[]; isValid: boolean }> {
    const fieldRules = rules.value[field] || [];
    const value = formModel.value[field];
    const errors: string[] = [];

    // 更新状态为验证中
    validationState.value.set(field, {
      ...defaultState,
      isValidating: true,
    });

    // 按优先级排序规则
    const sortedRules = [...fieldRules].toSorted(
      (a, b) => (a.priority || 0) - (b.priority || 0),
    );

    for (const rule of sortedRules) {
      const error = await executeRule(value, rule, field);
      if (error) {
        errors.push(error);
        if (strategy === 'first' || strategy === 'firstError') {
          break;
        }
      }
    }

    // 更新验证状态
    const state: ProValidationState = {
      isValid: errors.length === 0,
      isValidating: false,
      errors,
      warnings: [],
    };
    validationState.value.set(field, state);

    return { isValid: errors.length === 0, errors };
  }

  /**
   * 验证多个字段
   */
  async function validateFields(
    fields?: string[],
  ): Promise<{ errors: Map<string, string[]>; isValid: boolean }> {
    const fieldsToValidate = fields || Object.keys(rules.value);
    const errors = new Map<string, string[]>();
    let hasError = false;

    // 并行验证所有字段
    const results = await Promise.all(
      fieldsToValidate.map(async (field) => {
        const result = await validateField(field);
        return { field, ...result };
      }),
    );

    for (const { field, isValid, errors: fieldErrors } of results) {
      if (!isValid) {
        hasError = true;
        errors.set(field, fieldErrors);

        if (strategy === 'firstError') {
          break;
        }
      }
    }

    return { isValid: !hasError, errors };
  }

  /**
   * 清除字段验证
   */
  function clearFieldValidation(field: string): void {
    validationState.value.delete(field);
  }

  /**
   * 清除所有验证
   */
  function clearAllValidation(): void {
    validationState.value.clear();
  }

  /**
   * 获取字段验证状态
   */
  function getFieldValidation(field: string): ProValidationState {
    return validationState.value.get(field) || { ...defaultState };
  }

  /**
   * 设置字段验证状态
   */
  function setFieldValidation(field: string, state: ProValidationState): void {
    validationState.value.set(field, state);
  }

  // 是否有错误
  const hasErrors = computed(() => {
    for (const state of validationState.value.values()) {
      if (!state.isValid) return true;
    }
    return false;
  });

  // 错误数量
  const errorCount = computed(() => {
    let count = 0;
    for (const state of validationState.value.values()) {
      count += state.errors.length;
    }
    return count;
  });

  // 去抖版本
  const debouncedValidateField =
    debounceMs > 0 ? debounce(validateField, debounceMs) : validateField;

  return {
    validateField: debouncedValidateField as typeof validateField,
    validateFields,
    clearFieldValidation,
    clearAllValidation,
    getFieldValidation,
    setFieldValidation,
    validationState,
    hasErrors,
    errorCount,
  };
}

/**
 * 内置验证规则预设
 */
export const validationPresets = {
  required: (message?: string): ProValidationRule => ({
    required: true,
    message: message || t('common.validation.required'),
    trigger: ['blur', 'change'],
  }),

  email: (message?: string): ProValidationRule => ({
    type: 'email',
    message: message || t('common.validation.validEmail'),
    trigger: ['blur'],
  }),

  phone: (message?: string): ProValidationRule => ({
    pattern: /^1[3-9]\d{9}$/,
    message: message || t('common.validation.validPhone'),
    trigger: ['blur'],
  }),

  url: (message?: string): ProValidationRule => ({
    type: 'url',
    message: message || t('common.validation.validUrl'),
    trigger: ['blur'],
  }),

  length: (min: number, max: number, message?: string): ProValidationRule => ({
    min,
    max,
    message: message || t('common.validation.lengthBetween', { min, max }),
    trigger: ['blur'],
  }),

  range: (min: number, max: number, message?: string): ProValidationRule => ({
    validator: (rule, value) => {
      if (value < min || value > max) {
        return new Error(
          message || t('common.validation.valueBetween', { min, max }),
        );
      }
      return true;
    },
    trigger: ['blur', 'change'],
  }),

  pattern: (regex: RegExp, message?: string): ProValidationRule => ({
    pattern: regex,
    message: message || t('common.validation.invalidFormat'),
    trigger: ['blur'],
  }),

  custom: (
    validator: (
      value: any,
      formModel: Recordable,
    ) => boolean | Promise<boolean | string> | string,
    message?: string,
  ): ProValidationRule => ({
    validator: async (rule, value, callback, source) => {
      const result = await validator(value, source as Recordable);
      if (result === true) return true;
      if (typeof result === 'string') return new Error(result);
      return new Error(message || t('common.validation.failed'));
    },
    trigger: ['blur'],
  }),
};

export default useProValidation;
