<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useDialog } from 'naive-ui';

import { usePermission } from '#/hooks';

interface Props {
  /** 绑定值 */
  modelValue: boolean | number | string;
  /** 权限码 */
  permission?: string | string[];
  /** 是否禁用 */
  disabled?: boolean;
  /** 额外提示文本 */
  extraTip?: string;
  /** 确认按钮文案 */
  positiveText?: string;
  /** 取消按钮文案 */
  negativeText?: string;
  /** 选中时的值 */
  checkedValue?: boolean | number | string;
  /** 未选中时的值 */
  uncheckedValue?: boolean | number | string;
}

const props = withDefaults(defineProps<Props>(), {
  checkedValue: true,
  uncheckedValue: false,
  extraTip: '',
  permission: undefined,
  positiveText: undefined,
  negativeText: undefined,
});

const emit = defineEmits<{
  confirm: [value: boolean | number | string];
  'update:modelValue': [value: boolean | number | string];
}>();

const { t } = useI18n();
const dialog = useDialog();
const { hasPermission } = usePermission();

const switchRef = ref();
const pendingValue = ref<boolean | null | number | string>(null);

// 权限检查
const isDisabled = computed(() => {
  if (props.disabled === true) return true;
  if (props.disabled === false) return false;

  if (!props.permission) return false;

  const permissions = Array.isArray(props.permission)
    ? props.permission
    : [props.permission];

  return !hasPermission(permissions);
});

/**
 * 处理切换
 */
const handleChange = (value: boolean | number | string) => {
  const isEnabling = value === props.checkedValue;
  const confirmText = isEnabling
    ? t('common.confirmEnable')
    : t('common.confirmDisable');
  const tipText = props.extraTip ? confirmText + props.extraTip : confirmText;

  pendingValue.value = value;

  dialog.warning({
    title: t('common.prompt'),
    content: tipText,
    positiveText: props.positiveText ?? t('common.confirm'),
    negativeText: props.negativeText ?? t('common.cancel'),
    onPositiveClick: () => {
      emit('update:modelValue', value);
      emit('confirm', value);
    },
    onNegativeClick: () => {
      pendingValue.value = null;
    },
  });
};

defineExpose({
  switchRef,
});
</script>

<template>
  <n-switch
    ref="switchRef"
    :value="modelValue"
    :checked-value="checkedValue"
    :unchecked-value="uncheckedValue"
    :disabled="isDisabled"
    v-bind="$attrs"
    @update:value="handleChange"
  />
</template>
