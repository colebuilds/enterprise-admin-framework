<script setup lang="ts">
import { computed } from 'vue';

import { NInputNumber } from 'naive-ui';

import { useProFormContextSafe } from '../context';

defineOptions({ name: 'ProNumberRange', inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    clearable?: boolean;
    /** min > max 时显示的错误文本；不传则只标 status='error' 不出文本 */
    invalidMessage?: string;
    maxPlaceholder?: string;
    minPlaceholder?: string;
    /**
     * 把两端值直接写回 form model 对应字段（min 在前，max 在后）。
     * 例：`['minAmount', 'maxAmount']` → form.minAmount / form.maxAmount。
     * 仅在 ProField 包裹下生效（需要 form context）。优先级最高。
     */
    modelKeys?: [string, string];
    /** 输入上界（透传给 NInputNumber max；不传不约束） */
    numberMax?: number;
    /** 输入下界（透传给 NInputNumber min；不传不约束） */
    numberMin?: number;
    /** NInputNumber precision；金额传 2、计数传 0、倍数留 undefined 沿用默认 */
    precision?: number;
    /** 中间分隔符（默认 `-`） */
    separator?: string;
    /** 不传则跟随 NConfigProvider / NForm 的全局 size（默认 medium）；仅特殊场景需要覆盖 */
    size?: 'large' | 'medium' | 'small' | 'tiny';
  }>(),
  {
    modelKeys: undefined,
    minPlaceholder: undefined,
    maxPlaceholder: undefined,
    precision: undefined,
    numberMin: undefined,
    numberMax: undefined,
    separator: '-',
    invalidMessage: undefined,
    clearable: true,
    size: undefined,
  },
);

type RangeValue = [null | number, null | number];

/**
 * 三种绑定模式（优先级从高到低；可叠加，组件内统一同步）：
 *   1. `modelKeys` + ProForm context：直接读写 form 字段（最干净）
 *   2. `v-model:min` / `v-model:max`：两个独立字段绑定（n-form 场景）
 *   3. `v-model`：tuple `[min, max]`（直连 ref 场景）
 */
const modelValue = defineModel<null | RangeValue>({ default: null });
const minModel = defineModel<null | number>('min', { default: null });
const maxModel = defineModel<null | number>('max', { default: null });

const formContext = useProFormContextSafe();
const useFlat = computed(
  () =>
    Array.isArray(props.modelKeys) &&
    props.modelKeys.length === 2 &&
    !!formContext,
);

function readSlot(idx: 0 | 1): null | number {
  if (useFlat.value) {
    const v = formContext!.getFieldValue(props.modelKeys![idx]);
    return v === undefined || v === '' || v === null ? null : Number(v);
  }
  // 双 v-model 优先；都为 null 时回退 tuple
  const dual = idx === 0 ? minModel.value : maxModel.value;
  if (dual !== null && dual !== undefined) return dual;
  return modelValue.value?.[idx] ?? null;
}

const minValue = computed(() => readSlot(0));
const maxValue = computed(() => readSlot(1));

const hasInvalidRange = computed(() => {
  const minRaw = minValue.value;
  const maxRaw = maxValue.value;
  if (minRaw === null || maxRaw === null) return false;
  if (!Number.isFinite(minRaw) || !Number.isFinite(maxRaw)) return false;
  return minRaw > maxRaw;
});

function handleChange(idx: 0 | 1, val: null | number) {
  if (useFlat.value) {
    formContext!.setFieldValue(props.modelKeys![idx], val);
    return;
  }
  // 同步写所有可能被父组件绑定的 model：双 v-model 与 tuple v-model 都更新
  if (idx === 0) minModel.value = val;
  else maxModel.value = val;
  const nextTuple: RangeValue = [
    idx === 0 ? val : (minModel.value ?? modelValue.value?.[0] ?? null),
    idx === 1 ? val : (maxModel.value ?? modelValue.value?.[1] ?? null),
  ];
  modelValue.value = nextTuple;
}
</script>

<template>
  <div class="pro-number-range">
    <div class="pro-number-range__inputs">
      <NInputNumber
        :value="minValue"
        :placeholder="minPlaceholder"
        :precision="precision"
        :clearable="clearable"
        :min="numberMin"
        :max="numberMax"
        :show-button="false"
        :size="size"
        :status="hasInvalidRange ? 'error' : undefined"
        class="pro-number-range__item"
        @update:value="(v) => handleChange(0, v)"
      />
      <span class="pro-number-range__separator">{{ separator }}</span>
      <NInputNumber
        :value="maxValue"
        :placeholder="maxPlaceholder"
        :precision="precision"
        :clearable="clearable"
        :min="numberMin"
        :max="numberMax"
        :show-button="false"
        :size="size"
        :status="hasInvalidRange ? 'error' : undefined"
        class="pro-number-range__item"
        @update:value="(v) => handleChange(1, v)"
      />
    </div>
    <div
      v-if="hasInvalidRange && invalidMessage"
      class="pro-number-range__error"
    >
      {{ invalidMessage }}
    </div>
  </div>
</template>

<style lang="less" scoped>
.pro-number-range {
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 4px;
}
.pro-number-range__inputs {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 4px;
}
.pro-number-range__item {
  flex: 1;
  min-width: 0;
}
.pro-number-range__separator {
  flex-shrink: 0;
  color: var(--n-text-color-disabled, #a8a8a8);
}
.pro-number-range__error {
  font-size: 12px;
  line-height: 1.25;
  color: #f43f5e;
}
</style>
