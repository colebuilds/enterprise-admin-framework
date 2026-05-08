/**
 * dict-snapshot.ts
 *
 * 从真实 SIT 接口拉取所有字典数据，输出：
 *   tools/dict-snapshot.json          — 原始快照（key列表 + 样本）供审查
 *   src/composables/dict/registry.ts  — KEY_SOURCE 注册表草稿
 *
 * 用法：pnpm --filter web-ar-admin exec esno tools/dict-snapshot.ts
 */

import * as fs from 'node:fs';
import https from 'node:https';
import * as path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import axios from 'axios';
import SparkMD5 from 'spark-md5';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

// ── Env ──────────────────────────────────────────────────────────────────────

function parseEnv(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {};
  const result: Record<string, string> = {};
  for (const line of fs.readFileSync(filePath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq === -1) continue;
    result[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
  }
  return result;
}

const env = {
  ...parseEnv(path.join(ROOT, '.env')),
  ...parseEnv(path.join(ROOT, '.env.sit')),
};

const BASE_URL = env.VITE_TENANT_API_URL;
const DOMAIN_URL = BASE_URL;

if (!BASE_URL) {
  console.error('VITE_TENANT_API_URL not found in .env.sit');
  process.exit(1);
}

// ── Signing (mirrors src/api/request.ts) ────────────────────────────────────

function randomInt(n: number): number {
  if (n <= 0) return -1;
  const limit = 10 ** n;
  const value = Math.floor(Math.random() * limit);
  if (value < limit / 10 && value !== 0) return randomInt(n);
  return value;
}

function sortObjectForSign(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const keys = Object.keys(obj)
    .filter((k) => !Array.isArray(obj[k]) && obj[k] !== '')
    .toSorted();
  for (const k of keys) {
    if (obj[k] !== null && obj[k] !== '') {
      result[k] =
        obj[k] && typeof obj[k] === 'object'
          ? sortObjectForSign(obj[k] as Record<string, unknown>)
          : obj[k];
    }
  }
  return result;
}

function removeArrayFields(value: unknown): unknown {
  if (Array.isArray(value)) return undefined;
  if (value && typeof value === 'object') {
    const r: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const next = removeArrayFields(v);
      if (next !== undefined) r[k] = next;
    }
    return r;
  }
  return value;
}

function signBody(body: Record<string, unknown>): Record<string, unknown> {
  const random = randomInt(12);
  const withMeta = { ...body, language: 'en', random };
  const forSign = removeArrayFields(withMeta) as Record<string, unknown>;
  const sorted = sortObjectForSign(forSign);
  const signature = SparkMD5.hash(JSON.stringify(sorted))
    .toUpperCase()
    .slice(0, 32);
  const timestamp = Math.floor(Date.now() / 1000);
  return { ...withMeta, signature, timestamp };
}

// ── HTTP ─────────────────────────────────────────────────────────────────────

const http = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { 'Content-Type': 'application/json', domainUrl: DOMAIN_URL },
  // SIT 证书在本机 LibreSSL 下握手失败，跳过验证
  httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  timeout: 15_000,
});

async function post<T = unknown>(
  url: string,
  body: Record<string, unknown> = {},
  token?: string,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await http.post<{ code: number; data: T; msg: string }>(
    url,
    signBody(body),
    { headers },
  );
  if (res.data.code !== 0) {
    throw new Error(`${url} code=${res.data.code} msg=${res.data.msg}`);
  }
  return res.data.data;
}

// ── Snapshot helpers ──────────────────────────────────────────────────────────

type ItemRecord = Record<string, unknown>;

interface SourceSnapshot {
  keys: string[];
  /** 每个 key 的第一条原始数据，用于判断 label/value 字段 */
  samples: Record<string, ItemRecord>;
}

function buildSourceSnapshot(data: Record<string, unknown>): SourceSnapshot {
  const keys: string[] = [];
  const samples: Record<string, ItemRecord> = {};
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) {
      keys.push(k);
      samples[k] = (v[0] ?? {}) as ItemRecord;
    }
  }
  return { keys: keys.toSorted(), samples };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // ── 1. Login ────────────────────────────────────────────────
  process.stdout.write('Logging in … ');
  const { token } = await post<{ token: string; tokenHeader: string }>(
    '/Login/Login',
    { userName: 'milogly01', pwd: '12345678' },
  );
  console.log('OK');

  // ── 2. Static dicts ─────────────────────────────────────────
  process.stdout.write('Fetching common dict … ');
  const commonRaw = await post<Record<string, unknown>>(
    '/Common/GetDictionary',
    {},
    token,
  );
  const common = buildSourceSnapshot(commonRaw);
  console.log(`${common.keys.length} keys`);

  process.stdout.write('Fetching v1 dict … ');
  const v1Raw = await post<Record<string, unknown>>(
    '/v1/Common/GetDictionary',
    {},
    token,
  );
  const v1 = buildSourceSnapshot(v1Raw);
  console.log(`${v1.keys.length} keys`);

  process.stdout.write('Fetching group dict … ');
  const groupRaw = await post<Record<string, unknown>>(
    '/SysDictionary/GetGroupData',
    {},
    token,
  );
  const group = buildSourceSnapshot(groupRaw);
  console.log(`${group.keys.length} keys`);

  process.stdout.write('Fetching platform dict … ');
  const platformRaw = await post<Record<string, unknown>>(
    '/Common/GetPlatformDic',
    {},
    token,
  );
  const platform = buildSourceSnapshot(platformRaw);
  console.log(`${platform.keys.length} keys`);

  // ── 3. Dynamic dict ──────────────────────────────────────────
  // ⚠️  gen-api 把 DynamicDictionaryKeyEnum 生成为中文字面量，但后端实际接收英文 camelCase。
  //    中文 keys 会被后端拒绝（code=7, Param is Invalid）。
  //    此脚本（snapshot 工具）尝试中文作为 fallback，是因为 SIT 环境实际验证发现空 body 不返回数据。
  //    运行时（useDictionary.ts）必须用英文 camelCase keys，见 ALL_DYNAMIC_KEYS。
  // 响应 items 的 key 可能是 camelCase 或 PascalCase，useDictionary.ts 在 queryFn 里统一转 camelCase。
  // 若后端新增枚举，在此追加映射后重跑脚本。
  const DYNAMIC_ENUM_MAP: Record<string, string> = {
    withdrawCategoryList: '提现大类列表',
    organizationList: '集团下拉框数据',
    tenantList: '商户下拉框数据',
    sysCurrencyList: '币种下拉框数据',
    payCodeList: '三方映射码下拉框数据',
    thirdPayMerchantList: '三方商户昵称/商户号下拉框数据',
    tenantPayChannelList: '商户通道下拉框数据',
    sysPayChannelList: '系统通道字典下拉框数据',
    rechargeCategoryList: '充值大类下拉框数据',
    roleList: '系统角色下拉框数据',
    menuList: '系统菜单下拉框数据',
    withdrawConfigGroupList: '出款派单配置组别下拉框数据',
  };

  process.stdout.write('Fetching dynamic dict (empty body → full?) … ');
  let dynamicRaw: Record<string, unknown> = {};
  let dynamicMode = 'empty';
  try {
    const res = await post<{ items: Record<string, unknown> }>(
      '/Common/GetDynamicDictionary',
      {},
      token,
    );
    dynamicRaw = res.items ?? (res as Record<string, unknown>);
    const dynamicKeys = Object.keys(dynamicRaw).filter((k) =>
      Array.isArray(dynamicRaw[k]),
    );
    if (dynamicKeys.length > 0) {
      console.log(`OK — full (${dynamicKeys.length} keys)`);
    } else {
      // 空 body 无效，用中文枚举值显式批量请求
      console.log('empty — fetching via Chinese enum keys …');
      dynamicMode = 'explicit';
      const enumValues = Object.values(DYNAMIC_ENUM_MAP);
      try {
        const r = await post<{ items: Record<string, unknown> }>(
          '/Common/GetDynamicDictionary',
          { keys: enumValues },
          token,
        );
        dynamicRaw = r.items ?? (r as Record<string, unknown>);
        const got = Object.keys(dynamicRaw).filter((k) =>
          Array.isArray(dynamicRaw[k]),
        ).length;
        console.log(`got ${got}/${enumValues.length} keys`);
      } catch (error: any) {
        // 批量失败，逐个尝试
        console.log(`batch failed (${error.message}) — trying one by one …`);
        for (const [engKey, cnEnum] of Object.entries(DYNAMIC_ENUM_MAP)) {
          try {
            const r = await post<{ items: Record<string, unknown> }>(
              '/Common/GetDynamicDictionary',
              { keys: [cnEnum] },
              token,
            );
            const items = r.items ?? (r as Record<string, unknown>);
            if (items[engKey] !== undefined) dynamicRaw[engKey] = items[engKey];
          } catch {
            // 单 key 失败不中断
          }
        }
        console.log(
          `got ${Object.keys(dynamicRaw).length}/${Object.keys(DYNAMIC_ENUM_MAP).length} keys`,
        );
      }
    }
  } catch (error: any) {
    console.log(`failed (${error.message}) — will skip dynamic`);
    dynamicMode = 'failed';
  }

  // dynamic 为 0 时回退到已知 key 列表，保证 registry 完整
  if (
    Object.keys(dynamicRaw).filter((k) => Array.isArray(dynamicRaw[k]))
      .length === 0
  ) {
    console.log(
      '  ⚠ dynamic fetch returned 0 items — using known key list as fallback',
    );
    for (const k of Object.keys(DYNAMIC_ENUM_MAP)) {
      dynamicRaw[k] = []; // 占位，保证 key 出现在 registry
    }
  }

  const dynamic = buildSourceSnapshot(dynamicRaw);

  // ── 4. Compute overlaps ──────────────────────────────────────
  const allSources = { common, v1, group, platform, dynamic };
  const keyToSources: Record<string, string[]> = {};
  for (const [src, snap] of Object.entries(allSources)) {
    for (const k of snap.keys) {
      (keyToSources[k] ??= []).push(src);
    }
  }
  const overlaps = Object.entries(keyToSources)
    .filter(([, srcs]) => srcs.length > 1)
    .map(([k, srcs]) => ({ key: k, sources: srcs }));

  // ── 5. Write snapshot JSON ───────────────────────────────────
  const snapshot = {
    generatedAt: new Date().toISOString(),
    dynamicMode,
    overlaps,
    sources: allSources,
  };
  const snapshotPath = path.join(__dirname, 'dict-snapshot.json');
  fs.writeFileSync(snapshotPath, JSON.stringify(snapshot, null, 2));
  console.log(`\nSnapshot → ${snapshotPath}`);

  // ── 6. Generate KEY_SOURCE registry ─────────────────────────
  const ambiguousKeys = new Set(overlaps.map((o) => o.key));

  // Ambiguous keys MUST NOT appear in KEY_SOURCE — they require explicit source
  // in the composable overload. Generate them as a separate type + map instead.
  const ambiguousEntries = overlaps.map(({ key, sources }) => ({
    key,
    sources,
  }));

  const lines: string[] = [
    `// AUTO-GENERATED by tools/dict-snapshot.ts — ${new Date().toISOString()}`,
    `// Do NOT edit manually — re-run: pnpm --filter web-ar-admin exec esno tools/dict-snapshot.ts`,
    ``,
    `export type DictSource = 'common' | 'v1' | 'group' | 'platform' | 'dynamic';`,
    ``,
    `/**`,
    ` * Keys that exist in multiple sources. The composable overload requires an explicit`,
    ` * \`source\` argument for these — they are intentionally absent from KEY_SOURCE.`,
    ` */`,
    `// prettier-ignore`,
    `export const AMBIGUOUS_SOURCES: Record<string, DictSource[]> = {`,
    ...ambiguousEntries.map(
      ({ key, sources }) =>
        `  ${key}: [${sources.map((s) => `'${s}'`).join(', ')}],`,
    ),
    `} as const;`,
    ``,
    `export type AmbiguousKey = keyof typeof AMBIGUOUS_SOURCES;`,
    ``,
    `// prettier-ignore`,
    `export const KEY_SOURCE: Record<string, DictSource> = {`,
  ];

  // 读取中文元数据，注入 JSDoc 注释（文件不存在时静默跳过）
  const keyMeta: Record<string, string> = {};
  const metaPath = path.join(__dirname, 'dict-keys-meta.ts');
  if (fs.existsSync(metaPath)) {
    const metaSrc = fs.readFileSync(metaPath, 'utf8');
    // 只匹配单行 JSDoc（/** ... */），避免跨块误匹配
    const jsdocRe = /\/\*\*\s*(.+?)\s*\*\/\s*\n\s*(\w+):\s*'[^']*'/g;
    let m: null | RegExpExecArray;
    while ((m = jsdocRe.exec(metaSrc)) !== null) {
      keyMeta[m[2]!] = m[1]!.trim();
    }
  }

  function addSection(label: string, src: string, keys: string[]) {
    if (keys.length === 0) return;
    lines.push(`  // ── ${label} ──`);
    for (const k of keys) {
      if (keyMeta[k]) {
        lines.push(`  /** ${keyMeta[k]} */`);
      }
      lines.push(`  ${k}: '${src}',`);
    }
  }

  addSection(
    'common',
    'common',
    common.keys.filter((k) => !ambiguousKeys.has(k)),
  );
  addSection(
    'v1',
    'v1',
    v1.keys.filter((k) => !ambiguousKeys.has(k)),
  );
  addSection('group', 'group', group.keys);
  addSection(
    'platform',
    'platform',
    platform.keys.filter((k) => !ambiguousKeys.has(k)),
  );
  addSection('dynamic', 'dynamic', dynamic.keys);

  lines.push(`} as const;`, ``);

  // Write registry
  const registryDir = path.join(ROOT, 'src/composables/dict');
  fs.mkdirSync(registryDir, { recursive: true });
  const registryPath = path.join(registryDir, 'registry.ts');
  fs.writeFileSync(registryPath, lines.join('\n'));
  console.log(`Registry  → ${registryPath}`);

  // ── 7. Summary ───────────────────────────────────────────────
  console.log(`\n${'─'.repeat(60)}`);
  console.log(`common   : ${common.keys.length} keys`);
  console.log(`v1       : ${v1.keys.length} keys`);
  console.log(`group    : ${group.keys.length} keys`);
  console.log(`platform : ${platform.keys.length} keys`);
  console.log(`dynamic  : ${dynamic.keys.length} keys  [mode=${dynamicMode}]`);
  if (overlaps.length > 0) {
    console.log(`\nAmbiguous keys (appear in multiple sources):`);
    for (const { key, sources } of overlaps) {
      console.log(`  ${key}  →  ${sources.join(', ')}`);
    }
  }
}

main().catch((error) => {
  console.error(error.message ?? error);
  process.exit(1);
});
