// TODO: Phase 1.5 — full i18n setup with vue-i18n, namespaces, locale switching
import { createI18n } from 'vue-i18n';

export const i18n = createI18n({
  legacy: false,
  locale: 'zh',
  fallbackLocale: 'en',
  messages: {},
});

export function setupI18n() {
  return i18n;
}
