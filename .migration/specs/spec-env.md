# 技术方案 A — Env 变量重构

## 背景与问题

老项目 env 文件把**环境**和**业务类型**耦合在文件名里：

- `.env.admin` = 总控 dev（命名含业务类型）
- `.env.tenant` = 商户 dev
- `.env.sit` = 商户 SIT（命名是 sit 但实际是商户，欺骗性）
- 总控 SIT 根本没有 env 文件

变量名前缀 `VITE_GLOB_*` 无语义，历史遗留。

## 设计原则

> 环境变量只管环境（dev/sit/prod），业务类型（admin/tenant）通过脚本参数传入，两件事分开。

## After：新 env 结构

### 文件布局（apps/web-ar-admin/）

```
.env              ← 全局默认，所有模式共享
.env.dev          ← dev 环境（两套 API URL）
.env.sit          ← SIT 环境
.env.prod         ← 生产环境
.env.dev.local    ← 本地覆盖，git ignore，用于个人配置
```

### 文件内容

**.env**（全局默认）

```bash
VITE_APP_TITLE=AR Admin
VITE_APP_TYPE=ADMIN
VITE_ROUTER_HISTORY=hash
VITE_BASE=/
```

**.env.dev**

```bash
VITE_PORT=5173
VITE_API_BASE_URL=http://dev-admin.lottotest6688.com
VITE_TENANT_API_URL=http://dev-tenantadmin.lottotest6688.com
VITE_DROP_CONSOLE=false
```

**.env.sit**

```bash
VITE_PORT=5173
VITE_API_BASE_URL=https://sit-admin.lottotest6688.com
VITE_TENANT_API_URL=https://sit-tenantadmin.lottotest6688.com
VITE_DROP_CONSOLE=false
```

**.env.prod**

```bash
VITE_API_BASE_URL=https://admin.yourdomain.com
VITE_TENANT_API_URL=https://tenantadmin.yourdomain.com
VITE_DROP_CONSOLE=true
```

### package.json scripts

```json
{
  "scripts": {
    "dev": "vite --mode dev",
    "dev:tenant": "cross-env VITE_APP_TYPE=TENANT vite --mode dev",
    "build:sit": "vite build --mode sit",
    "build:sit:tenant": "cross-env VITE_APP_TYPE=TENANT vite build --mode sit",
    "build:prod": "vite build --mode prod",
    "build:prod:tenant": "cross-env VITE_APP_TYPE=TENANT vite build --mode prod",
    "preview": "vite preview",
    "gen:api": "esno ./tools/api.ts",
    "typecheck": "vue-tsc --noEmit --skipLibCheck",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## vite.config.ts 关键配置

```ts
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  // 根据 VITE_APP_TYPE 选代理目标
  // process.env 优先于 env 文件（cross-env 注入的变量走 process.env）
  const appType = process.env.VITE_APP_TYPE ?? env.VITE_APP_TYPE ?? 'ADMIN';
  const apiTarget =
    appType === 'TENANT' ? env.VITE_TENANT_API_URL : env.VITE_API_BASE_URL;

  return {
    server: {
      port: Number(env.VITE_PORT) || 5173,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          ws: true,
        },
      },
    },
    define: {
      // 注入到客户端代码
      'import.meta.env.VITE_APP_TYPE': JSON.stringify(appType),
    },
  };
});
```

## 废弃变量对照表

| 老变量 | 新变量 | 说明 |
| --- | --- | --- |
| `VITE_GLOB_API_URL` | `VITE_API_BASE_URL` | 去掉 GLOB |
| `VITE_GLOB_API_URL_PREFIX` | 删除 | 固定 /api，写死在 request.ts |
| `VITE_GLOB_UPLOAD_URL` | 删除 | 由 `VITE_API_BASE_URL + /Upload/UploadToOss` 拼接 |
| `VITE_GLOB_IMG_URL` | `VITE_IMG_BASE_URL`（按需） | 如有用到再加 |
| `VITE_USE_MOCK` | 删除 | vben 无此模式 |
| `VITE_LOCAL_PROXY` | 删除 | vite.config 统一处理 |
| `VITE_BUILD_COMPRESS` | 删除 | vben 内部处理 |
| `VITE_PUBLIC_PATH` | `VITE_BASE` | vben 标准名 |

## 依赖

```bash
pnpm add -D cross-env
```

## 验证方法

```bash
# 启动总控 dev，检查 Network /api 请求打到 dev-admin 域名
pnpm dev

# 启动商户 dev，检查 Network /api 请求打到 dev-tenantadmin 域名
pnpm dev:tenant

# 代码中读取业务类型
import.meta.env.VITE_APP_TYPE  // 'ADMIN' 或 'TENANT'
```
