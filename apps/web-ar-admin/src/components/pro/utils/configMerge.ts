/* oxlint-disable */
import type { Recordable } from '../types';

import { isArray, isPlainObject, mergeWith } from 'lodash-es';

/**
 * 配置层级
 */
export interface ConfigLevel {
  /** 全局默认配置 */
  global: Recordable;
  /** 组件级配置 */
  component: Recordable;
  /** 实例级配置 (最高优先级) */
  instance: Recordable;
}

/**
 * 合并策略
 */
export type MergeStrategy = 'concat' | 'custom' | 'merge' | 'replace';

/**
 * 合并配置
 */
export interface MergeConfig {
  /** 默认合并策略 */
  defaultStrategy: MergeStrategy;
  /** 字段特定策略 */
  fieldStrategies?: Record<string, MergeStrategy>;
  /** 自定义合并函数 */
  customMerge?: (
    globalVal: any,
    componentVal: any,
    instanceVal: any,
    key: string,
  ) => any;
}

/**
 * 全局配置注册表
 */
const globalConfigRegistry = new Map<string, Recordable>();

/**
 * 设置全局配置
 */
export function setGlobalConfig(key: string, config: Recordable): void {
  globalConfigRegistry.set(key, config);
}

/**
 * 获取全局配置
 */
export function getGlobalConfig(key: string): Recordable {
  return globalConfigRegistry.get(key) || {};
}

/**
 * 清除全局配置
 */
export function clearGlobalConfig(key?: string): void {
  if (key) {
    globalConfigRegistry.delete(key);
  } else {
    globalConfigRegistry.clear();
  }
}

/**
 * 三级配置合并
 * 优先级: instance > component > global
 */
export function mergeConfig<T extends Recordable>(
  levels: ConfigLevel,
  mergeConfig?: MergeConfig,
): T {
  const { global, component, instance } = levels;
  const config: MergeConfig = {
    defaultStrategy: 'merge',
    ...mergeConfig,
  };

  const customizer = (objValue: any, srcValue: any, key: string): any => {
    const strategy = config.fieldStrategies?.[key] || config.defaultStrategy;

    switch (strategy) {
      case 'concat': {
        if (isArray(objValue) && isArray(srcValue)) {
          return [...objValue, ...srcValue];
        }
        return srcValue === undefined ? objValue : srcValue;
      }

      case 'replace': {
        return srcValue === undefined ? objValue : srcValue;
      }

      case 'custom': {
        if (config.customMerge) {
          return config.customMerge(
            global[key],
            component[key],
            instance[key],
            key,
          );
        }
      }
      // Fall through to merge

      case 'merge':
      default: {
        if (isPlainObject(objValue) && isPlainObject(srcValue)) {
          return mergeWith({}, objValue, srcValue, customizer);
        }
        return srcValue === undefined ? objValue : srcValue;
      }
    }
  };

  return mergeWith({}, global, component, instance, customizer) as T;
}

/**
 * 合并两个对象 (简化版)
 */
export function mergeObjects<T extends Recordable>(
  ...objects: Partial<T>[]
): T {
  return mergeWith({}, ...objects, (objValue: any, srcValue: any) => {
    if (isPlainObject(objValue) && isPlainObject(srcValue)) {
      return mergeWith({}, objValue, srcValue);
    }
    return srcValue === undefined ? objValue : srcValue;
  }) as T;
}

/**
 * 合并 props (过滤 undefined)
 */
export function mergeProps<T extends Recordable>(...props: Partial<T>[]): T {
  const result: Recordable = {};

  for (const prop of props) {
    if (!prop) continue;
    for (const key of Object.keys(prop)) {
      const value = prop[key];
      if (value !== undefined) {
        result[key] = value;
      }
    }
  }

  return result as T;
}

/**
 * 选择性合并 (只合并指定的键)
 */
export function pickAndMerge<T extends Recordable>(
  source: T,
  keys: (keyof T)[],
  override: Partial<T>,
): Partial<T> {
  const result: Partial<T> = {};

  for (const key of keys) {
    const overrideValue = override[key];
    result[key] = overrideValue === undefined ? source[key] : overrideValue;
  }

  return result;
}

/**
 * 排除键并合并
 */
export function omitAndMerge<T extends Recordable>(
  source: T,
  omitKeys: (keyof T)[],
  override: Partial<T>,
): Partial<T> {
  const result: Partial<T> = {};
  const omitSet = new Set(omitKeys);

  for (const key of Object.keys(source) as (keyof T)[]) {
    if (!omitSet.has(key)) {
      const overrideValue = override[key];
      result[key] = overrideValue === undefined ? source[key] : overrideValue;
    }
  }

  return result;
}

/**
 * ProComponents 全局配置
 */
export interface ProGlobalConfig {
  form?: Recordable;
  field?: Recordable;
  table?: Recordable;
  edit?: Recordable;
  searchForm?: Recordable;
}

/**
 * 设置 ProComponents 全局配置
 */
export function setupProComponents(config: ProGlobalConfig): void {
  if (config.form) setGlobalConfig('proForm', config.form);
  if (config.field) setGlobalConfig('proField', config.field);
  if (config.table) setGlobalConfig('proTable', config.table);
  if (config.edit) setGlobalConfig('proEdit', config.edit);
  if (config.searchForm) setGlobalConfig('proSearchForm', config.searchForm);
}

/**
 * 获取 ProForm 全局配置
 */
export function getProFormConfig(): Recordable {
  return getGlobalConfig('proForm');
}

/**
 * 获取 ProField 全局配置
 */
export function getProFieldConfig(): Recordable {
  return getGlobalConfig('proField');
}

/**
 * 获取 ProTable 全局配置
 */
export function getProTableConfig(): Recordable {
  return getGlobalConfig('proTable');
}

/**
 * 获取 ProEdit 全局配置
 */
export function getProEditConfig(): Recordable {
  return getGlobalConfig('proEdit');
}

/**
 * 获取 ProSearchForm 全局配置
 */
export function getProSearchFormConfig(): Recordable {
  return getGlobalConfig('proSearchForm');
}
