/* oxlint-disable */
import type {
  CreateProFormOptions,
  CreateProFormReturn,
  Nullable,
  ProFieldInstance,
  ProValidationState,
  Recordable,
} from '../types';

import { computed, ref, shallowRef, toRaw, triggerRef, watch } from 'vue';

import { debounce } from 'lodash-es';

import {
  deepClone,
  getChangedFields,
  getValueByPath,
  setValueByPath,
} from '../utils';

/**
 * 创建 ProForm 实例 (pro-naive-ui 风格)
 *
 * @example
 * ```ts
 * const form = createProForm({
 *   initialValues: { name: '', age: 0 },
 *   onValuesChange: (changed, all) => {
 *     console.log('Changed:', changed)
 *   }
 * })
 *
 * // 在模板中使用
 * <ProForm :form="form">
 *   <ProField path="name" label="姓名" />
 * </ProForm>
 * ```
 */
export function createProForm<T extends Recordable = Recordable>(
  options: CreateProFormOptions<T> = {},
): CreateProFormReturn<T> {
  const { initialValues = {} as Partial<T>, onValuesChange } = options;

  // 表单值
  const values = ref<T>(deepClone(initialValues) as T);

  // 初始值
  const initialValuesRef = ref<Partial<T>>(deepClone(initialValues));

  // 验证状态
  const validationState = shallowRef(new Map<string, ProValidationState>());

  // 已注册字段
  const registeredFields = new Map<string, ProFieldInstance>();

  // NForm 引用
  const formRef = ref<any>(null);

  // 计算后的表单模型 (用于 NForm :model 绑定)
  const formModel = computed(() => values.value);

  // 监听值变化（仅在提供 onValuesChange 回调时注册 deep watcher，避免无意义的深度遍历）
  if (onValuesChange) {
    let prevValues: T = deepClone(values.value) as T;

    const debouncedOnChange = debounce((newValues: T) => {
      const changedValues = getChangedFields(prevValues, newValues);
      if (Object.keys(changedValues).length > 0) {
        onValuesChange(changedValues, newValues);
      }
      prevValues = deepClone(newValues) as T;
    }, 16);

    watch(values, (newValues) => debouncedOnChange(newValues), { deep: true });
  }

  /**
   * 获取所有字段值
   */
  function getFieldsValue(): T {
    return deepClone(toRaw(values.value)) as T;
  }

  /**
   * 设置多个字段值
   */
  function setFieldsValue(newValues: Partial<T>): void {
    Object.assign(values.value, newValues);
    triggerRef(values);
  }

  /**
   * 设置单个字段值
   */
  function setFieldValue<K extends keyof T>(field: K, value: T[K]): void {
    if (typeof field === 'string' && field.includes('.')) {
      setValueByPath(values.value, field as string, value);
    } else {
      (values.value as any)[field] = value;
    }
    triggerRef(values);
  }

  /**
   * 获取单个字段值
   */
  function getFieldValue<K extends keyof T>(field: K): T[K] {
    if (typeof field === 'string' && field.includes('.')) {
      return getValueByPath(values.value, field as string);
    }
    return values.value[field];
  }

  /**
   * 重置表单到初始值
   */
  function resetFields(fields?: (keyof T)[]): void {
    if (fields && fields.length > 0) {
      // 重置指定字段
      for (const field of fields) {
        const initialValue = initialValuesRef.value[field];
        setFieldValue(field, initialValue as T[keyof T]);

        // 清除验证
        const fieldInstance = registeredFields.get(field as string);
        fieldInstance?.clearValidate();
      }
    } else {
      // 先将整个 values 恢复到初始值（覆盖自定义渲染等未注册字段）
      values.value = deepClone(initialValuesRef.value) as T;
      // 再调用注册字段的 reset（使用各自的 defaultValue 并清除验证）
      for (const instance of registeredFields.values()) {
        instance.reset();
      }
      triggerRef(values);
      validationState.value.clear();
    }
  }

  /**
   * 恢复到初始值 (不触发回调)
   */
  function restoreFields(fields?: (keyof T)[]): void {
    if (fields && fields.length > 0) {
      for (const field of fields) {
        const initialValue = initialValuesRef.value[field];
        setFieldValue(field, initialValue as T[keyof T]);
      }
    } else {
      values.value = deepClone(initialValuesRef.value) as T;
    }
    triggerRef(values);
  }

  /**
   * 验证表单
   */
  async function validate(fields?: (keyof T)[]): Promise<T> {
    const errors: Recordable<string[]> = {};
    let hasError = false;

    const fieldsToValidate = fields
      ? fields.map((f) => registeredFields.get(f as string)).filter(Boolean)
      : [...registeredFields.values()];

    // 执行所有字段验证
    const results = await Promise.all(
      fieldsToValidate.map(async (instance) => {
        if (instance) {
          try {
            const isValid = await instance.validate();
            return { instance, isValid };
          } catch {
            return { instance, isValid: false };
          }
        }
        return { instance: null, isValid: true };
      }),
    );

    // 收集错误
    for (const { instance, isValid } of results) {
      if (!isValid && instance) {
        hasError = true;
      }
    }

    // 也可以使用 NForm 的验证
    if (formRef.value?.validate) {
      try {
        await formRef.value.validate();
      } catch (error_: any) {
        hasError = true;
        if (Array.isArray(error_)) {
          for (const error of error_) {
            const field = error[0]?.field;
            if (field) {
              errors[field] = error.map((e: any) => e.message);
            }
          }
        }
      }
    }

    if (hasError) {
      throw errors;
    }

    return getFieldsValue();
  }

  /**
   * 清除验证
   */
  function clearValidate(fields?: (keyof T)[]): void {
    if (fields && fields.length > 0) {
      for (const field of fields) {
        const instance = registeredFields.get(field as string);
        instance?.clearValidate();
        validationState.value.delete(field as string);
      }
    } else {
      for (const instance of registeredFields.values()) {
        instance.clearValidate();
      }
      validationState.value.clear();
    }

    // 也清除 NForm 的验证
    if (formRef.value?.restoreValidation) {
      formRef.value.restoreValidation();
    }
  }

  /**
   * 设置初始值
   */
  function setInitialValues(newInitialValues: Partial<T>): void {
    initialValuesRef.value = deepClone(newInitialValues);
  }

  /**
   * 获取字段验证状态
   */
  function getFieldValidation(field: keyof T): Nullable<ProValidationState> {
    return validationState.value.get(field as string) || null;
  }

  /**
   * 注册字段
   */
  function registerField(path: string, instance: ProFieldInstance): void {
    registeredFields.set(path, instance);
  }

  /**
   * 注销字段
   */
  function unregisterField(path: string): void {
    registeredFields.delete(path);
    validationState.value.delete(path);
  }

  /**
   * 获取已注册字段
   */
  function getRegisteredFields(): Map<string, ProFieldInstance> {
    return registeredFields;
  }

  return {
    values,
    initialValues: initialValuesRef,
    validationState,
    getFieldsValue,
    setFieldsValue,
    setFieldValue,
    getFieldValue,
    resetFields,
    restoreFields,
    validate,
    clearValidate,
    setInitialValues,
    getFieldValidation,
    registerField,
    unregisterField,
    getRegisteredFields,
    formRef,
    formModel,
  };
}

export default createProForm;
