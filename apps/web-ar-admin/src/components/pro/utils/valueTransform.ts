/* oxlint-disable */
import type { Recordable } from '../types';

import {
  isArray,
  isEmpty,
  isNil,
  isPlainObject,
  isString,
  omitBy,
} from 'lodash-es';

/**
 * 根据路径获取值
 */
export function getValueByPath(obj: any, path: string): any {
  if (!path) return obj;
  if (!obj) return undefined;

  const keys = path.split('.');
  let result = obj;

  for (const key of keys) {
    if (result == null) return undefined;
    // 处理数组索引 如 'items[0].name'
    const match = key.match(/^(\w+)\[(\d+)\]$/);
    if (match) {
      result = result[match[1]];
      if (result == null) return undefined;
      result = result[Number.parseInt(match[2])];
    } else {
      result = result[key];
    }
  }

  return result;
}

/**
 * 根据路径设置值
 */
export function setValueByPath(obj: any, path: string, value: any): void {
  if (!path) return;
  if (!obj) return;

  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const match = key.match(/^(\w+)\[(\d+)\]$/);

    if (match) {
      const arrayKey = match[1];
      const index = Number.parseInt(match[2]);
      if (current[arrayKey] == null) {
        current[arrayKey] = [];
      }
      if (current[arrayKey][index] == null) {
        current[arrayKey][index] = {};
      }
      current = current[arrayKey][index];
    } else {
      if (current[key] == null) {
        current[key] = {};
      }
      current = current[key];
    }
  }

  const lastKey = keys[keys.length - 1];
  const match = lastKey.match(/^(\w+)\[(\d+)\]$/);

  if (match) {
    const arrayKey = match[1];
    const index = Number.parseInt(match[2]);
    if (current[arrayKey] == null) {
      current[arrayKey] = [];
    }
    current[arrayKey][index] = value;
  } else {
    current[lastKey] = value;
  }
}

/**
 * 删除路径上的值
 */
export function deleteValueByPath(obj: any, path: string): void {
  if (!path) return;
  if (!obj) return;

  const keys = path.split('.');
  let current = obj;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] == null) return;
    current = current[key];
  }

  delete current[keys[keys.length - 1]];
}

/**
 * 检查路径是否存在
 */
export function hasValueByPath(obj: any, path: string): boolean {
  return getValueByPath(obj, path) !== undefined;
}

/**
 * 清理对象 (移除 null/undefined)
 */
export function omitNil<T extends Recordable>(obj: T): Partial<T> {
  return omitBy(obj, isNil) as Partial<T>;
}

/**
 * 清理对象 (移除空字符串)
 */
export function omitEmptyString<T extends Recordable>(obj: T): Partial<T> {
  return omitBy(obj, (v) => isString(v) && v === '') as Partial<T>;
}

/**
 * 清理对象 (移除空值)
 */
export function omitEmpty<T extends Recordable>(obj: T): Partial<T> {
  return omitBy(obj, (v) => {
    if (isNil(v)) return true;
    if (isString(v) && v === '') return true;
    if (isArray(v) && v.length === 0) return true;
    if (isPlainObject(v) && isEmpty(v)) return true;
    return false;
  }) as Partial<T>;
}

/**
 * 深度清理对象
 */
export function deepOmitEmpty<T extends Recordable>(obj: T): Partial<T> {
  const result: Recordable = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (isNil(value)) continue;
    if (isString(value) && value === '') continue;
    if (isArray(value) && value.length === 0) continue;

    if (isPlainObject(value)) {
      const cleaned = deepOmitEmpty(value);
      if (!isEmpty(cleaned)) {
        result[key] = cleaned;
      }
    } else if (isArray(value)) {
      const cleaned = value
        .map((item) => (isPlainObject(item) ? deepOmitEmpty(item) : item))
        .filter((item) => !isNil(item) && !(isString(item) && item === ''));
      if (cleaned.length > 0) {
        result[key] = cleaned;
      }
    } else {
      result[key] = value;
    }
  }

  return result as Partial<T>;
}

/**
 * 扁平化对象
 */
export function flattenObject(obj: Recordable, prefix = ''): Recordable {
  const result: Recordable = {};

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(value)) {
      Object.assign(result, flattenObject(value, newKey));
    } else {
      result[newKey] = value;
    }
  }

  return result;
}

/**
 * 展开扁平化对象
 */
export function unflattenObject(obj: Recordable): Recordable {
  const result: Recordable = {};

  for (const key of Object.keys(obj)) {
    setValueByPath(result, key, obj[key]);
  }

  return result;
}

/**
 * 深拷贝
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj) as any;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as any;
  }

  if (obj instanceof Object) {
    const copy: Recordable = {};
    for (const key of Object.keys(obj)) {
      copy[key] = deepClone((obj as Recordable)[key]);
    }
    return copy as T;
  }

  return obj;
}

/**
 * 比较两个值是否相等
 */
export function isEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a === b;
  if (typeof a !== typeof b) return false;

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime();
  }

  if (isArray(a) && isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => isEqual(item, b[index]));
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((key) => isEqual(a[key], b[key]));
  }

  return false;
}

/**
 * 获取变更的字段
 */
export function getChangedFields<T extends Recordable>(
  oldValues: T,
  newValues: T,
): Partial<T> {
  const result: Partial<T> = {};

  for (const key of Object.keys(newValues) as (keyof T)[]) {
    if (!isEqual(oldValues[key], newValues[key])) {
      result[key] = newValues[key];
    }
  }

  return result;
}

/**
 * 合并默认值
 */
export function mergeDefaults<T extends Recordable>(
  values: Partial<T>,
  defaults: T,
): T {
  const result = { ...defaults };

  for (const key of Object.keys(values) as (keyof T)[]) {
    const value = values[key];
    if (value !== undefined) {
      result[key] = value;
    }
  }

  return result;
}

/**
 * 转换为数组
 */
export function toArray<T>(value: null | T | T[] | undefined): T[] {
  if (isNil(value)) return [];
  if (isArray(value)) return value;
  return [value];
}

/**
 * 转换为字符串
 */
export function toString(value: any): string {
  if (isNil(value)) return '';
  if (isString(value)) return value;
  return String(value);
}

/**
 * 安全的 JSON 解析
 */
export function safeJsonParse<T = any>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

/**
 * 安全的 JSON 序列化
 */
export function safeJsonStringify(obj: any, defaultValue = ''): string {
  try {
    return JSON.stringify(obj);
  } catch {
    return defaultValue;
  }
}
