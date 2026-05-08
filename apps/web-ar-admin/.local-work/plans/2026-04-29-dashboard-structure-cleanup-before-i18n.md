# Dashboard Structure Cleanup Before i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clean up the withdraw dashboard structures that currently block safe i18n work: text-coupled logic, UI copy used as internal identifiers, swallowed error paths, and duplicated dashboard helper logic.

**Architecture:** Keep the existing dashboard page shape and API usage intact. Make the minimum structural changes needed to separate stable semantics from display copy, simplify over-wrapped staff actions, and centralize repeated dashboard-local parsing/copy logic without starting full i18n migration.

**Tech Stack:** Vue 3 `script setup`, TypeScript, Naive UI, generated `@/api/withdraw` client, Vitest.

---

## File Structure

- Create: `src/views/finance/withdrawOrder/dashboard/copy.ts` Responsibility: dashboard-local display copy and stable semantic keys for cards, groups, action labels, and column tooltip text. This is not i18n yet; it is a pre-i18n copy registry to stop scattering literals through logic files.

- Modify: `src/views/finance/withdrawOrder/dashboard/useDashboardPage.ts` Responsibility: expose dashboard card data with stable semantic keys and preset state arrays; stop relying on ad-hoc labels to infer behavior.

- Modify: `src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue` Responsibility: render dashboard cards from semantic config and route card clicks by stable key/preset payload, not by label text comparison.

- Modify: `src/views/finance/withdrawOrder/dashboard/components/StaffPanel.vue` Responsibility: remove the string-based generic action wrapper, surface backend failure messages, and keep each staff action handler explicit.

- Modify: `src/views/finance/withdrawOrder/dashboard/columns.ts` Responsibility: reuse shared parsing helpers, consume centralized copy config, and reduce local literal sprawl without changing column behavior.

- Modify: `src/views/finance/withdrawOrder/dashboard/timezoneResolver.ts` Responsibility: remain the single source for dashboard tenant id parsing; no behavior expansion.

- Modify: `src/views/finance/withdrawOrder/dashboard/statusConfig.ts` Responsibility: keep action availability rules only; do not mix it with display copy ownership.

- Modify: `src/views/finance/withdrawOrder/dashboard/test/useDashboardPage.spec.ts` Responsibility: assert semantic card config and preset payloads from page state.

- Modify: `src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts` Responsibility: verify dashboard card clicks route by semantic payload instead of label branching.

- Modify: `src/views/finance/withdrawOrder/dashboard/test/columns.spec.ts` Responsibility: keep column rendering assertions green after copy centralization and helper deduplication.

- Create: `src/views/finance/withdrawOrder/dashboard/test/staffPanel.spec.ts` Responsibility: cover staff action success/failure handling, especially non-zero `code` responses and visible error feedback.

---

## Task 1: Introduce Stable Dashboard Copy And Semantic Keys

**Files:**

- Create: `src/views/finance/withdrawOrder/dashboard/copy.ts`
- Modify: `src/views/finance/withdrawOrder/dashboard/useDashboardPage.ts`
- Test: `src/views/finance/withdrawOrder/dashboard/test/useDashboardPage.spec.ts`

- [ ] **Step 1: Write the failing page-state test for semantic card config**

```ts
it('暴露稳定的看板卡片 key 和预设状态，而不是只暴露中文 label', async () => {
  const { useDashboardPage } = await import('../useDashboardPage');
  const page = useDashboardPage();

  expect(page.orderStatusCards.value.map((item) => item.key)).toEqual([
    'processingOrders',
    'pendingDispatchOrders',
  ]);
  expect(
    page.orderStatusCards.value.map((item) => item.presetStates ?? []),
  ).toEqual([
    ['PendingAudit', 'Auditing', 'AuditTimeout'],
    ['PendingDispatch'],
  ]);
});
```

- [ ] **Step 2: Run the targeted test and confirm it fails**

Run:

```bash
pnpm test:unit -- src/views/finance/withdrawOrder/dashboard/test/useDashboardPage.spec.ts
```

Expected:

```text
FAIL
Expected property "key" to exist on dashboard order cards
```

- [ ] **Step 3: Add a dashboard-local copy/semantic registry**

```ts
// src/views/finance/withdrawOrder/dashboard/copy.ts
import type { WithdrawStateEnum } from '@/api/withdraw';
import type { OrderProcessStateValue, StaffStateCode } from './domain';

export const DASHBOARD_GROUP_COPY = {
  title: '远程出款数据管理看板',
  merchantLabel: '商户：',
  merchantPlaceholder: '全部商户',
  staffGroup: '员工状态统计',
  orderGroup: '订单状态统计',
  todayGroup: '今日订单统计',
  query: '查询',
  reset: '重置',
} as const;

export const DASHBOARD_STAFF_CARD_COPY: Array<{
  key: 'onlineStaff' | 'pausedStaff';
  label: string;
  tooltip: string;
  dot: 'green' | 'red';
  presetStates?: StaffStateCode[];
}> = [
  {
    key: 'onlineStaff',
    label: '在线出款人数',
    tooltip: '当前处于在线工作状态的出款员工总人数',
    dot: 'green',
    presetStates: ['Work_NoOpenTakeOrder', 'Work_TakingOrder'],
  },
  {
    key: 'pausedStaff',
    label: '暂停中人数',
    tooltip: '当前处于暂停状态（主动暂停或超时暂停）的员工总人数',
    dot: 'red',
    presetStates: [
      'Work_ManagerStopTakeOrder',
      'Work_Paused',
      'Work_ExceptionPausedTimeout',
      'Work_ExceptionUnAuditTimeout',
    ],
  },
];

export const DASHBOARD_ORDER_CARD_COPY: Array<{
  key: 'processingOrders' | 'pendingDispatchOrders';
  label: string;
  tooltip: string;
  dot: 'orange' | 'green';
  presetStates: OrderProcessStateValue[];
}> = [
  {
    key: 'processingOrders',
    label: '处理中订单单数',
    tooltip: '当前仍在处理中（未完成）的出款订单总数',
    dot: 'orange',
    presetStates: ['PendingAudit', 'Auditing', 'AuditTimeout'],
  },
  {
    key: 'pendingDispatchOrders',
    label: '待派发订单单数',
    tooltip: '当前队列中等待派发给出款员工的订单总数',
    dot: 'green',
    presetStates: ['PendingDispatch'],
  },
];

export const DASHBOARD_TODAY_CARD_COPY: Array<{
  key: 'todaySuccess' | 'todayCompleted' | 'todayAvgDuration';
  label: string;
  tooltip: string;
  dot: 'green';
  presetStates?: WithdrawStateEnum[];
}> = [
  {
    key: 'todaySuccess',
    label: '今日已出款单数',
    tooltip: '今日内已成功出款完成的订单总数',
    dot: 'green',
    presetStates: [1],
  },
  {
    key: 'todayCompleted',
    label: '今日已完成单次',
    tooltip: '今日内已审核完成（通过或拒绝）的出款订单总数',
    dot: 'green',
    presetStates: [1, 2],
  },
  {
    key: 'todayAvgDuration',
    label: '今日平均处理时长',
    tooltip: '今日所有已完成订单的平均审核处理时长（分钟/单）',
    dot: 'green',
  },
];
```

- [ ] **Step 4: Rebuild `useDashboardPage()` card state from the registry**

```ts
// src/views/finance/withdrawOrder/dashboard/useDashboardPage.ts
import {
  DASHBOARD_ORDER_CARD_COPY,
  DASHBOARD_STAFF_CARD_COPY,
  DASHBOARD_TODAY_CARD_COPY,
} from './copy';

const staffCards = ref(
  DASHBOARD_STAFF_CARD_COPY.map((item) => ({
    ...item,
    value: '--',
    clickable: true,
  })),
);

const orderStatusCards = ref(
  DASHBOARD_ORDER_CARD_COPY.map((item) => ({
    ...item,
    value: '--',
    clickable: true,
  })),
);

const todayOrderCards = ref(
  DASHBOARD_TODAY_CARD_COPY.map((item) => ({
    ...item,
    value: '--',
    clickable: true,
  })),
);
```

- [ ] **Step 5: Re-run the page-state test and make sure it passes**

Run:

```bash
pnpm test:unit -- src/views/finance/withdrawOrder/dashboard/test/useDashboardPage.spec.ts
```

Expected:

```text
PASS
```

---

## Task 2: Remove Text-Coupled Card Routing In DashboardPanel

**Files:**

- Modify: `src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue`
- Modify: `src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts`

- [ ] **Step 1: Extend the dashboard panel test so card routing no longer depends on label branching**

```ts
it('订单状态卡片点击时直接使用卡片自带的 presetStates', async () => {
  expect(orderStatusCards.value).toEqual([
    expect.objectContaining({
      key: 'processingOrders',
      presetStates: ['PendingAudit', 'Auditing', 'AuditTimeout'],
    }),
    expect.objectContaining({
      key: 'pendingDispatchOrders',
      presetStates: ['PendingDispatch'],
    }),
  ]);
});
```

- [ ] **Step 2: Run the dashboard panel test and confirm it fails**

Run:

```bash
pnpm test:unit -- src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts
```

Expected:

```text
FAIL
Expected presetStates on order cards, but click handler still branches by label
```

- [ ] **Step 3: Replace label-based branching with payload-based routing**

```ts
// src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue
import { DASHBOARD_GROUP_COPY } from '../copy';
import type { OrderProcessStateValue, StaffStateCode } from '../domain';

function handleOrderCardClick(states?: OrderProcessStateValue[]) {
  navigateToOrders(states, dashboardTenantIds.value);
}
```

```vue
<span class="wdb__title">{{ DASHBOARD_GROUP_COPY.title }}</span>
<span class="wdb__filter-label">{{ DASHBOARD_GROUP_COPY.merchantLabel }}</span>
<n-select :placeholder="DASHBOARD_GROUP_COPY.merchantPlaceholder" />
<n-button>{{ DASHBOARD_GROUP_COPY.query }}</n-button>
<n-button>{{ DASHBOARD_GROUP_COPY.reset }}</n-button>

<div class="wdb__group-label">{{ DASHBOARD_GROUP_COPY.orderGroup }}</div>
<StatCard
  v-for="card in orderStatusCards"
  :key="card.key"
  v-bind="card"
  @click="handleOrderCardClick(card.presetStates)"
/>
```

- [ ] **Step 4: Re-run the dashboard panel test and make sure it passes**

Run:

```bash
pnpm test:unit -- src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts
```

Expected:

```text
PASS
```

---

## Task 3: Simplify Staff Actions And Stop Swallowing Failures

**Files:**

- Modify: `src/views/finance/withdrawOrder/dashboard/components/StaffPanel.vue`
- Create: `src/views/finance/withdrawOrder/dashboard/test/staffPanel.spec.ts`
- Modify: `src/views/finance/withdrawOrder/dashboard/copy.ts`

- [ ] **Step 1: Write the failing staff action test for non-zero code feedback**

```ts
it('停止派单返回非 0 code 时展示后端 msg，而不是静默返回', async () => {
  adminStopDispatchMock.mockResolvedValue({
    code: 1001,
    msg: '停止失败：员工已离线',
  });

  await triggerStopDispatchConfirm();

  expect(message.error).toHaveBeenCalledWith('停止失败：员工已离线');
  expect(reloadMock).not.toHaveBeenCalled();
});
```

- [ ] **Step 2: Run the new staff panel test and confirm it fails**

Run:

```bash
pnpm test:unit -- src/views/finance/withdrawOrder/dashboard/test/staffPanel.spec.ts
```

Expected:

```text
FAIL
Expected message.error to be called, but executeStaffAction returned silently on code !== 0
```

- [ ] **Step 3: Move staff action display copy into stable keyed metadata**

```ts
// src/views/finance/withdrawOrder/dashboard/copy.ts
export const STAFF_ACTION_COPY = {
  stopDispatch: {
    title: '停止派单',
    confirm: (userName: string) => `确认停止 ${userName} 的派单？`,
    success: '停止派单成功',
    failure: '停止派单失败',
  },
  startDispatch: {
    title: '开始派单',
    confirm: (userName: string) => `确认为 ${userName} 开始派单？`,
    success: '开始派单成功',
    failure: '开始派单失败',
  },
  recoverException: {
    title: '解除异常',
    confirm: (userName: string) => `确认解除 ${userName} 的异常状态？`,
    success: '解除异常成功',
    failure: '解除异常失败',
  },
} as const;
```

- [ ] **Step 4: Delete the string-based generic wrapper and keep handlers explicit**

```ts
// src/views/finance/withdrawOrder/dashboard/components/StaffPanel.vue
import { STAFF_ACTION_COPY } from '../copy';

async function handleStopDispatchConfirm(row: Recordable) {
  try {
    const { code, msg } = await adminStopDispatch({
      userId: Number(row.sysUserId ?? 0),
    });
    if (code !== 0) {
      message.error(msg || STAFF_ACTION_COPY.stopDispatch.failure);
      return;
    }
    message.success(STAFF_ACTION_COPY.stopDispatch.success);
    await refreshStaffPanel();
  } catch {
    message.error(STAFF_ACTION_COPY.stopDispatch.failure);
  }
}

function handleStopAssign(row: Recordable) {
  dialog.warning({
    title: STAFF_ACTION_COPY.stopDispatch.title,
    content: STAFF_ACTION_COPY.stopDispatch.confirm(String(row.userName ?? '')),
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: async () => {
      await handleStopDispatchConfirm(row);
    },
  });
}
```

Apply the same explicit pattern to `handleStartAssign` and `handleReleaseAnomaly`. Do not reintroduce a generic `action: '开始派单' | ...` parameter wrapper in this batch.

- [ ] **Step 5: Re-run the staff panel test and make sure it passes**

Run:

```bash
pnpm test:unit -- src/views/finance/withdrawOrder/dashboard/test/staffPanel.spec.ts
```

Expected:

```text
PASS
```

---

## Task 4: Centralize Dashboard Column Copy And Remove Repeated Parsing

**Files:**

- Modify: `src/views/finance/withdrawOrder/dashboard/columns.ts`
- Modify: `src/views/finance/withdrawOrder/dashboard/timezoneResolver.ts`
- Modify: `src/views/finance/withdrawOrder/dashboard/test/columns.spec.ts`

- [ ] **Step 1: Add a regression test that uses the shared tenant id parser path**

```ts
it('商户列使用统一的 tenantIds 解析规则', () => {
  const columns = createStaffColumns(
    vi.fn(),
    vi.fn(),
    vi.fn(),
    vi.fn(),
    vi.fn(),
  );
  const tenantColumn = columns.find((column) => column.key === 'tenantName');
  const vnode = tenantColumn?.render?.({
    tenantIds: '101，202 101,foo',
    tenantName: 'ignored',
  });

  expect(extractText(vnode as VNodeChild)).toContain('(101)');
  expect(extractText(vnode as VNodeChild)).toContain('(202)');
});
```

- [ ] **Step 2: Run the column test and confirm the current file still owns duplicate parsing**

Run:

```bash
pnpm test:unit -- src/views/finance/withdrawOrder/dashboard/test/columns.spec.ts
```

Expected:

```text
PASS currently, but parsing is still duplicated inside columns.ts
```

This step is a duplication checkpoint, not a red test.

- [ ] **Step 3: Replace local parsing and inline display literals with shared copy/helper imports**

```ts
// src/views/finance/withdrawOrder/dashboard/columns.ts
import { parseDashboardTenantIds } from './timezoneResolver';
import { DASHBOARD_COLUMN_COPY } from './copy';

function renderTenantTagsFromRow(
  row: Recordable,
  resolveTenantName?: (tenantId: number) => string,
) {
  const tenantIds = parseDashboardTenantIds(row.tenantIds);
  if (!tenantIds.length) {
    return h(
      'span',
      { style: 'color:#9ca3af' },
      String(row.tenantName ?? '--'),
    );
  }
  return renderTenantTags(tenantIds, resolveTenantName);
}

title: colTitle(
  DASHBOARD_COLUMN_COPY.orderStats.title,
  DASHBOARD_COLUMN_COPY.orderStats.tips,
);
```

```ts
// src/views/finance/withdrawOrder/dashboard/copy.ts
export const DASHBOARD_COLUMN_COPY = {
  orderStats: {
    title: '订单统计',
    labels: {
      completed: '已完成单次',
      processing: '处理中单数',
    },
    tips: [
      {
        title: '已完成单次',
        desc: '统计已审核完成的次数',
        notes: [
          '包含：已提交、出款成功、人工确认、人工取消',
          '※ 若一笔订单被多人操作过会计算多次',
        ],
      },
      {
        title: '处理中单数',
        desc: '统计当前正在处理中的订单单数',
      },
    ],
  },
} as const;
```

Do the same only for the copy that is already touched by this batch. Do not migrate every dashboard string at once.

- [ ] **Step 4: Re-run the column test and make sure it still passes**

Run:

```bash
pnpm test:unit -- src/views/finance/withdrawOrder/dashboard/test/columns.spec.ts
```

Expected:

```text
PASS
```

---

## Task 5: Run Focused Regression Verification For This Batch

**Files:**

- No new code files
- Verification only

- [ ] **Step 1: Run the targeted dashboard unit test set**

Run:

```bash
pnpm test:unit -- \
  src/views/finance/withdrawOrder/dashboard/test/useDashboardPage.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/staffPanel.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/columns.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/orderPanel.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/statusConfig.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/timezoneResolver.spec.ts
```

Expected:

```text
PASS
```

- [ ] **Step 2: Run a lightweight type-level verification for touched dashboard files**

Run:

```bash
pnpm typecheck
```

Expected:

```text
PASS
```

- [ ] **Step 3: Manual QA checklist**

```text
1. 打开 /finance/withdrawOrder?tab=dashboard
2. 点击“处理中订单单数”和“待派发订单单数”，确认跳转 orders 时筛选正确
3. 点击“在线出款人数”与“暂停中人数”，确认跳转 staff 时预设和商户透传正确
4. 在员工实时状态里执行开始派单 / 停止派单 / 解除异常，确认成功与失败提示可见
5. 打开查看订单弹窗与订单审核日志，确认本批结构调整未影响原有展示
```

- [ ] **Step 4: Commit**

```bash
git add \
  src/views/finance/withdrawOrder/dashboard/copy.ts \
  src/views/finance/withdrawOrder/dashboard/useDashboardPage.ts \
  src/views/finance/withdrawOrder/dashboard/components/DashboardPanel.vue \
  src/views/finance/withdrawOrder/dashboard/components/StaffPanel.vue \
  src/views/finance/withdrawOrder/dashboard/columns.ts \
  src/views/finance/withdrawOrder/dashboard/timezoneResolver.ts \
  src/views/finance/withdrawOrder/dashboard/test/useDashboardPage.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/dashboardPanel.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/staffPanel.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/columns.spec.ts
git commit -m "refactor(finance): 清理看板结构以便后续接入多语言"
```

---

## Non-Goals For This Batch

- Do not replace dashboard copy with `t(...)`
- Do not migrate all hardcoded Chinese strings across `withdrawOrder/**`
- Do not redesign dashboard API composition or split the page into more files than necessary
- Do not refactor unrelated `workbench / dispatch / report / records` modules

## Validation Notes

- This batch is successful when stable keys and preset payloads replace label-driven behavior, staff action failures become visible, and repeated dashboard-local parsing/copy sprawl is reduced without changing business behavior.
- This batch is not responsible for full i18n rollout; it only prepares the dashboard so the later i18n batch is low-risk.
