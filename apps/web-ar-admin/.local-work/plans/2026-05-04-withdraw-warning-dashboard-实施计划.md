# Withdraw Warning Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在远程出款数据面板中补齐“实时预警状态”统计卡、“异常风控预警”列表，以及“订单池预警配置”弹窗，并基于新生成的 `WithdrawStaticDay/*` API 跑通主流程。

**Architecture:** 保持现有 `dashboard/` 模块结构不变，在 `DashboardPanel.vue` 上增量接入第 4 组统计卡，并把“异常风控预警”拆成页面私有组件，避免把主面板继续堆大。列表部分使用 `ProCrudTable` 承接筛选、表格与操作列；时间筛选复用 `ProDateRangeInput` 的 UTC+0 字面协议逻辑；订单池配置弹窗使用页面私有 `NModal` 组件按后端返回的币种配置直接渲染，不做前端硬编码币种兜底。

**Tech Stack:** Vue 3 `script setup`, TypeScript, Naive UI, `ProCrudTable`, `ProDateRangeInput`, `useDictionary({ source: 'common' })`, generated `@/api/withdraw`, Vitest。

---

## 0. 已确认需求与约束

### 0.1 产品范围

1. 顶部统计区新增第 4 组 `实时预警状态`，只做展示，不做点击跳转。
2. 异常风控预警列表只支持两个筛选项：
   - `预警类型`
   - `时间范围`
3. `处理状态` 只在表格列中展示，不出现在筛选区。
4. 订单池预警配置通过弹窗实现，不能漏掉。

### 0.2 接口来源

1. 统计卡片：`getDashboardData`
   - `todayAuditTimeoutWarningCount`
   - `todayPauseTimeoutWarningCount`
2. 异常预警列表：`getWithdrawWarningList`
3. 解除异常：`recoverExceptionRecord`
4. 订单池配置读取：`getOrderPoolWarningConfig`
5. 订单池配置保存：`saveOrderPoolWarningConfig`

### 0.3 字典与显示规则

1. `预警类型` 只能读取 `warningCategoryTypeMap['2']`，不做前端枚举兜底。
2. `触发商户` 按 `(${tenantId})${tenantName}` 展示。
3. `触发用户` 只展示 `userName`。
4. `triggerTenantId = 0` / `triggerUserId = 0` 时统一显示 `--`。

### 0.4 时间与默认值

1. 默认查询最近 7 天。
2. 默认区间定义为：
   - 开始：今日往前 6 天 `00:00:00.000`
   - 结束：今日 `23:59:59.999`
3. 时间筛选必须走项目现有的 UTC+0 字面协议逻辑，保证回显日期正确。

### 0.5 订单池预警配置校验

1. `待派发订单数预警阈值`
   - 必填
   - `min = 0`
   - `max = 99999`
2. `预警推送频率`
   - 必填
   - `min = 1`
   - `max = 1440`

### 0.6 本轮明确不做

1. 不新增独立权限码设计；先沿用现有 dashboard 可见/可操作边界。
2. 不新增自定义 warning type 枚举 fallback。
3. 不硬编码订单池币种与默认配置。
4. 不改 `src/api/**` 手写内容，API 只使用已生成结果。

## 1. File Structure

- Modify: `src/views/finance/withdrawOrder/dashboard/useDashboardPage.ts` 责任：把 `todayAuditTimeoutWarningCount` / `todayPauseTimeoutWarningCount` 纳入看板共享状态，并提供新的统计卡配置。

- Modify: `src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue` 责任：渲染第 4 组 `实时预警状态` 卡片，并挂载新的异常预警列表组件。

- Create: `src/views/finance/withdrawOrder/dashboard/components/WithdrawWarningSection.vue` 责任：承接异常风控预警列表、筛选、表格、解除异常动作和“订单池预警配置”按钮。

- Create: `src/views/finance/withdrawOrder/dashboard/components/OrderPoolWarningConfigModal.vue` 责任：读取/编辑/保存订单池预警配置。

- Create: `src/views/finance/withdrawOrder/dashboard/warningHelpers.ts` 责任：沉淀本轮新增的纯逻辑，包括默认 7 天范围、字典子集提取、商户/用户显示格式化。

- Modify: `src/i18n/locales/zh/finance.json`
- Modify: `src/i18n/locales/en/finance.json`
- Modify: `src/i18n/locales/vi/finance.json`
- Modify: `src/i18n/locales/id/finance.json` 责任：补齐本轮 dashboard 文案。

- Modify: `src/views/finance/withdrawOrder/dashboard/test/useDashboardPage.spec.ts`
- Modify: `src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts`
- Modify: `src/views/finance/withdrawOrder/dashboard/test/dashboardI18n.spec.ts`
- Create: `src/views/finance/withdrawOrder/dashboard/test/warningHelpers.spec.ts`
- Create: `src/views/finance/withdrawOrder/dashboard/test/withdrawWarningSection.spec.ts`
- Create: `src/views/finance/withdrawOrder/dashboard/test/orderPoolWarningConfigModal.spec.ts` 责任：覆盖新增统计卡、默认范围、字典读取、只展示卡片、列表交互与弹窗校验。

## 2. 验收标准

1. 远程出款数据面板顶部出现第 4 组 `实时预警状态`。
2. 卡片文案参考 `ar-saas`，数值来自 `GetDashboardData`。
3. 卡片不可点击，不触发路由或列表联动。
4. 异常风控预警列表默认按最近 7 天查询，日期回显正确。
5. 筛选项只有 `预警类型` 和 `时间范围`。
6. `预警类型` 下拉来自 `warningCategoryTypeMap['2']`。
7. 表格展示列至少包含：
   - 预警时间
   - 预警类型
   - 触发商户
   - 触发用户
   - 内容
   - 处理状态
   - 操作
8. `触发商户` 展示为 `(${id})name`，`触发用户` 展示 `userName`。
9. 仅未处理记录显示 `解除异常` 操作。
10. 订单池预警配置按钮能打开弹窗，弹窗内容来自后端返回 `currencyConfigs`。
11. 两个配置字段均必填且按已确认范围校验。
12. 保存成功后关闭弹窗，并提示成功。

## 3. 实施任务

### Task 1: 先锁定纯逻辑与默认 7 天规则

**Files:**

- Create: `src/views/finance/withdrawOrder/dashboard/test/warningHelpers.spec.ts`
- Create: `src/views/finance/withdrawOrder/dashboard/warningHelpers.ts`

- [ ] **Step 1: 写失败测试，锁定默认范围、字典提取和显示格式**

```ts
expect(
  createDefaultWarningTimeRange(new Date('2026-05-04T12:34:56.000Z')),
).toEqual([
  Date.UTC(2026, 4, 28, 0, 0, 0, 0),
  Date.UTC(2026, 4, 4, 23, 59, 59, 999),
]);

expect(
  resolveWarningTypeOptions({
    2: [
      { id: 505, name: 'Order Pool Warning' },
      { id: 506, name: 'Pause Timeout Warning' },
    ],
  }),
).toEqual([
  { label: 'Order Pool Warning', value: 505 },
  { label: 'Pause Timeout Warning', value: 506 },
]);

expect(formatWarningTriggerTenant(1001, 'Alpha')).toBe('(1001)Alpha');
expect(formatWarningTriggerUser('operator_1')).toBe('operator_1');
```

- [ ] **Step 2: 运行 helper 测试确认失败**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/warningHelpers.spec.ts
```

Expected: FAIL，因为 `warningHelpers.ts` 尚不存在。

- [ ] **Step 3: 用最小实现补齐 helper**

```ts
import type { IdNameRsp } from '@/api/common';

const WARNING_CATEGORY_KEY = '2';

export function createDefaultWarningTimeRange(
  now = new Date(),
): [number, number] {
  return [
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 6, 0, 0, 0, 0),
    Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999),
  ];
}

export function resolveWarningTypeOptions(
  warningCategoryTypeMap: Record<string, IdNameRsp[]> | null | undefined,
) {
  return (warningCategoryTypeMap?.[WARNING_CATEGORY_KEY] ?? []).map((item) => ({
    label: item.name,
    value: item.id,
  }));
}

export function formatWarningTriggerTenant(
  tenantId?: number | null,
  tenantName?: string | null,
) {
  if (!tenantId || tenantId <= 0) return '--';
  return `(${tenantId})${String(tenantName ?? '').trim() || '--'}`;
}

export function formatWarningTriggerUser(userName?: string | null) {
  return String(userName ?? '').trim() || '--';
}
```

- [ ] **Step 4: 重新运行 helper 测试确认通过**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/warningHelpers.spec.ts
```

Expected: PASS。

### Task 2: 接入实时预警统计卡并更新 DashboardPanel

**Files:**

- Modify: `src/views/finance/withdrawOrder/dashboard/test/useDashboardPage.spec.ts`
- Modify: `src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts`
- Modify: `src/views/finance/withdrawOrder/dashboard/useDashboardPage.ts`
- Modify: `src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue`

- [ ] **Step 1: 先补失败测试，锁定新卡片组存在且不可跳转**

```ts
expect(page.warningStatusCards.value.map((item) => item.cardKey)).toEqual([
  'todayAuditTimeoutWarningCount',
  'todayPauseTimeoutWarningCount',
]);

expect(wrapper.text()).toContain('Realtime Warning Status');

await auditAlertButton.trigger('click');
expect(navigateToOrdersMock).not.toHaveBeenCalled();
expect(navigateToRecordsMock).not.toHaveBeenCalled();
```

- [ ] **Step 2: 跑定向测试确认失败**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run \
  src/views/finance/withdrawOrder/dashboard/test/useDashboardPage.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts
```

Expected: FAIL，因为 `warningStatusCards` 和新分组尚未实现。

- [ ] **Step 3: 在 useDashboardPage 中增加预警卡片状态**

```ts
const todayAuditTimeoutWarningCount = ref('--');
const todayPauseTimeoutWarningCount = ref('--');

const warningStatusCards = computed(() => [
  {
    cardKey: 'todayAuditTimeoutWarningCount',
    value: todayAuditTimeoutWarningCount.value,
    label: t(
      'finance.withdrawOrder.dashboard.cards.todayAuditTimeoutWarningCount.label',
    ),
    dot: 'orange',
    tooltip: t(
      'finance.withdrawOrder.dashboard.cards.todayAuditTimeoutWarningCount.tooltip',
    ),
  },
  {
    cardKey: 'todayPauseTimeoutWarningCount',
    value: todayPauseTimeoutWarningCount.value,
    label: t(
      'finance.withdrawOrder.dashboard.cards.todayPauseTimeoutWarningCount.label',
    ),
    dot: 'red',
    tooltip: t(
      'finance.withdrawOrder.dashboard.cards.todayPauseTimeoutWarningCount.tooltip',
    ),
  },
]);

todayAuditTimeoutWarningCount.value = String(
  stats?.todayAuditTimeoutWarningCount ?? '--',
);
todayPauseTimeoutWarningCount.value = String(
  stats?.todayPauseTimeoutWarningCount ?? '--',
);
```

- [ ] **Step 4: 在 DashboardPanel.vue 渲染第 4 组卡片，并保持不可点击**

```vue
<div class="wdb__divider" />
<div class="wdb__group">
  <div class="wdb__group-label">
    {{ t('finance.withdrawOrder.dashboard.realTimeWarningStatus') }}
  </div>
  <div class="wdb__cards">
    <StatCard
      v-for="card in warningStatusCards"
      :key="card.cardKey"
      v-bind="card"
      :clickable="false"
    />
  </div>
</div>

<WithdrawWarningSection :can-operate="canOperateRemote" />
```

- [ ] **Step 5: 重新运行定向测试确认通过**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run \
  src/views/finance/withdrawOrder/dashboard/test/useDashboardPage.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts
```

Expected: PASS。

### Task 3: 实现异常风控预警列表

**Files:**

- Create: `src/views/finance/withdrawOrder/dashboard/components/WithdrawWarningSection.vue`
- Create: `src/views/finance/withdrawOrder/dashboard/test/withdrawWarningSection.spec.ts`

- [ ] **Step 1: 先写失败测试，锁定筛选结构、默认时间和按钮入口**

```ts
expect(searchColumns.value.map((item) => item.path)).toEqual([
  'warningType',
  'warningTimeRange',
]);
expect(searchInitialValues.value.warningTimeRange).toEqual([
  Date.UTC(2026, 4, 28, 0, 0, 0, 0),
  Date.UTC(2026, 4, 4, 23, 59, 59, 999),
]);
expect(wrapper.text()).toContain('Order Pool Warning Config');
```

- [ ] **Step 2: 跑组件测试确认失败**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/withdrawWarningSection.spec.ts
```

Expected: FAIL，因为组件还不存在。

- [ ] **Step 3: 按当前框架实现列表组件**

```vue
<ProCrudTable
  ref="tableRef"
  :columns="columns"
  :search-columns="searchColumns"
  :search-initial-values="searchInitialValues"
  :request="loadData"
  :action-column="actionColumn"
  :show-column-setting="false"
  :search-default-collapsed="false"
  row-key="id"
>
  <template #toolbar-right>
    <n-button size="small" type="primary" @click="visibleConfig = true">
      {{ t('finance.withdrawOrder.dashboard.warningSection.config') }}
    </n-button>
  </template>
</ProCrudTable>
```

关键实现点：

1. `warningTypeOptions` 从 `useDictionary({ source: 'common' }).getRawData('warningCategoryTypeMap')` 读取，再交给 `resolveWarningTypeOptions()`。
2. `searchColumns` 只有：
   - `warningType`：单选
   - `warningTimeRange`：`valueType: 'proDateRange'`，`showTime: false`
3. `loadData(params)` 将 `warningTimeRange` 拆成：
   - `startTime`
   - `endTime`
4. `warningStatus` 只映射显示，不进筛选。
5. `tenantUserScope` 构建：
   - `tenantId -> tenantName`
   - `userId -> userName`
6. 补充 `loadUserNameMap()` 作为 `triggerUserId` 兜底来源。
7. `recoverExceptionRecord` 只在 `warningStatus === 1` 时显示。

- [ ] **Step 4: 把表格列按需求落齐**

```ts
const columns = computed<ProColumn<WithdrawWarningRow>[]>(() => [
  {
    key: 'warningTimeText',
    title: t(
      'finance.withdrawOrder.dashboard.warningSection.table.warningTime',
    ),
  },
  {
    key: 'warningTypeLabel',
    title: t(
      'finance.withdrawOrder.dashboard.warningSection.table.warningType',
    ),
  },
  {
    key: 'triggerTenantText',
    title: t(
      'finance.withdrawOrder.dashboard.warningSection.table.triggerTenant',
    ),
  },
  {
    key: 'triggerUserText',
    title: t(
      'finance.withdrawOrder.dashboard.warningSection.table.triggerUser',
    ),
  },
  {
    key: 'content',
    title: t('finance.withdrawOrder.dashboard.warningSection.table.content'),
  },
  {
    key: 'warningStatus',
    title: t(
      'finance.withdrawOrder.dashboard.warningSection.table.warningStatus',
    ),
  },
]);
```

- [ ] **Step 5: 增加“解除异常”二次确认与刷新**

```ts
dialog.warning({
  title: t('finance.withdrawOrder.dashboard.warningSection.recover.title'),
  content: t('finance.withdrawOrder.dashboard.warningSection.recover.content'),
  onPositiveClick: async () => {
    await api.withdraw.recoverExceptionRecord({ id: row.id });
    message.success(
      t('finance.withdrawOrder.dashboard.warningSection.recover.success'),
    );
    await tableRef.value?.reload();
  },
});
```

- [ ] **Step 6: 重新运行列表组件测试确认通过**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/withdrawWarningSection.spec.ts
```

Expected: PASS。

### Task 4: 实现订单池预警配置弹窗

**Files:**

- Create: `src/views/finance/withdrawOrder/dashboard/components/OrderPoolWarningConfigModal.vue`
- Create: `src/views/finance/withdrawOrder/dashboard/test/orderPoolWarningConfigModal.spec.ts`
- Modify: `src/views/finance/withdrawOrder/dashboard/components/WithdrawWarningSection.vue`

- [ ] **Step 1: 先写失败测试，锁定打开即拉取、必填校验和范围校验**

```ts
expect(getOrderPoolWarningConfigMock).toHaveBeenCalledTimes(1);

await saveButton.trigger('click');
expect(saveOrderPoolWarningConfigMock).not.toHaveBeenCalled();
expect(message.error).toHaveBeenCalledWith('Threshold is required');

setThreshold(-1);
expect(message.error).toHaveBeenCalledWith(
  'Threshold must be between 0 and 99999',
);
```

- [ ] **Step 2: 跑弹窗测试确认失败**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/orderPoolWarningConfigModal.spec.ts
```

Expected: FAIL，因为弹窗组件还不存在。

- [ ] **Step 3: 用后端 `currencyConfigs` 直接渲染表单行**

```vue
<n-modal
  v-model:show="visible"
  preset="card"
  :title="t('finance.withdrawOrder.dashboard.warningConfig.title')"
>
  <n-spin :show="loading">
    <n-table :single-line="false" size="small">
      <thead>
        <tr>
          <th>{{ t('finance.withdrawOrder.dashboard.warningConfig.currency') }}</th>
          <th>{{ t('finance.withdrawOrder.dashboard.warningConfig.orderCountThreshold') }}</th>
          <th>{{ t('finance.withdrawOrder.dashboard.warningConfig.intervalMinutes') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in formRows" :key="item.sysCurrency">
          <td>{{ item.sysCurrency }}</td>
          <td><n-input-number v-model:value="item.orderCountThreshold" :min="0" :max="99999" /></td>
          <td><n-input-number v-model:value="item.intervalMinutes" :min="1" :max="1440" /></td>
        </tr>
      </tbody>
    </n-table>
  </n-spin>
</n-modal>
```

- [ ] **Step 4: 保存前做显式校验**

```ts
function validateRows(rows: OrderPoolWarningCurrencyConfigItem[]) {
  for (const row of rows) {
    if (row.orderCountThreshold == null)
      return t('...orderCountThresholdRequired');
    if (row.orderCountThreshold < 0 || row.orderCountThreshold > 99999) {
      return t('...orderCountThresholdRange');
    }
    if (row.intervalMinutes == null) return t('...intervalMinutesRequired');
    if (row.intervalMinutes < 1 || row.intervalMinutes > 1440) {
      return t('...intervalMinutesRange');
    }
  }
  return null;
}
```

- [ ] **Step 5: 保存成功后关闭弹窗并刷新列表**

```ts
await api.withdraw.saveOrderPoolWarningConfig({
  currencyConfigs: formRows.value,
});
message.success(t('finance.withdrawOrder.dashboard.warningConfig.saveSuccess'));
emit('saved');
visible.value = false;
```

- [ ] **Step 6: 重新运行弹窗测试确认通过**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/orderPoolWarningConfigModal.spec.ts
```

Expected: PASS。

### Task 5: 补齐 i18n 与整体验证

**Files:**

- Modify: `src/i18n/locales/zh/finance.json`
- Modify: `src/i18n/locales/en/finance.json`
- Modify: `src/i18n/locales/vi/finance.json`
- Modify: `src/i18n/locales/id/finance.json`
- Modify: `src/views/finance/withdrawOrder/dashboard/test/dashboardI18n.spec.ts`

- [ ] **Step 1: 先让 dashboardI18n 用例覆盖新 key**

```ts
const keys = [
  'finance.withdrawOrder.dashboard.realTimeWarningStatus',
  'finance.withdrawOrder.dashboard.warningSection.title',
  'finance.withdrawOrder.dashboard.warningConfig.title',
  'finance.withdrawOrder.dashboard.cards.todayAuditTimeoutWarningCount.label',
];
```

- [ ] **Step 2: 补齐四份 locale**

最少新增这几组：

```json
"realTimeWarningStatus": "实时预警状态",
"warningSection": {
  "title": "异常风控预警",
  "config": "订单池预警配置"
},
"warningConfig": {
  "title": "订单池预警配置"
}
```

- [ ] **Step 3: 运行定向 dashboard 测试**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run \
  src/views/finance/withdrawOrder/dashboard/test/useDashboardPage.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/dashboardI18n.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/warningHelpers.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/withdrawWarningSection.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/orderPoolWarningConfigModal.spec.ts
```

Expected: PASS。

- [ ] **Step 4: 运行类型检查**

Run:

```bash
NODE_OPTIONS=--max-old-space-size=4096 pnpm typecheck
```

Expected: exit code 0。

## 4. 风险与处理策略

1. `warningCategoryTypeMap['2']` 运行时为空
   - 处理：前端不做 fallback，只按空选项表现，并在联调时作为后端缺口上提。

2. `triggerUserId` 不在 `tenantUserScope` 中
   - 处理：优先用 `tenantUserScope`，其次用 `loadUserNameMap()` 的动态字典兜底。

3. `typecheck` 继续因 Node 堆内存不足退出
   - 处理：固定使用 `NODE_OPTIONS=--max-old-space-size=4096` 再跑一次。

4. 订单池配置后端返回空数组
   - 处理：弹窗展示空表格，不自行补假数据。

## 5. 交付顺序

1. 先 helper 与测试
2. 再实时预警统计卡
3. 再异常风控预警列表
4. 再订单池预警配置弹窗
5. 最后补 i18n 与统一验证

## 6. 当前状态说明

1. 本计划生成前，工作区内存在未完成的测试草稿变更。
2. 这些变更不应被视为正式开工完成物。
3. 计划确认前，不继续推进业务实现。
