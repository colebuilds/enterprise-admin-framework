<!-- oxlint-disable -->
<script lang="ts" setup>
import type { FormItemProps, FormItemRule } from 'naive-ui';

import type { PropType } from 'vue';

import type { ProSize, ProValidationRule, ProValidationState } from '../types';

import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { QuestionCircleOutlined } from '@vicons/antd';
import { NFormItem, NIcon, NTooltip } from 'naive-ui';

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
  /** 标签样式 */
  labelStyle: {
    type: Object,
    default: undefined,
  },
  /** 标签属性 */
  labelProps: {
    type: Object,
    default: undefined,
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
  /** 反馈内容 */
  feedback: {
    type: String,
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
  /** 是否显示 */
  show: {
    type: Boolean,
    default: true,
  },
  /** 验证状态 */
  validationState: {
    type: Object as PropType<ProValidationState>,
    default: undefined,
  },
  /** 尺寸 */
  size: {
    type: String as PropType<ProSize>,
    default: undefined,
  },
  /** 是否首先验证 */
  first: {
    type: Boolean,
    default: false,
  },
  /** 表单项其他属性 */
  formItemProps: {
    type: Object as PropType<Partial<FormItemProps>>,
    default: () => ({}),
  },
});

const { t } = useI18n();

// 是否显示
const isShow = computed(() => props.show);

// 错误列表
const errors = computed(() => props.validationState?.errors || []);

// 警告列表
const warnings = computed(() => props.validationState?.warnings || []);

// 验证状态
const validationStatus = computed(() => {
  if (!props.validationState) return undefined;
  if (!props.validationState.isValid) return 'error';
  if (props.validationState.warnings?.length) return 'warning';
  return undefined;
});

// 规范化规则为数组
function normalizeRules(
  rules: ProValidationRule | ProValidationRule[] | undefined,
): FormItemRule[] {
  if (!rules) return [];
  if (Array.isArray(rules)) return rules as FormItemRule[];
  return [rules] as FormItemRule[];
}

// 合并规则
const mergedRules = computed<FormItemRule[]>(() => {
  const rules: FormItemRule[] = normalizeRules(props.rules);

  // 添加必填规则
  if (props.required) {
    const hasRequiredRule = rules.some((r) => r.required);
    if (!hasRequiredRule) {
      rules.unshift({
        required: true,
        message:
          props.requiredMessage ||
          t('common.validation.labelRequired', {
            label: props.label || t('common.validation.field'),
          }),
        trigger: ['blur', 'change'],
      });
    }
  }

  return rules;
});
</script>

<template>
  <NFormItem
    v-if="isShow"
    :path="path"
    :label="label"
    :label-width="labelWidth"
    :label-style="labelStyle"
    :label-props="labelProps"
    :show-require-mark="showRequireMark"
    :require-mark-placement="requireMarkPlacement"
    :show-feedback="showFeedback"
    :feedback="feedback"
    :validation-status="validationStatus"
    :rule="mergedRules"
    :first="first"
    :size="size"
    v-bind="formItemProps"
  >
    <!-- 标签插槽 -->
    <template v-if="$slots.label || labelMessage" #label>
      <slot name="label">
        <span class="pro-form-item-label">
          {{ label }}
          <NTooltip v-if="labelMessage" trigger="hover">
            <template #trigger>
              <NIcon class="pro-form-item-label-icon" :size="14">
                <QuestionCircleOutlined />
              </NIcon>
            </template>
            {{ labelMessage }}
          </NTooltip>
        </span>
      </slot>
    </template>

    <!-- 默认内容插槽 -->
    <slot></slot>

    <!-- 反馈插槽 -->
    <template v-if="$slots.feedback" #feedback>
      <slot name="feedback" :errors="errors" :warnings="warnings"></slot>
    </template>
  </NFormItem>
</template>

<style lang="less" scoped>
.pro-form-item-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.pro-form-item-label-icon {
  color: var(--n-text-color-3);
  cursor: help;

  &:hover {
    color: var(--n-primary-color);
  }
}
</style>
