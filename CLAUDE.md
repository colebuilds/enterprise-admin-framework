# AR Admin — 迁移项目 Claude 约定

## 项目性质

这是一次**重构式迁移**：将老项目（feat1-ar_platform_admin）迁移到 vben-admin 底座。迁移的角色是**架构师**，不是搬运工。可以重构，但产品功能逻辑不变。

老项目路径：`/Users/cola/Documents/gs/feat1-ar_platform_admin` 新项目路径：`/Users/cola/Documents/gr/vue-vben-admin/apps/web-ar-admin`（待建）

## 必读文档（每次 session 开始前确认）

- 迁移执行手册：`.migration/runbook.md` ← 当前阶段、当前任务、下一步
- 模块状态追踪：`.migration/tracker.md`
- E2E 用例清单：`.migration/e2e-inventory.md`
- 技术方案目录：`.migration/specs/`

## 路径与 Alias 规则

新项目（apps/web-ar-admin）使用 vben 的 alias 体系：

```
#/          →  apps/web-ar-admin/src/
@vben/xxx   →  packages/xxx（workspace 包）
```

**禁止**在新项目里使用 `@/` alias，那是老项目的。

## 两套 Store 并存规则（重要）

vben 内部的 store 和业务 store 严格分开，不要混用：

| Store | 包 | 用途 |
| --- | --- | --- |
| `useAccessStore` | `@vben/stores` | token、权限码、登录状态——vben 内部读 |
| `useUserStore` | `@vben/stores` | 基础用户信息（avatar/realName）——layout 读 |
| `useAppUserStore` | `#/store/app-user` | 完整业务用户信息、字典、商户列表——业务代码读 |

业务代码里所有 `userStore.xxx` 调用，迁移后指向 `useAppUserStore`，不要改成 vben 的 `useUserStore`。

**注意**：`useAppUserStore` 不含字典数据，字典统一走 `useDictOptions`（见下方字典规范）。

## 字典使用规范

完整规则见 `apps/web-ar-admin/src/composables/dict/CLAUDE.md`。

核心约束（高频违规）：

- 调用入口：`useDictOptions` / `useLabelMap`，从 `#/composables/dict` 导入
- 歧义 key（`countryList` / `currencyList` / `financialTypeList`）必须指定 source
- 禁止读 store、手改 registry.ts、使用旧 useDictionary hook

---

## 权限指令规则

保留 `v-permission` 指令名（老项目 44 处用法不改）。 **禁止**把 `v-permission` 改写成 vben 的 `v-access:code`。新实现内部读 `accessStore.accessCodes`，对外 API 不变。

## HTTP 客户端规则

业务代码通过 `requestClient` 调用接口：

```
requestClient.post / .get / .put / .delete / .patch  ← 直接用
uploadFile(config, params, fieldName)                ← 包装层，兼容老签名
```

**禁止**在业务代码里 import `axios` 直接使用。

## Env 变量规则

```
VITE_API_BASE_URL     ← 总控后台 API
VITE_TENANT_API_URL   ← 商户后台 API
VITE_APP_TYPE         ← ADMIN（默认）或 TENANT（脚本传入）
```

**禁止**使用老项目的 `VITE_GLOB_*` 前缀变量名。

## 组件使用优先级

1. **优先用 vben 组件**：`useVbenForm`、`VbenModal`、`VbenDrawer`、`CountTo`、`Cropper`
2. **次选 ProComponents**（已搬入 `#/components/pro/`）：`ProCrudTable`、`ProForm`、`ProDataTable`
3. **自建组件**：必须遵循 vben 主题变量体系（CSS 变量，不硬编码颜色）

新页面优先用 vxe-table（`useVbenVxeGrid`），老页面搬过来保持 ProCrudTable 不变。

## 样式规则

- 保留 Less（老组件迁移期间不强制 Tailwind 化）
- 颜色使用 CSS 变量：`var(--primary-color)` 而非 `#1890ff`
- 不修改无关组件的样式

## E2E 测试规则

```ts
// ✅ 语义选择器
page.getByRole('button', { name: '新增' });
page.getByRole('row').nth(1);
page.getByText('操作').first();

// ❌ 禁止 class 选择器
page.locator('.n-data-table-td');

// ✅ URL 直达导航
await page.goto('/system/user');

// ❌ 禁止点击侧边栏导航
await page.click('.layout-sider >> text=系统管理');
```

## 迁移行为约定

- **先写 e2e spec，再迁代码**，spec 跑通才算模块完成
- 迁移一个模块，只动这个模块的代码，不连带"顺手优化"其他地方
- 发现老项目技术债：记录到 runbook，不要在迁移中途插入重构
- TypeScript 类型报错：记录但不阻塞，打 `// TODO: fix type` 继续前进
- 每完成一个模块立即更新 `tracker.md` 和 `e2e-inventory.md`

## AI 分工规则（Claude Code + Codex MCP）

Codex MCP 已接入（`mcp__codex__codex`，ChatGPT Pro OAuth），按以下分工执行任务：

**Claude Code 负责（架构决策 + 需要理解 vben 内部）：**

- 设计方案、技术决策、代码审查
- 修改 App.vue、bootstrap.ts、vite.config.ts 等架构文件
- 验证结果、调试问题
- 审查 Codex 的输出再决定是否采用

**Codex 负责（机械性执行任务）：**

- 文件复制、目录操作
- 批量文本替换（import 路径、alias 等）
- 生成已知内容的样板文件（env、package.json scripts）
- 执行 shell 命令（pnpm install、tsc 检查）

**在 writing-plans 中的标注方式：**

```markdown
- [ ] **Step N: 任务描述** `→ Codex` Codex prompt: "具体指令，包含文件路径和预期结果"

- [ ] **Step N: 任务描述** `→ Claude Code` 直接执行，需要架构判断
```

调用 Codex 前先用 ToolSearch 加载 `mcp__codex__codex` schema，再调用。

## 可用 Slash Commands

| 命令 | 用途 |
| --- | --- |
| `/dict <关键词>` | 查字典 key：source、字段映射、用法示例 |
| `/dict-sync` | 全量同步字典（重跑脚本 + 更新 ALL_DYNAMIC_KEYS + DYNAMIC_FIELDS + spec-dict-keys.md） |
| `/i18n <关键词>` | 查翻译 key：zh-CN / en-US 值、用法示例；搜不到时给出添加指引 |
| `/i18n-check` | 检查 zh-CN / en-US 文件对齐、key 覆盖、空值 |
| `/i18n-fix <路径>` | 扫描指定目录/文件的多语言问题并直接修复 |

使用手册：`documents/guides/development/字典Slash-Commands速查手册.md`

---

## AI 产物存放规则（Superpowers 默认路径覆盖）

superpowers 插件默认把产物写到 `docs/superpowers/`，但 `docs/` 是 vben 官方 vitepress 文档站，禁止混入 AI 产物。

正确存放位置：

| 产物类型 | 正确位置 |
| --- | --- |
| 实施计划（writing-plans 产物） | `apps/web-ar-admin/.local-work/plans/` |
| 执行期设计规格（brainstorming 产物，实施完即归档） | `apps/web-ar-admin/.local-work/specs/` |
| 永久架构文档（团队长期参考的设计决策） | `apps/web-ar-admin/documents/design/technical/` |
| 已完成阶段设计（归档） | `apps/web-ar-admin/documents/archive/` |

**在调用 writing-plans 或 brainstorming skill 时，必须在 prompt 中指定上方路径，覆盖插件默认值。**

## 禁止事项

- 禁止安装 vben 底座没有的 UI 组件库
- 禁止修改 `packages/` 下的 vben 核心包
- 禁止使用 `any` 类型绕过所有 TypeScript 检查（单个字段除外）
- 禁止在没有 e2e 验收的情况下声称模块迁移完成
