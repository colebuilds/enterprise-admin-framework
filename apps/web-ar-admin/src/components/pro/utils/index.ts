/* oxlint-disable */
// ============== 配置合并 ==============
export {
  clearGlobalConfig,
  type ConfigLevel,
  getGlobalConfig,
  getProEditConfig,
  getProFieldConfig,
  getProFormConfig,
  getProSearchFormConfig,
  getProTableConfig,
  mergeConfig,
  type MergeConfig,
  mergeObjects,
  mergeProps,
  type MergeStrategy,
  omitAndMerge,
  pickAndMerge,
  type ProGlobalConfig,
  setGlobalConfig,
  setupProComponents,
} from './configMerge';

// ============== 占位符 ==============
export {
  createLengthMessage,
  createPlaceholder,
  createPlaceholderByValueType,
  createRangeMessage,
  createRequiredMessage,
  getDateFormat,
  getDatePickerType,
  getTimePickerFormat,
  PATTERNS,
} from './placeholder';

// ============== 值转换 ==============
export {
  deepClone,
  deepOmitEmpty,
  deleteValueByPath,
  flattenObject,
  getChangedFields,
  getValueByPath,
  hasValueByPath,
  isEqual,
  mergeDefaults,
  omitEmpty,
  omitEmptyString,
  omitNil,
  safeJsonParse,
  safeJsonStringify,
  setValueByPath,
  toArray,
  toString,
  unflattenObject,
} from './valueTransform';
