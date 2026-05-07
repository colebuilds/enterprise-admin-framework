import { RequestClient } from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message } from '#/adapter/naive';

export const requestClient = new RequestClient({
  baseURL: '/api',
});

// Alias for vben core files that import baseRequestClient (no refresh token in AR admin)
export const baseRequestClient = requestClient;

requestClient.addRequestInterceptor({
  fulfilled: async (config) => {
    const accessStore = useAccessStore();
    if (accessStore.accessToken) {
      config.headers.Authorization = `Bearer ${accessStore.accessToken}`;
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
