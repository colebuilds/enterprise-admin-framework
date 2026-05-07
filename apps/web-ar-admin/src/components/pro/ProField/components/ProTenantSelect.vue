<!-- oxlint-disable -->
<script setup lang="ts">
import type { CascaderOption, SelectOption } from 'naive-ui';

import { computed, onMounted, watch } from 'vue';

import { useTenantOptions } from '#/hooks';
import { useAppUserStore } from '#/store/app-user';

import { useProCrudTableContextSafe } from '../../context/crudTableContext';

defineOptions({
  name: 'ProTenantSelect',
  inheritAttrs: false,
});

const props = withDefaults(
  defineProps<{
    /**
     * 是否在 modelValue 为空时自动回填激活商户（HeaderTenant 选中的商户）。
     * 默认 true：商户端用户打开搜索/编辑表单时省去手动选自己商户的步骤（项目级统一行为）。
     * 设为 false：让用户必须手动选择商户（适用于跨商户审核明细等需要主动筛选的场景）。
     */
    autoFill?: boolean;
    immediate?: boolean;
    multiple?: boolean;
  }>(),
  {
    immediate: true,
    multiple: false,
    autoFill: true,
  },
);

type TenantSelectValue = null | number | number[] | undefined;
type RawTenantSelectValue =
  | Array<number | string>
  | null
  | number
  | string
  | undefined;

const modelValue = defineModel<TenantSelectValue>();
const userStore = useAppUserStore();
const isSuperAuthUser = computed(() => userStore.isSuperAuthUser);
const {
  defaultTenantId,
  tenantOptions: scopedTenantOptions,
  tenantCascaderOptions,
  loading,
  load,
  getTenantTimeZone,
} = useTenantOptions();
const crudCtx = useProCrudTableContextSafe();

const tenantOptions = computed<SelectOption[]>(
  () => scopedTenantOptions.value as unknown as SelectOption[],
);
const adminTenantOptions = computed<CascaderOption[]>(
  () => tenantCascaderOptions.value as unknown as CascaderOption[],
);
const adminValue = computed<TenantSelectValue>(() => {
  if (props.multiple) return normalizeTenantIds(modelValue.value);
  return typeof modelValue.value === 'number' ? modelValue.value : null;
});

function toTenantId(value: null | number | string | undefined) {
  if (value == null) return null;
  const tenantId = Number(value);
  return Number.isFinite(tenantId) ? tenantId : null;
}

function normalizeTenantIds(value: RawTenantSelectValue) {
  if (!Array.isArray(value)) {
    const tenantId = toTenantId(value);
    return tenantId == null ? [] : [tenantId];
  }
  return value
    .map((item) => toTenantId(item))
    .filter((item): item is number => item !== null);
}

function hasTenantValue(value: TenantSelectValue) {
  return Array.isArray(value)
    ? value.length > 0
    : value !== undefined && value !== null;
}

function handleAdminUpdate(value: RawTenantSelectValue) {
  if (props.multiple) {
    modelValue.value = normalizeTenantIds(value);
    return;
  }
  modelValue.value = toTenantId(Array.isArray(value) ? value[0] : value);
}

onMounted(() => {
  if (props.immediate && isSuperAuthUser.value) {
    void load();
  }
});

watch(
  () =>
    [
      modelValue.value,
      defaultTenantId.value,
      isSuperAuthUser.value,
      props.multiple,
    ] as const,
  ([value, tenantId, currentIsSuperAuthUser, multiple]) => {
    if (!props.autoFill) return; // opt-out：让用户必须手动选商户
    if (currentIsSuperAuthUser) return;
    if (hasTenantValue(value)) return;
    if (tenantId === null) return;
    modelValue.value = multiple ? [tenantId] : tenantId;
  },
  { immediate: true },
);

// 单选商户才写入 ProCrudTableContext。多选商户的时区口径由页面层决定，
// 避免组件用任一选中商户或 null 覆盖页面设置的默认商户时区。
watch(
  () => [modelValue.value, props.multiple] as const,
  ([val, multiple]) => {
    if (!crudCtx) return;
    if (multiple) return;
    const id = Array.isArray(val) ? val[0] : val;
    const tz = id == null ? null : getTenantTimeZone(id) || null;
    crudCtx.setTimezoneId(tz);
  },
  { immediate: true },
);
</script>

<template>
  <n-cascader
    v-if="isSuperAuthUser"
    :value="adminValue"
    :options="adminTenantOptions"
    :loading="loading"
    :multiple="multiple"
    :clearable="false"
    check-strategy="child"
    v-bind="$attrs"
    @update:value="handleAdminUpdate"
  />
  <n-select
    v-else
    v-model:value="modelValue"
    :options="tenantOptions"
    :multiple="multiple"
    :clearable="false"
    v-bind="$attrs"
  />
</template>
