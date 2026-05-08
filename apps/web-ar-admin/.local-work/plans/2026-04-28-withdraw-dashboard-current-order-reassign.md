# Withdraw Dashboard Current Order Reassign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the current-order currency filter, block invalid batch reassign attempts unless selected rows share the same withdraw category and currency, and pass selected order numbers into the reassign staff lookup so the transfer flow can complete.

**Architecture:** Keep request-building and batch-validation logic local to `dashboard/` by extracting pure helpers that can be unit-tested with Vitest. Reuse the global common dictionary `currencyList` for the new filter, and make one module-shared change in `TransferOrderModal.vue` to include `orderNos` for `reassign` mode while preserving `assign` mode behavior.

**Tech Stack:** Vue 3 `script setup`, TypeScript, Naive UI, `ProCrudTable`, generated `@/api/withdraw` client, Vitest.

---

## File Structure

- Create: `src/views/finance/withdrawOrder/dashboard/orderReassign.ts` Purpose: Pure helper for current-order request payload assembly and batch reassign compatibility checks.

- Create: `src/views/finance/withdrawOrder/dashboard/orderReassign.spec.ts` Purpose: Vitest coverage for `sysCurrency` request inclusion and same-category/same-currency batch guards.

- Modify: `src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue` Purpose: Add the currency filter UI after “更新时间”, source options from global dictionary, persist selected rows, wire batch validation, and pass `sysCurrency` into the current-order list request.

- Create: `src/views/finance/withdrawOrder/components/transferOrderSelect.ts` Purpose: Pure helper to build `getStaffUserSelectList` params for `assign` vs `reassign`.

- Create: `src/views/finance/withdrawOrder/components/transferOrderSelect.spec.ts` Purpose: Vitest coverage for select-request payload differences between `assign` and `reassign`.

- Modify: `src/views/finance/withdrawOrder/components/TransferOrderModal.vue` Purpose: Use the helper and include `orderNos` for `reassign` mode. This file is outside the default `dashboard/` boundary, so the implementation step must explicitly announce the scoped compatibility-safe shared edit before touching it.

## Task 1: Add Dashboard-Local Reassign Helpers

**Files:**

- Create: `src/views/finance/withdrawOrder/dashboard/orderReassign.ts`
- Test: `src/views/finance/withdrawOrder/dashboard/orderReassign.spec.ts`

- [ ] **Step 1: Write the failing test for current-order query payload and batch guard**

```ts
import { describe, expect, it } from 'vitest';
import {
  buildCurrentOrderQuery,
  validateBatchReassignSelection,
} from './orderReassign';

describe('buildCurrentOrderQuery', () => {
  it('includes sysCurrency when the filter is selected', () => {
    const query = buildCurrentOrderQuery({
      tenantIds: [101],
      processState: 'all',
      memberId: '2001',
      orderNo: 'WO-1',
      sysCategoryId: 7,
      sysCurrency: 'INR',
      minAmount: 10,
      maxAmount: 99,
      withdrawDateRange: [1000, 2000],
      updateDateRange: [3000, 4000],
      pageNo: 2,
      pageSize: 50,
    });

    expect(query.sysCurrency).toBe('INR');
    expect(query.sysCategoryId).toBe(7);
    expect(query.startDate).toBe(1000);
    expect(query.completeEndDate).toBe(4000);
  });
});

describe('validateBatchReassignSelection', () => {
  it('rejects mixed currencies', () => {
    const result = validateBatchReassignSelection([
      {
        orderNo: 'A-1',
        userWithdrawType: 9,
        userWithdrawTypeName: '银行卡',
        sysCurrency: 'INR',
      },
      {
        orderNo: 'A-2',
        userWithdrawType: 9,
        userWithdrawTypeName: '银行卡',
        sysCurrency: 'USDT',
      },
    ]);

    expect(result.ok).toBe(false);
    expect(result.message).toContain('相同提现大类');
    expect(result.message).toContain('相同币种');
  });

  it('rejects mixed withdraw categories', () => {
    const result = validateBatchReassignSelection([
      {
        orderNo: 'A-1',
        userWithdrawType: 9,
        userWithdrawTypeName: '银行卡',
        sysCurrency: 'INR',
      },
      {
        orderNo: 'A-2',
        userWithdrawType: 12,
        userWithdrawTypeName: 'USDT',
        sysCurrency: 'INR',
      },
    ]);

    expect(result.ok).toBe(false);
  });

  it('returns orderNos for a compatible selection', () => {
    const result = validateBatchReassignSelection([
      {
        orderNo: 'A-1',
        userWithdrawType: 9,
        userWithdrawTypeName: '银行卡',
        sysCurrency: 'INR',
      },
      {
        orderNo: 'A-2',
        userWithdrawType: 9,
        userWithdrawTypeName: '银行卡',
        sysCurrency: 'INR',
      },
    ]);

    expect(result).toEqual({
      ok: true,
      orderNos: ['A-1', 'A-2'],
      sysCurrency: 'INR',
      userWithdrawType: 9,
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/orderReassign.spec.ts
```

Expected: FAIL with `Cannot find module './orderReassign'` or missing export errors.

- [ ] **Step 3: Write the minimal helper implementation**

```ts
import type { WithdrawWorkCurrentOrderPageReq } from '@/api/withdraw/types';
import type { OrderProcessStateValue } from './domain';

export interface CurrentOrderQueryInput {
  tenantIds: number[];
  processState: OrderProcessStateValue | 'all';
  memberId: string;
  orderNo: string;
  sysCategoryId: WithdrawWorkCurrentOrderPageReq['sysCategoryId'] | null;
  sysCurrency: string | null;
  minAmount: number | null;
  maxAmount: number | null;
  withdrawDateRange: [number, number] | null;
  updateDateRange: [number, number] | null;
  pageNo: number;
  pageSize: number;
}

export interface BatchReassignRow {
  orderNo: string;
  userWithdrawType?: number | string | null;
  userWithdrawTypeName?: string | null;
  sysCurrency?: string | null;
}

export function buildCurrentOrderQuery(input: CurrentOrderQueryInput): Omit<
  WithdrawWorkCurrentOrderPageReq,
  'processState'
> & {
  processState?: OrderProcessStateValue;
} {
  const [startDate, endDate] = input.withdrawDateRange ?? [];
  const [completeStartDate, completeEndDate] = input.updateDateRange ?? [];

  return {
    tenantIds: input.tenantIds.length ? input.tenantIds : undefined,
    processState: input.processState === 'all' ? undefined : input.processState,
    userId: input.memberId.trim() ? Number(input.memberId.trim()) : undefined,
    orderNo: input.orderNo.trim() || undefined,
    sysCategoryId: input.sysCategoryId ?? undefined,
    sysCurrency: input.sysCurrency?.trim() || undefined,
    minAmount: input.minAmount ?? undefined,
    maxAmount: input.maxAmount ?? undefined,
    startDate,
    endDate,
    completeStartDate,
    completeEndDate,
    pageNo: input.pageNo,
    pageSize: input.pageSize,
    orderBy: 'Desc',
    sortField: 'CreateTime',
  };
}

const BATCH_REASSIGN_MISMATCH_MESSAGE =
  '批量转派仅支持相同提现大类且相同币种的订单，请先使用筛选功能保证列表数据为相同提现大类、相同币种后再操作';

export function validateBatchReassignSelection(rows: BatchReassignRow[]) {
  if (!rows.length) {
    return {
      ok: false as const,
      message: '请先勾选需要转派的订单',
    };
  }

  const first = rows[0];
  const firstCurrency = String(first.sysCurrency ?? '').trim();
  const firstCategory = first.userWithdrawType ?? null;

  const allCompatible = rows.every((row) => {
    const currency = String(row.sysCurrency ?? '').trim();
    const category = row.userWithdrawType ?? null;
    return currency === firstCurrency && category === firstCategory;
  });

  if (!allCompatible) {
    return {
      ok: false as const,
      message: BATCH_REASSIGN_MISMATCH_MESSAGE,
    };
  }

  return {
    ok: true as const,
    orderNos: rows.map((row) => row.orderNo),
    sysCurrency: firstCurrency,
    userWithdrawType: firstCategory,
  };
}
```

- [ ] **Step 4: Run the helper test to verify it passes**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/orderReassign.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/views/finance/withdrawOrder/dashboard/orderReassign.ts src/views/finance/withdrawOrder/dashboard/orderReassign.spec.ts
git commit -m "test(withdraw-dashboard): cover current order reassign helpers"
```

## Task 2: Wire Currency Filter and Batch Guard into OrderPanel

**Files:**

- Modify: `src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue`
- Reuse: `src/views/finance/withdrawOrder/dashboard/orderReassign.ts`
- Test: `src/views/finance/withdrawOrder/dashboard/orderReassign.spec.ts`

- [ ] **Step 1: Replace inline request assembly and ad-hoc batch logic with helper-backed wiring**

```ts
import {
  buildCurrentOrderQuery,
  validateBatchReassignSelection,
  type BatchReassignRow,
} from '../orderReassign';

const orderCurrencyFilter = ref<string | null>(null);
const orderSelectedRows = ref<BatchReassignRow[]>([]);

const orderCurrencyOptions = computed(() =>
  getOptions('currencyList', {
    source: 'common',
    labelField: 'currencyName',
    valueField: 'currencyCode',
  }).map((item) => ({
    label: String(item.label ?? ''),
    value: String(item.value ?? ''),
  })),
);
```

```vue
<div class="wdb__order-search-item">
  <span class="wdb__filter-label">币种：</span>
  <n-select
    v-model:value="orderCurrencyFilter"
    :options="orderCurrencyOptions"
    placeholder="请选择币种"
    clearable
    filterable
    size="small"
    style="flex: 1; min-width: 0"
  />
</div>
```

```ts
function handleBatchReassign() {
  const result = validateBatchReassignSelection(orderSelectedRows.value);
  if (!result.ok) {
    message.warning(result.message);
    return;
  }
  openReassignModal(result.orderNos);
}

function handleSelectionChange(keys: DataTableRowKey[], rows: Recordable[]) {
  orderCheckedKeys.value = keys.map((key) => String(key));
  orderSelectedRows.value = rows.map((row) => ({
    orderNo: String(row.orderNo ?? ''),
    userWithdrawType: row.userWithdrawType ?? null,
    userWithdrawTypeName: row.userWithdrawTypeName ?? null,
    sysCurrency: row.sysCurrency ?? null,
  }));
}

async function loadOrderData(params: Recordable) {
  const requestParams = buildCurrentOrderQuery({
    tenantIds: orderTenantIds.value,
    processState: orderFilter.value,
    memberId: orderMemberIdFilter.value,
    orderNo: orderNoFilter.value,
    sysCategoryId: orderTypeFilter.value,
    sysCurrency: orderCurrencyFilter.value,
    minAmount: orderAmountMin.value,
    maxAmount: orderAmountMax.value,
    withdrawDateRange: orderWithdrawDateRange.value,
    updateDateRange: orderUpdateDateRange.value,
    pageNo: Number(params?.pageNo ?? 1),
    pageSize: Number(params?.pageSize ?? 20),
  });

  const response = await getCurrentWithdrawOrderList(
    requestParams as unknown as WithdrawWorkCurrentOrderPageReq,
  );
  const list = Array.isArray(response.data?.list) ? response.data.list : [];
  return { list, total: Number(response.data?.totalCount ?? list.length) };
}
```

- [ ] **Step 2: Reset the new filter and selection state together**

```ts
async function handleReset() {
  await withSuppressedOrderReload(() => {
    orderTenantIds.value = [];
    orderMemberIdFilter.value = '';
    orderNoFilter.value = '';
    orderTypeFilter.value = null;
    orderCurrencyFilter.value = null;
    orderAmountMin.value = null;
    orderAmountMax.value = null;
    orderWithdrawDateRange.value = null;
    orderUpdateDateRange.value = null;
    orderFilter.value = 'all';
    orderCheckedKeys.value = [];
    orderSelectedRows.value = [];
  });
}
```

- [ ] **Step 3: Run the targeted dashboard helper test and a type check**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/orderReassign.spec.ts
pnpm typecheck
```

Expected: helper spec PASS; `OrderPanel.vue` has no new TypeScript errors for the added currency filter and row-selection state.

- [ ] **Step 4: Commit**

```bash
git add src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue
git commit -m "feat(withdraw-dashboard): gate batch reassign by currency and category"
```

## Task 3: Add a Pure Helper for Reassign Staff Select Params

**Files:**

- Create: `src/views/finance/withdrawOrder/components/transferOrderSelect.ts`
- Test: `src/views/finance/withdrawOrder/components/transferOrderSelect.spec.ts`

- [ ] **Step 1: Write the failing test for assign vs reassign params**

```ts
import { describe, expect, it } from 'vitest';
import { buildStaffUserSelectParams } from './transferOrderSelect';

describe('buildStaffUserSelectParams', () => {
  it('keeps assign mode unchanged', () => {
    expect(buildStaffUserSelectParams('assign', ['WO-1'])).toEqual({ type: 1 });
  });

  it('adds orderNos for reassign mode', () => {
    expect(buildStaffUserSelectParams('reassign', ['WO-1', 'WO-2'])).toEqual({
      type: 2,
      orderNos: ['WO-1', 'WO-2'],
    });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/components/transferOrderSelect.spec.ts
```

Expected: FAIL with `Cannot find module './transferOrderSelect'`.

- [ ] **Step 3: Write the minimal helper implementation**

```ts
import type {
  WithdrawUserSelectListReq,
  WithdrawUserSelectTypeEnum,
} from '@/api/withdraw/types';
import type { TransferMode } from '../shared';

export function buildStaffUserSelectParams(
  mode: TransferMode,
  orderNos: string[],
): WithdrawUserSelectListReq {
  const type: WithdrawUserSelectTypeEnum = mode === 'assign' ? 1 : 2;

  if (mode === 'reassign') {
    return {
      type,
      orderNos,
    };
  }

  return { type };
}
```

- [ ] **Step 4: Run the helper test to verify it passes**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/components/transferOrderSelect.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/views/finance/withdrawOrder/components/transferOrderSelect.ts src/views/finance/withdrawOrder/components/transferOrderSelect.spec.ts
git commit -m "test(withdraw-order): cover transfer user select params"
```

## Task 4: Update TransferOrderModal Without Breaking Assign Mode

**Files:**

- Modify: `src/views/finance/withdrawOrder/components/TransferOrderModal.vue`
- Reuse: `src/views/finance/withdrawOrder/components/transferOrderSelect.ts`
- Test: `src/views/finance/withdrawOrder/components/transferOrderSelect.spec.ts`

- [ ] **Step 1: Announce the shared-file edit before implementation**

Implementation note to surface in-session before editing:

```text
Next edit is outside the default dashboard boundary but still inside the withdrawOrder module:
src/views/finance/withdrawOrder/components/TransferOrderModal.vue
Change is compatibility-safe: reassign mode will include orderNos for staff lookup; assign mode stays unchanged.
```

- [ ] **Step 2: Replace inline select-param assembly with the helper**

```ts
import { buildStaffUserSelectParams } from './transferOrderSelect';

onMounted(async () => {
  userLoading.value = true;
  try {
    const { data } = await api.withdraw.getStaffUserSelectList(
      buildStaffUserSelectParams(props.mode, props.orderNos),
    );
    const list: WithdrawUserSelectItemRsp[] = Array.isArray(data) ? data : [];
    userOptions.value = list.map<StaffSelectOption>((item) => ({
      label: item.nickName || String(item.userId),
      value: String(item.userId),
      workState: item.workState ?? '',
    }));
  } catch {
    userOptions.value = [];
  } finally {
    userLoading.value = false;
  }
});
```

- [ ] **Step 3: Re-run the select helper test and a type check**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/components/transferOrderSelect.spec.ts
pnpm typecheck
```

Expected: helper spec PASS; `TransferOrderModal.vue` compiles with no new type errors.

- [ ] **Step 4: Commit**

```bash
git add src/views/finance/withdrawOrder/components/TransferOrderModal.vue
git commit -m "feat(withdraw-order): filter reassign candidates by selected orders"
```

## Task 5: Final Verification

**Files:**

- Verify: `src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue`
- Verify: `src/views/finance/withdrawOrder/components/TransferOrderModal.vue`
- Verify: `src/views/finance/withdrawOrder/dashboard/orderReassign.spec.ts`
- Verify: `src/views/finance/withdrawOrder/components/transferOrderSelect.spec.ts`

- [ ] **Step 1: Run the targeted tests**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/orderReassign.spec.ts src/views/finance/withdrawOrder/components/transferOrderSelect.spec.ts
```

Expected: PASS

- [ ] **Step 2: Run a focused type check**

Run:

```bash
pnpm typecheck
```

Expected: PASS

- [ ] **Step 3: Inspect the final diff for scope**

Run:

```bash
git diff -- src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue src/views/finance/withdrawOrder/dashboard/orderReassign.ts src/views/finance/withdrawOrder/dashboard/orderReassign.spec.ts src/views/finance/withdrawOrder/components/TransferOrderModal.vue src/views/finance/withdrawOrder/components/transferOrderSelect.ts src/views/finance/withdrawOrder/components/transferOrderSelect.spec.ts
```

Expected: only the current-order reassign flow and its tests changed; no unrelated dashboard or global component churn.

- [ ] **Step 4: Commit the final integration checkpoint**

```bash
git add src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue src/views/finance/withdrawOrder/dashboard/orderReassign.ts src/views/finance/withdrawOrder/dashboard/orderReassign.spec.ts src/views/finance/withdrawOrder/components/TransferOrderModal.vue src/views/finance/withdrawOrder/components/transferOrderSelect.ts src/views/finance/withdrawOrder/components/transferOrderSelect.spec.ts
git commit -m "feat(withdraw-dashboard): complete current order reassign flow"
```

## Self-Review

- Spec coverage: covers `sysCurrency` filter, global dictionary source, same-category/same-currency batch guard, and `orderNos` propagation into reassign staff lookup.
- Placeholder scan: no TBD/TODO placeholders remain; all touched files and commands are concrete.
- Type consistency: `OrderPanel.vue` continues to consume `WithdrawWorkCurrentOrderPageReq`; shared select-request helper uses generated `WithdrawUserSelectListReq`; shared edit is isolated to `reassign` mode.

## Execution Handoff

Plan complete and saved to `.local-work/plans/2026-04-28-withdraw-dashboard-current-order-reassign.md`. Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
