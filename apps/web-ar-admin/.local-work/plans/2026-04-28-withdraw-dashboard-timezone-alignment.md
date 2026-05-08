# Withdraw Dashboard Timezone Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the withdraw dashboard timezone behavior so the three dashboard modules share one consistent rule set: no default merchant fill, current-order queries send UTC timestamps based on dashboard timezone resolution, and time displays show the correct UTC context beside each value.

**Architecture:** Reuse the existing timezone conversion and formatting primitives already proven in `/finance/withdrawOrder?sub=orders&tab=records`, but move the dashboard-specific "which tenant timezone should I use?" decision into one small shared resolver inside `dashboard/`. Keep request-side timezone handling in `ProDateRangeInput`, keep display-side formatting in `useTenantOptions()`, and only add thin module-local glue for current-order rows, staff rows, and audit-log/detail dialogs.

**Tech Stack:** Vue 3 `script setup`, TypeScript, Naive UI, `ProDateRangeInput`, `ProCrudTable`, `useTenantOptions()`, generated `@/api/withdraw` client, Vitest.

---

## File Structure

- Create: `src/views/finance/withdrawOrder/dashboard/timezoneResolver.ts` Purpose: Dashboard-local resolver for "first selected tenant", "module default tenant", and "row tenant timezone" decisions. This is the only place that should know the "use the first merchant timezone" product rule.

- Create: `src/views/finance/withdrawOrder/dashboard/test/timezoneResolver.spec.ts` Purpose: Prove resolver behavior for empty merchant selection, multi-select, row `tenantId`, and row `tenantIds`.

- Modify: `src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue` Purpose: Feed the resolved timezone into both `ProDateRangeInput` controls, keep merchant default empty, and build audit-log summary values from timestamps instead of backend text fields.

- Modify: `src/views/finance/withdrawOrder/dashboard/columns.ts` Purpose: Render current-order timestamps and staff attendance timestamps with inline UTC suffixes while leaving duration-style fields untouched.

- Modify: `src/views/finance/withdrawOrder/dashboard/components/StaffPanel.vue` Purpose: Pass resolver-backed timezone helpers into the staff columns.

- Modify: `src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue` Purpose: Replace `formatToCurrentZone` with merchant-timezone formatting that follows the same resolver rule as the staff main table.

- Create: `src/views/finance/withdrawOrder/dashboard/test/staffColumns.spec.ts` Purpose: Prove staff attendance values display inline UTC suffixes and durations remain duration-only.

- Modify: `src/views/finance/withdrawOrder/dashboard/test/orderColumns.spec.ts` Purpose: Update current-order expectations so UTC is rendered beside each timestamp rather than on a separate line.

- Create: `src/views/finance/withdrawOrder/components/orderAuditLogTime.ts` Purpose: Shared timestamp-first helper for current-order audit-log summary values and audit-log table row mapping.

- Create: `src/views/finance/withdrawOrder/test/orderAuditLogTime.spec.ts` Purpose: Prove audit-log helper uses raw timestamps first, falls back to backend text only when timestamps are absent, and carries tenant UTC suffixes correctly.

- Modify: `src/views/finance/withdrawOrder/components/OrderAuditLog.vue` Purpose: Stop rendering backend-formatted `createTimeName` directly; instead map `createTime` through the shared helper and preserve backward-compatible fallback behavior.

## Task 1: Add a Shared Dashboard Timezone Resolver

**Files:**

- Create: `src/views/finance/withdrawOrder/dashboard/timezoneResolver.ts`
- Test: `src/views/finance/withdrawOrder/dashboard/test/timezoneResolver.spec.ts`

- [ ] **Step 1: Write the failing resolver test**

```ts
import { describe, expect, it } from 'vitest';
import {
  parseDashboardTenantIds,
  resolveDashboardTimezoneTarget,
  resolveRowTimezoneTarget,
} from '../timezoneResolver';

const tenantScope = [
  { tenantId: 101, tenantName: 'Alpha' },
  { tenantId: 202, tenantName: 'Bravo' },
];

const getTenantTimeZone = (tenantId?: number | null) =>
  tenantId === 101 ? 'Asia/Kolkata' : tenantId === 202 ? 'Asia/Manila' : '';

const getTenantTimeZoneLabel = (tenantId?: number | null) =>
  tenantId === 101 ? 'UTC+05:30' : tenantId === 202 ? 'UTC+08:00' : '';

describe('parseDashboardTenantIds', () => {
  it('parses and de-duplicates ids from row tenantIds text', () => {
    expect(parseDashboardTenantIds('101, 202, 101')).toEqual([101, 202]);
  });
});

describe('resolveDashboardTimezoneTarget', () => {
  it('uses the first selected tenant when merchants are selected', () => {
    expect(
      resolveDashboardTimezoneTarget({
        selectedTenantIds: [202, 101],
        tenantScope,
        getTenantTimeZone,
        getTenantTimeZoneLabel,
      }),
    ).toEqual({
      tenantId: 202,
      timezone: 'Asia/Manila',
      timezoneLabel: 'UTC+08:00',
    });
  });

  it('falls back to the first dashboard-scope tenant when none are selected', () => {
    expect(
      resolveDashboardTimezoneTarget({
        selectedTenantIds: [],
        tenantScope,
        getTenantTimeZone,
        getTenantTimeZoneLabel,
      }),
    ).toEqual({
      tenantId: 101,
      timezone: 'Asia/Kolkata',
      timezoneLabel: 'UTC+05:30',
    });
  });
});

describe('resolveRowTimezoneTarget', () => {
  it('prefers row tenantId over tenantIds text', () => {
    expect(
      resolveRowTimezoneTarget({
        rowTenantId: 202,
        rowTenantIds: '101,202',
        tenantScope,
        getTenantTimeZone,
        getTenantTimeZoneLabel,
      }),
    ).toEqual({
      tenantId: 202,
      timezone: 'Asia/Manila',
      timezoneLabel: 'UTC+08:00',
    });
  });

  it('falls back to the first tenant in row tenantIds text', () => {
    expect(
      resolveRowTimezoneTarget({
        rowTenantIds: '101,202',
        tenantScope,
        getTenantTimeZone,
        getTenantTimeZoneLabel,
      }),
    ).toEqual({
      tenantId: 101,
      timezone: 'Asia/Kolkata',
      timezoneLabel: 'UTC+05:30',
    });
  });
});
```

- [ ] **Step 2: Run the resolver test and confirm it fails**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/timezoneResolver.spec.ts
```

Expected: FAIL with `Cannot find module '../timezoneResolver'`.

- [ ] **Step 3: Implement the minimal shared resolver**

```ts
export interface DashboardTenantScopeItem {
  tenantId: number;
  tenantName?: string;
}

export interface DashboardTimezoneTarget {
  tenantId?: number;
  timezone: string | null;
  timezoneLabel: string;
}

interface ResolveDashboardTimezoneTargetOptions {
  selectedTenantIds?: number[];
  tenantScope: DashboardTenantScopeItem[];
  getTenantTimeZone: (tenantId?: number | null) => string;
  getTenantTimeZoneLabel: (tenantId?: number | null) => string;
}

interface ResolveRowTimezoneTargetOptions extends ResolveDashboardTimezoneTargetOptions {
  rowTenantId?: unknown;
  rowTenantIds?: unknown;
}

export function parseDashboardTenantIds(value: unknown): number[] {
  const normalized = String(value ?? '').trim();
  if (!normalized) return [];

  const ids = normalized
    .split(/[,\s，]+/)
    .map((item) => Number(item.trim()))
    .filter((item) => Number.isFinite(item) && item > 0);

  return Array.from(new Set(ids));
}

function resolveFirstScopeTenantId(tenantScope: DashboardTenantScopeItem[]) {
  return tenantScope[0]?.tenantId;
}

function buildTimezoneTarget(
  tenantId: number | undefined,
  getTenantTimeZone: (tenantId?: number | null) => string,
  getTenantTimeZoneLabel: (tenantId?: number | null) => string,
): DashboardTimezoneTarget {
  return {
    tenantId,
    timezone: tenantId ? getTenantTimeZone(tenantId) || null : null,
    timezoneLabel: tenantId ? getTenantTimeZoneLabel(tenantId) || '' : '',
  };
}

export function resolveDashboardTimezoneTarget(
  options: ResolveDashboardTimezoneTargetOptions,
): DashboardTimezoneTarget {
  const selectedTenantId = options.selectedTenantIds?.[0];
  const tenantId =
    selectedTenantId ?? resolveFirstScopeTenantId(options.tenantScope);
  return buildTimezoneTarget(
    tenantId,
    options.getTenantTimeZone,
    options.getTenantTimeZoneLabel,
  );
}

export function resolveRowTimezoneTarget(
  options: ResolveRowTimezoneTargetOptions,
): DashboardTimezoneTarget {
  const rowTenantId = Number(options.rowTenantId);
  if (Number.isFinite(rowTenantId) && rowTenantId > 0) {
    return buildTimezoneTarget(
      rowTenantId,
      options.getTenantTimeZone,
      options.getTenantTimeZoneLabel,
    );
  }

  const rowTenantIds = parseDashboardTenantIds(options.rowTenantIds);
  const tenantId =
    rowTenantIds[0] ?? resolveFirstScopeTenantId(options.tenantScope);
  return buildTimezoneTarget(
    tenantId,
    options.getTenantTimeZone,
    options.getTenantTimeZoneLabel,
  );
}
```

- [ ] **Step 4: Run the resolver test and confirm it passes**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/timezoneResolver.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/views/finance/withdrawOrder/dashboard/timezoneResolver.ts src/views/finance/withdrawOrder/dashboard/test/timezoneResolver.spec.ts
git commit -m "test(withdraw-dashboard): cover timezone resolver"
```

## Task 2: Align Current Order Request and Main-Table Time Display

**Files:**

- Modify: `src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue`
- Modify: `src/views/finance/withdrawOrder/dashboard/columns.ts`
- Modify: `src/views/finance/withdrawOrder/dashboard/test/orderColumns.spec.ts`

- [ ] **Step 1: Update the failing current-order column test**

```ts
it('renders each order timestamp with the UTC suffix beside the value', () => {
  const columns = createOrderColumns(vi.fn(), vi.fn(), {
    formatTenantDateTime: (value, tenantId) =>
      `formatted:${tenantId}:${String(value)}`,
    getTenantTimeZoneLabel: (tenantId) => (tenantId === 101 ? 'UTC+05:30' : ''),
  });

  const orderTimeColumn = columns.find((column) => column.key === 'orderTime');
  const vnode = orderTimeColumn?.render?.({
    tenantId: 101,
    createTime: 1000,
    createTimeText: 'legacy-create',
    assignTime: 2000,
    assignTimeText: 'legacy-assign',
    lastUpdateTime: 3000,
    lastUpdateTimeText: 'legacy-update',
  });

  const text = JSON.stringify(vnode);
  expect(text).toContain('formatted:101:1000');
  expect(text).toContain('(UTC+05:30)');
  expect(text).not.toContain('legacy-create');
});
```

- [ ] **Step 2: Run the current-order column test and confirm the old rendering fails**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/orderColumns.spec.ts
```

Expected: FAIL because the current column still puts UTC on a separate line or still prefers backend text.

- [ ] **Step 3: Wire timezone resolution into the current-order panel and columns**

```ts
// OrderPanel.vue
import {
  resolveDashboardTimezoneTarget,
  resolveRowTimezoneTarget,
} from '../timezoneResolver';

const orderQueryTimezoneTarget = computed(() =>
  resolveDashboardTimezoneTarget({
    selectedTenantIds: orderTenantIds.value,
    tenantScope: tenantUserScope.value.map((item) => ({
      tenantId: item.tenantId,
      tenantName: item.tenantName,
    })),
    getTenantTimeZone,
    getTenantTimeZoneLabel,
  }),
);

// template
<ProDateRangeInput
  v-model:value="orderWithdrawDateRange"
  :timezone="orderQueryTimezoneTarget.timezone"
  display-format="yyyy-MM-dd HH:mm:ss"
  clearable
/>

<ProDateRangeInput
  v-model:value="orderUpdateDateRange"
  :timezone="orderQueryTimezoneTarget.timezone"
  display-format="yyyy-MM-dd HH:mm:ss"
  clearable
/>

function formatOrderAuditInfoTime(timestamp: unknown, legacyText: unknown, tenantId: unknown) {
  if (typeof timestamp === 'number' && Number.isFinite(timestamp) && timestamp > 0) {
    return formatTenantDateTime(timestamp, Number(tenantId), undefined, '--');
  }
  return String(legacyText ?? '--');
}

const info = {
  site: row.tenantName || '--',
  handler: row.currentHandler ?? '--',
  applyTime: formatOrderAuditInfoTime(row.createTime, row.createTimeText, row.tenantId),
  assignTime: formatOrderAuditInfoTime(row.assignTime, row.assignTimeText, row.tenantId),
  assignee: row.currentHandler ?? '--',
  reviewStartTime: formatOrderAuditInfoTime(
    row.auditStartTime,
    row.auditStartTimeText,
    row.tenantId,
  ),
  elapsed: row.auditDurationText ?? '--',
  orderStatus: row.orderStateName ?? '--',
  processStatus: row.processStateName ?? '--',
  queryCount: row.queryCount ?? '--',
};
```

```ts
// columns.ts
function renderTimestampWithTimezone(
  label: string,
  value: unknown,
  legacyText: unknown,
  tenantId: unknown,
  options?: {
    formatTenantDateTime?: (
      value: number | string | Date | null | undefined,
      tenantId?: string | number | null,
      formatStr?: string,
      fallback?: string,
    ) => string;
    getTenantTimeZoneLabel?: (
      tenantId?: string | number | null,
      fallback?: string,
    ) => string;
  },
) {
  const formatted = options?.formatTenantDateTime
    ? options.formatTenantDateTime(
        typeof value === 'number' ||
          typeof value === 'string' ||
          value instanceof Date
          ? value
          : null,
        Number(tenantId),
        undefined,
        '--',
      )
    : String(legacyText ?? '--');
  const timeText = formatted || String(legacyText ?? '--');
  const tzLabel = options?.getTenantTimeZoneLabel?.(tenantId, '') || '';

  return h(
    'div',
    { style: 'display:flex;align-items:flex-start;white-space:nowrap;' },
    [
      h(
        'span',
        {
          style:
            'color:#8c8c8c;display:inline-block;flex:0 0 58px;min-width:58px;',
        },
        label,
      ),
      h('span', { style: 'color:#374151;' }, [
        timeText,
        tzLabel
          ? h(
              'span',
              { style: 'margin-left:4px;color:#9ca3af;font-size:11px;' },
              `(${tzLabel})`,
            )
          : null,
      ]),
    ],
  );
}
```

- [ ] **Step 4: Run the focused tests to confirm current-order behavior**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/timezoneResolver.spec.ts src/views/finance/withdrawOrder/dashboard/test/orderColumns.spec.ts src/views/finance/withdrawOrder/dashboard/test/orderReassign.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue src/views/finance/withdrawOrder/dashboard/columns.ts src/views/finance/withdrawOrder/dashboard/test/orderColumns.spec.ts
git commit -m "feat(withdraw-dashboard): align current order timezone handling"
```

## Task 3: Align Staff Main Table and Staff Order Modal

**Files:**

- Modify: `src/views/finance/withdrawOrder/dashboard/components/StaffPanel.vue`
- Modify: `src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue`
- Modify: `src/views/finance/withdrawOrder/dashboard/columns.ts`
- Create: `src/views/finance/withdrawOrder/dashboard/test/staffColumns.spec.ts`

- [ ] **Step 1: Write the failing staff-columns test**

```ts
import { describe, expect, it, vi } from 'vitest';
import { createStaffColumns } from '../columns';

describe('createStaffColumns', () => {
  it('renders staff attendance timestamps with an inline UTC suffix but leaves durations unchanged', () => {
    const columns = createStaffColumns(vi.fn(), vi.fn(), vi.fn(), vi.fn(), {
      resolveTenantName: (tenantId) => (tenantId === 101 ? 'Alpha' : ''),
      resolveRowTimezoneTarget: () => ({
        tenantId: 101,
        timezone: 'Asia/Kolkata',
        timezoneLabel: 'UTC+05:30',
      }),
      formatTenantDateTime: (value, tenantId) =>
        `formatted:${tenantId}:${String(value)}`,
    });

    const workInfoColumn = columns.find((column) => column.key === 'workInfo');
    const vnode = workInfoColumn?.render?.({
      tenantIds: '101,202',
      startWorkTime: 1000,
      endWorkTime: 2000,
      workDuration: '08:00:00',
    });

    const text = JSON.stringify(vnode);
    expect(text).toContain('formatted:101:1000');
    expect(text).toContain('formatted:101:2000');
    expect(text).toContain('(UTC+05:30)');
    expect(text).toContain('08:00:00');
  });
});
```

- [ ] **Step 2: Run the staff-columns test and confirm it fails**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/staffColumns.spec.ts
```

Expected: FAIL because `createStaffColumns` does not yet accept timezone formatter options.

- [ ] **Step 3: Implement staff main-table and modal timezone formatting**

```ts
// columns.ts
export function createStaffColumns(
  onViewOrders: (row: Recordable) => void,
  onStopAssign: (row: Recordable) => void,
  onStartAssign: (row: Recordable) => void,
  onReleaseAnomaly: (row: Recordable) => void,
  options?: {
    resolveTenantName?: (tenantId: number) => string;
    resolveRowTimezoneTarget?: (row: Recordable) => {
      tenantId?: number;
      timezone: string | null;
      timezoneLabel: string;
    };
    formatTenantDateTime?: (
      value: number | string | Date | null | undefined,
      tenantId?: string | number | null,
      formatStr?: string,
      fallback?: string,
    ) => string;
  },
) {
  // workInfo render: start/end use timestamp formatter + inline UTC, workDuration stays plain.
}
```

```ts
// StaffPanel.vue
const staffTableColumns = computed(() =>
  createStaffColumns(
    openStaffOrderModal,
    handleStopAssign,
    handleStartAssign,
    handleReleaseAnomaly,
    {
      resolveTenantName: (tenantId: number) =>
        tenantNameMap.value.get(tenantId) ?? '',
      resolveRowTimezoneTarget: (row) =>
        resolveRowTimezoneTarget({
          rowTenantIds: row.tenantIds,
          tenantScope: tenantUserScope.value.map((item) => ({
            tenantId: item.tenantId,
            tenantName: item.tenantName,
          })),
          getTenantTimeZone,
          getTenantTimeZoneLabel,
        }),
      formatTenantDateTime,
    },
  ),
);
```

```ts
// StaffOrderModal.vue
const { formatTenantDateTime, getTenantTimeZone, getTenantTimeZoneLabel } =
  useTenantOptions();

function resolveDashboardTenantTimezone() {
  const firstTenantId = resolveTenantId();
  return {
    tenantId: firstTenantId,
    timezone: firstTenantId ? getTenantTimeZone(firstTenantId) || null : null,
    timezoneLabel: firstTenantId
      ? getTenantTimeZoneLabel(firstTenantId) || ''
      : '',
  };
}

function formatDateTime(timestamp: unknown) {
  if (!timestamp) return '--';
  const normalized = Number(timestamp);
  if (!Number.isFinite(normalized) || normalized <= 0) return '--';
  const { tenantId } = resolveDashboardTenantTimezone();
  return formatTenantDateTime(
    normalized,
    tenantId,
    'yyyy-MM-dd HH:mm:ss',
    '--',
  );
}
```

- [ ] **Step 4: Run the focused staff tests**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/dashboard/test/staffColumns.spec.ts src/views/finance/withdrawOrder/dashboard/test/timezoneResolver.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/views/finance/withdrawOrder/dashboard/components/StaffPanel.vue src/views/finance/withdrawOrder/dashboard/components/StaffOrderModal.vue src/views/finance/withdrawOrder/dashboard/columns.ts src/views/finance/withdrawOrder/dashboard/test/staffColumns.spec.ts
git commit -m "feat(withdraw-dashboard): align staff timezone display"
```

## Task 4: Align Current-Order Audit Log Summary and Table Rows

**Files:**

- Create: `src/views/finance/withdrawOrder/components/orderAuditLogTime.ts`
- Create: `src/views/finance/withdrawOrder/test/orderAuditLogTime.spec.ts`
- Modify: `src/views/finance/withdrawOrder/components/OrderAuditLog.vue`
- Modify: `src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue`

- [ ] **Step 1: Write the failing audit-log helper test**

```ts
import { describe, expect, it } from 'vitest';
import {
  buildAuditLogDisplayTime,
  mapAuditLogRows,
} from '../components/orderAuditLogTime';

describe('buildAuditLogDisplayTime', () => {
  it('prefers raw timestamps over backend text fields', () => {
    expect(
      buildAuditLogDisplayTime({
        timestamp: 1000,
        legacyText: 'legacy',
        tenantId: 101,
        formatTenantDateTime: (value, tenantId) =>
          `formatted:${tenantId}:${String(value)}`,
        getTenantTimeZoneLabel: (tenantId) =>
          tenantId === 101 ? 'UTC+05:30' : '',
      }),
    ).toEqual({
      text: 'formatted:101:1000',
      timezoneSuffix: '(UTC+05:30)',
    });
  });
});

describe('mapAuditLogRows', () => {
  it('maps createTime using the shared timestamp-first formatter', () => {
    const rows = mapAuditLogRows(
      [
        {
          sort: 1,
          operator: 'alice',
          operationType: 'dispatch',
          operationTypeName: '派单',
          createTime: 2000,
          createTimeName: 'legacy',
          orderState: 1,
          orderStateName: '审核中',
          content: 'content',
          remark: '',
        },
      ],
      {
        tenantId: 101,
        formatTenantDateTime: (value, tenantId) =>
          `formatted:${tenantId}:${String(value)}`,
        getTenantTimeZoneLabel: (tenantId) =>
          tenantId === 101 ? 'UTC+05:30' : '',
      },
    );

    expect(rows[0].time).toBe('formatted:101:2000');
    expect(rows[0].timezoneSuffix).toBe('(UTC+05:30)');
  });
});
```

- [ ] **Step 2: Run the audit-log helper test and confirm it fails**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/test/orderAuditLogTime.spec.ts
```

Expected: FAIL with missing helper module errors.

- [ ] **Step 3: Implement the shared audit-log time helper and wire the component**

```ts
// orderAuditLogTime.ts
export function buildAuditLogDisplayTime(options: {
  timestamp: unknown;
  legacyText: unknown;
  tenantId?: number;
  formatTenantDateTime: (
    value: number | string | Date | null | undefined,
    tenantId?: string | number | null,
    formatStr?: string,
    fallback?: string,
  ) => string;
  getTenantTimeZoneLabel: (
    tenantId?: string | number | null,
    fallback?: string,
  ) => string;
}) {
  const text =
    typeof options.timestamp === 'number' &&
    Number.isFinite(options.timestamp) &&
    options.timestamp > 0
      ? options.formatTenantDateTime(
          options.timestamp,
          options.tenantId,
          undefined,
          '--',
        )
      : String(options.legacyText ?? '--');

  const timezoneLabel = options.getTenantTimeZoneLabel(options.tenantId, '');
  return {
    text,
    timezoneSuffix: timezoneLabel ? `(${timezoneLabel})` : '',
  };
}
```

```ts
// OrderAuditLog.vue
const { formatTenantDateTime, getTenantTimeZoneLabel } = useTenantOptions();

const mappedRows = mapAuditLogRows(list, {
  tenantId: props.tenantId,
  formatTenantDateTime,
  getTenantTimeZoneLabel,
});
```

```ts
// OrderPanel.vue openLogModal info
const applyTime = buildAuditLogDisplayTime({
  timestamp: row.createTime,
  legacyText: row.createTimeText,
  tenantId: Number(row.tenantId ?? 0),
  formatTenantDateTime,
  getTenantTimeZoneLabel,
});
```

- [ ] **Step 4: Run the audit-log and current-order focused tests**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run src/views/finance/withdrawOrder/test/orderAuditLogTime.spec.ts src/views/finance/withdrawOrder/dashboard/test/orderColumns.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/views/finance/withdrawOrder/components/orderAuditLogTime.ts src/views/finance/withdrawOrder/test/orderAuditLogTime.spec.ts src/views/finance/withdrawOrder/components/OrderAuditLog.vue src/views/finance/withdrawOrder/dashboard/components/OrderPanel.vue
git commit -m "feat(withdraw-dashboard): align audit log timezone formatting"
```

## Task 5: Final Verification

**Files:**

- Modify: working tree only

- [ ] **Step 1: Run the full focused test suite**

Run:

```bash
pnpm exec vitest --config vitest.app.config.ts run \
  src/views/finance/withdrawOrder/dashboard/test/timezoneResolver.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/orderColumns.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/staffColumns.spec.ts \
  src/views/finance/withdrawOrder/dashboard/test/orderReassign.spec.ts \
  src/views/finance/withdrawOrder/test/orderAuditLogTime.spec.ts \
  src/views/finance/withdrawOrder/test/transferOrderRequest.spec.ts
```

Expected: PASS

- [ ] **Step 2: Run whitespace and patch hygiene checks**

Run:

```bash
git diff --check
```

Expected: PASS with no trailing whitespace or malformed conflict markers.

- [ ] **Step 3: Summarize the manual smoke checklist**

```text
1. Open 出款数据看板 → 当前提现订单 and confirm merchant filter defaults to empty.
2. Pick one merchant, choose 申请时间 / 更新时间, and verify outgoing query uses timestamps while the trigger displays the merchant timezone.
3. Clear merchant filter and verify the same controls still use the dashboard default timezone.
4. Open 员工实时状态 and verify 上班时间 / 下班时间 render with inline UTC while 工作时长 stays duration-only.
5. Open 查看订单 and 订单审核日志 and verify they match the same timezone rule as the main table.
```

- [ ] **Step 4: Commit the final verification-only changes if needed**

```bash
git status --short
```

Expected: only intentional source/test changes remain; no verification-only file edits to commit.

## Self-Review

- Spec coverage: the plan covers all three dashboard modules, the no-default-merchant rule, the first-merchant shared resolver, timestamp-only query parameters, current-order display, staff display, staff detail modal, and current-order audit-log detail.
- Placeholder scan: no `TODO` / `TBD` placeholders remain; every task names exact files and commands.
- Type consistency: current-order request fields remain `number` timestamps, staff `startWorkTime/endWorkTime` use the regenerated `number` types, and duration-like fields stay as strings.
