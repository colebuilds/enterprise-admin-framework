<script setup lang="ts">
import type { FormInst, FormRules } from 'naive-ui';

import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useMessage } from 'naive-ui';

import { api } from '#/api';
import { ProNumberRange } from '#/components/pro';

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

// 订单金额边界（与 WithdrawPermCard 保持一致）
const ORDER_AMOUNT_MIN = 1;
const ORDER_AMOUNT_MAX = 500_000_000;

const form = reactive({ minAmount: 500, maxAmount: 100_000_000 });

const rangeError = () =>
  t('system.sysUser.batchRange.rangeError', {
    min: ORDER_AMOUNT_MIN,
    max: ORDER_AMOUNT_MAX,
  });

const rules: FormRules = {
  minAmount: [
    {
      type: 'number',
      required: true,
      message: () => t('system.sysUser.batch.minAmountPlaceholder'),
      trigger: 'blur',
    },
    {
      type: 'number',
      validator: (_rule, value: number) => {
        if (
          value === null ||
          value === undefined ||
          value < ORDER_AMOUNT_MIN ||
          value > ORDER_AMOUNT_MAX
        ) {
          return new Error(rangeError());
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
  maxAmount: [
    {
      type: 'number',
      required: true,
      message: () => t('system.sysUser.batch.maxAmountPlaceholder'),
      trigger: 'blur',
    },
    {
      type: 'number',
      validator: (_rule, value: number) => {
        if (
          value === null ||
          value === undefined ||
          value < ORDER_AMOUNT_MIN ||
          value > ORDER_AMOUNT_MAX
        ) {
          return new Error(rangeError());
        }
        if (value <= form.minAmount) {
          return new Error(t('system.sysUser.batch.maxAmountGtMin'));
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
      await api.system.batchUpdateTenantSysUserWithdrawAuditAmountRange({
        userIds: props.userIds,
        auditMinAmount: form.minAmount,
        auditMaxAmount: form.maxAmount,
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
      {{ t('system.sysUser.batch.adjustRangeTip', { count }) }}
    </p>
    <n-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-placement="top"
      size="small"
    >
      <n-form-item
        :label="t('system.sysUser.batch.minAmount')"
        path="minAmount"
      >
        <ProNumberRange
          v-model:min="form.minAmount"
          v-model:max="form.maxAmount"
          :precision="2"
          :number-min="ORDER_AMOUNT_MIN"
          :number-max="ORDER_AMOUNT_MAX"
          :min-placeholder="t('system.sysUser.batch.minAmountPlaceholder')"
          :max-placeholder="t('system.sysUser.batch.maxAmountPlaceholder')"
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
