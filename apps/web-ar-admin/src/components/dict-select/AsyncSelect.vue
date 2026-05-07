<!-- oxlint-disable -->
<script setup lang="ts">
import type { SelectOption as NSelectOption } from 'naive-ui';

import { computed, onMounted, ref, watch } from 'vue';

export interface SelectOption {
  label: string;
  value: number | string;
  [key: string]: unknown;
}

export interface FieldMapping {
  label: string;
  value: string;
}

interface Props {
  request?: () => Promise<{ data: any[] }>;
  options?: SelectOption[];
  fieldMapping?: FieldMapping;
  transform?: (data: any[]) => SelectOption[];
  immediate?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  immediate: true,
});

const emit = defineEmits<{
  change: [
    value: null | number | number[] | string | string[],
    option: null | SelectOption | SelectOption[],
  ];
}>();

const modelValue = defineModel<null | number | number[] | string | string[]>();

const remoteOptions = ref<SelectOption[]>([]);
const loading = ref(false);
const error = ref<Error | null>(null);

const computedOptions = computed(() => props.options ?? remoteOptions.value);
const selectOptions = computed<NSelectOption[]>(
  () => computedOptions.value as NSelectOption[],
);

const fetchOptions = async () => {
  if (!props.request) return;

  loading.value = true;
  error.value = null;

  try {
    const response = await props.request();
    const data = response.data ?? [];

    if (props.transform) {
      remoteOptions.value = props.transform(data);
    } else if (props.fieldMapping) {
      const { label, value } = props.fieldMapping;
      remoteOptions.value = data.map((item) => ({
        label: item[label],
        value: item[value],
        ...item,
      }));
    } else {
      remoteOptions.value = data;
    }
  } catch (error_) {
    error.value = error_ as Error;
    console.error('[AsyncSelect] fetch error:', error_);
  } finally {
    loading.value = false;
  }
};

const handleChange = (value: null | number | number[] | string | string[]) => {
  if (Array.isArray(value)) {
    const selectedValues = new Set(value.map(String));
    emit(
      'change',
      value,
      computedOptions.value.filter((item) =>
        selectedValues.has(String(item.value)),
      ),
    );
    return;
  }

  const option =
    computedOptions.value.find((item) => item.value === value) ?? null;
  emit('change', value, option);
};

const refresh = () => fetchOptions();

onMounted(() => {
  if (props.immediate && props.request) {
    fetchOptions();
  }
});

watch(
  () => props.request,
  () => {
    if (props.request) {
      fetchOptions();
    }
  },
);

defineExpose({
  options: computedOptions,
  loading,
  error,
  refresh,
});
</script>

<template>
  <n-select
    v-model:value="modelValue"
    :options="selectOptions"
    :loading="loading"
    v-bind="$attrs"
    @update:value="handleChange"
  >
    <template v-if="$slots.empty" #empty>
      <slot name="empty"></slot>
    </template>
  </n-select>
</template>
