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
import { clearDictCache, prefetchStaticDicts } from './dict';

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

      const { token } = await api.admin.login({
        userName: params.username as string,
        pwd: params.password as string,
      });
      accessStore.setAccessToken(token);

      const vbenUserInfo = await fetchUserInfo();

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

    const info = await api.admin.getSysUserInfo();
    appUserStore.setUserInfo(info);

    // 登录后预热 4 条静态字典（non-blocking，TanStack Query cache）
    // dynamic dict 按需懒加载，不在此预热
    prefetchStaticDicts();

    const codes = appUserStore.getPermissionCodes;

    // localhost sentinel — grants full access in local dev
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

    const vbenUserInfo = {
      avatar: '',
      homePath: '/system/user',
      realName: info.userName,
      roles: codes,
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

    // 清理字典 cache，防止旧用户数据残留
    clearDictCache();

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
