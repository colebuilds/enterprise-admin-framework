import type { App } from 'vue';

import type { LocaleSetupOptions, SupportedLanguagesType } from '@vben/locales';

import {
  $t,
  setupI18n as coreSetup,
  loadLocalesMapFromDir,
} from '@vben/locales';
import { preferences } from '@vben/preferences';

const modules = import.meta.glob('./langs/**/*.json');

const localesMap = loadLocalesMapFromDir(
  /\.\/langs\/([^/]+)\/(.*)\.json$/,
  modules,
);

/**
 * 加载应用特有的语言包
 * 这里也可以改造为从服务端获取翻译数据
 * @param lang
 */
async function loadMessages(lang: SupportedLanguagesType) {
  const appLocaleMessages = await localesMap[lang]?.();
  const raw = appLocaleMessages?.default;
  if (!raw) return {};
  // Each JSON file wraps its content in a top-level key matching the filename.
  // loadLocalesMapFromDir already keys by filename, so we'd get double nesting
  // (e.g. messages.menu.menu.user). Flatten one level to get messages.menu.user.
  const merged: Record<string, unknown> = {};
  for (const content of Object.values(raw)) {
    Object.assign(merged, content as Record<string, unknown>);
  }
  return merged;
}

const SUPPORTED_LOCALES: ReadonlySet<string> = new Set(['en-US', 'zh-CN']);

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  await coreSetup(app, {
    defaultLocale: preferences.app.locale,
    loadMessages,
    // Suppress warnings for unsupported intermediate locales (e.g. 'zh' implicit
    // fallback from vue-i18n when locale is 'zh-CN'). Those are never actionable.
    missingWarn: !import.meta.env.PROD,
    ...options,
  });

  // Override the missing handler installed by coreSetup to skip unsupported locales.
  if (!import.meta.env.PROD) {
    const { i18n: i18nInstance } = await import('@vben/locales');
    i18nInstance.global.setMissingHandler((locale, key) => {
      if (SUPPORTED_LOCALES.has(locale) && key.includes('.')) {
        console.warn(
          `[intlify] Not found '${key}' key in '${locale}' locale messages.`,
        );
      }
    });
  }
}

export { $t, setupI18n };
