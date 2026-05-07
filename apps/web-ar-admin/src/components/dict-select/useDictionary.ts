/* oxlint-disable */
import type { DictionaryRsp, PlatformDicRsp } from '#/api/common';
import type { SysGropDictionaryRsp } from '#/api/system';

import { ref } from 'vue';

import { useAppUserStore } from '#/store/app-user';

/** 字典数据来源 */
export type DictionarySource = 'common' | 'group' | 'platform' | 'v1';

/** 字典键名类型 */
export type DictionaryType =
  | keyof DictionaryRsp
  | keyof PlatformDicRsp
  | keyof SysGropDictionaryRsp
  | string;

/** 选项格式 */
export interface SelectOption {
  label: string;
  value: number | string;
  [key: string]: unknown;
}

/** 获取选项的配置 */
export interface GetOptionsConfig {
  source?: DictionarySource;
  labelField?: string;
  valueField?: string;
}

interface ResolvedFieldConfig {
  labelField?: string;
  valueField?: string;
}

const SOURCE_DEFAULT_FIELDS: Record<DictionarySource, ResolvedFieldConfig> = {
  common: {
    labelField: 'name',
    valueField: 'id',
  },
  group: {
    labelField: 'dictName',
    valueField: 'dictCode',
  },
  platform: {},
  v1: {
    labelField: 'name',
    valueField: 'id',
  },
};

const SOURCE_LABEL_CANDIDATES: Record<DictionarySource, string[]> = {
  common: ['name', 'label', 'dictName', 'value'],
  group: ['dictName', 'name', 'label'],
  platform: [
    'countryName',
    'languageName',
    'currencyName',
    'name',
    'label',
    'dictName',
  ],
  v1: ['name', 'label', 'value'],
};

const SOURCE_VALUE_CANDIDATES: Record<DictionarySource, string[]> = {
  common: ['id', 'code', 'key', 'value', 'dictCode'],
  group: ['dictCode', 'id', 'code', 'key', 'value'],
  platform: [
    'countryCode',
    'languageCode',
    'currencyCode',
    'code',
    'key',
    'id',
    'value',
  ],
  v1: ['id', 'code', 'key', 'value'],
};

/**
 * 字典数据 Hook
 * @example
 * const { getOptions, getOptionMap, findLabel } = useDictionary();
 * const options = getOptions('status', { source: 'common' });
 * const label = findLabel('status', 1);
 */
export interface UseDictionaryConfig {
  /** Default source for all calls from this instance */
  source?: DictionarySource;
}

export function useDictionary(config: UseDictionaryConfig = {}) {
  const defaultSource = config.source ?? 'common';
  const userStore = useAppUserStore();
  const loading = ref(false);

  const resolveSourceData = (source: DictionarySource) => {
    switch (source) {
      case 'group': {
        return userStore.getGropuData;
      }
      case 'platform': {
        return userStore.getPlatformDic;
      }
      case 'v1': {
        return userStore.getV1Dictionary;
      }
      case 'common':
      default: {
        return userStore.getDictionaryList;
      }
    }
  };

  const resolveLabelField = (source: DictionarySource, labelField?: string) =>
    labelField || SOURCE_DEFAULT_FIELDS[source].labelField;

  const resolveValueField = (source: DictionarySource, valueField?: string) =>
    valueField || SOURCE_DEFAULT_FIELDS[source].valueField;

  const readValueByCandidates = (
    item: Record<string, unknown>,
    candidates: string[],
  ): unknown => {
    for (const field of candidates) {
      const value = item[field];
      if (value !== undefined && value !== null && value !== '') {
        return value;
      }
    }
    return undefined;
  };

  /**
   * 获取字典选项列表
   */
  const getOptions = (
    key: DictionaryType,
    opts: GetOptionsConfig = {},
  ): SelectOption[] => {
    const { source = defaultSource, labelField, valueField } = opts;

    if (!key) return [];

    const data = resolveSourceData(source);

    if (!data) return [];

    const items = (data as Record<string, any[]>)[key];
    if (!Array.isArray(items)) return [];

    const resolvedLabelField = resolveLabelField(source, labelField);
    const resolvedValueField = resolveValueField(source, valueField);

    return items.map((item) => ({
      label: String(
        (resolvedLabelField ? item[resolvedLabelField] : undefined) ??
          readValueByCandidates(item, SOURCE_LABEL_CANDIDATES[source]) ??
          '',
      ),
      value: ((resolvedValueField ? item[resolvedValueField] : undefined) ??
        readValueByCandidates(item, SOURCE_VALUE_CANDIDATES[source])) as
        | number
        | string,
      ...item,
    }));
  };

  /**
   * 获取字典 Map (value -> option)
   */
  const getOptionMap = (
    key: DictionaryType,
    config: GetOptionsConfig = {},
  ): Map<number | string, SelectOption> => {
    const options = getOptions(key, config);
    return new Map(options.map((opt) => [opt.value, opt]));
  };

  /**
   * 根据 value 获取 label
   */
  const findLabel = (
    key: DictionaryType,
    value: null | number | string | undefined,
    config: GetOptionsConfig = {},
  ): string => {
    if (value === undefined || value === null) return '';
    const map = getOptionMap(key, config);
    return map.get(value)?.label ?? String(value);
  };

  /**
   * 获取原始字典数据
   */
  const getRawData = (
    key: DictionaryType,
    source: DictionarySource = defaultSource,
  ) => {
    const data = resolveSourceData(source);
    return data ? (data as Record<string, any[]>)[key] : null;
  };

  return {
    loading,
    getOptions,
    getOptionMap,
    findLabel,
    getRawData,
  };
}
