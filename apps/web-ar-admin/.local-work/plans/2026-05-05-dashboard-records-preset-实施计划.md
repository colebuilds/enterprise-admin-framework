# Withdraw Dashboard Records Preset Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 让“出款看板”里的“今日订单”卡片跳转到“提现记录”时，按产品规则一次性带入商户、状态与完成时间筛选，同时不改坏提现记录页的原生默认行为。

**Architecture:** 保持 `withdrawOrder` 模块现有的“模块根 context + 子 Tab 自消费 preset”模式不变，把目前只支持 `withdrawState` 的 records preset 扩成结构化的一次性 preset 对象。商户优先级和“今天整天”的时间范围统一在 records 侧解析，继续复用记录页现有的商户时区逻辑，避免把时间语义散落到 dashboard 侧。

**Tech Stack:** Vue 3 `script setup`, TypeScript, Naive UI, `ProCrudTable`, `useTenantOptions`, `date-fns`, `date-fns-tz`, Vitest。

---

## 0. 已确认需求与边界

### 0.1 产品规则

1. 入口仅限：`出款看板 -> 今日订单 -> 提现记录`。
2. 看板未选商户时，跳转后记录页带左上角默认商户。
3. 看板选了多个商户时，跳转后只取所选数组的第一个商户 ID。
4. 跳转后清空 `申请时间`。
5. 跳转后把“今日 00:00:00 - 23:59:59.999”带入 `完成时间`。
6. “今日”必须按目标商户时区计算，不按浏览器本地时区计算。
7. 现有“今日订单卡片 -> withdrawState”带入逻辑必须保留。

### 0.2 本轮明确不做

1. 不改 `提现记录` 页直接进入时的原生默认值。
2. 不把 `提现记录` 页的商户筛选从单选改成多选。
3. 不改 `src/api/**`。
4. 不新增路由参数方案；继续沿用模块内 context 透传一次性 preset。

### 0.3 需要显式写进方案的行为

1. 本次 preset 只影响“本次跳转后的当前表单值”，不修改 `searchInitialValues`。
2. 因此用户从看板跳入后，如果点击记录页的“重置”，会回到记录页原生默认值：
   - 商户：默认商户
   - 申请时间：今天
   - 完成时间：空
3. 这是当前 `ProCrudTable` 机制下的最小改动方案；若产品要求“重置后仍保留看板入口 preset”，需要额外改 `searchInitialValues` 设计，本轮不做。

## 1. 相关代码现状分析

### 1.1 Dashboard 跳转入口

- `src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue`
  - `dashboardTenantIds` 是看板顶部商户筛选，类型为 `number[]`，支持 `multiple`。
  - `handleTodayOrderCardClick()` 当前只调用 `navigateToRecords(states)`，没有传商户，也没有传时间信息。

### 1.2 WithdrawOrder 模块级共享上下文

- `src/views/finance/withdrawOrder/shared.ts`
  - 当前上下文只定义了 `recordsPresetWithdrawStates: Ref<WithdrawStateEnum[] | null>`。
  - `navigateToRecords` 也只接收 `withdrawStates?: WithdrawStateEnum[]`。

- `src/views/finance/withdrawOrder/index.vue`
  - 当前模块根通过 `provideWithdrawOrderContext()` 注入 `recordsPresetWithdrawStates`。
  - `navigateToRecords()` 会把状态数组写入 ref，然后切到 `records` Tab。

### 1.3 Records 页默认行为

- `src/views/finance/withdrawOrder/records/useRecordsPage.ts`
  - `searchInitialValues` 会给记录页默认注入：
    - `tenantId = defaultTenantId`
    - `applyTimeRange = 商户时区今天整天`
  - 页面已有 `getTenantTimeZone()` + `date-fns-tz` 逻辑来计算商户时区的“今天”边界。

- `src/views/finance/withdrawOrder/records/columns.ts`
  - `tenantId` 是单选 `tenantSelect`。
  - `applyTimeRange` / `completeTimeRange` 都是 `proDateRange`。

### 1.4 Records preset 当前消费方式

- `src/views/finance/withdrawOrder/records/index.vue`
  - 当前只监听 `recordsPresetWithdrawStates`。
  - 生效时仅执行：
    - `setSearchParams({ withdrawState: [...] })`
    - `searchFromFirstPage()`
    - 清空 preset ref
  - 也就是说，商户和时间根本没有纳入本次 preset。

### 1.5 测试现状

- `src/views/finance/withdrawOrder/records/test/index.spec.ts`
  - 只覆盖“状态 preset 被消费并触发 reload”。
  - 还没有覆盖：
    - 商户带入
    - 申请时间清空
    - 完成时间设为今天
    - preset 等待切到 `records` Tab 后再消费

## 2. 推荐实现方案

### 2.1 方案选择

推荐继续沿用现有 context preset 模式，但把 preset 从“状态数组”升级成“结构化 records preset 对象”。

推荐原因：

1. 改动面最小，符合现有 `withdrawOrder` 模块组织方式。
2. 不需要引入路由 query，也不会污染其它 Tab。
3. 商户时区的“今天整天”继续由 records 侧计算，避免 dashboard 重复造一份时间规则。

### 2.2 不推荐的方案

1. 在 dashboard 侧直接算完整时间范围再传过去。
   - 问题：把 records 专属的商户时区时间规则复制到 dashboard，维护点变多。

2. 通过路由 query 透传 merchant/time。
   - 问题：当前模块是同页内 Tab 切换，不是跨路由切页；引入 query 会把临时状态暴露到 URL，超出本轮需求。

3. 直接改 `searchInitialValues` 让 preset 成为新默认值。
   - 问题：会影响直接进入 records 页和“重置”行为，不符合“只在本次跳转生效”的需求边界。

## 3. File Structure

- Modify: `src/views/finance/withdrawOrder/shared.ts`
  - 责任：定义结构化的 `WithdrawRecordsPreset` 类型，并更新模块上下文签名。

- Modify: `src/views/finance/withdrawOrder/index.vue`
  - 责任：把 records preset 存储从“状态数组”升级为“preset 对象”，并更新 `navigateToRecords()` 入参。

- Modify: `src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue`
  - 责任：在点击“今日订单”卡片时，按产品规则传入第一个商户 ID。

- Modify: `src/views/finance/withdrawOrder/records/useRecordsPage.ts`
  - 责任：复用并适度泛化“按商户时区计算今天整天”的 helper；必要时提供 records preset 应用所需的辅助方法。

- Modify: `src/views/finance/withdrawOrder/records/index.vue`
  - 责任：消费结构化 preset，一次性设置 `tenantId / withdrawState / applyTimeRange / completeTimeRange` 并触发刷新。

- Modify: `src/views/finance/withdrawOrder/records/test/index.spec.ts`
  - 责任：补齐 preset 消费相关测试。

## 4. 验收标准

1. 看板未选商户时，点击“今日订单”卡片，记录页商户为默认商户。
2. 看板选了多个商户时，记录页商户取所选数组的第一个商户 ID。
3. 跳转后 `withdrawState` 仍按卡片预设值带入。
4. 跳转后 `applyTimeRange` 为空。
5. 跳转后 `completeTimeRange` 为目标商户时区下“今天整天”。
6. preset 仅消费一次，消费完成后会清空，不会重复覆盖用户后续手工修改。
7. records 页直接进入时，默认行为仍保持现状不变。

## 5. 实施任务

### Task 1: 扩展模块级 records preset 契约

**Files:**

- Modify: `src/views/finance/withdrawOrder/shared.ts`
- Modify: `src/views/finance/withdrawOrder/index.vue`

- [ ] 定义结构化 preset 类型，例如：
  - `withdrawStates?: WithdrawStateEnum[]`
  - `tenantId?: number`
- [ ] 把 `recordsPresetWithdrawStates` 替换为 `recordsPreset`。
- [ ] 把 `navigateToRecords()` 从“接收状态数组”升级为“接收 preset 对象”。
- [ ] 保持 preset 仍然是模块内的一次性 ref，不改成持久状态。

**Validation:**

- TypeScript 能通过 `shared.ts` / `withdrawOrder/index.vue` 的类型约束。

### Task 2: 在 Dashboard 入口按产品规则构造 preset

**Files:**

- Modify: `src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue`

- [ ] 在 `handleTodayOrderCardClick()` 中读取 `dashboardTenantIds.value[0]`。
- [ ] 看板没选商户时传 `undefined`，让 records 侧走默认商户回退。
- [ ] 调整调用为结构化 preset，而不是仅传 `withdrawStates`。

**Validation:**

- 代码评审时确认：
  - 未对 `dashboardTenantIds` 排序或去重，直接使用当前 UI 选择数组的第一个元素。
  - 未把“完成时间”计算塞到 dashboard 侧。

### Task 3: 在 Records 页应用 preset，并复用商户时区“今天整天”逻辑

**Files:**

- Modify: `src/views/finance/withdrawOrder/records/useRecordsPage.ts`
- Modify: `src/views/finance/withdrawOrder/records/index.vue`

- [ ] 将当前仅用于 `applyTimeRange` 默认值的“今天整天” helper 泛化为可供 preset 复用的方法。
- [ ] records 侧在消费 preset 时按以下顺序解析目标商户：
  1. `preset.tenantId`
  2. `defaultTenantId`
- [ ] 调用 `setSearchParams()` 时一次性设置：
  - `tenantId`
  - `withdrawState`
  - `applyTimeRange: null`
  - `completeTimeRange: todayRange`
- [ ] 在调用 `searchFromFirstPage()` 前，若目标商户变化，主动刷新与商户相关的下拉源：
  - `withdrawCategoryOptions`
  - `withdrawChannelOptions`
- [ ] 消费成功后清空 preset ref，避免重复应用。
- [ ] 不修改 `searchInitialValues`，确保 records 页原始默认值不被入口 preset 污染。

**Validation:**

- 手工检查 `records/index.vue` 不再直接写死时间算法，而是复用 records 自身 helper。
- 手工检查 `applyTimeRange` 清空值使用的类型与 `ProCrudTable.setFieldsValue()` 兼容。

### Task 4: 补齐 preset 测试

**Files:**

- Modify: `src/views/finance/withdrawOrder/records/test/index.spec.ts`

- [ ] 将现有 mock 从 `recordsPresetWithdrawStates` 升级为结构化 `recordsPreset`。
- [ ] 覆盖“激活 records Tab 后才消费 preset”的现有时机逻辑。
- [ ] 新增断言，确认 `setSearchParams()` 至少收到：
  - `tenantId`
  - `withdrawState`
  - `applyTimeRange: null`
  - `completeTimeRange`
- [ ] 断言消费完成后 preset ref 被清空。

**Validation:**

- Run:

```bash
pnpm test:unit -- src/views/finance/withdrawOrder/records/test/index.spec.ts src/views/finance/withdrawOrder/records/test/columns.spec.ts
```

Expected:

- records preset 测试 PASS
- records 既有列测试 PASS

## 6. 风险与检查点

### 6.1 商户下拉是单选，Dashboard 是多选

风险：

- 开发时如果把整个数组直接塞给 records 页，会导致 `tenantSelect` 类型不匹配。

检查点：

- 只允许传 `dashboardTenantIds.value[0]`。

### 6.2 商户变更后的级联下拉源

风险：

- 如果只改 `tenantId` 表单值，不主动刷新 `提现大类 / 通道名称` 选项，UI 可能仍保留旧商户下拉源。

检查点：

- 在 records preset 应用路径里显式调用现有加载方法。

### 6.3 “重置”是否保留 preset

风险：

- 产品若期望“重置后仍保持完成时间=今天”，当前最小改动方案不满足。

当前结论：

- 本轮按“一次性 preset，不改 reset 基线”实施。

## 7. 建议执行顺序

1. 先改 `shared.ts` / `withdrawOrder/index.vue`，建立新的 preset 契约。
2. 再改 `DashboardPanel.vue`，让入口开始传商户。
3. 然后改 `records/useRecordsPage.ts` / `records/index.vue`，把 preset 真正消费掉。
4. 最后补 `records/test/index.spec.ts`，跑 targeted unit tests 验证。

## 8. 最终验证清单

1. 打开出款看板，不选商户，点击“今日订单”卡片。
   - 预期：记录页商户=默认商户，申请时间为空，完成时间=今天。
2. 在看板选择多个商户，点击“今日订单”卡片。
   - 预期：记录页商户=所选第一个商户 ID。
3. 修改记录页筛选后再次切回其它 Tab 再回 records。
   - 预期：不会再次被旧 preset 覆盖。
4. 在 records 页点击“重置”。
   - 预期：回到 records 页原生默认值，而不是保留看板 preset。
