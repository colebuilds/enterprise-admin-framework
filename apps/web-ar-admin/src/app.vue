<script lang="ts" setup>
import type { GlobalComponentConfig, GlobalThemeOverrides } from 'naive-ui';

import { computed } from 'vue';

import { useNaiveDesignTokens } from '@vben/hooks';
import { preferences } from '@vben/preferences';

import {
  darkTheme,
  dateEnUS,
  dateIdID,
  dateViVN,
  dateZhCN,
  enUS,
  idID,
  lightTheme,
  NConfigProvider,
  NDialogProvider,
  NMessageProvider,
  NModalProvider,
  NNotificationProvider,
  viVN,
  zhCN,
} from 'naive-ui';

defineOptions({ name: 'App' });

const { commonTokens } = useNaiveDesignTokens();

const NAIVE_LOCALE_MAP = {
  'zh-CN': { locale: zhCN, dateLocale: dateZhCN },
  'en-US': { locale: enUS, dateLocale: dateEnUS },
  'vi-VN': { locale: viVN, dateLocale: dateViVN },
  'id-ID': { locale: idID, dateLocale: dateIdID },
};

const tokenLocale = computed(
  () =>
    NAIVE_LOCALE_MAP[preferences.app.locale as keyof typeof NAIVE_LOCALE_MAP]
      ?.locale ?? enUS,
);
const tokenDateLocale = computed(
  () =>
    NAIVE_LOCALE_MAP[preferences.app.locale as keyof typeof NAIVE_LOCALE_MAP]
      ?.dateLocale ?? dateEnUS,
);
const tokenTheme = computed(() =>
  preferences.theme.mode === 'dark' ? darkTheme : lightTheme,
);

const themeOverrides = computed(
  (): GlobalThemeOverrides => ({
    common: commonTokens,
  }),
);

const componentOptions: GlobalComponentConfig = {
  AutoComplete: { size: 'small' },
  Cascader: { size: 'small' },
  Button: { size: 'small' },
  DatePicker: { size: 'small' },
  Input: { size: 'small' },
  InputNumber: { size: 'small' },
  Select: { size: 'small' },
  TimePicker: { size: 'small' },
};
</script>

<template>
  <NConfigProvider
    :component-options="componentOptions"
    :date-locale="tokenDateLocale"
    :locale="tokenLocale"
    :theme="tokenTheme"
    :theme-overrides="themeOverrides"
    class="h-full"
    inline-theme-disabled
  >
    <NDialogProvider>
      <NModalProvider>
        <NNotificationProvider>
          <NMessageProvider>
            <RouterView />
          </NMessageProvider>
        </NNotificationProvider>
      </NModalProvider>
    </NDialogProvider>
  </NConfigProvider>
</template>
