<script lang="ts" setup>
import type { FormInst, FormItemRule, FormRules } from 'naive-ui';

import type { SysUsersPageListRsp } from '#/api/system';

import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { RefreshOutline } from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';

import { api } from '#/api';
import { AsyncSelect } from '#/components/dict-select';
import { generateQuickAccount, generateQuickPassword } from '#/utils';

interface SystemUserFormPayload {
  account: string;
  nickName: string;
  roleIds: number[];
  password?: string;
  confirmPassword?: string;
  enabled: boolean;
  isOpenGoogle: boolean;
}

type EditableUserRecord = Pick<
  SysUsersPageListRsp,
  | 'agentId'
  | 'isOpenGoogle'
  | 'nickName'
  | 'roleIds'
  | 'userId'
  | 'userName'
  | 'userState'
>;

const props = withDefaults(
  defineProps<{
    mode: 'add' | 'edit';
    record?: EditableUserRecord | null;
  }>(),
  { record: null },
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'save'): void;
}>();

function parseDelimitedIds<T extends number | string>(
  value: string | undefined,
  parser: (item: string) => null | T,
): T[] {
  return String(value || '')
    .replaceAll(/^,|,$/g, '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => parser(item))
    .filter((item): item is T => item !== null);
}

const { t } = useI18n();
const message = useMessage();
const formRef = ref<FormInst | null>(null);
const loading = ref(false);

const formData = reactive<SystemUserFormPayload>({
  account: props.record?.userName ?? '',
  nickName: props.record?.nickName ?? '',
  roleIds: parseDelimitedIds(props.record?.roleIds, (item) => {
    const value = Number(item);
    return Number.isFinite(value) ? value : null;
  }),
  password: '',
  confirmPassword: '',
  enabled: props.record ? props.record.userState === 1 : true,
  isOpenGoogle: props.record?.isOpenGoogle ?? false,
});

const isEditMode = computed(() => props.mode === 'edit');

function handleGenerateAccount() {
  formData.account = generateQuickAccount('user');
  formRef.value?.restoreValidation();
}

function handleGeneratePassword() {
  const nextPassword = generateQuickPassword();
  formData.password = nextPassword;
  formData.confirmPassword = nextPassword;
  formRef.value?.restoreValidation();
}

const formRules = computed<FormRules>(() => ({
  account: [
    {
      required: true,
      validator: (_rule: FormItemRule, value: string) => {
        if (!value)
          return new Error(t('system.sysUser.userForm.rule.accountRequired'));
        if (!/^[a-zA-Z0-9_]+$/.test(value))
          return new Error(
            t('system.sysUser.userForm.rule.accountFormatError'),
          );
        if (value.length < 6 || value.length > 20)
          return new Error(
            t('system.sysUser.userForm.rule.accountLengthError'),
          );
        return true;
      },
      trigger: 'blur',
    },
  ],
  nickName: {
    required: true,
    validator: (_rule: FormItemRule, value: string) => {
      if (!value?.trim())
        return new Error(t('system.sysUser.userForm.rule.nameRequired'));
      return true;
    },
    trigger: 'blur',
  },
  roleIds: {
    type: 'array',
    required: true,
    validator: (_rule: FormItemRule, value: number[]) => {
      if (Array.isArray(value) && value.length > 0) return true;
      return new Error(t('system.sysUser.userForm.rule.roleRequired'));
    },
    trigger: 'change',
  },
  password: {
    validator: (_rule: FormItemRule, value: string) => {
      if (isEditMode.value) return true;
      if (!value)
        return new Error(t('system.sysUser.userForm.rule.passwordRequired'));
      if (value.length < 8)
        return new Error(t('system.sysUser.userForm.rule.passwordLengthError'));
      return true;
    },
    trigger: ['blur', 'input'],
  },
  confirmPassword: {
    validator: (_rule: FormItemRule, value: string) => {
      if (isEditMode.value) return true;
      if (!value)
        return new Error(
          t('system.sysUser.userForm.rule.confirmPasswordRequired'),
        );
      if (value !== formData.password)
        return new Error(t('system.sysUser.userForm.rule.passwordMismatch'));
      return true;
    },
    trigger: ['blur', 'input'],
  },
}));

async function handleSave() {
  try {
    await formRef.value?.validate();
  } catch {
    return;
  }

  loading.value = true;
  try {
    if (props.mode === 'add') {
      const { code, msg } = await api.system.sysUsersAdd({
        userName: formData.account.trim(),
        nickName: formData.nickName.trim(),
        password: formData.password || '',
        secondPassword: formData.confirmPassword || '',
        roleIds: formData.roleIds,
        agentId: 0,
        remark: '',
        isOpenGoogle: formData.isOpenGoogle,
        userState: formData.enabled ? 1 : 0,
      });
      if (code !== 0) {
        message.error(msg);
        return;
      }
      message.success(t('system.sysUser.userForm.msg.addSuccess'));
    } else {
      if (!props.record?.userId) return;
      const { code, msg } = await api.system.sysUsersUpdate({
        userId: props.record.userId,
        nickName: formData.nickName.trim(),
        roleIds: formData.roleIds,
        userState: formData.enabled ? 1 : 0,
        agentId: 0,
        isOpenGoogle: formData.isOpenGoogle,
      });
      if (code !== 0) {
        message.error(msg);
        return;
      }
      message.success(t('system.sysUser.userForm.msg.updateSuccess'));
    }
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
    <div class="system-user-form__grid">
      <n-form-item
        :label="t('system.sysUser.userForm.label.account')"
        path="account"
      >
        <div class="system-user-form__field">
          <n-input
            v-model:value="formData.account"
            :disabled="mode === 'edit'"
            :placeholder="t('system.sysUser.userForm.label.accountPlaceholder')"
          />
          <n-button
            v-if="mode === 'add'"
            type="primary"
            secondary
            class="system-user-form__generate-button"
            @click="handleGenerateAccount"
          >
            <template #icon>
              <n-icon size="16"><RefreshOutline /></n-icon>
            </template>
            {{ t('system.sysUser.userForm.label.generate') }}
          </n-button>
        </div>
      </n-form-item>

      <n-form-item
        :label="t('system.sysUser.userForm.label.name')"
        path="nickName"
      >
        <n-input
          v-model:value="formData.nickName"
          :placeholder="t('system.sysUser.userForm.label.namePlaceholder')"
        />
      </n-form-item>

      <n-form-item
        :label="t('system.sysUser.userForm.label.role')"
        path="roleIds"
      >
        <AsyncSelect
          v-model:value="formData.roleIds"
          dict-key="roleList"
          source="dynamic"
          multiple
          filterable
          clearable
          :placeholder="t('system.sysUser.userForm.label.rolePlaceholder')"
        />
      </n-form-item>

      <n-form-item
        v-if="mode === 'add'"
        :label="t('system.sysUser.userForm.label.password')"
        path="password"
      >
        <div class="system-user-form__field">
          <n-input
            v-model:value="formData.password"
            type="password"
            show-password-on="click"
            autocomplete="new-password"
            :placeholder="
              t('system.sysUser.userForm.label.passwordPlaceholder')
            "
          />
          <n-button
            type="primary"
            secondary
            class="system-user-form__generate-button"
            @click="handleGeneratePassword"
          >
            <template #icon>
              <n-icon size="16"><RefreshOutline /></n-icon>
            </template>
            {{ t('system.sysUser.userForm.label.generate') }}
          </n-button>
        </div>
      </n-form-item>

      <n-form-item
        v-if="mode === 'add'"
        :label="t('system.sysUser.userForm.label.confirmPassword')"
        path="confirmPassword"
      >
        <n-input
          v-model:value="formData.confirmPassword"
          type="password"
          show-password-on="click"
          autocomplete="new-password"
          :placeholder="
            t('system.sysUser.userForm.label.confirmPasswordPlaceholder')
          "
        />
      </n-form-item>
    </div>

    <div class="system-user-form__switches">
      <div class="system-user-form__switch-card">
        <div>
          <div class="system-user-form__switch-title">
            {{ t('system.sysUser.userForm.label.userStatus') }}
          </div>
          <div class="system-user-form__switch-desc">
            {{ t('system.sysUser.userForm.label.userStatusDesc') }}
          </div>
        </div>
        <n-switch v-model:value="formData.enabled" />
      </div>
      <div class="system-user-form__switch-card">
        <div>
          <div class="system-user-form__switch-title">
            {{ t('system.sysUser.userForm.label.googleVerify') }}
          </div>
          <div class="system-user-form__switch-desc">
            {{ t('system.sysUser.userForm.label.googleVerifyDesc') }}
          </div>
        </div>
        <n-switch v-model:value="formData.isOpenGoogle" />
      </div>
    </div>

    <div class="system-user-form__actions">
      <n-button @click="emit('close')">{{ t('common.cancel') }}</n-button>
      <n-button type="primary" :loading="loading" @click="handleSave">
        {{ t('common.confirm') }}
      </n-button>
    </div>
  </n-form>
</template>

<style lang="less" scoped>
.system-user-form__field {
  display: flex;
  gap: 8px;
  width: 100%;
}

.system-user-form__field ::v-deep(.n-input) {
  flex: 1;
  min-width: 0;
}

.system-user-form__generate-button {
  flex-shrink: 0;
  min-width: 76px;
}

.system-user-form__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 14px;
}

.system-user-form__switches {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 4px 0 20px;
}

.system-user-form__switch-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  background: #fafafa;
}

.system-user-form__switch-title {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
}

.system-user-form__switch-desc {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 2px;
}

.system-user-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}
</style>
