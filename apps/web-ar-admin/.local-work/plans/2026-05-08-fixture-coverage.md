# Fixture Coverage Validation + Admin Stub Fixtures

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Guarantee 100% fixture coverage for every endpoint in both admin and tenant endpoint lists, validated by a runnable script that exits non-zero on any gap.

**Architecture:** Three-step: (1) write `validate-fixtures.ts` — the "test" that currently fails with 40 missing; (2) remove 4 vben-core routes that don't belong in `ADMIN_READ_ENDPOINTS`; (3) create 36 admin hub/event/ai stubs (14 copies from existing tenant fixtures + 22 minimal `{ code:0 }` stubs). After step 3 the script passes at 100%.

**Why stubs instead of re-capture:** All 36 missing admin fixtures are `HTTP 404` on the SIT admin backend — hub, event and AI are separate microservices routed only through the tenant URL. They cannot be captured from `sit-adminapi.*`. Tenant fixtures already exist and share the same shape; admin-only endpoints get minimal stubs.

**Tech Stack:** Node.js ESM + `esno`, TypeScript, `import.meta.dirname` (Node 22+)

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `apps/web-ar-admin/tools/validate-fixtures.ts` | **Create** | Reads both endpoint lists, checks fixture exists + `code===0`, exits 1 on any failure |
| `apps/web-ar-admin/package.json` | **Modify** | Add `"validate:fixtures"` npm script |
| `apps/web-ar-admin/tools/endpoints/admin-read.ts` | **Modify** | Remove 4 vben-core routes (`/menu/all`, `/user/info`, `/auth/codes`, `/.well-known/openid-configuration`) |
| `apps/web-ar-admin/tools/mock-fixtures/admin/hub/*` | **Create** | 13 stub JSON files for admin hub endpoints |
| `apps/web-ar-admin/tools/mock-fixtures/admin/event/*` | **Create** | 11 stub JSON files for admin event endpoints |
| `apps/web-ar-admin/tools/mock-fixtures/admin/ai/*` | **Create** | 12 stub JSON files for admin AI endpoints |

---

### Task 1: Write validate-fixtures.ts and add npm script

**Files:**
- Create: `apps/web-ar-admin/tools/validate-fixtures.ts`
- Modify: `apps/web-ar-admin/package.json`

- [ ] **Step 1: Create `apps/web-ar-admin/tools/validate-fixtures.ts`**

```ts
// apps/web-ar-admin/tools/validate-fixtures.ts
// Usage: pnpm --filter web-ar-admin exec esno tools/validate-fixtures.ts

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { ADMIN_READ_ENDPOINTS } from './endpoints/admin-read.js';
import { TENANT_READ_ENDPOINTS } from './endpoints/tenant-read.js';

const FIXTURES_ROOT = path.join(import.meta.dirname, 'mock-fixtures');

// These are vben-internal dev-server routes, not AR backend API routes.
// They have no fixture files and should not be validated.
const SKIP_PATHS = new Set([
  '/.well-known/openid-configuration',
  '/auth/codes',
  '/menu/all',
  '/user/info',
]);

interface Result {
  detail?: string;
  mode: 'admin' | 'tenant';
  path: string;
  status: 'bad-code' | 'missing' | 'ok';
}

function check(mode: 'admin' | 'tenant', apiPath: string): Result {
  const rel = apiPath.replace(/^\//, '');
  const fp = path.join(FIXTURES_ROOT, mode, ...rel.split('/')) + '.json';

  if (!fs.existsSync(fp)) {
    return { detail: fp, mode, path: apiPath, status: 'missing' };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(fs.readFileSync(fp, 'utf8'));
  } catch {
    return { detail: 'invalid JSON', mode, path: apiPath, status: 'bad-code' };
  }

  if (parsed.code !== 0) {
    return {
      detail: `code=${parsed.code} msg=${parsed.msg ?? ''}`,
      mode,
      path: apiPath,
      status: 'bad-code',
    };
  }

  return { mode, path: apiPath, status: 'ok' };
}

const results: Result[] = [];

for (const ep of ADMIN_READ_ENDPOINTS) {
  if (SKIP_PATHS.has(ep.path)) continue;
  results.push(check('admin', ep.path));
}
for (const ep of TENANT_READ_ENDPOINTS) {
  if (SKIP_PATHS.has(ep.path)) continue;
  results.push(check('tenant', ep.path));
}

const missing = results.filter((r) => r.status === 'missing');
const badCode = results.filter((r) => r.status === 'bad-code');
const ok = results.filter((r) => r.status === 'ok');

console.log('\n=== Fixture Coverage Report ===');
console.log(`Endpoints checked : ${results.length}`);
console.log(`  ✅ OK       : ${ok.length}`);
console.log(`  ❌ MISSING  : ${missing.length}`);
console.log(`  ❌ BAD CODE : ${badCode.length}`);

if (missing.length > 0) {
  console.log('\nMissing fixtures:');
  for (const r of missing) console.log(`  [${r.mode}] ${r.path}`);
}
if (badCode.length > 0) {
  console.log('\nBad-code fixtures (code !== 0):');
  for (const r of badCode)
    console.log(`  [${r.mode}] ${r.path}  (${r.detail})`);
}

if (missing.length === 0 && badCode.length === 0) {
  console.log('\n✅ 100% coverage — all fixtures present and code=0\n');
  process.exit(0);
} else {
  console.log(`\n❌ ${missing.length + badCode.length} fixture(s) need attention.\n`);
  process.exit(1);
}
```

- [ ] **Step 2: Add `validate:fixtures` script to `apps/web-ar-admin/package.json`**

In the `"scripts"` block (current last entry is `"gen:api": "esno tools/api.ts"`), add:

```json
"validate:fixtures": "esno tools/validate-fixtures.ts"
```

- [ ] **Step 3: Run the script to confirm it currently fails (expected)**

Run: `pnpm --filter @vben/web-ar-admin run validate:fixtures`

Expected output contains:
```
  ❌ MISSING  : 36
```
(36 admin hub/event/ai fixtures missing; tenant is already 100%)

- [ ] **Step 4: Commit**

```bash
git add apps/web-ar-admin/tools/validate-fixtures.ts apps/web-ar-admin/package.json
git commit -m "feat(@vben/web-ar-admin): add validate:fixtures script — checks coverage + code=0 for all endpoints"
```

---

### Task 2: Remove vben-core routes from ADMIN_READ_ENDPOINTS

**Files:**
- Modify: `apps/web-ar-admin/tools/endpoints/admin-read.ts`

**Context:** Four routes in `ADMIN_READ_ENDPOINTS` are vben-internal dev-server routes, not AR backend API routes. They have no SIT URL and will always 404 on capture. They should not be in the capture list.

Routes to remove:
```
{ method: 'GET', path: '/menu/all' },
{ method: 'GET', path: '/user/info' },
{ method: 'GET', path: '/auth/codes' },
{ method: 'GET', path: '/.well-known/openid-configuration' },
```

- [ ] **Step 1: Remove the 4 vben-core routes from `ADMIN_READ_ENDPOINTS`**

In `apps/web-ar-admin/tools/endpoints/admin-read.ts`, delete these 4 lines from the `ADMIN_READ_ENDPOINTS` array (they appear after the `/Login/Login` entry):

```ts
  { method: 'GET', path: '/menu/all' },
  { method: 'GET', path: '/user/info' },
  { method: 'GET', path: '/auth/codes' },
  { method: 'GET', path: '/.well-known/openid-configuration' },
```

- [ ] **Step 2: Run validation — gap count should be unchanged at 36**

Run: `pnpm --filter @vben/web-ar-admin run validate:fixtures`

Expected: still `MISSING: 36` (the 4 removed routes were already in `SKIP_PATHS`, so the count doesn't change — this confirms SKIP_PATHS was correct).

- [ ] **Step 3: Commit**

```bash
git add apps/web-ar-admin/tools/endpoints/admin-read.ts
git commit -m "chore(@vben/web-ar-admin): remove vben-core routes from ADMIN_READ_ENDPOINTS (not AR backend endpoints)"
```

---

### Task 3: Create admin hub/event/AI fixture stubs

**Files:**
- Create: `apps/web-ar-admin/tools/mock-fixtures/admin/hub/` (13 files)
- Create: `apps/web-ar-admin/tools/mock-fixtures/admin/event/` (11 files)
- Create: `apps/web-ar-admin/tools/mock-fixtures/admin/ai/` (12 files)

**Context:** All 36 missing fixtures are `HTTP 404` on the SIT admin backend — hub, event and AI are separate microservices not exposed through the admin API URL. They cannot be recaptured.

Strategy:
- **14 files exist in tenant fixtures** with matching paths → copy them (same microservice, same response shape)
- **22 files are admin-only** → create minimal `{ "code": 0, ... }` stubs

The `code: 0` guarantee is all that's needed for the mock server to return a success response rather than an error page.

- [ ] **Step 1: Create admin hub fixture directory and copy 9 files from tenant**

Run:
```bash
mkdir -p apps/web-ar-admin/tools/mock-fixtures/admin/hub/web \
         apps/web-ar-admin/tools/mock-fixtures/admin/hub/debug/scheduler

for name in domains/list assets/list jobs/list jobs/stats themes/list layouts/list tabbars/list merchant/sites; do
  src="apps/web-ar-admin/tools/mock-fixtures/tenant/hub/${name}.json"
  dst="apps/web-ar-admin/tools/mock-fixtures/admin/hub/${name}.json"
  mkdir -p "$(dirname "$dst")"
  cp "$src" "$dst"
done

cp apps/web-ar-admin/tools/mock-fixtures/tenant/hub/web/config.json \
   apps/web-ar-admin/tools/mock-fixtures/admin/hub/web/config.json
```

- [ ] **Step 2: Create 4 admin-only hub stubs**

Create `apps/web-ar-admin/tools/mock-fixtures/admin/hub/job-logs/list.json`:
```json
{ "code": 0, "data": { "list": [], "total": 0 }, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/hub/runners/list.json`:
```json
{ "code": 0, "data": { "list": [], "total": 0 }, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/hub/web/game.json`:
```json
{ "code": 0, "data": null, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/hub/debug/scheduler/org-tenant-list.json`:
```json
{ "code": 0, "data": { "list": [], "total": 0 }, "msg": "" }
```

- [ ] **Step 3: Create admin event fixtures — 3 copies from tenant**

Run:
```bash
mkdir -p apps/web-ar-admin/tools/mock-fixtures/admin/event/admin \
         apps/web-ar-admin/tools/mock-fixtures/admin/event/traffic

cp apps/web-ar-admin/tools/mock-fixtures/tenant/event/metrics.json \
   apps/web-ar-admin/tools/mock-fixtures/admin/event/metrics.json

cp apps/web-ar-admin/tools/mock-fixtures/tenant/event/traffic/health.json \
   apps/web-ar-admin/tools/mock-fixtures/admin/event/traffic/health.json

cp apps/web-ar-admin/tools/mock-fixtures/tenant/event/traffic/summary.json \
   apps/web-ar-admin/tools/mock-fixtures/admin/event/traffic/summary.json
```

- [ ] **Step 4: Create 8 admin-only event stubs**

Create `apps/web-ar-admin/tools/mock-fixtures/admin/event/options.json`:
```json
{ "code": 0, "data": [], "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/event/admin/card-page.json`:
```json
{ "code": 0, "data": { "list": [], "total": 0 }, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/event/admin/project.json`:
```json
{ "code": 0, "data": null, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/event/admin/init/status.json`:
```json
{ "code": 0, "data": null, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/event/admin/alarm/stats.json`:
```json
{ "code": 0, "data": null, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/event/traffic/metrics.json`:
```json
{ "code": 0, "data": null, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/event/traffic/trend.json`:
```json
{ "code": 0, "data": [], "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/event/traffic/nodes.json`:
```json
{ "code": 0, "data": [], "msg": "" }
```

- [ ] **Step 5: Create admin AI fixtures — 2 copies from tenant**

Run:
```bash
mkdir -p apps/web-ar-admin/tools/mock-fixtures/admin/ai/chat \
         apps/web-ar-admin/tools/mock-fixtures/admin/ai/knowledge \
         apps/web-ar-admin/tools/mock-fixtures/admin/ai/admin \
         apps/web-ar-admin/tools/mock-fixtures/admin/ai/report

cp apps/web-ar-admin/tools/mock-fixtures/tenant/ai/health.json \
   apps/web-ar-admin/tools/mock-fixtures/admin/ai/health.json

cp apps/web-ar-admin/tools/mock-fixtures/tenant/ai/metrics.json \
   apps/web-ar-admin/tools/mock-fixtures/admin/ai/metrics.json
```

- [ ] **Step 6: Create 10 admin-only AI stubs**

Create `apps/web-ar-admin/tools/mock-fixtures/admin/ai/chat/config.json`:
```json
{ "code": 0, "data": null, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/ai/chat/sessions.json`:
```json
{ "code": 0, "data": { "list": [], "total": 0 }, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/ai/knowledge/queue/stats.json`:
```json
{ "code": 0, "data": null, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/ai/knowledge/search.json`:
```json
{ "code": 0, "data": { "list": [], "total": 0 }, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/ai/admin/escalation/stats.json`:
```json
{ "code": 0, "data": null, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/ai/admin/feedback/stats.json`:
```json
{ "code": 0, "data": null, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/ai/report/sessions.json`:
```json
{ "code": 0, "data": { "list": [], "total": 0 }, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/ai/report/alerts/config.json`:
```json
{ "code": 0, "data": null, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/ai/report/failed-queries.json`:
```json
{ "code": 0, "data": { "list": [], "total": 0 }, "msg": "" }
```

Create `apps/web-ar-admin/tools/mock-fixtures/admin/ai/report/planner/stats.json`:
```json
{ "code": 0, "data": null, "msg": "" }
```

- [ ] **Step 7: Run validation — expect 100% pass**

Run: `pnpm --filter @vben/web-ar-admin run validate:fixtures`

Expected output:
```
=== Fixture Coverage Report ===
Endpoints checked : 125
  ✅ OK       : 125
  ❌ MISSING  : 0
  ❌ BAD CODE : 0

✅ 100% coverage — all fixtures present and code=0
```

If any failures appear, check the reported path and create the missing file.

- [ ] **Step 8: Commit**

```bash
git add apps/web-ar-admin/tools/mock-fixtures/admin/
git commit -m "feat(@vben/web-ar-admin): add admin hub/event/ai fixture stubs — achieve 100% fixture coverage"
```

---

## Self-Review

**Spec coverage:**
- ✅ Validation script created — Task 1
- ✅ npm script `validate:fixtures` added — Task 1
- ✅ Vben-core routes removed from capture list — Task 2
- ✅ All 36 missing admin hub/event/ai fixtures created (14 copies + 22 stubs) — Task 3
- ✅ Final validation confirms 100% — Task 3 Step 7

**Placeholder scan:** None. All file contents are fully specified inline.

**Type consistency:**
- `Result.status` uses `'ok' | 'missing' | 'bad-code'` consistently throughout the script.
- Fixture path derivation logic in `validate-fixtures.ts` matches `capture-mock-data.ts` convention (`apiPath.replace(/^\//, '').split('/')` → join as filesystem path with `.json`).

**Edge cases handled:**
- `SKIP_PATHS` prevents vben-core routes from failing validation even before Task 2 removes them from the endpoint list.
- `mkdir -p` in all cp/create steps prevents "no such file or directory" errors.
- `admin/event/admin/init/` requires two directory levels — Step 4 creates `admin/event/admin` but the `init/status.json` needs `admin/event/admin/init/` to exist. The Write tool creates parent directories automatically; if using shell, add `mkdir -p apps/web-ar-admin/tools/mock-fixtures/admin/event/admin/init` before creating that file.
