# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## 项目概述

这是一个 **SaaS 商户管理后台系统**（AR Sass Tenant），基于 Naive UI Admin 构建。使用 Vue 3、Vite、TypeScript、Naive UI 和 Pinia。支持国际化（当前运行时启用 `en/zh/vi/id`）。

## 项目私有 Skills 本地入口（薄入口）

为支持“项目级别 skill 仅本地使用、不提交仓库”，约定如下：

- 私有目录：`/.repo-local-skills/`
- 目录用途：存放项目私有 `*/SKILL.md`，作为正式规范的补充，不替代项目硬规则
- 触发条件：
  - 用户明确点名某个私有 skill
  - 任务描述与某个私有 skill 的 `name/description/keywords` 明显命中
- 读取方式：先读取 metadata（`name/description/keywords`）做匹配，再按需读取命中的 `SKILL.md` 正文
- 推荐流程：优先使用 `/.repo-local-skills/registry.json` 做快速命中，必要时再读取目标 skill 正文
- 本地脚本：`python3 .repo-local-skills/scripts/find-skill.py <关键词>` 用于匹配，`python3 .repo-local-skills/scripts/load-skill.py <skill-name>` 用于按需加载正文
- 读取优先级：低于 `AGENTS.md`、`documents/README.md`、`documents/standards/ai-collaboration/*` 与正式 skills
- 兜底规则：未点名且未明显命中时，不默认全量读取 `/.repo-local-skills/`

## 文档落点与提交策略

- 先区分“正式项目文档”与“执行期工作文档”，不要把所有文档都视为 `documents/` 归档对象
- 正式项目文档：
  - 包括需求、产品说明、技术设计、架构决策、测试方案、验收结论、长期规范、长期指南等
  - 只要 `documents/` 存在职责匹配的目录，默认优先写入 `documents/`
  - 具体落点先由 `documents/README.md` 决定；`git ignore`、`info/exclude`、本地提交便利性都不能改变正式文档落点判断
- 执行期工作文档：
  - 包括 PIR / superpowers 产出的实施计划、执行清单、checkpoint、会话恢复快照、临时验证记录、局部实验草稿等
  - 默认写入 `/.local-work/`，不进入 `documents/`
  - 实施计划类文档默认落点：`/.local-work/plans/`
  - 会话恢复与上下文交接默认落点：`/.local-work/session-context/`
  - 若历史会话或旧工具已使用 `/.local-work/superpowers/plans/`，该路径仅作兼容读取；新的实施计划不要再默认写入该目录
- 如果同一主题同时包含“正式方案文档”和“执行期实施计划”：
  - 正式方案文档进 `documents/`
  - 执行期实施计划进 `/.local-work/`
- 只有当用户明确要求把实施计划本身作为长期项目知识沉淀，或该计划已升级为正式治理文档时，才允许把计划写入 `documents/`
- 当正式文档落点规则与本地 git 忽略规则冲突时，仍需优先遵守正式文档归档规则；但这条规则不应覆盖执行期工作文档的 `/.local-work/` 分流

## 常用命令

```bash
# 安装依赖
pnpm install

# 开发服务器（当前默认走 admin mode）
pnpm dev

# SIT 环境开发
pnpm sit

# 构建
pnpm build
pnpm build:tenant
pnpm build:master

# 代码检查
pnpm lint            # Oxc 检查并修复 src
pnpm typecheck       # Vue + TS 类型检查
pnpm lint:prettier   # Prettier 格式化
pnpm i18n:check      # i18n key 校验

# 测试
pnpm test:unit
pnpm test:unit:watch
pnpm test:e2e
pnpm test:e2e:headed
pnpm test:e2e:ui

# tools 域测试（与业务域测试分离）
pnpm test:knowledge
pnpm test:screenshot
```

## 测试命令与边界

- `test:unit` / `test:unit:watch`：业务域 Vitest，用于 `src/**/test/**/*.spec.ts`
- `test:e2e` / `test:e2e:headed` / `test:e2e:ui`：业务域 Playwright，用于 `tests/e2e/**/*.spec.ts`
- `test:knowledge` / `test:screenshot`：`tools/**` 子系统测试，**不要**和业务域测试混用
- 当前 `dispatch` 的真实登录型 E2E 依赖 `E2E_ADMIN_USERNAME` 与 `E2E_ADMIN_PASSWORD`；未提供时，相关已登录链路用例会跳过

## 架构说明

### 目录结构

- `src/api/` - API 模块，按业务域划分（account、agent、finance、operations 等）
- `src/views/` - 页面组件，与 API 业务域对应
- `src/router/modules/` - 按业务域定义的路由
- `src/store/modules/` - Pinia 状态管理（user、asyncRoute、tabsView、settings）
- `src/components/` - 可复用组件（ProComponents、TableAction、DictSelect 等）
- `src/hooks/` - 组合式函数（usePermission、useECharts、useExcel 等）
- `src/i18n/locales/` - 翻译文件（按 locale 与业务域组织）

### 重要约束（Codex 必须遵守）

> **⛔ 禁止直接操作 API 目录**
>
> Codex **严禁**执行以下操作：
>
> - **禁止**直接创建、修改、删除 `src/api/` 目录下的任何文件
> - **禁止**直接编辑 API 接口定义文件（`**/index.ts`）
> - **禁止**直接编辑 API 类型定义文件（`**/types.ts`）
> - **禁止**使用 Write、Edit 等工具操作 `src/api/**/*` 路径下的文件
>
> **正确做法**：必须使用 `npm run gen:api` 命令来生成和管理 API 接口文件
>
> 这确保了 API 接口的一致性和规范性。违反此约束将导致代码不一致。

> **⛔ 页面类型定义约束**
>
> - 页面内在可以直接使用接口请求类型、响应类型、DTO 类型时，**禁止重复自定义一份同构类型**
> - 页面类型优先从 `@/api/<module>` 直接导入；确实需要页面态组合时，优先基于接口类型使用 `Pick`、`Omit`、`Partial`、交叉类型或联合类型扩展
> - 页面内**尽量不要使用 `as`**；优先使用泛型、显式变量类型、类型守卫、`satisfies` 等方式让类型自然收敛
> - 只有在框架边界或第三方库类型缺失等无法避免的场景才允许使用 `as`，并且应尽量把范围缩到最小，避免 `as any` / `as unknown as`

> **⛔ 列表页目录结构与职责约束**
>
> - 所有新建或重构的列表页，默认采用“页面目录 + `index.vue` + `useXxxPage.ts` + `form.ts` + components”的结构
> - 页面入口统一使用 `src/views/<module>/<feature>/index.vue`，**禁止继续新增** `components/<Feature>Tab.vue` 这类页面壳文件
> - `index.vue` 只负责页面 UI 结构、`ProCrudTable` 绑定、查询列、表格列、操作列、权限常量和事件转发
> - `useXxxPage.ts` 负责接口请求、缓存、数据映射、格式化方法、弹窗打开、状态更新、列表刷新等页面行为
> - `form.ts` 负责页面表单模型和 `createXxxFormData` 默认值工厂；页面私有类型**不要再单独放 `types.ts`**
> - components 放页面用到的子组件
> - 仅当前页面使用的编辑弹窗、详情弹窗等业务组件，放在页面目录内，与 `index.vue` / `useXxxPage.ts` / `form.ts` 同级
> - 模块级 `components/`、`hooks/` 只用于跨页面复用；页面私有逻辑不要上提到模块公共目录
> - 内容很少的确认弹窗或配置弹窗，可直接在 `useXxxPage.ts` 中用 `h()` 创建，无需额外拆成 `.vue`
> - `src/hooks/` 只放全局或跨模块 hook；页面专用 hook 必须放在对应页面目录内
> - 列表页的 `index.vue` 和 `useXxxPage.ts` 需要补职责注释，至少覆盖权限常量、表格实例、查询列、表格列、操作列、缓存状态和核心方法

> **⛔ 样式深度选择器约束**
>
> - 样式默认使用 `<style lang="less" scoped>`
> - 只有在 `scoped` 样式中需要穿透子组件或 Naive UI 内部节点时，才允许使用 `::v-deep(<selector>)`
> - 非 `scoped` 样式块禁止使用 `:deep()`、`:v-deep()`、`::v-deep()`；此时应直接写标准后代选择器
> - 禁止继续新增 `:deep()` 或 `:v-deep()`，避免 Vite 8 / `lightningcss minify` 告警或构建失败

> **⛔ 配置文件与工具链文件格式优先级约束**
>
> - 当仓库已启用 ESM（如 `package.json` 存在 `"type": "module"`）时，新增或迁移配置文件、工具链文件时，**优先使用 `.ts`**
> - 若工具支持 ESM 但不支持 TypeScript，才退回 `.js` / `.mjs`
> - 只有在工具明确不支持 ESM 时，才允许继续使用 `.cjs`
> - 不得因为仓库中存在历史 `.cjs` / `.js` 文件，就默认沿用低优先级格式
> - 变更配置文件前，应先确认工具支持矩阵，再选择最终文件格式
>
> 适用对象包括但不限于：
>
> - `commitlint`
> - `vite` / `vitest`
> - 脚本配置
> - 工程工具配置

### 通用开发准则

- 开发前先熟悉本次任务相关模块的现有实现、入口文件与依赖关系，再决定修改点；不要在缺少上下文时直接开改
- 开发前初始化以建立总框架和入口地图为目标，优先识别任务相关模块与共享能力入口；具体实现细节在任务推进过程中按需加载，避免无边界全量扫描
- 优先复用公共组件、公共函数、公共 hooks、公共字典与共享工具；只有现有能力明显不适配当前需求时，才新增局部实现
- 修改公共组件、公共函数、公共 hooks 或共享工具时，默认保持向后兼容；若确需破坏性调整，必须先明确影响范围与迁移方案
- 实现以满足当前需求为目标，避免过度设计、提前抽象和为假设场景扩展复杂配置
- 保持代码结构平直可读，避免不必要的函数层级套娃；只有在确实提升复用性、可测试性或可读性时才继续拆分

### 核心模式

**动态路由生成**：路由根据后端菜单数据动态生成。权限系统根据用户信息中的 `authCode` 过滤 `asyncRoutes`（定义在 `src/router/modules/`）。

**权限检查**：使用 `usePermission()` hook：

```typescript
const { hasPermission } = usePermission();
// 在模板或逻辑中检查权限
hasPermission(['account:user:view']);
```

**HTTP 请求**：所有 API 调用通过 `src/utils/http/index.ts`。axios 实例特性：

- 自动从 storage 添加 Bearer token
- 处理 token 过期（跳转登录页）
- 通过 Naive UI 的 `$message` 显示错误信息

**表单组件**（`src/components/ProComponents/`）：页面表单与搜索表单统一使用 `ProForm` / `ProSearchForm`，通过 `createProForm`、`ProField`、`ProSearchFormColumn` 组织字段配置，底层适配 Naive UI 组件（如 `NInput`、`NSelect`、`NDatePicker`）。

**表格组件**：列表页统一使用 `src/components/ProComponents/` 下的 `ProCrudTable`，集成搜索表单、数据表格、分页、批量操作等能力；`src/components/Table/` 主要提供 `TableAction` 等表格辅助组件。

### 状态管理

- `useUserStore` - 认证 token、用户信息、权限、字典数据
- `useAsyncRouteStore` - 动态路由和菜单
- Storage 键名：`ACCESS_TOKEN`、`CURRENT_USER`（7 天过期）

### 环境变量

- 当前脚本与 env 的实际关系：
  - `pnpm dev`、`pnpm build:tenant` 走 `--mode admin`，主要读取 `.env.admin`
  - `pnpm sit` 走 `--mode sit`，主要读取 `.env.sit`
  - `pnpm build` 走生产构建，主要读取 `.env.production`
  - `pnpm build:master` 走 `--mode master`
- 仓库当前存在 `mode` 与平台目标耦合的历史现状；新增脚本、测试配置或 env 文件时，不要默认把 `mode` 直接等同为“环境维度”

路径别名：`@` 映射到 `src/`

### 提交规范

遵循 Angular 提交规范：

- `feat` - 新功能
- `fix` - Bug 修复
- `perf` - 性能优化
- `refactor` - 代码重构
- `style` - 代码风格（不影响逻辑）
- `docs` - 文档
- `chore` - 构建/工具变更
- 在当前仓库生成或修改 commit message 时，优先遵循 `/.repo-local-skills/commit-local/SKILL.md`
- `type`、`scope` 使用英文规范值，`subject` 默认使用简体中文；除非用户明确要求，否则不要使用全英文主题

### 开发者协作文案语言边界

- 面向当前仓库开发者的说明性文案默认使用简体中文，避免整句全英文；允许夹带必要的专业英文术语或通用缩写
- 适用范围包括：commit message 的 `subject` / `body`、测试标题（如 `describe` / `it`）、新增代码注释、面向维护者的本地脚本提示或说明文案
- 以下内容**不受此约束**：
  - 业务代码中的标识符、变量名、函数名、类型名、接口字段名、协议字段名、路由名、权限码、数据库字段名
  - 框架、库、规范、协议或行业通用英文术语及缩写，例如 `TDD`、`VIP`、`API`、`HTTP`、`DTO`、`URL`、`ID`、`USDT`
  - 多语言资源中的英文内容，尤其是 `i18n` 的 `en` / `ru` 等非中文 locale 文案；对应语言应保持目标语言自然表达，不需要强行混入中文
  - 面向最终用户且产品明确要求英文展示的业务文案、外部接口约定或第三方平台要求的固定英文内容

### GitHub Copilot 配置

项目已配置 GitHub Copilot 中文化支持：

- 配置文件：`.github/copilot-instructions.md`
- **所有 Copilot 代码审查反馈将使用简体中文**
- 审查规范与 `.Codex/commands/review.md` 保持一致
- 包含项目特定的 TypeScript、Vue 3、安全性等检查标准

## 页面开发工作流

### Skills 命令

| 命令                        | 说明               |
| --------------------------- | ------------------ |
| `/page-check [path]`        | 检查页面规范符合度 |
| `/page-optimize [path]`     | 分析并提供优化建议 |
| `/page-gen <module> <path>` | 生成标准 CRUD 页面 |

### 开发流程

1. **新页面开发**：使用 `/page-gen` 生成标准模板
2. **开发完成后**：使用 `/page-check` 检查规范
3. **代码审查时**：使用 `/page-optimize` 获取优化建议

### 自动触发建议

> **重要提示**：Codex 在以下场景应主动建议运行相关命令。

#### 修改 Vue 页面文件时

当用户修改 `src/views/**/*.vue` 文件后，建议运行：

```
/page-check <修改的文件路径>
```

检查内容包括：

- 组件命名是否符合规范
- 权限配置是否正确
- 国际化文本是否完整
- API 调用是否规范
- 表单/表格组件使用是否正确

#### 创建新页面时

当用户请求创建新页面时，建议使用：

```
/page-gen <module> <pageName>
```

该命令会自动创建：

- 页面组件文件（`src/views/<module>/<pageName>/`）
- 路由配置（`src/router/modules/<module>.ts`）
- API 接口（`src/api/<module>/<pageName>.ts`）
- 国际化文本（至少覆盖 `zh/en` 基线；若目标 namespace 已存在 `vi/id`，同步补齐对应 `src/i18n/locales/<locale>/<module>.json`）

#### 页面优化场景

当发现页面性能问题或代码质量问题时，建议运行：

```
/page-optimize <文件路径>
```

优化范围包括：代码结构、性能优化、最佳实践应用等。

### 其他常用 Skills

| 命令         | 说明                        |
| ------------ | --------------------------- |
| `/component` | 创建可复用组件              |
| `/api`       | 生成 API 接口文件           |
| `/i18n`      | 国际化处理                  |
| `/fix`       | 修复 TypeScript/ESLint 错误 |
| `/build`     | 构建项目                    |
| `/commit`    | Git 提交                    |
| `/review`    | 代码审查                    |

### 页面规范参考

- 标准页面模板：`src/views/system/user/user.vue`
- 详细规范文档：`docs/page-development-guide.md`
- 组件使用指南：`docs/components-guide.md`
