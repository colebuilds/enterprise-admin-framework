<script lang="ts" setup>
import type { FormInst, FormItemRule, FormRules } from 'naive-ui';

import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useMessage } from 'naive-ui';

import { api } from '#/api';

const props = defineProps<{
  userId: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save'): void;
}>();

const { t } = useI18n();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const formData = reactive({
  password: '',
  confirmPassword: '',
});

const formRules: FormRules = {
  password: {
    validator: (_rule: FormItemRule, value: string) => {
      if (!value)
        return new Error(
          t('system.sysUser.resetPassword.rule.passwordRequired'),
        );
      if (value.length < 8)
        return new Error(
          t('system.sysUser.resetPassword.rule.passwordLengthError'),
        );
      return true;
    },
    trigger: ['blur', 'input'],
  },
  confirmPassword: {
    validator: (_rule: FormItemRule, value: string) => {
      if (!value)
        return new Error(
          t('system.sysUser.resetPassword.rule.confirmPasswordRequired'),
        );
      if (value !== formData.password)
        return new Error(
          t('system.sysUser.resetPassword.rule.passwordMismatch'),
        );
      return true;
    },
    trigger: ['blur', 'input'],
  },
};

async function handleSave() {
  try {
    await formRef.value?.validate();
  } catch {
    return;
  }

  const payload = {
    userId: props.userId,
    password: formData.password,
  };

  loading.value = true;
  try {
    const { code, msg } = await api.system.revisePassword({
      userId: payload.userId,
      sysUserPassword: payload.password,
    });

    if (code !== 0) {
      message.error(msg);
      return;
    }

    message.success(t('system.sysUser.resetPassword.msg.success'));
    emit('save');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <n-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-placement="top"
  >
    <n-form-item
      :label="t('system.sysUser.resetPassword.label.newPassword')"
      path="password"
    >
      <n-input
        v-model:value="formData.password"
        type="password"
        show-password-on="click"
        :placeholder="t('system.sysUser.resetPassword.placeholder.newPassword')"
      />
    </n-form-item>

    <n-form-item
      :label="t('system.sysUser.resetPassword.label.confirmPassword')"
      path="confirmPassword"
    >
      <n-input
        v-model:value="formData.confirmPassword"
        type="password"
        show-password-on="click"
        :placeholder="
          t('system.sysUser.resetPassword.placeholder.confirmPassword')
        "
      />
    </n-form-item>

    <div class="system-reset-password__actions">
      <n-button @click="emit('close')">
        {{ t('common.cancel') }}
      </n-button>
      <n-button type="primary" :loading="loading" @click="handleSave">
        {{ t('common.confirm') }}
      </n-button>
    </div>
  </n-form>
</template>

<style lang="less" scoped>
.system-reset-password__actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
