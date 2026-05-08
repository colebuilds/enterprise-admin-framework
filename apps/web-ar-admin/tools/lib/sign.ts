// apps/web-ar-admin/tools/lib/sign.ts
import { createHash } from 'node:crypto';

function sortObjectForSign(
  obj: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const keys = Object.keys(obj)
    .filter(
      (k) =>
        !Array.isArray(obj[k]) &&
        obj[k] !== '' &&
        obj[k] !== null &&
        obj[k] !== undefined,
    )
    .toSorted();
  for (const k of keys) {
    result[k] =
      obj[k] && typeof obj[k] === 'object'
        ? sortObjectForSign(obj[k] as Record<string, unknown>)
        : obj[k];
  }
  return result;
}

function removeArrayFields(value: unknown): unknown {
  if (Array.isArray(value)) return undefined;
  if (value && typeof value === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const next = removeArrayFields(v);
      if (next !== undefined) result[k] = next;
    }
    return result;
  }
  return value;
}

function randomInt(n: number): number {
  if (n <= 0) return -1;
  const limit = 10 ** n;
  const value = Math.floor(Math.random() * limit);
  if (value < limit / 10 && value !== 0) return randomInt(n);
  return value;
}

export function signBody(
  body: Record<string, unknown>,
): Record<string, unknown> {
  const language = 'zh';
  const random = randomInt(12);
  const withMeta = { ...body, language, random };
  const forSign = removeArrayFields(withMeta) as Record<string, unknown>;
  const sorted = sortObjectForSign(forSign);
  const signature = createHash('md5')
    .update(JSON.stringify(sorted))
    .digest('hex')
    .toUpperCase()
    .slice(0, 32);
  const timestamp = Math.floor(Date.now() / 1000);
  return { ...withMeta, signature, timestamp };
}
