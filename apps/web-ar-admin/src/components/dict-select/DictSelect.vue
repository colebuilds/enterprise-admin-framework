<!-- oxlint-disable -->
<script setup lang="ts">
import type {
  DictionarySource,
  DictionaryType,
  SelectOption,
} from './useDictionary';

import { computed } from 'vue';

import { useDictionary } from './useDictionary';

interface Props {
  /** 字典键名 */
  dictKey?: DictionaryType;
  /** 数据来源: common-通用字典, group-分组字典 */
  source?: DictionarySource;
  /** 自定义 label 字段 */
  labelField?: string;
  /** 自定义 value 字段 */
  valueField?: string;
  /** 直接传入静态选项时，优先使用 */
  options?: SelectOption[];
}

const props = withDefaults(defineProps<Props>(), {
  source: 'common',
  dictKey: undefined,
  options: undefined,
});

const modelValue = defineModel<null | number | number[] | string | string[]>();

const { getOptions, loading } = useDictionary();

const options = computed(() => {
  if (Array.isArray(props.options)) {
    return props.options;
  }

  if (!props.dictKey) {
    return [];
  }

  return getOptions(props.dictKey, {
    source: props.source,
    labelField: props.labelField,
    valueField: props.valueField,
  });
});
</script>

<template>
  <n-select
    v-model:value="modelValue"
    :options="options"
    :loading="loading"
    v-bind="$attrs"
  />
</template>
