<template>
  <component :is="activePage" />
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useAppUserStore } from '#/store/app-user';
import PlatformUserPage from './PlatformUserPage.vue';
import TenantUserPage from './TenantUserPage.vue';

const userStore = useAppUserStore();

// 总控用户（orgId === 0）使用总控页面，商户用户使用商户页面
const activePage = computed(() =>
  userStore.isPlatformUser ? PlatformUserPage : TenantUserPage,
);
</script>
