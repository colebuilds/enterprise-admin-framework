<!-- oxlint-disable -->
<script lang="ts" setup>
import type { FormRules } from 'naive-ui';

import type { PropType } from 'vue';

import type { ProFormContext } from '../context';
import type {
  CreateProFormReturn,
  Recordable,
  ValidationTrigger,
} from '../types';

import { computed, ref, watch } from 'vue';

import { NForm } from 'naive-ui';

import { createProFormContext } from '../context';

defineOptions({
  name: 'ProForm',
  inheritAttrs: false,
});

const props = defineProps({
  /** 表单控制器 (必需) */
  form: {
    type: Object as PropType<CreateProFormReturn<Recordable>>,
    required: true,
  },
  /** 表单规则 */
  rules: {
    type: Object as PropType<FormRules>,
    default: undefined,
  },
  /** 加载状态 */
  loading: {
    type: Boolean,
    default: false,
  },
  /** 验证触发时机 */
  validationTrigger: {
    type: [String, Array] as PropType<ValidationTrigger | ValidationTrigger[]>,
    default: 'input',
  },
  /** 只读状态 */
  readonly: {
    type: Boolean,
    default: undefined,
  },
  /** 标签位置 */
  labelPlacement: {
    type: String as PropType<'left' | 'top'>,
    default: 'left',
  },
  /** 标签宽度 */
  labelWidth: {
    type: [String, Number] as PropType<number | string>,
    default: 'auto',
  },
  /** 标签对齐 */
  labelAlign: {
    type: String as PropType<'left' | 'right'>,
    default: undefined,
  },
  /** 尺寸 */
  size: {
    type: String as PropType<'large' | 'medium' | 'small'>,
    default: 'medium',
  },
  /** 显示必填标记 */
  showRequireMark: {
    type: Boolean,
    default: undefined,
  },
  /** 必填标记位置 */
  requireMarkPlacement: {
    type: String as PropType<'left' | 'right' | 'right-hanging'>,
    default: undefined,
  },
  /** 显示反馈 */
  showFeedback: {
    type: Boolean,
    default: true,
  },
  /** 禁用 */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 内联模式 */
  inline: {
    type: Boolean,
    default: false,
  },
});

// NForm 引用
const formRef = ref<InstanceType<typeof NForm> | null>(null);

// 同步 formRef 到 form 实例
watch(
  formRef,
  (ref) => {
    if (ref) {
      props.form.formRef.value = ref;
    }
  },
  { immediate: true },
);

// 提供表单上下文
const formContext: ProFormContext = {
  model: props.form.values,
  config: computed(() => ({
    labelPlacement: props.labelPlacement,
    labelWidth: props.labelWidth,
    size: props.size,
    disabled: props.disabled,
    readonly: props.readonly,
  })),
  validationState: props.form.validationState,
  validateTrigger: computed(() => props.validationTrigger),
  readonly: computed(() => props.readonly),
  disabled: computed(() => props.disabled),
  getFieldValue: (path: string) => props.form.getFieldValue(path as any),
  setFieldValue: (path: string, value: any) =>
    props.form.setFieldValue(path as any, value),
  registerField: props.form.registerField,
  unregisterField: props.form.unregisterField,
  validateField: async (path: string) => {
    try {
      await formRef.value?.validate(undefined, (rule) => rule?.key === path);
      return true;
    } catch {
      return false;
    }
  },
  clearFieldValidate: (path: string) => {
    formRef.value?.restoreValidation();
    props.form.validationState.value.delete(path);
  },
  updateFieldValidation: (path: string, state) => {
    props.form.validationState.value.set(path, state);
  },
  getFieldValidation: (path: string) => {
    return props.form.validationState.value.get(path);
  },
  formRef,
};

createProFormContext(formContext);

// 暴露实例
defineExpose({
  getFieldsValue: props.form.getFieldsValue,
  setFieldsValue: props.form.setFieldsValue,
  setFieldValue: props.form.setFieldValue,
  resetFields: props.form.resetFields,
  validate: () => formRef.value?.validate(),
  clearValidate: () => formRef.value?.restoreValidation(),
  getFormRef: () => formRef.value,
});
</script>

<template>
  <NForm
    ref="formRef"
    :model="form.formModel.value"
    :rules="rules"
    :label-placement="labelPlacement"
    :label-width="labelWidth"
    :label-align="labelAlign"
    :size="size"
    :show-require-mark="showRequireMark"
    :require-mark-placement="requireMarkPlacement"
    :show-feedback="showFeedback"
    :disabled="disabled"
    :inline="inline"
    v-bind="$attrs"
    @submit.prevent
  >
    <slot></slot>
  </NForm>
</template>
