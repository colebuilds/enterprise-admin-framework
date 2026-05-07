<!-- oxlint-disable -->
<script lang="ts" setup>
import type { FormItemProps } from 'naive-ui';

import type { Component, PropType } from 'vue';

import type {
  ProAsyncOptions,
  ProComponentType,
  ProFieldMapping,
  ProFieldValueType,
  ProSize,
  ProTransformFn,
  ProValidationRule,
  Recordable,
} from '../types';

import { computed, markRaw } from 'vue';

import {
  NCascader,
  NCheckbox,
  NCheckboxGroup,
  NColorPicker,
  NDatePicker,
  NInput,
  NInputNumber,
  NRadio,
  NRadioGroup,
  NRate,
  NSelect,
  NSlider,
  NSwitch,
  NTimePicker,
  NTreeSelect,
  NUpload,
} from 'naive-ui';

import DictSelect from '#/components/dict-select/DictSelect.vue';
import { useTenantOptions } from '#/hooks';

import { useProField } from '../composables';
import { ProDateRangeInput, ProSelectDateRange } from '../ProDateRangePicker';
import ProCascadeSelect from './components/ProCascadeSelect.vue';
import ProTenantSelect from './components/ProTenantSelect.vue';
import ProFormItem from './ProFormItem.vue';

defineOptions({
  name: 'ProField',
});

const props = defineProps({
  /** 字段路径 */
  path: {
    type: String,
    required: true,
  },
  /** 标签 */
  label: {
    type: String,
    default: '',
  },
  /** 标签提示 */
  labelMessage: {
    type: String,
    default: '',
  },
  /** 标签宽度 */
  labelWidth: {
    type: [String, Number] as PropType<number | string>,
    default: undefined,
  },
  /** 值类型 */
  valueType: {
    type: String as PropType<ProFieldValueType>,
    default: 'text',
  },
  /** 组件类型 */
  component: {
    type: [String, Object] as PropType<ProComponentType>,
    default: undefined,
  },
  /** 组件属性 (支持函数动态计算) */
  componentProps: {
    type: [Object, Function] as PropType<
      ((formModel: Recordable) => Recordable) | Recordable
    >,
    default: () => ({}),
  },
  /** 默认值 */
  defaultValue: {
    type: null as unknown as PropType<any>,
    default: undefined,
  },
  /** 验证规则 */
  rules: {
    type: [Array, Object] as PropType<ProValidationRule | ProValidationRule[]>,
    default: undefined,
  },
  /** 是否必填 */
  required: {
    type: Boolean,
    default: false,
  },
  /** 必填消息 */
  requiredMessage: {
    type: String,
    default: '',
  },
  /** 占位符 */
  placeholder: {
    type: [String, Array] as PropType<[string, string] | string>,
    default: undefined,
  },
  /** 选项数据 */
  options: {
    type: [Array, Function] as PropType<ProAsyncOptions>,
    default: undefined,
  },
  /** 选项字段映射 */
  fieldMapping: {
    type: Object as PropType<ProFieldMapping>,
    default: () => ({ label: 'label', value: 'value' }),
  },
  /** 是否显示 */
  show: {
    type: [Boolean, Function] as PropType<
      ((formModel: Recordable) => boolean) | boolean
    >,
    default: true,
  },
  /** 是否禁用 */
  disabled: {
    type: [Boolean, Function] as PropType<
      ((formModel: Recordable) => boolean) | boolean
    >,
    default: false,
  },
  /** 是否只读 */
  readonly: {
    type: [Boolean, Function] as PropType<
      ((formModel: Recordable) => boolean) | boolean
    >,
    default: false,
  },
  /** 是否占满整行 */
  isFull: {
    type: Boolean,
    default: false,
  },
  /** 依赖字段 */
  dependencies: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  /** 值转换 (存储 -> 显示) */
  transformIn: {
    type: Function as PropType<ProTransformFn>,
    default: undefined,
  },
  /** 值转换 (显示 -> 存储) */
  transformOut: {
    type: Function as PropType<ProTransformFn>,
    default: undefined,
  },
  /** 表单项属性 */
  formItemProps: {
    type: Object as PropType<Partial<FormItemProps>>,
    default: () => ({}),
  },
  /** 尺寸 */
  size: {
    type: String as PropType<ProSize>,
    default: undefined,
  },
  /** 列跨度 */
  span: {
    type: Number,
    default: undefined,
  },
});

const { defaultTenantId } = useTenantOptions();

const resolvedDefaultValue = computed(() => {
  if (props.defaultValue !== undefined) return props.defaultValue;
  if (props.valueType === 'tenantSelect') {
    // 用户显式 componentProps.autoFill === false 时不再用激活商户做隐式默认值，
    // 配合 ProTenantSelect.vue:112 的 autoFill 守卫实现 "opt-out：用户必须手动选商户" 语义。
    // 适用于跨商户审核明细等需要主动筛选、避免预填激活商户造成误查的场景。
    const autoFill = (
      props.componentProps as undefined | { autoFill?: boolean }
    )?.autoFill;
    if (autoFill === false) return undefined;
    return defaultTenantId.value ?? undefined;
  }
  return undefined;
});

// 使用 useProField
const fieldState = useProField({
  path: props.path,
  valueType: props.valueType,
  component: props.component as ProComponentType,
  componentProps: computed(() => props.componentProps),
  defaultValue: resolvedDefaultValue,
  rules: props.rules,
  required: props.required,
  placeholder: computed(() => props.placeholder),
  label: computed(() => props.label),
  options: computed(() => props.options),
  fieldMapping: props.fieldMapping,
  show: props.show,
  disabled: props.disabled,
  readonly: props.readonly,
  transformIn: props.transformIn,
  transformOut: props.transformOut,
  dependencies: props.dependencies,
});

// 组件映射
const COMPONENT_MAP: Record<string, Component> = {
  NInput: markRaw(NInput),
  NInputNumber: markRaw(NInputNumber),
  NSelect: markRaw(NSelect),
  TenantSelect: markRaw(ProTenantSelect),
  DictSelect: markRaw(DictSelect),
  NDatePicker: markRaw(NDatePicker),
  NTimePicker: markRaw(NTimePicker),
  NCheckbox: markRaw(NCheckbox),
  NCheckboxGroup: markRaw(NCheckboxGroup),
  NRadio: markRaw(NRadio),
  NRadioGroup: markRaw(NRadioGroup),
  NSwitch: markRaw(NSwitch),
  NCascader: markRaw(NCascader),
  ProCascadeSelect: markRaw(ProCascadeSelect),
  NTreeSelect: markRaw(NTreeSelect),
  NSlider: markRaw(NSlider),
  NRate: markRaw(NRate),
  NColorPicker: markRaw(NColorPicker),
  NUpload: markRaw(NUpload),
  ProDateRangeInput: markRaw(ProDateRangeInput),
  ProSelectDateRange: markRaw(ProSelectDateRange),
};

// 解析组件
const resolvedComponent = computed(() => {
  const comp = fieldState.resolvedComponent.value;
  if (typeof comp === 'string') {
    return COMPONENT_MAP[comp] || NInput;
  }
  return comp;
});

// 是否显示
const isShow = computed(() => fieldState.isShow.value);

// 双向绑定值
const modelValue = computed({
  get: () => fieldState.displayValue.value,
  set: (val) => fieldState.setValue(val),
});

// 暴露实例方法
defineExpose({
  getValue: () => fieldState.value.value,
  setValue: fieldState.setValue,
  validate: fieldState.validate,
  clearValidate: fieldState.clearValidate,
  reset: fieldState.reset,
  instance: fieldState.instance,
});
</script>

<template>
  <ProFormItem
    :path="path"
    :label="label"
    :label-message="labelMessage"
    :label-width="labelWidth"
    :rules="rules"
    :required="required"
    :required-message="requiredMessage"
    :show="isShow"
    :validation-state="fieldState.validationState.value"
    :size="size"
    :form-item-props="formItemProps"
  >
    <!-- 标签插槽 -->
    <template v-if="$slots.label" #label>
      <slot name="label"></slot>
    </template>

    <!-- 默认插槽 - 自定义内容 -->
    <template v-if="$slots.default">
      <slot
        :value="fieldState.value.value"
        :set-value="fieldState.setValue"
        :disabled="fieldState.isDisabled.value"
        :readonly="fieldState.isReadonly.value"
        :props="fieldState.mergedProps.value"
      ></slot>
    </template>

    <!-- 自动渲染组件 -->
    <template v-else>
      <component
        :is="resolvedComponent"
        v-model:value="modelValue"
        v-bind="fieldState.mergedProps.value"
        @focus="fieldState.handlers.onFocus"
        @blur="fieldState.handlers.onBlur"
      >
        <!-- 选项组件的插槽 -->
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps"></slot>
        </template>
      </component>
    </template>

    <!-- 后缀插槽 -->
    <template v-if="$slots.suffix">
      <slot name="suffix"></slot>
    </template>

    <!-- 反馈插槽 -->
    <template v-if="$slots.feedback" #feedback>
      <slot
        name="feedback"
        :errors="fieldState.validationState.value.errors"
        :warnings="fieldState.validationState.value.warnings"
      ></slot>
    </template>
  </ProFormItem>
</template>
