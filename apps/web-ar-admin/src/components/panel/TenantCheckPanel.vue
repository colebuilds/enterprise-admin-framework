<script setup lang="ts">
import { useI18n } from 'vue-i18n';

export interface TenantCheckOption {
  label: string;
  value: number | string;
  orgName?: string;
  raw?: Record<string, unknown>;
}

interface Props {
  modelValue: (number | string)[];
  options: TenantCheckOption[];
  loading?: boolean;
  disabled?: boolean;
  emptyText?: string;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disabled: false,
  emptyText: '',
});

const emit = defineEmits<{
  'update:modelValue': [(number | string)[]];
}>();

const { t } = useI18n();

function handleChange(val: (number | string)[]) {
  emit('update:modelValue', val);
}

function handleSelectAll() {
  emit(
    'update:modelValue',
    props.options.map((o) => o.value),
  );
}

function handleClear() {
  emit('update:modelValue', []);
}
</script>

<template>
  <div class="tenant-check-panel">
    <div class="tenant-check-panel__toolbar">
      <span class="tenant-check-panel__summary">
        {{
          t('components.tenantCheckPanel.selected', {
            count: modelValue.length,
            total: options.length,
          })
        }}
      </span>
      <n-space :size="8">
        <n-button
          size="tiny"
          quaternary
          :disabled="disabled || options.length === 0"
          @click="handleSelectAll"
        >
          {{ t('components.tenantCheckPanel.selectAll') }}
        </n-button>
        <n-button
          size="tiny"
          quaternary
          :disabled="disabled || modelValue.length === 0"
          @click="handleClear"
        >
          {{ t('components.tenantCheckPanel.clear') }}
        </n-button>
      </n-space>
    </div>

    <div v-if="loading" class="tenant-check-panel__empty">
      {{ t('components.tenantCheckPanel.loading') }}
    </div>
    <div v-else-if="options.length === 0" class="tenant-check-panel__empty">
      {{ emptyText || t('components.tenantCheckPanel.empty') }}
    </div>
    <n-checkbox-group v-else :value="modelValue" @update:value="handleChange">
      <div class="tenant-check-panel__list">
        <div
          v-for="item in options"
          :key="item.value"
          class="tenant-check-panel__item"
        >
          <n-checkbox :value="item.value" :disabled="disabled">
            <span class="tenant-check-panel__label">
              {{ item.label }}
              <n-tag
                v-if="item.raw?.supportSysCurrency"
                size="tiny"
                type="success"
                class="tenant-check-panel__tag"
              >
                {{ item.raw?.supportSysCurrency }}
              </n-tag>
              <n-tag
                v-if="item.orgName"
                size="tiny"
                type="info"
                class="tenant-check-panel__tag"
              >
                {{ item.orgName }}
              </n-tag>
            </span>
          </n-checkbox>
        </div>
      </div>
    </n-checkbox-group>
  </div>
</template>

<style lang="less" scoped>
.tenant-check-panel {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  width: 100%;
}

.tenant-check-panel__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.tenant-check-panel__summary {
  font-size: 12px;
  color: #6b7280;
}

.tenant-check-panel__empty {
  padding: 16px;
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
}

.tenant-check-panel__list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 0;
  padding: 8px;
  max-height: 160px;
  overflow-y: auto;
}

.tenant-check-panel__item {
  width: 50%;
  font-size: 12px;
}

.tenant-check-panel__label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.tenant-check-panel__tag {
  font-size: 10px;
  line-height: 1;
  padding: 0 4px;
  height: 16px;
}
</style>
