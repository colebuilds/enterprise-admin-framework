/* oxlint-disable */
import type {
  ProFieldInstance,
  ProFieldSchema,
  ProValidationState,
} from '../types';

import { ComputedRef, inject, InjectionKey, provide, Ref } from 'vue';

/**
 * ProField 上下文接口
 */
export interface ProFieldContext<T = any> {
  /** 字段路径 */
  path: string;

  /** 字段值 */
  value: Ref<T>;

  /** 字段 Schema */
  schema: ComputedRef<ProFieldSchema>;

  /** 字段实例 */
  instance: ProFieldInstance;

  /** 验证状态 */
  validationState: ComputedRef<ProValidationState>;

  /** 是否只读 */
  readonly: ComputedRef<boolean>;

  /** 是否禁用 */
  disabled: ComputedRef<boolean>;

  /** 是否显示 */
  show: ComputedRef<boolean>;

  /** 设置值 */
  setValue: (value: T) => void;

  /** 验证 */
  validate: () => Promise<boolean>;

  /** 清除验证 */
  clearValidate: () => void;

  /** 重置 */
  reset: () => void;
}

/**
 * ProField 上下文注入键
 */
export const ProFieldContextKey: InjectionKey<ProFieldContext> =
  Symbol('ProFieldContext');

/**
 * 创建并提供 ProField 上下文
 */
export function createProFieldContext<T = any>(
  context: ProFieldContext<T>,
): void {
  provide(ProFieldContextKey, context as ProFieldContext);
}

/**
 * 注入 ProField 上下文
 */
export function useProFieldContext<T = any>(): ProFieldContext<T> {
  const context = inject(ProFieldContextKey);
  if (!context) {
    throw new Error(
      '[ProComponents] useProFieldContext must be used within a ProField component',
    );
  }
  return context as ProFieldContext<T>;
}

/**
 * 安全注入 ProField 上下文
 */
export function useProFieldContextSafe<T = any>(): null | ProFieldContext<T> {
  return inject(ProFieldContextKey, null) as null | ProFieldContext<T>;
}

/**
 * ProFormItem 上下文接口 (用于表单项内部通信)
 */
export interface ProFormItemContext {
  /** 字段路径 */
  path: string;

  /** 标签宽度 */
  labelWidth: ComputedRef<number | string | undefined>;

  /** 是否必填 */
  required: ComputedRef<boolean>;

  /** 验证状态 */
  validationState: ComputedRef<ProValidationState>;
}

/**
 * ProFormItem 上下文注入键
 */
export const ProFormItemContextKey: InjectionKey<ProFormItemContext> =
  Symbol('ProFormItemContext');

/**
 * 创建并提供 ProFormItem 上下文
 */
export function createProFormItemContext(context: ProFormItemContext): void {
  provide(ProFormItemContextKey, context);
}

/**
 * 注入 ProFormItem 上下文
 */
export function useProFormItemContext(): null | ProFormItemContext {
  return inject(ProFormItemContextKey, null);
}
