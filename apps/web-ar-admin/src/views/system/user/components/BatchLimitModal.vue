<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';

import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useMessage } from 'naive-ui';

import { api } from '#/api';

interface Props {
  count: number;
  userIds: number[];
}

const props = defineProps<Props>();
const emit = defineEmits<{ close: []; save: [] }>();
const { t } = useI18n();
const message = useMessage();
const loading = ref(false);
const formRef = ref<FormInst | null>(null);

// 处理上限边界（与 WithdrawPermCard 保持一致）：0 表示不限制（业务语义）
const PROCESSING_LIMIT_MIN = 0;
const PROCESSING_LIMIT_MAX = 10_000;

const form = reactive({ maxConcurrent: 5 });

const rules: FormRules = {
  maxConcurrent: [
    {
      type: 'number',
      required: true,
      message: () => t('system.sysUser.batch.maxConcurrentPlaceholder'),
      trigger: 'blur',
    },
    {
      type: 'number',
      validator: (_rule, value: number) => {
        if (
          value === null ||
          value === undefined ||
          value < PROCESSING_LIMIT_MIN ||
          value > PROCESSING_LIMIT_MAX
        ) {
          return new Error(
            `处理上限需在 ${PROCESSING_LIMIT_MIN}-${PROCESSING_LIMIT_MAX} 之间`,
          );
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
};

async function handleSave() {
  // 同步守卫 + 立即置位 loading：避免 validate 异步期间按钮未置 loading 被快速双击重复提交
  if (loading.value) return;
  loading.value = true;
  try {
    try {
      await formRef.value?.validate();
    } catch {
      return;
    }
    const { code } =
      await api.system.batchUpdateTenantSysUserCurrentProcessingOrderLimit({
        userIds: props.userIds,
        currentProcessingOrderLimit: form.maxConcurrent,
      });
    if (code === 0) {
      message.success(t('common.operationSuccess'));
      emit('save');
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="batch-modal">
    <p class="batch-modal__tip">
      {{ t('system.sysUser.batch.adjustLimitTip', { count }) }}
    </p>
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="top"
      size="small"
    >
      <n-form-item
        :label="t('system.sysUser.withdraw.maxConcurrent')"
        path="maxConcurrent"
      >
        <n-input-number
          v-model:value="form.maxConcurrent"
          :min="PROCESSING_LIMIT_MIN"
          :max="PROCESSING_LIMIT_MAX"
          :show-button="false"
          :placeholder="t('system.sysUser.batch.maxConcurrentPlaceholder')"
          style="width: 100%"
        />
      </n-form-item>
    </n-form>
    <div class="batch-modal__actions">
      <n-button @click="emit('close')">{{ t('common.cancel') }}</n-button>
      <n-button type="primary" :loading="loading" @click="handleSave">
        {{ t('common.confirm') }}
      </n-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.batch-modal__tip {
  font-size: 13px;
  color: #374151;
  margin: 0 0 16px;
}

.batch-modal__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}
</style>
