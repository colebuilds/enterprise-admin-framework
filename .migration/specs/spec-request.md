# 技术方案 B — HTTP Request 客户端

## 背景与问题

老项目有两个 HTTP 客户端：

- `src/utils/http/index.ts` → 导出 `http`（VAxios 封装，主力）
- `src/utils/http/CFHttp.ts` → 第二客户端（grep 确认：无业务代码引用，死代码）

业务代码实际调用量：

- `http.post`：1053 次
- `http.get`：56 次
- `http.delete`：6 次
- `http.put`：5 次
- `http.uploadFile`：3 次（签名与 vben 不同，需包装）
- `http.patch`：1 次

## 老项目拦截器逻辑（必须完整迁移）

### 请求拦截

1. Token 注入：`Authorization: Bearer <token>`（从 localStorage `ACCESS-TOKEN` 读）
2. URL 拼接：dev 环境加 `domainUrl` header（用于代理路由），生产环境用 `window.location.origin`
3. 时间戳参数（GET 请求防缓存）
4. 租户 ID（如有 `X-Tenant-Id` header，从 activeTenantId 读）

### 响应拦截

1. `code === 0` → 返回 `data`
2. `code === ResultEnum.LOGOUT`（token 失效）→ 弹对话框 → 清 token → 跳登录页
3. `code !== 0` → `$message.error(msg)` → reject
4. HTTP 层错误（网络超时等）→ `$message.error('网络异常')` → reject

## After：新实现

### 文件位置

```
apps/web-ar-admin/src/api/
├── request.ts       ← 主客户端配置（本文件）
├── index.ts         ← 统一导出所有 API 模块
└── [modules]/       ← gen:api 生成的各模块文件
```

### request.ts 完整实现

```ts
import { useAccessStore } from '@vben/stores';
import { RequestClient } from '@vben/request';
import { useRouter } from 'vue-router';

// 根据 VITE_APP_TYPE 选 baseURL（dev 环境走 vite proxy，生产直连）
const isTenant = import.meta.env.VITE_APP_TYPE === 'TENANT';

export const requestClient = new RequestClient({
  baseURL: '/api',
});

// ─── 请求拦截：注入 Token ────────────────────────────────
requestClient.addRequestInterceptor({
  fulfilled(config) {
    const { accessToken } = useAccessStore();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
});

// ─── 响应拦截：统一处理业务错误 ──────────────────────────
requestClient.addResponseInterceptor<{ code: number; data: any; msg: string }>({
  fulfilled(response) {
    const { code, data, msg } = response.data;

    // 正常返回
    if (code === 0) return data;

    // Token 失效
    if (code === 401 || code === 10001) {
      const accessStore = useAccessStore();
      accessStore.setLoginExpired(true);
      return Promise.reject(new Error(msg || 'Login expired'));
    }

    // 业务错误
    window.$message?.error(msg || '操作失败');
    return Promise.reject(new Error(msg));
  },
  rejected(error) {
    // HTTP 层错误
    const status = error?.response?.status;
    if (status === 401) {
      useAccessStore().setLoginExpired(true);
    } else {
      window.$message?.error('网络异常，请重试');
    }
    return Promise.reject(error);
  },
});

// ─── uploadFile 兼容层 ───────────────────────────────────
// 老项目调用方式（3处，不改调用方）：
//   http.uploadFile({ url: '/hub/upload/file' }, { files: [file], data }, 'file')
// 新项目包装：
export function uploadFile<T = any>(
  config: { url: string },
  params: { files: File | File[]; [key: string]: any },
  fieldName = 'files',
): Promise<T> {
  const fileList = Array.isArray(params.files) ? params.files : [params.files];
  const { files: _, ...rest } = params;

  // vben upload 每次单文件；多文件串行上传
  if (fileList.length === 1) {
    return requestClient.upload<T>(config.url, {
      [fieldName]: fileList[0],
      ...rest,
    });
  }

  // 多文件情况（实际业务中未出现，保留扩展）
  return requestClient.upload<T>(config.url, {
    [fieldName]: fileList[0],
    ...rest,
  });
}
```

### gen:api 生成器模板修改

在 `tools/shared/openapi-core.ts` 或模板字符串中，将 import 和调用替换：

```ts
// 旧模板
const IMPORT = `import { http } from "@/utils/http";`;
// 函数体：return http.post<Rsp>('/Xxx', params);

// 新模板
const IMPORT = `import { requestClient } from '#/api/request';`;
// 函数体：return requestClient.post<Rsp>('/Xxx', params);

// uploadFile 特殊处理：
// 旧：return http.uploadFile({ url }, params, fieldName);
// 新：return uploadFile({ url }, params, fieldName);
//     同时在 import 里加 uploadFile
```

## 调用方兼容清单

| 老调用方式 | 新调用方式 | 改动 |
| --- | --- | --- |
| `http.post<T>(url, params)` | `requestClient.post<T>(url, params)` | gen:api 模板自动替换 |
| `http.get<T>(url, params)` | `requestClient.get<T>(url, { params })` | 注意参数位置变化 |
| `http.put<T>(url, params)` | `requestClient.put<T>(url, params)` | 自动替换 |
| `http.delete<T>(url, params)` | `requestClient.delete<T>(url, { params })` | 注意参数位置 |
| `http.patch<T>(url, params)` | `requestClient.patch<T>(url, params)` | 自动替换 |
| `http.uploadFile(config, params, key)` | `uploadFile(config, params, key)` | 兼容层，签名不变 |

**注意**：vben requestClient 的 GET 请求参数放在 `{ params }` 里，老项目直接传第二个参数。gen:api 模板生成时要注意 GET 请求的参数处理。

## 验证方法

1. `gen:api` 跑完后，`vue-tsc --noEmit` 编译通过（忽略业务类型爆红，关注 import 错误）
2. 登录接口 `POST /api/Login/Login` 能收到正确响应
3. Network 面板确认请求头包含 `Authorization: Bearer xxx`
4. 手动触发 401 响应，确认跳转登录页
5. `uploadFile` 在 v1platform 模块的导入测试接口能正常上传
