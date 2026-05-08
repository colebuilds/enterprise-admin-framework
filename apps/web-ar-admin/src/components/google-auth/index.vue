<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useClipboard } from '@vueuse/core';
import { useMessage } from 'naive-ui';

import { useAppUserStore } from '#/store/app-user';

const props = withDefaults(
  defineProps<{
    form?: Record<string, any>;
    googleImage?: string;
    mode?: 'bind' | 'preview';
    tenantName?: string;
    userName?: string;
  }>(),
  {
    mode: 'bind',
    googleImage: '',
    form: () => ({}),
    tenantName: '',
    userName: '',
  },
);
const emit = defineEmits(['cancel', 'confirm']);

const userStore = useAppUserStore();
const { t } = useI18n();

const isPreview = computed(() => props.mode === 'preview');
const secretKey = computed(() => props.googleImage || '');
const resolvedUserName = computed(
  () => props.userName || props.form.userName || 'User',
);
const resolvedTenantName = computed(() => {
  const userInfo = (userStore?.info || {}) as Record<string, any>;
  return props.tenantName || userInfo.tenantName || userInfo.orgName || 'AR';
});

const otpauth = computed(() => {
  const issuer = `${resolvedTenantName.value}-${resolvedUserName.value}`;
  const params = new URLSearchParams({
    secret: secretKey.value,
    issuer,
  });
  const account = `${resolvedTenantName.value}-${resolvedUserName.value}`;
  return `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(account)}?${params.toString()}`;
});

const { copy } = useClipboard({
  legacy: true,
});
const loading = ref(false);
const formData = reactive({
  vCode: '',
});
const message = useMessage();
const copyGoogle = () => {
  copy(secretKey.value);
  message.success(t('common.googleAuth.copySuccess'));
};
const handleLogout = async () => {
  if (!formData.vCode) {
    return message.error(t('common.googleAuth.codeRequired'));
  }
  if (formData.vCode.length !== 6) {
    return message.error(t('common.googleAuth.codeLength'));
  }
  try {
    loading.value = true;
    // TODO: fix type — useAppUserStore has no login(); wire to api.auth.login or useAuthStore
    const { code, msg } = await (userStore as any).login(
      Object.assign({}, props.form, formData),
    );
    if (code !== 0) {
      return message.error(msg || t('common.googleAuth.loginFailed'));
    }
    emit('confirm');
  } finally {
    loading.value = false;
  }
};
const onCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div class="google-auth" :class="{ 'google-auth--preview': isPreview }">
    <template v-if="isPreview">
      <div class="google-auth__preview-title">
        {{ t('common.googleAuth.title') }}
      </div>
      <div class="google-auth__step">
        <div class="google-auth__step-label">
          {{ t('common.googleAuth.stepDownload') }}
        </div>
        <div class="google-auth__step-text">
          {{ t('common.googleAuth.previewDownloadText') }}
        </div>
      </div>
      <div class="google-auth__step google-auth__step--spaced">
        <div class="google-auth__step-label">
          {{ t('common.googleAuth.stepAddKey') }}
        </div>
        <div class="google-auth__step-text">
          {{ t('common.googleAuth.addKeyText') }}
        </div>
        <div class="google-auth__preview-main">
          <n-qr-code
            :value="otpauth"
            :size="140"
            class="google-auth__preview-code"
          />
          <div class="google-auth__preview-side">
            <n-space>
              <div>
                {{ t('common.googleAuth.secretLabel') }}:
                <span class="google-auth__secret">{{ secretKey }}</span>
              </div>
              <n-button type="primary" size="small" @click="copyGoogle">
                {{ t('common.copy.copy') }}
              </n-button>
            </n-space>
            <div class="google-auth__step-text">
              {{ t('common.googleAuth.backupText') }}
            </div>
          </div>
        </div>
      </div>
      <div class="google-auth__step">
        <div class="google-auth__step-label">
          {{ t('common.googleAuth.stepEnterCode') }}
        </div>
        <div class="google-auth__step-text">
          {{ t('common.googleAuth.accountName') }}: {{ resolvedUserName }}
        </div>
      </div>
    </template>

    <template v-else>
      <div class="google-auth__head">{{ t('common.googleAuth.bindHead') }}</div>
      <n-alert :title="t('common.googleAuth.tipTitle')" type="error">
        {{ t('common.googleAuth.resetTip') }}
      </n-alert>
      <div class="google-auth__title">
        {{ t('common.googleAuth.bindStepTitle') }}
      </div>
      <div class="google-auth__text">
        {{ t('common.googleAuth.downloadApp') }}
      </div>
      <div class="google-auth__text">
        {{ t('common.googleAuth.iosPrefix') }}
        <n-button
          text
          tag="a"
          href="https://apps.apple.com/us/app/google-authenticator/id388497605"
          target="_blank"
          type="primary"
        >
          AppStore
        </n-button>
        {{ t('common.googleAuth.searchAuthenticator') }}
        <n-button
          text
          tag="a"
          href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=en_US"
          target="_blank"
          type="primary"
        >
          {{ t('common.googleAuth.appStore') }}
        </n-button>
        {{ t('common.googleAuth.browserSearch') }}
        <span>{{ t('common.googleAuth.authenticatorExtension') }}</span>
      </div>
      <div class="google-auth__title">
        {{ t('common.googleAuth.stepAddKey') }}
      </div>
      <div class="google-auth__text google-auth__text--spaced">
        {{ t('common.googleAuth.addKeyText') }}
      </div>
      <div class="google-auth__qr-main">
        <n-alert :show-icon="false" type="success">
          <n-qr-code :value="otpauth" :size="140" />
        </n-alert>
        <div class="google-auth__qr-side">
          <div class="google-auth__text">
            {{ t('common.googleAuth.keyUsageTip') }}
          </div>
          <div class="google-auth__text">
            {{ t('common.googleAuth.enterCodeText') }}
          </div>
          <div class="google-auth__text">
            {{ t('common.googleAuth.accountName') }}:
            <n-tag type="success">{{ resolvedUserName || '--' }}</n-tag>
          </div>
          <n-space>
            <div>
              {{ t('common.googleAuth.secretLabel') }}:
              <span class="google-auth__secret">
                {{ secretKey }}
              </span>
            </div>
            <n-button type="primary" size="small" @click="copyGoogle">
              {{ t('common.copy.copy') }}
            </n-button>
          </n-space>
        </div>
      </div>
      <div class="google-auth__title">
        {{ t('common.googleAuth.inputStepTitle') }}
      </div>
      <div class="google-auth__actions-row google-auth__actions-row--spaced">
        <div>{{ t('common.googleAuth.codePasswordLabel') }}:</div>
        <div>
          <n-input
            v-model:value="formData.vCode"
            maxlength="6"
            :placeholder="t('common.googleAuth.codePlaceholder')"
            size="large"
          />
        </div>
      </div>

      <n-space class="flex justify-center">
        <n-button @click="onCancel">{{ t('common.cancel') }}</n-button>
        <n-button type="primary" :loading="loading" @click="handleLogout">
          {{ t('common.googleAuth.bindButton') }}
        </n-button>
      </n-space>
    </template>
  </div>
</template>

<style lang="less" scoped>
.google-auth {
  width: 100%;
  height: fit-content;

  &--preview {
    font-size: 16px;
  }

  &__head {
    font-size: 20px;
    text-align: center;
    line-height: 26px;
    margin-bottom: 6px;
    font-weight: 900;
  }

  &__actions-row {
    display: flex;
    align-items: center;
    gap: 10px;

    &--spaced {
      margin-bottom: 20px;
    }
  }

  &__title,
  &__step-label {
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
    margin: 8px 0;
  }

  &__text,
  &__step-text,
  &__qr-side {
    font-size: 14px;
    line-height: 24px;
    text-indent: 24px;
    margin-bottom: 4px;

    .n-button {
      width: auto;
      text-indent: 0;
    }

    .n-tag {
      text-indent: 0;
    }

    span {
      color: #18a058;
    }
  }

  &__text--spaced,
  &__step--spaced {
    margin-bottom: 12px;
  }

  &__secret {
    font-size: 12px;
    font-weight: 700;
  }

  &__qr-main,
  &__preview-main {
    display: flex;
    align-items: center;
    gap: 10px;

    .n-qr-code {
      box-sizing: content-box;
    }
  }

  &__preview-title {
    font-size: 36px;
    font-weight: 700;
    margin-bottom: 12px;
  }

  &__preview-code {
    width: 160px;
    height: 160px;
  }

  &__preview-side {
    margin-left: 10px;
  }
}
</style>
