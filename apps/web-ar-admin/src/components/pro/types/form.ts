/* oxlint-disable */
import type { FormProps as NaiveFormProps } from 'naive-ui';

import type { ComputedRef, Ref } from 'vue';

import type {
  Nullable,
  ProValidateTrigger,
  ProValidationState,
  Recordable,
} from './common';
import type { ProFieldInstance } from './field';

/**
 * ProForm 全局配置
 */
export type ProFormConfig = Recordable;

/**
 * 验证触发器类型
 */
export type ValidationTrigger = ProValidateTrigger | string;

/**
 * 验证错误
 */
export interface ValidateError {
  message?: string;
  fieldValue?: any;
  field?: string;
}

/**
 * ProForm 扩展 Props (pro-naive-ui 风格)
 */
export interface ProFormExtendProps<T extends Recordable = Recordable> {
  /** 表单控制器 (必需) */
  form: CreateProFormReturn<T>;

  /** 加载状态，用于防止重复提交 */
  loading?: boolean;

  /** 表单验证时机 */
  validationTrigger?: ValidationTrigger | ValidationTrigger[];

  /** 只读状态，优先级低于 ProField */
  readonly?: boolean;
}

/**
 * ProForm Props (继承 NaiveFormProps，排除 model)
 */
export type ProFormProps<T extends Recordable = Recordable> = Omit<
  NaiveFormProps,
  'model'
> &
  ProFormExtendProps<T>;

/**
 * createProForm 选项
 */
export interface CreateProFormOptions<T extends Recordable = Recordable> {
  /** 初始值 */
  initialValues?: Partial<T>;

  /** 值变化回调 */
  onValuesChange?: (changedValues: Partial<T>, allValues: T) => void;
}

/**
 * createProForm 返回值
 */
export interface CreateProFormReturn<T extends Recordable = Recordable> {
  /** 表单值 (响应式) */
  values: Ref<T>;

  /** 初始值 */
  initialValues: Ref<Partial<T>>;

  /** 验证状态 */
  validationState: Ref<Map<string, ProValidationState>>;

  /** 获取所有值 */
  getFieldsValue: () => T;

  /** 设置多个字段值 */
  setFieldsValue: (values: Partial<T>) => void;

  /** 设置单个字段值 */
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;

  /** 获取单个字段值 */
  getFieldValue: <K extends keyof T>(field: K) => T[K];

  /** 重置表单 */
  resetFields: (fields?: (keyof T)[]) => void;

  /** 恢复到初始值 */
  restoreFields: (fields?: (keyof T)[]) => void;

  /** 验证表单 */
  validate: (fields?: (keyof T)[]) => Promise<T>;

  /** 清除验证 */
  clearValidate: (fields?: (keyof T)[]) => void;

  /** 设置初始值 */
  setInitialValues: (values: Partial<T>) => void;

  /** 获取字段验证状态 */
  getFieldValidation: (field: keyof T) => Nullable<ProValidationState>;

  /** 注册字段 */
  registerField: (path: string, instance: ProFieldInstance) => void;

  /** 注销字段 */
  unregisterField: (path: string) => void;

  /** 获取已注册字段 */
  getRegisteredFields: () => Map<string, ProFieldInstance>;

  /** NForm 实例引用 */
  formRef: Ref<any>;

  /** 绑定到 NForm 的 model */
  formModel: ComputedRef<T>;
}

/**
 * ProForm 实例方法 (expose)
 */
export interface ProFormInstance<T extends Recordable = Recordable> {
  /** 获取所有值 */
  getFieldsValue: () => T;

  /** 设置多个字段值 */
  setFieldsValue: (values: Partial<T>) => void;

  /** 设置单个字段值 */
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;

  /** 重置表单 */
  resetFields: (fields?: (keyof T)[]) => void;

  /** 验证表单 */
  validate: (fields?: (keyof T)[]) => Promise<T>;

  /** 清除验证 */
  clearValidate: (fields?: (keyof T)[]) => void;

  /** 获取表单引用 */
  getFormRef: () => any;
}
