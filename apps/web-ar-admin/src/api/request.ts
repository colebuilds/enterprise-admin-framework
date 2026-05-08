import { preferences } from '@vben/preferences';
import { RequestClient } from '@vben/request';
import { useAccessStore } from '@vben/stores';

import SparkMD5 from 'spark-md5';

import { message } from '#/adapter/naive';

export const requestClient = new RequestClient({
  baseURL: '/api',
});

// Alias for vben core files that import baseRequestClient (no refresh token in AR admin)
export const baseRequestClient = requestClient;

// ── Signing helpers ─────────────────────────────────────────────────────────

function randomInt(n: number): number {
  if (n <= 0) return -1;
  const limit = 10 ** n;
  const value = Math.floor(Math.random() * limit);
  if (value < limit / 10 && value !== 0) return randomInt(n);
  return value;
}

function sortObjectForSign(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const keys = Object.keys(obj)
    .filter((k) => !Array.isArray(obj[k]) && obj[k] !== '')
    .toSorted();
  for (const k of keys) {
    if (obj[k] !== null && obj[k] !== '') {
      result[k] =
        obj[k] && typeof obj[k] === 'object'
          ? sortObjectForSign(obj[k] as Record<string, unknown>)
          : obj[k];
    }
  }
  return result;
}

function removeArrayFields(value: unknown): unknown {
  if (Array.isArray(value)) return undefined;
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const next = removeArrayFields(v);
      if (next !== undefined) result[k] = next;
    }
    return result;
  }
  return value;
}

function resolveRequestLanguage(): string {
  return preferences.app.locale.split('-')[0] ?? 'zh';
}

function signBody(body: Record<string, unknown>): Record<string, unknown> {
  const language = resolveRequestLanguage();
  const random = randomInt(12);
  const withMeta = { ...body, language, random };
  const forSign = removeArrayFields(withMeta) as Record<string, unknown>;
  const sorted = sortObjectForSign(forSign);
  const signature = SparkMD5.hash(JSON.stringify(sorted))
    .toUpperCase()
    .slice(0, 32);
  const timestamp = Math.floor(Date.now() / 1000);
  return { ...withMeta, signature, timestamp };
}

// ── Interceptors ─────────────────────────────────────────────────────────────

// domainUrl: tenant backend resolves merchant by this header
// DEV: use the proxied API URL so backend knows which tenant; PROD: use actual origin
function resolveDomainUrl(): string {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_APP_TYPE === 'TENANT'
      ? import.meta.env.VITE_TENANT_API_URL
      : import.meta.env.VITE_API_BASE_URL;
  }
  return window.location.origin;
}

requestClient.addRequestInterceptor({
  fulfilled: async (config) => {
    const accessStore = useAccessStore();
    if (accessStore.accessToken) {
      config.headers.Authorization = `Bearer ${accessStore.accessToken}`;
    }

    config.headers.domainUrl = resolveDomainUrl();

    // Sign all POST/PUT/PATCH requests (even empty body) — backend requires signing fields
    const method = config.method?.toUpperCase();
    if (
      (method === 'POST' || method === 'PUT' || method === 'PATCH') &&
      !(config.data instanceof FormData)
    ) {
      config.data = signBody((config.data ?? {}) as Record<string, unknown>);
    }

    return config;
  },
});

requestClient.addResponseInterceptor<{ code: number; data: any; msg: string }>({
  fulfilled: (response) => {
    const { code, data, msg } = response.data;

    if (code === 0) return data;

    if (code === 4) {
      useAccessStore().setLoginExpired(true);
      return Promise.reject(new Error(msg || 'Login expired'));
    }

    message.error(msg || '操作失败');
    return Promise.reject(new Error(msg));
  },
  rejected: (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      useAccessStore().setLoginExpired(true);
    } else {
      message.error('网络异常，请重试');
    }
    return Promise.reject(error);
  },
});

export function uploadFile<T = any>(
  config: { url: string },
  params: { [key: string]: any; files: File | File[] },
  fieldName = 'files',
): Promise<T> {
  const fileList = Array.isArray(params.files) ? params.files : [params.files];
  const { files: _, ...rest } = params;
  const formData = new FormData();
  formData.append(fieldName, fileList[0] as Blob);
  for (const [key, value] of Object.entries(rest)) {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value));
    }
  }
  return requestClient.post<T>(config.url, formData);
}
