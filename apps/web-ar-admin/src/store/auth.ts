import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { defineStore } from 'pinia';

import { notification } from '#/adapter/naive';
import { api } from '#/api';
import { $t } from '#/locales';

import { useAppUserStore } from './app-user';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  async function authLogin(
    params: Record<string, any>,
    onSuccess?: () => Promise<void> | void,
  ) {
    try {
      loginLoading.value = true;

      // 1. Login — map form field names to AR admin API field names
      const { token } = await api.admin.login({
        userName: params.username as string,
        pwd: params.password as string,
      });
      accessStore.setAccessToken(token);

      // 2. Fetch user info (permission codes + user details)
      const vbenUserInfo = await fetchUserInfo();

      // 3. Navigate
      if (accessStore.loginExpired) {
        accessStore.setLoginExpired(false);
      } else {
        onSuccess
          ? await onSuccess()
          : await router.push(
              vbenUserInfo.homePath || preferences.app.defaultHomePath,
            );
      }

      if (vbenUserInfo.realName) {
        notification.success({
          content: $t('authentication.loginSuccess'),
          description: `${$t('authentication.loginSuccessDesc')}:${vbenUserInfo.realName}`,
          duration: 3000,
        });
      }
    } finally {
      loginLoading.value = false;
    }
  }

  async function fetchUserInfo() {
    const appUserStore = useAppUserStore();

    // Fetch full user info from AR admin
    const info = await api.admin.getSysUserInfo();
    appUserStore.setUserInfo(info);

    // Extract permission codes from menus tree (flat walk)
    const codes = appUserStore.getPermissionCodes;

    // Add localhost sentinel for local dev permissions
    const hostname = globalThis.location?.hostname ?? '';
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
    ) {
      codes.push('localhost');
    }

    accessStore.setAccessCodes(codes);

    // Sync minimal info to vben userStore (used by layout header etc.)
    const vbenUserInfo = {
      avatar: '',
      homePath: '/dashboard/welcome',
      realName: info.userName,
      roles: [] as string[],
      userId: String(info.userId),
      username: info.userName,
    };
    userStore.setUserInfo(vbenUserInfo);

    return vbenUserInfo;
  }

  async function logout(redirect = true) {
    try {
      await api.admin.loginOff();
    } catch {
      // ignore logout errors
    }
    resetAllStores();
    accessStore.setLoginExpired(false);

    await router.replace({
      path: LOGIN_PATH,
      query: redirect
        ? { redirect: encodeURIComponent(router.currentRoute.value.fullPath) }
        : {},
    });
  }

  function $reset() {
    loginLoading.value = false;
  }

  return { $reset, authLogin, fetchUserInfo, loginLoading, logout };
});
