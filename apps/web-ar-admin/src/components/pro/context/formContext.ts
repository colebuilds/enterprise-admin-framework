/* oxlint-disable */
import type {
  ProFieldInstance,
  ProFormConfig,
  ProValidateTrigger,
  ProValidationState,
  Recordable,
} from '../types';

import {
  computed,
  ComputedRef,
  inject,
  InjectionKey,
  provide,
  Ref,
  shallowRef,
} from 'vue';

import { getValueByPath, setValueByPath } from '../utils';

/**
 * ProForm 上下文接口
 */
export interface ProFormContext<T extends Recordable = Recordable> {
  /** 表单数据模型 */
  model: Ref<T>;

  /** 表单配置 */
  config: ComputedRef<ProFormConfig>;

  /** 验证状态映射 */
  validationState: Ref<Map<string, ProValidationState>>;

  /** 验证触发时机 */
  validateTrigger: ComputedRef<ProValidateTrigger | ProValidateTrigger[]>;

  /** 是否只读 */
  readonly: ComputedRef<boolean>;

  /** 是否禁用 */
  disabled: ComputedRef<boolean>;

  /** 获取字段值 */
  getFieldValue: (path: string) => any;

  /** 设置字段值 */
  setFieldValue: (path: string, value: any) => void;

  /** 注册字段 */
  registerField: (path: string, instance: ProFieldInstance) => void;

  /** 注销字段 */
  unregisterField: (path: string) => void;

  /** 验证字段 */
  validateField: (path: string) => Promise<boolean>;

  /** 清除字段验证 */
  clearFieldValidate: (path: string) => void;

  /** 更新字段验证状态 */
  updateFieldValidation: (path: string, state: ProValidationState) => void;

  /** 获取字段验证状态 */
  getFieldValidation: (path: string) => ProValidationState | undefined;

  /** 表单引用 */
  formRef: Ref<any>;
}

/**
 * ProForm 上下文注入键
 */
export const ProFormContextKey: InjectionKey<ProFormContext> =
  Symbol('ProFormContext');

/**
 * 创建并提供 ProForm 上下文
 */
export function createProFormContext<T extends Recordable = Recordable>(
  context: ProFormContext<T>,
): void {
  provide(ProFormContextKey, context as ProFormContext);
}

/**
 * 注入 ProForm 上下文
 */
export function useProFormContext<
  T extends Recordable = Recordable,
>(): ProFormContext<T> {
  const context = inject(ProFormContextKey);
  if (!context) {
    throw new Error(
      '[ProComponents] useProFormContext must be used within a ProForm component',
    );
  }
  return context as ProFormContext<T>;
}

/**
 * 安全注入 ProForm 上下文 (不抛异常)
 */
export function useProFormContextSafe<
  T extends Recordable = Recordable,
>(): null | ProFormContext<T> {
  return inject(ProFormContextKey, null) as null | ProFormContext<T>;
}

/**
 * 创建默认的表单上下文 (用于独立使用 ProField)
 */
export function createDefaultFormContext<T extends Recordable = Recordable>(
  initialValues: T = {} as T,
): ProFormContext<T> {
  const model = shallowRef<T>(initialValues);
  const validationState = shallowRef(new Map<string, ProValidationState>());
  const fieldRegistry = new Map<string, ProFieldInstance>();
  const formRef = shallowRef<any>(null);

  return {
    model,
    config: computed(() => ({})),
    validationState,
    validateTrigger: computed(() => 'blur'),
    readonly: computed(() => false),
    disabled: computed(() => false),
    formRef,

    getFieldValue(path: string) {
      return getValueByPath(model.value, path);
    },

    setFieldValue(path: string, value: any) {
      setValueByPath(model.value, path, value);
    },

    registerField(path: string, instance: ProFieldInstance) {
      fieldRegistry.set(path, instance);
    },

    unregisterField(path: string) {
      fieldRegistry.delete(path);
    },

    async validateField(path: string) {
      const instance = fieldRegistry.get(path);
      if (instance) {
        return instance.validate();
      }
      return true;
    },

    clearFieldValidate(path: string) {
      const instance = fieldRegistry.get(path);
      if (instance) {
        instance.clearValidate();
      }
      validationState.value.delete(path);
    },

    updateFieldValidation(path: string, state: ProValidationState) {
      validationState.value.set(path, state);
    },

    getFieldValidation(path: string) {
      return validationState.value.get(path);
    },
  };
}
