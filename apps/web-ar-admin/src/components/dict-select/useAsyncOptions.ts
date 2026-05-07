/* oxlint-disable */
import type { Ref } from 'vue';

import { onMounted, ref } from 'vue';

export interface SelectOption {
  label: string;
  value: number | string;
  [key: string]: unknown;
}

export interface FieldMapping {
  label: string;
  value: string;
}

export interface UseAsyncOptionsConfig {
  fieldMapping?: FieldMapping;
  transform?: (data: any[]) => SelectOption[];
  immediate?: boolean;
}

export interface UseAsyncOptionsReturn {
  options: Ref<SelectOption[]>;
  loading: Ref<boolean>;
  error: Ref<Error | null>;
  refresh: () => Promise<void>;
}

export function useAsyncOptions(
  request: (() => Promise<{ data: any[] }>) | null,
  config: UseAsyncOptionsConfig = {},
): UseAsyncOptionsReturn {
  const { fieldMapping, transform, immediate = true } = config;

  const options = ref<SelectOption[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchOptions = async () => {
    if (!request) return;

    loading.value = true;
    error.value = null;

    try {
      const response = await request();
      const data = response.data ?? [];

      if (transform) {
        options.value = transform(data);
      } else if (fieldMapping) {
        options.value = data.map((item) => ({
          label: item[fieldMapping.label],
          value: item[fieldMapping.value],
          ...item,
        }));
      } else {
        options.value = data;
      }
    } catch (error_) {
      error.value = error_ as Error;
      console.error('[useAsyncOptions] fetch error:', error_);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    if (immediate) {
      fetchOptions();
    }
  });

  return {
    options,
    loading,
    error,
    refresh: fetchOptions,
  };
}
