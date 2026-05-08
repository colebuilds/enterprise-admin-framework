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

### 工具链（与 gen:api 纪律相同）

```
tools/dict-keys-meta.ts  ← 【手动维护】key 中文元数据，唯一手改入口
        ↓ 重跑脚本
src/composables/dict/registry.ts  ← 【生成产物】禁止手改
```

重跑命令：`pnpm --filter web-ar-admin exec esno tools/dict-snapshot.ts`

**触发时机**：后端新增/修改字典 key、发现新歧义 key → 必须重跑，不得手改 registry.ts。

### 查 key 的流程

1. 需要某类下拉数据 → 先查 `.migration/specs/spec-dict-keys.md` 找中文含义对应的 key
2. 用 `useDictOptions(key)` 消费，**禁止直接读任何 store 或 queryClient**
3. 歧义 key（`countryList` / `currencyList` / `financialTypeList`）必须加 `source` 参数，否则编译报错

### API

```ts
import { useDictOptions, useLabelMap } from '#/composables/dict';

// 下拉选项（ComputedRef<DictOption[]>，响应式）
const statusOptions = useDictOptions('enableStateList'); // 自动推断 source
const roleOptions = useDictOptions('roleList'); // dynamic，自动懒加载
const countryOpts = useDictOptions('countryList', 'platform'); // 歧义 key 必须指定 source

// value → label 查找 Map（用于表格列渲染）
const statusMap = useLabelMap('enableStateList');
// 模板中：{{ statusMap.get(row.status) }}
```

### 常用 key 速查（高频场景）

| 业务描述 | key | source |
| --- | --- | --- |
| 启用/禁用状态 | `enableStateList` | common（自动） |
| 商户状态 | `tenantStateList` | common（自动） |
| 充值订单状态 | `rechargeStateList` | common（自动） |
| 提现订单状态 | `withdrawStateList` | common（自动） |
| 提现工单状态 | `withdrawWorkStateList` | common（自动） |
| 商户列表 | `tenantList` | dynamic（自动） |
| 角色列表 | `roleList` | dynamic（自动） |
| 提现大类（商户配置） | `withdrawCategoryList` | dynamic（自动） |
| 充值大类（商户配置） | `rechargeCategoryList` | dynamic（自动） |
| 国家（平台基础数据） | `countryList` | `'platform'`（歧义，必须指定） |
| 国家（后台自定义） | `countryList` | `'common'`（歧义，必须指定） |
| 系统支付通道 | `sysPayChannelList` | dynamic（自动） |

### dynamic dict CRUD 后失效

如果当前页面有增删改 dynamic dict 数据的操作，成功后需要失效缓存：

```ts
import { queryClient } from '#/lib/query-client';
import { DICT_QUERY_KEY } from '#/store/dict';
queryClient.invalidateQueries({ queryKey: DICT_QUERY_KEY.dynamic });
```

### 禁止的旧写法

```ts
// ❌ 直接读 store
userStore.getDictionaryList?.enableStateList;

// ❌ 老 useDictionary hook
const { getOptions } = useDictionary();
getOptions('enableStateList', { source: 'common' });

// ❌ 动态字典 store 手动 load
const dictStore = useDynamicDictionaryStore();
await dictStore.load('roleList');

// ❌ 手改 registry.ts
```

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
