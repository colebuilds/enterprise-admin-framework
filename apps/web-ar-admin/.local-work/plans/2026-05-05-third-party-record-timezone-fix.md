# Third-Party Record Timezone Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复出款第三方记录弹窗“操作时间”展示错误，让 `dashboard` 下当前提现订单与出款员工操作台两个指定入口改为直接消费 `createTime` 时间戳并按传入商户时区格式化，同时保持其它既有消费者默认行为不变。

**Architecture:** 该问题仍收口在共享组件 `ThirdPartyRecordModal.vue` / `ThirdPartyCell.vue`，但实现不能做成全局默认切换，否则会波及所有历史消费者。方案改为在共享链路上新增一个可选的显式 opt-in 开关，仅当调用方明确开启时，才复用 `useTenantOptions().formatTenantDateTime()` 按 `displayTimezoneTenantId`/`tenantId` 格式化 `createTime`；未开启时继续沿用当前 UTC+0 字面文本逻辑。这样 `dashboard` 当前提现订单与 `workbench` 可先切到新逻辑，而 `records`、`report`、`StaffOrderModal` 等历史入口维持兼容。

**Tech Stack:** Vue 3 `script setup`、TypeScript、Naive UI、Vitest、@vue/test-utils、`useTenantOptions`

---

## Scope

- 主修复组件：
  - `src/views/finance/withdrawOrder/components/ThirdPartyCell.vue`
  - `src/views/finance/withdrawOrder/components/ThirdPartyRecordModal.vue`
- 主回归测试：
  - `src/views/finance/withdrawOrder/test/thirdPartyRecordModal.spec.ts`
- 目标调用方（会改代码）：
  - `src/views/finance/withdrawOrder/dashboard/columns.ts`
  - `src/views/finance/withdrawOrder/workbench/index.vue`
- 只读确认调用方，不默认改代码：
  - `src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue`
  - `src/views/finance/withdrawOrder/records/columns.ts`
  - `src/views/finance/withdrawOrder/report/components/StaffOrderDetailModal.vue`

## Call Site Inventory

- `dashboard` 当前提现订单：
  - 文件：`src/views/finance/withdrawOrder/dashboard/columns.ts`
  - 当前已传：`tenantId + displayTimezoneTenantId + displayTimezoneLabel`
  - 期望：本次切到新时区格式化
- `workbench` 出款员工操作台：
  - 文件：`src/views/finance/withdrawOrder/workbench/index.vue`
  - 当前已传：`tenantId`
  - 期望：本次切到新时区格式化
- `dashboard` StaffOrderModal：
  - 文件：`src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue`
  - 当前已传：`tenantId + displayTimezoneTenantId + displayTimezoneLabel`
  - 期望：本次不改行为
- `records` 提现记录：
  - 文件：`src/views/finance/withdrawOrder/records/columns.ts`
  - 当前已传：`tenantId`
  - 期望：本次不改行为
- `report` 员工订单明细：
  - 文件：`src/views/finance/withdrawOrder/report/components/StaffOrderDetailModal.vue`
  - 当前已传：`tenantId`
  - 期望：本次不改行为

## Assumptions

- “正确的 UTC 时区转换”在本需求里等价于：按当前订单所属商户时区展示时间，和当前模块其它时间列保持一致。
- `/finance/withdrawOrder?sub=orders` 与员工操作台入口都经过 `ThirdPartyCell -> ThirdPartyRecordModal` 这条共享链路，因此共享修复优先于在各列表页重复实现时间格式化。
- 如果仅凭 `tenantId` 或 `displayTimezoneTenantId` 自动切换新逻辑，会误伤其它历史消费者；因此必须引入显式 opt-in。
- 本次必须保持向后兼容：不新增必传 props，不调整 `ThirdPartyCell` / `ThirdPartyRecordModal` 现有入参命名，不要求既有消费者同步改造。

## Non-Goals

- 不调整第三方记录弹窗其它列样式或交互。
- 不修改后端接口或 API 生成文件。
- 不把报表模块中明确声明为“UTC+0 字面协议”的时间逻辑一起改掉。
- 不为了时区修复去批量改所有 `ThirdPartyCell` 调用方。
- 不把 `displayTimezoneTenantId` 是否存在作为唯一开关；否则会误影响 `StaffOrderModal` 现有入口。

## Backward Compatibility

- `ThirdPartyRecordModal` 继续保留现有 props：`orderNo`、`tenantId`、`displayTimezoneTenantId`、`displayTimezoneLabel`
- `ThirdPartyCell` / `ThirdPartyRecordModal` 可新增一个**可选**开关 props，例如 `useTimezoneFormatting?: boolean`
- 新开关默认值必须是 `false`，不改任何历史消费者的默认行为
- 表格列仍复用 `createTimeText` 作为渲染字段，不改列 key
- 现有消费者即使完全不改代码，也必须保持当前行为不变
- 只有在时间戳非法时，才继续使用后端 `createTimeText` 兜底

---

### Task 1: 为共享弹窗补齐失败测试

**Files:**

- Modify: `src/views/finance/withdrawOrder/test/thirdPartyRecordModal.spec.ts`
- Read: `src/views/finance/withdrawOrder/components/ThirdPartyRecordModal.vue`

- [ ] **Step 1: 扩展测试桩，模拟时区格式化能力**

在 `thirdPartyRecordModal.spec.ts` 中新增 `useTenantOptions` mock，并暴露 `formatTenantDateTimeMock`，保证测试可以断言是否使用了共享时区格式化链路。

```ts
const formatTenantDateTimeMock = vi.fn(
  (value: unknown, tenantId?: string | number | null) =>
    `tz:${String(tenantId)}:${String(value)}`,
);

vi.mock('@/hooks', () => ({
  useTenantOptions: () => ({
    formatTenantDateTime: formatTenantDateTimeMock,
  }),
}));
```

- [ ] **Step 2: 改造 `ProCrudTable` mock，让它执行 `request` 并渲染首行“操作时间”**

让测试真正覆盖 `loadData -> createTimeText 映射 -> 列展示` 这条链路，而不是只做源码字符串断言。

```ts
vi.mock('@/components', () => ({
  ProCrudTable: defineComponent({
    name: 'ProCrudTable',
    props: {
      columns: { type: Array, default: () => [] },
      request: { type: Function, required: true },
    },
    setup(props) {
      const rows = ref<Record<string, unknown>[]>([]);

      onMounted(async () => {
        const result = await props.request({});
        rows.value = Array.isArray(result?.list) ? result.list : [];
      });

      return () =>
        h('div', [
          rows.value[0]
            ? h(
                'div',
                { 'data-testid': 'action-time-cell' },
                String(rows.value[0]?.createTimeText ?? '--'),
              )
            : null,
        ]);
    },
  }),
}));
```

- [ ] **Step 3: 写失败用例，要求只有显式开启时才按时区格式化 `createTime`**

```ts
it('显式开启 useTimezoneFormatting 时按时区格式化 createTime', async () => {
  const { api } = await import('@/api');
  vi.mocked(api.withdraw.getThirdPartyRecordList).mockResolvedValue({
    data: {
      paidOutCount: 1,
      recordList: [
        {
          sort: 1,
          orderNo: 'WD20260505',
          state: 3,
          stateName: 'Success',
          operator: 'alice',
          remark: '',
          createTime: 1746438529000,
          createTimeText: '2026-05-05 09:48:49',
        },
      ],
    },
  } as never);

  const ThirdPartyRecordModal = (
    await import('../components/ThirdPartyRecordModal.vue')
  ).default;

  const wrapper = mount(ThirdPartyRecordModal, {
    props: {
      orderNo: 'WD20260505',
      tenantId: 101,
      displayTimezoneTenantId: 202,
      useTimezoneFormatting: true,
    },
  });

  await flushPromises();

  expect(formatTenantDateTimeMock).toHaveBeenCalledWith(
    1746438529000,
    202,
    undefined,
    '--',
  );
  expect(wrapper.get('[data-testid=\"action-time-cell\"]').text()).toBe(
    'tz:202:1746438529000',
  );
});
```

- [ ] **Step 4: 写失败用例，要求未开启时继续走旧行为**

```ts
it('未开启 useTimezoneFormatting 时保持旧的 UTC+0 字面文本行为', async () => {
  const { api } = await import('@/api');
  vi.mocked(api.withdraw.getThirdPartyRecordList).mockResolvedValue({
    data: {
      paidOutCount: 1,
      recordList: [
        {
          sort: 1,
          orderNo: 'WD20260505',
          state: 3,
          stateName: 'Success',
          operator: 'alice',
          remark: '',
          createTime: 1746438529000,
          createTimeText: '2026-05-05 09:48:49',
        },
      ],
    },
  } as never);

  const ThirdPartyRecordModal = (
    await import('../components/ThirdPartyRecordModal.vue')
  ).default;

  const wrapper = mount(ThirdPartyRecordModal, {
    props: {
      orderNo: 'WD20260505',
      tenantId: 101,
    },
  });

  await flushPromises();

  expect(formatTenantDateTimeMock).not.toHaveBeenCalled();
  expect(wrapper.get('[data-testid=\"action-time-cell\"]').text()).toBe(
    '2025-05-05 04:48:49',
  );
});
```

- [ ] **Step 5: 写失败用例，要求非法时间戳回退到 `createTimeText`**

```ts
it('createTime 非法时回退接口返回的 createTimeText', async () => {
  const { api } = await import('@/api');
  vi.mocked(api.withdraw.getThirdPartyRecordList).mockResolvedValue({
    data: {
      paidOutCount: 1,
      recordList: [
        {
          sort: 1,
          orderNo: 'WD20260505',
          state: 3,
          stateName: 'Success',
          operator: 'alice',
          remark: '',
          createTime: 0,
          createTimeText: 'fallback-text',
        },
      ],
    },
  } as never);

  const ThirdPartyRecordModal = (
    await import('../components/ThirdPartyRecordModal.vue')
  ).default;

  const wrapper = mount(ThirdPartyRecordModal, {
    props: {
      orderNo: 'WD20260505',
      tenantId: 101,
    },
  });

  await flushPromises();

  expect(formatTenantDateTimeMock).not.toHaveBeenCalled();
  expect(wrapper.get('[data-testid=\"action-time-cell\"]').text()).toBe(
    'fallback-text',
  );
});
```

- [ ] **Step 6: 运行测试，确认先红**

Run:

```bash
pnpm test:unit src/views/finance/withdrawOrder/test/thirdPartyRecordModal.spec.ts
```

Expected:

- 至少 1 个新用例失败
- 失败点应是当前组件仍在使用 `toISOString()` 或未调用 `formatTenantDateTime`

---

### Task 2: 在共享链路里新增显式 opt-in 开关

**Files:**

- Modify: `src/views/finance/withdrawOrder/components/ThirdPartyCell.vue`
- Modify: `src/views/finance/withdrawOrder/components/ThirdPartyRecordModal.vue`
- Reference: `src/views/finance/withdrawOrder/components/OrderAuditLog.vue:111-143`
- Reference: `src/hooks/useTenantOptions.ts:817-824`

- [ ] **Step 1: 给共享上下文增加可选开关，不破坏现有接口**

在 `ThirdPartyCell.vue` 的 `OrderContext` 增加可选字段：

```ts
interface OrderContext {
  orderNo: string;
  thirdPartyName?: string;
  tenantId?: number;
  displayTimezoneTenantId?: number;
  displayTimezoneLabel?: string;
  useTimezoneFormatting?: boolean;
}
```

- [ ] **Step 2: 把可选开关继续透传给 `ThirdPartyRecordModal`**

```ts
h(ThirdPartyRecordModal, {
  orderNo: ctx.orderNo,
  thirdPartyName: ctx.thirdPartyName,
  tenantId: ctx.tenantId,
  displayTimezoneTenantId: ctx.displayTimezoneTenantId,
  displayTimezoneLabel: ctx.displayTimezoneLabel,
  useTimezoneFormatting: ctx.useTimezoneFormatting,
});
```

- [ ] **Step 3: 在 `ThirdPartyRecordModal` 上定义同名可选 props，默认关闭**

```ts
const props = defineProps<{
  orderNo: string;
  tenantId?: number;
  displayTimezoneTenantId?: number;
  displayTimezoneLabel?: string;
  useTimezoneFormatting?: boolean;
}>();
```

- [ ] **Step 4: 重写 `formatRecordTime`，只在开关开启时走新时区逻辑**

```ts
function formatRecordTime(
  rawValue: unknown,
  fallbackText: unknown,
  fallback = '--',
) {
  const normalized = Number(rawValue);
  const backendText = String(fallbackText ?? '').trim() || fallback;
  if (!Number.isFinite(normalized) || normalized <= 0) return backendText;

  if (!props.useTimezoneFormatting || !formatTenantDateTime) {
    const date = new Date(normalized);
    return Number.isNaN(date.getTime())
      ? backendText
      : date.toISOString().slice(0, 19).replace('T', ' ');
  }

  const formatted = formatTenantDateTime(
    normalized,
    props.displayTimezoneTenantId ?? props.tenantId,
    undefined,
    fallback,
  );

  return formatted && formatted !== fallback ? formatted : backendText;
}
```

- [ ] **Step 5: 更新注释，明确新旧行为并存**

注释要说明：

- 默认保持旧的 UTC+0 字面文本逻辑
- 只有显式开启 `useTimezoneFormatting` 时才按商户时区展示
- 这是为了兼容现有多个消费者

- [ ] **Step 6: 运行测试，确认转绿**

Run:

```bash
pnpm test:unit src/views/finance/withdrawOrder/test/thirdPartyRecordModal.spec.ts
```

Expected:

- 新增 opt-in / legacy / fallback 用例全部通过
- 原有状态映射用例仍通过

---

### Task 3: 只让两个指定入口切到新行为

**Files:**

- Modify: `src/views/finance/withdrawOrder/dashboard/columns.ts`
- Modify: `src/views/finance/withdrawOrder/workbench/index.vue`
- Read: `src/views/finance/withdrawOrder/dashboard/columns.ts`
- Read: `src/views/finance/withdrawOrder/workbench/index.vue`
- Read: `src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue`
- Read: `src/views/finance/withdrawOrder/records/columns.ts`
- Read: `src/views/finance/withdrawOrder/report/components/StaffOrderDetailModal.vue`

- [ ] **Step 1: 在 dashboard 当前提现订单入口显式开启新行为**

在 [dashboard/columns.ts](src/views/finance/withdrawOrder/dashboard/columns.ts) 的 `orderContext` 中新增：

```ts
orderContext: {
  orderNo: String(row.orderNo ?? ''),
  tenantId: displayTimezoneTenantId,
  displayTimezoneTenantId,
  displayTimezoneLabel: displayTimezoneTenantId
    ? options?.getTenantTimeZoneLabel?.(displayTimezoneTenantId, '') || undefined
    : undefined,
  useTimezoneFormatting: true,
}
```

- [ ] **Step 2: 在员工操作台入口显式开启新行为**

在 [workbench/index.vue](src/views/finance/withdrawOrder/workbench/index.vue) 的 `orderContext` 中新增：

```ts
orderContext: {
  orderNo: row.orderNo,
  thirdPartyName: tp.thirdPayCode || '',
  tenantId: row.tenantId,
  useTimezoneFormatting: true,
}
```

- [ ] **Step 3: 确认其它 3 个历史入口不加开关**

以下调用点保持不变：

- `src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue`
- `src/views/finance/withdrawOrder/records/columns.ts`
- `src/views/finance/withdrawOrder/report/components/StaffOrderDetailModal.vue`

它们继续不传 `useTimezoneFormatting`，从而维持旧行为。

- [ ] **Step 4: 跑定向回归测试**

Run:

```bash
pnpm test:unit src/views/finance/withdrawOrder/test/thirdPartyRecordModal.spec.ts
```

如果补了入口级测试，再追加：

```bash
pnpm test:unit src/views/finance/withdrawOrder/dashboard/test/thirdPartyCell.spec.ts
```

- [ ] **Step 5: 做两条人工验收**

1. `/finance/withdrawOrder?sub=orders`
2. 出款员工操作台页签

每条入口都执行：

- 打开一条含“第三方详细”的订单
- 点击“详情”
- 对比主列表时间口径与弹窗“操作时间”
- 确认不再出现固定 UTC+0 字面时间

- [ ] **Step 6: 记录验证结论**

若两条入口都正常，记录：

- 共享组件已支持 opt-in 新逻辑
- dashboard orders 入口已显式开启
- workbench 入口已显式开启
- 其它历史入口保持旧行为

---

## Verification Checklist

- `ThirdPartyRecordModal` 默认仍保留 `toISOString()` 旧逻辑
- `formatRecordTime()` 仅在 `useTimezoneFormatting === true` 时复用 `formatTenantDateTime`
- 新逻辑优先 `displayTimezoneTenantId`，回退 `tenantId`
- `createTime` 非法时仍保留 `createTimeText` 回退
- `/finance/withdrawOrder?sub=orders` 入口人工验收通过
- 员工操作台入口人工验收通过
- `StaffOrderModal` / `records` / `report` 入口未开启新行为

## Open Question

- 共享组件现在总共有 5 个调用点。本计划默认只让 `dashboard orders` 和 `workbench` 两个入口切到新行为，其余 3 个入口保持旧逻辑。如果后续确认 `StaffOrderModal` 也应该同步切换，再单独加开关即可，不建议在这次修复里顺手放开默认行为。
