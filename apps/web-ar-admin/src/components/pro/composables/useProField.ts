/* oxlint-disable */
import type { ComputedRef, Ref } from 'vue';

import type {
  ProAsyncOptions,
  ProComponentType,
  ProFieldInstance,
  ProFieldMapping,
  ProFieldValueType,
  ProValidationRule,
  ProValidationState,
  Recordable,
} from '../types';

import { computed, onMounted, onUnmounted, ref, unref, watch } from 'vue';

import { debounce } from 'lodash-es';

import { i18n } from '#/i18n';

import { useProFormContextSafe } from '../context';
import { VALUE_TYPE_COMPONENT_MAP, VALUE_TYPE_PROPS_MAP } from '../types/field';
import {
  createPlaceholderByValueType,
  getDateFormat,
  getDatePickerType,
  mergeProps,
} from '../utils';

const t = (key: string, params: Record<string, unknown> = {}): string =>
  String(i18n.global.t(key, params));

export interface UseProFieldOptions<T = any> {
  /** 字段路径 */
  path: string;

  /** 值类型 */
  valueType?: ProFieldValueType;

  /** 组件类型 */
  component?: ProComponentType;

  /** 组件属性 (支持函数动态计算，支持 Ref/ComputedRef 保持响应式) */
  componentProps?: MaybeRef<
    ((formModel: Recordable) => Recordable) | Recordable
  >;

  /** 默认值 */
  defaultValue?: MaybeRef<T>;

  /** 验证规则 */
  rules?: ProValidationRule | ProValidationRule[];

  /** 是否必填 */
  required?: boolean;

  /** 占位符（支持 Ref 以便随语言切换实时刷新） */
  placeholder?: MaybeRef<[string, string] | string | undefined>;

  /** 标签（支持 Ref 以便随语言切换实时更新占位符中的标签插值） */
  label?: MaybeRef<string>;

  /** 选项数据 */
  options?: MaybeRef<ProAsyncOptions | undefined>;

  /** 选项字段映射 */
  fieldMapping?: ProFieldMapping;

  /** 是否显示 */
  show?: ((formModel: Recordable) => boolean) | boolean;

  /** 是否禁用 */
  disabled?: ((formModel: Recordable) => boolean) | boolean;

  /** 是否只读 */
  readonly?: ((formModel: Recordable) => boolean) | boolean;

  /** 值转换 (存储 -> 显示) */
  transformIn?: (value: T) => any;

  /** 值转换 (显示 -> 存储) */
  transformOut?: (value: any) => T;

  /** 依赖字段 */
  dependencies?: string[];
}

type MaybeRef<T> = ComputedRef<T> | Ref<T> | T;

export interface UseProFieldReturn<T = any> {
  /** 当前值 */
  value: Ref<T>;

  /** 显示值 (经过 transformIn 转换) */
  displayValue: ComputedRef<any>;

  /** 设置值 */
  setValue: (val: any) => void;

  /** 验证状态 */
  validationState: ComputedRef<ProValidationState>;

  /** 验证 */
  validate: () => Promise<boolean>;

  /** 清除验证 */
  clearValidate: () => void;

  /** 重置 */
  reset: () => void;

  /** 是否聚焦 */
  isFocused: Ref<boolean>;

  /** 是否加载中 */
  isLoading: Ref<boolean>;

  /** 是否显示 */
  isShow: ComputedRef<boolean>;

  /** 是否禁用 */
  isDisabled: ComputedRef<boolean>;

  /** 是否只读 */
  isReadonly: ComputedRef<boolean>;

  /** 解析后的组件类型 */
  resolvedComponent: ComputedRef<ProComponentType>;

  /** 合并后的组件属性 */
  mergedProps: ComputedRef<Recordable>;

  /** 选项数据 */
  optionsList: Ref<any[]>;

  /** 事件处理器 */
  handlers: {
    onBlur: () => void;
    onChange: (val: any) => void;
    onFocus: () => void;
    onUpdateValue: (val: any) => void;
  };

  /** 字段实例 */
  instance: ProFieldInstance;
}

/**
 * ProField 核心 composable
 */
export function useProField<T = any>(
  options: UseProFieldOptions<T>,
): UseProFieldReturn<T> {
  const {
    path,
    valueType = 'text',
    component,
    componentProps = {},
    defaultValue,
    rules: rawRules,
    required = false,
    placeholder,
    label,
    options: asyncOptions,
    fieldMapping = { label: 'label', value: 'value' },
    show = true,
    disabled = false,
    readonly = false,
    transformIn,
    transformOut,
    dependencies = [],
  } = options;

  const resolvedDefaultValue = computed<T | undefined>(() =>
    unref(defaultValue),
  );

  const rules = computed<ProValidationRule[]>(() => {
    if (!rawRules) return [];
    return Array.isArray(rawRules) ? rawRules : [rawRules];
  });

  // 尝试获取表单上下文
  const formContext = useProFormContextSafe();

  const resolvedAsyncOptions = computed(() => unref(asyncOptions));

  function mapOptionsByFieldMapping(data: any[]): any[] {
    const labelField = fieldMapping.label || 'label';
    const valueField = fieldMapping.value || 'value';
    const childrenField = fieldMapping.children || 'children';
    const disabledField = fieldMapping.disabled || 'disabled';

    return (data || []).map((item: any) => {
      const children = Array.isArray(item?.[childrenField])
        ? mapOptionsByFieldMapping(item[childrenField])
        : undefined;

      return {
        ...item,
        label: item?.[labelField] ?? item?.label,
        value: item?.[valueField] ?? item?.value,
        disabled: item?.[disabledField] ?? item?.disabled,
        ...(children ? { children } : {}),
      };
    });
  }

  // 状态
  const isFocused = ref(false);
  const isLoading = ref(false);
  const optionsList = ref<any[]>([]);
  const localValidationState = ref<ProValidationState>({
    isValid: true,
    isValidating: false,
    errors: [],
    warnings: [],
  });

  // 值引用
  /**
   * 如果子组件是"自管展平"模式（componentProps.modelKeys 指向多个 form 字段），
   * ProField 自身的 path 只是一个聚合占位，不该再落 form state：
   *  - 子组件初始化时直接读 form[modelKeys[i]]，不依赖 path 的 v-model
   *  - 子组件交互时自己 setFieldValue 到 modelKeys，ProField 这里的 value.set 静默跳过
   * 命中条件：componentProps.modelKeys 是长度 ≥ 2 的数组。
   */
  const hasExternalModelKeys = computed(() => {
    const raw = unref(componentProps);
    if (!raw || typeof raw !== 'object') return false;
    const keys = (raw as Recordable).modelKeys;
    return Array.isArray(keys) && keys.length >= 2;
  });

  const value = computed<T>({
    get() {
      // 展平模式下 path 不参与 form state，组件自己从 modelKeys 读初值；
      // 这里返回 undefined 让子组件的 v-model 保持 untouched，避免把 path 的 null 再回灌
      if (hasExternalModelKeys.value) return undefined as T;
      if (formContext) {
        const raw = formContext.getFieldValue(path);
        // Only use defaultValue when field is undefined (not in form yet)
        // null means explicitly cleared (e.g. by reset) and must be passed to Naive UI as-is
        return raw === undefined ? (resolvedDefaultValue.value as T) : raw;
      }
      return resolvedDefaultValue.value as T;
    },
    set(val: T) {
      // 展平模式下不回写 path，让 form state 彻底不出现这个聚合字段
      if (hasExternalModelKeys.value) return;
      if (formContext) {
        formContext.setFieldValue(path, val);
      } else if (import.meta.env.DEV) {
        console.warn(
          `[ProField] Cannot set value for "${path}" — no formContext provided`,
        );
      }
    },
  });

  // 显示值 (经过 transformIn)
  const displayValue = computed(() => {
    const rawValue = value.value;
    if (transformIn) {
      return transformIn(rawValue);
    }
    return rawValue;
  });

  // 设置值 (经过 transformOut)
  function setValue(val: any): void {
    const finalValue = transformOut ? transformOut(val) : val;
    value.value = finalValue;
  }

  // 验证状态
  const validationState = computed<ProValidationState>(() => {
    if (formContext) {
      return formContext.getFieldValidation(path) || localValidationState.value;
    }
    return localValidationState.value;
  });

  // 是否显示
  const isShow = computed(() => {
    if (typeof show === 'function') {
      return formContext ? show(formContext.model.value) : true;
    }
    return show;
  });

  // 是否禁用
  const isDisabled = computed(() => {
    // 表单级禁用
    if (formContext?.disabled.value) return true;

    if (typeof disabled === 'function') {
      return formContext ? disabled(formContext.model.value) : false;
    }
    return disabled;
  });

  // 是否只读
  const isReadonly = computed(() => {
    // 表单级只读
    if (formContext?.readonly.value) return true;

    if (typeof readonly === 'function') {
      return formContext ? readonly(formContext.model.value) : false;
    }
    return readonly;
  });

  // 解析组件类型
  const resolvedComponent = computed<ProComponentType>(() => {
    if (component) return component;
    return VALUE_TYPE_COMPONENT_MAP[valueType] || 'NInput';
  });

  // 合并组件属性
  const mergedProps = computed<Recordable>(() => {
    const baseProps: Recordable = {};

    // 值类型默认属性
    const typeProps = VALUE_TYPE_PROPS_MAP[valueType] || {};
    Object.assign(baseProps, typeProps);

    const isProDateComponent =
      valueType === 'proDateRange' || valueType === 'proSelectDateRange';
    if (
      (valueType.includes('date') || valueType.includes('time')) &&
      !isProDateComponent
    ) {
      baseProps.type = getDatePickerType(valueType);
      baseProps.format = getDateFormat(valueType);
      baseProps.valueFormat = getDateFormat(valueType);
    }

    // 占位符
    const finalPlaceholder =
      unref(placeholder) ||
      createPlaceholderByValueType(valueType, unref(label));
    if (finalPlaceholder) {
      // Range types need startPlaceholder and endPlaceholder for NDatePicker
      if (Array.isArray(finalPlaceholder)) {
        baseProps.startPlaceholder = finalPlaceholder[0];
        baseProps.endPlaceholder = finalPlaceholder[1];
      } else {
        baseProps.placeholder = finalPlaceholder;
      }
    }

    // 禁用和只读
    baseProps.disabled = isDisabled.value;
    if (isReadonly.value) {
      baseProps.readonly = true;
    }

    // 选项数据
    if (optionsList.value.length > 0) {
      baseProps.options = optionsList.value;
    }

    // select 类型的字段映射（兼容 Naive UI 的 labelField/valueField）
    if (valueType === 'select' || valueType === 'multiSelect') {
      baseProps.labelField = fieldMapping.label || 'label';
      baseProps.valueField = fieldMapping.value || 'value';
    }

    // 合并用户传入的属性 (支持函数形式，支持 Ref 响应式)
    const rawComponentProps = unref(componentProps) || {};
    const resolvedComponentProps =
      typeof rawComponentProps === 'function'
        ? rawComponentProps(formContext?.model?.value || {})
        : rawComponentProps;
    return mergeProps(baseProps, resolvedComponentProps);
  });

  // 验证
  async function validate(): Promise<boolean> {
    if (!isShow.value) return true;

    localValidationState.value.isValidating = true;

    try {
      // 使用表单上下文验证
      if (formContext) {
        const isValid = await formContext.validateField(path);
        localValidationState.value.isValid = isValid;
        return isValid;
      }

      // 本地验证逻辑
      const currentValue = value.value;
      const errors: string[] = [];

      // 必填验证
      if (required) {
        const isEmpty =
          currentValue === undefined ||
          currentValue === null ||
          currentValue === '' ||
          (Array.isArray(currentValue) && currentValue.length === 0);

        if (isEmpty) {
          const labelText = unref(label);
          errors.push(
            labelText
              ? t('common.validation.labelRequired', { label: labelText })
              : t('common.validation.required'),
          );
        }
      }

      // 规则验证
      for (const rule of rules.value) {
        const ruleMessage =
          typeof rule.message === 'string' ? rule.message : undefined;

        if (rule.required) {
          const isEmpty =
            currentValue === undefined ||
            currentValue === null ||
            currentValue === '' ||
            (Array.isArray(currentValue) && currentValue.length === 0);

          if (isEmpty) {
            errors.push(ruleMessage || t('common.validation.required'));
          }
        }

        const pattern = (rule as any).pattern as RegExp | string | undefined;
        if (pattern) {
          const reg = pattern instanceof RegExp ? pattern : new RegExp(pattern);
          const testValue =
            currentValue === undefined || currentValue === null
              ? ''
              : String(currentValue);
          if (!reg.test(testValue)) {
            errors.push(ruleMessage || t('common.validation.invalidFormat'));
          }
        }

        const validator = (rule as any).validator as
          | ((...args: any[]) => any)
          | undefined;
        if (validator) {
          try {
            const result = await Promise.resolve(
              validator(rule as any, currentValue, () => undefined, {}, {}),
            );
            if (result instanceof Error) {
              errors.push(result.message);
            }
          } catch (error: any) {
            errors.push(error.message || t('common.validation.failed'));
          }
        }
      }

      localValidationState.value.errors = errors;
      localValidationState.value.isValid = errors.length === 0;

      return errors.length === 0;
    } finally {
      localValidationState.value.isValidating = false;
    }
  }

  // 清除验证
  function clearValidate(): void {
    localValidationState.value = {
      isValid: true,
      isValidating: false,
      errors: [],
      warnings: [],
    };

    if (formContext) {
      formContext.clearFieldValidate(path);
    }
  }

  /**
   * 重置字段值并清除校验。
   * `createProForm.resetFields` 会先把整表 `values` 恢复为 `initialValuesRef`，再逐个调用本方法；
   * 若此处在「无 defaultValue」时一律写 `null`，会覆盖刚恢复的初始值（例如商户 `select` 非 `tenantSelect`）。
   * 因此在有表单上下文且组件未声明 default 时，回退为当前模型中该路径的值（即已恢复的初始快照）。
   */
  function reset(): void {
    let next: T;
    if (resolvedDefaultValue.value !== undefined) {
      next = resolvedDefaultValue.value as T;
    } else if (formContext) {
      const fromModel = formContext.getFieldValue(path);
      next = (fromModel === undefined ? null : fromModel) as T;
    } else {
      next = null as T;
    }
    value.value = next;
    clearValidate();
  }

  // 事件处理器
  const handlers = {
    onFocus() {
      isFocused.value = true;
    },
    onBlur() {
      isFocused.value = false;
      // blur 时触发验证
      if (formContext?.validateTrigger.value === 'blur') {
        validate();
      }
    },
    onChange(val: any) {
      setValue(val);
      // change 时触发验证
      if (formContext?.validateTrigger.value === 'change') {
        validate();
      }
    },
    onUpdateValue(val: any) {
      setValue(val);
      // input 时触发验证
      if (formContext?.validateTrigger.value === 'input') {
        validate();
      }
    },
  };

  // 字段实例
  const instance: ProFieldInstance = {
    getValue: () => value.value,
    setValue,
    validate,
    clearValidate,
    reset,
    focus: () => {
      // 子组件需要实现
    },
    blur: () => {
      // 子组件需要实现
    },
  };

  // 组件是否已卸载
  let isUnmounted = false;

  // 异步选项缓存 - 使用依赖值作为缓存键
  const optionsCache = new Map<string, any[]>();

  // 生成缓存键
  function getOptionsCacheKey(): string {
    if (!formContext || dependencies.length === 0) return '';
    return dependencies
      .map((dep) => String(formContext.getFieldValue(dep) ?? ''))
      .join('|');
  }

  // 加载异步选项
  async function loadOptions(): Promise<void> {
    const currentAsyncOptions = resolvedAsyncOptions.value;
    if (!currentAsyncOptions) return;

    if (Array.isArray(currentAsyncOptions)) {
      optionsList.value = mapOptionsByFieldMapping(currentAsyncOptions);
      return;
    }

    if (typeof currentAsyncOptions === 'function') {
      // 检查缓存
      const cacheKey = getOptionsCacheKey();
      if (cacheKey && optionsCache.has(cacheKey)) {
        optionsList.value = optionsCache.get(cacheKey)!;
        return;
      }

      isLoading.value = true;
      try {
        const data = await currentAsyncOptions(formContext?.model?.value || {});
        if (isUnmounted) return;

        const mappedOptions = mapOptionsByFieldMapping(
          Array.isArray(data) ? data : [],
        );

        optionsList.value = mappedOptions;

        // 存入缓存
        if (cacheKey) {
          optionsCache.set(cacheKey, mappedOptions);
        }
      } catch (error) {
        if (isUnmounted) return;
        console.error('[useProField] Failed to load options:', error);
        optionsList.value = [];
      } finally {
        if (!isUnmounted) {
          isLoading.value = false;
        }
      }
    }
  }

  // 防抖加载选项
  const debouncedLoadOptions = debounce(loadOptions, 150);

  // 监听依赖字段变化 - 使用防抖避免频繁触发
  if (dependencies.length > 0 && formContext) {
    watch(
      () => dependencies.map((dep) => formContext.getFieldValue(dep)),
      () => {
        // 依赖变化时重新加载选项 (防抖)
        if (typeof resolvedAsyncOptions.value === 'function') {
          debouncedLoadOptions();
        }
      },
    );
  }

  // options 变化时重新加载（用于处理“异步拉取后再赋值 options 数组/函数”的场景）
  watch(
    resolvedAsyncOptions,
    () => {
      optionsCache.clear();
      loadOptions();
    },
    { deep: false },
  );

  // 生命周期
  onMounted(() => {
    // 注册字段
    if (formContext) {
      formContext.registerField(path, instance);

      // defaultValue 只是显示回退，必须同步写入表单 values，
      // 否则 getFieldsValue() 取不到该字段，导致参数丢失
      const dv = resolvedDefaultValue.value;
      if (dv !== undefined) {
        if (hasExternalModelKeys.value) {
          // 展平模式：path 不参与 form，按 modelKeys 下标把 defaultValue 数组拆到两个分字段。
          // 仅填那些还是 undefined 的分字段（让 searchInitialValues / 用户已选值 优先）。
          // 数值的格式规范化（比如 valueFormat='string' 时 number → 格式化字符串）由对应子组件在 modelKeysSnapshot 归一化阶段处理。
          const raw = unref(componentProps) as Recordable | undefined;
          const keys = (raw as Recordable | undefined)?.modelKeys as
            | string[]
            | undefined;
          if (Array.isArray(keys) && Array.isArray(dv)) {
            keys.forEach((k, i) => {
              if (formContext.getFieldValue(k) === undefined) {
                formContext.setFieldValue(k, (dv as any)[i]);
              }
            });
          }
        } else if (formContext.getFieldValue(path) === undefined) {
          formContext.setFieldValue(path, dv as any);
        }
      }
    }

    // 加载选项
    loadOptions();
  });

  onUnmounted(() => {
    isUnmounted = true;

    // 注销字段
    if (formContext) {
      formContext.unregisterField(path);
    }

    // 取消防抖并清理缓存
    debouncedLoadOptions.cancel();
    optionsCache.clear();
  });

  return {
    value,
    displayValue,
    setValue,
    validationState,
    validate,
    clearValidate,
    reset,
    isFocused,
    isLoading,
    isShow,
    isDisabled,
    isReadonly,
    resolvedComponent,
    mergedProps,
    optionsList,
    handlers,
    instance,
  };
}

export default useProField;
