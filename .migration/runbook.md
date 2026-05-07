# 迁移执行手册（Runbook）

> 每次开新 session 先读这个文件，确认当前阶段和下一步任务。
> 完成一项立即打 ✅ 并更新"当前状态"。

## 当前状态

**阶段：** 1 — 基础设施
**当前任务：** 1.2 ProComponents 搬入
**下一步：** 复制 ProComponents → src/components/pro/，修改 @/ → #/ alias

---

## 阶段 0 — 准备（文档与脚手架）

### 文档建立
- [x] CLAUDE.md（vben 项目根目录）
- [x] spec-env.md
- [x] spec-request.md
- [x] spec-access.md
- [x] spec-i18n.md
- [x] spec-dict.md
- [x] runbook.md（本文件）
- [ ] tracker.md（模块状态追踪）
- [ ] e2e-inventory.md（E2E 用例清单）
- [ ] component-guide.md（组件使用规范）

### 脚手架搭建
- [x] 复制 apps/web-naive → apps/web-ar-admin
- [x] 修改 package.json name 为 @vben/web-ar-admin
- [x] 清空 src/views/ 业务示例页（保留 _core/）
- [x] 建立 env 文件结构（参考 spec-env.md）
- [x] 更新 pnpm-workspace.yaml
- [x] 安装 cross-env 依赖
- [x] pnpm install
- [x] pnpm dev 验证启动成功（看到登录页）

**验收：** `pnpm dev` 启动，浏览器显示 vben 登录页，无编译错误。✅

---

## 阶段 1 — 基础设施

> 依赖阶段 0 完成。此阶段按顺序执行，每项完成后验证再进下一步。

### 1.1 HTTP 客户端（参考 spec-request.md）✅
- [x] 建 src/api/request.ts（requestClient + uploadFile 兼容层）
- [x] 迁移 tools/ 目录（gen:api 脚本）
- [x] 修改 gen:api 模板（import 路径 + http → requestClient）
- [x] 跑 gen:api，生成所有 src/api/ 模块（585 APIs / 12 模块）
- [x] vue-tsc 验证编译：0 错误（verbatimModuleSyntax + GET params 修复）

**验收：** requestClient 能发出请求，Network 面板确认。（待 1.3 登录打通后验收）

### 1.2 ProComponents 搬入
- [ ] 复制 ProComponents → src/components/pro/
- [ ] 复制 Table/ → src/components/table/
- [ ] 复制 DictSelect/ → src/components/dict-select/
- [ ] 修改内部所有 @/ → #/
- [ ] 修改 useUserStore → useAppUserStore（import 路径）

**验收：** import ProCrudTable 无报错。

### 1.3 登录 + accessStore 打通（参考 spec-access.md）
- [ ] 建 src/store/app-user.ts（appUserStore 完整实现）
- [ ] 建 src/store/auth.ts（登录/登出 action）
- [ ] 建 src/directives/permission.ts（v-permission 新实现）
- [ ] 建 src/hooks/usePermission.ts
- [ ] 建 src/router/access.ts（generateAccess）
- [ ] 迁入 asyncRoutes（router/routes/modules/）
- [ ] 修改 route meta: permissions → authority，sort → order
- [ ] 配置 guard（vben 内置 + i18n 追加）

**验收：** 能用真实账号登录，看到 dashboard welcome 页，菜单按权限显示。

### 1.4 五类字典链路（参考 spec-dict.md）
- [ ] 登录 action 里调 loadBaseDicts()（common + group + v1）
- [ ] dynamicDictionary store 迁入
- [ ] useDictionary hook 迁入
- [ ] DictSelect 组件迁入

**验收：** 登录后 appUserStore.dictionary 有值，smoke/dict-loading.spec.ts 通过。

### 1.5 多语言（参考 spec-i18n.md）
- [ ] 建 src/locales/ 结构
- [ ] 迁入 langs/en、zh、vi、id 所有语言文件
- [ ] 实现 loadNamespaces + PATH_NAMESPACE_MAP
- [ ] 配置 naive-ui locale（vi/id fallback to en-US）
- [ ] 语言切换后重拉字典

**验收：** 切换语言后页面文字更新，naive-ui 组件语言同步。

### 阶段 1 整体验收
- [ ] smoke/auth.spec.ts 全绿
- [ ] smoke/app-shell.spec.ts 全绿
- [ ] smoke/dict-loading.spec.ts 全绿

---

## 阶段 2 — 第一个模块（全链路验证）

目标模块：`system/user`

- [ ] 在老项目写 e2e/system/user.spec.ts
- [ ] 老项目跑通 spec（基准确立）
- [ ] 迁移 src/views/system/user/ 到新项目
- [ ] 迁移 src/api/system/ 相关接口
- [ ] 新项目跑通同一 spec

**验收：** e2e/system/user.spec.ts 在新项目全绿。

---

## 阶段 3 — 模块迭代

每个模块节奏：
1. 写 e2e spec → 老项目跑通
2. 迁移代码到新项目
3. 同一 spec 在新项目跑通
4. 更新 tracker.md 和 e2e-inventory.md

模块优先级（参考 tracker.md）：
system → tenant → dashboard → member → report → finance → game → operations → analytics

---

## 阶段 4 — 运行时旁路

- [ ] AWS Amplify WebSocket（adminWs store）
- [ ] SSE Stream hook（useSSEStream）

---

## 阻塞问题记录

| 日期 | 问题描述 | 状态 |
|------|---------|------|
| — | — | — |

---

## 关键路径记录

- 老项目路径：`/Users/cola/Documents/gs/feat1-ar_platform_admin`
- 登录接口：`POST /api/Login/Login`（不是 /auth/login）
- 测试账号：见 memory/project_test_credentials.md
- gen:api swagger 源：`https://dev-adminapi.lottotest6688.com/api-doc/`
