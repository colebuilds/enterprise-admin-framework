/* oxlint-disable */
// ============================================
// ProComponents - 高级组件库
// 基于 Naive UI 构建，与 pro-naive-ui 保持一致
// ============================================

// ================== 组件 ==================

// ================== Composables ==================
export {
  // 表单工厂
  createProForm,
  // 搜索表单工厂
  createProSearchForm,
  getColumnRenderer,
  registerColumnRenderer,
  // 操作守卫
  useActionGuard,
  // 列渲染器
  useColumnRenderer,
  // 拖拽排序
  useDragSort,
  // 字段 composable
  useProField,
  // 验证 composable
  useProValidation,
  validationPresets,
} from './composables';

// ================== Context ==================
export {
  createProEditTableContext,
  createProFieldContext,
  createProFormContext,
  createProFormItemContext,
  createProRowContext,
  createProTableContext,
  ProEditTableContextKey,
  // 字段上下文
  ProFieldContextKey,
  // 表单上下文
  ProFormContextKey,
  ProFormItemContextKey,
  ProRowContextKey,
  // 表格上下文
  ProTableContextKey,
  useProEditTableContext,
  useProFieldContext,
  useProFormContext,
  useProFormContextSafe,
  useProFormItemContext,
  useProRowContext,
  useProTableContext,
} from './context';

// ProCrudTable - 查询表格一体化组件
export { ProCrudTable } from './ProCrudTable';

// ProDataTable - 数据表格组件
export { ProDataTable } from './ProDataTable';

// ProDateRangePicker - 日期范围选择器组件（含内部快捷日期按钮）
export {
  ProDateRangeInput,
  ProDateRangePicker,
  ProQuickDateButtons,
} from './ProDateRangePicker';

// 快捷日期（基于 useZonedShortcuts，按时区计算 today/yesterday/last3-30 Days 等内置项）
export {
  matchShortcutIndexByRange,
  useZonedShortcuts,
} from './ProDateRangePicker';

// ProEditDataTable - 可编辑表格组件
export {
  ProCreatorButton,
  ProDragHandle,
  ProEditableCell,
  ProEditDataTable,
  ProRowActions,
} from './ProEditDataTable';

// ProField - 表单字段组件
export { ProField, ProFormItem } from './ProField';

// ProForm - 表单组件
export { ProForm } from './ProForm';

// ================== Types ==================
export type {
  CreateProFormOptions,
  CreateProFormReturn,
  CreateProSearchFormOptions,
  CreateProSearchFormReturn,
  CrudActionColumn,
  // CrudTable types
  CrudRequestParams,
  CrudRequestResult,
  DateRangeTimezone,
  // DateRangePicker types
  DateRangeValue,
  DeepPartial,
  MaybeRef,
  Nullable,
  ProAsyncOptions,

  // DataTable types
  ProColumn,
  ProColumnEditContext,
  ProColumnType,
  ProColumnTypeRenderer,
  ProComponentType,
  ProCrudTableInstance,
  ProCrudTableProps,
  ProDataTableExtendProps,
  ProDataTableInstance,
  ProDataTableProps,
  ProDateRangePickerProps,
  ProEditableCellProps,
  ProEditConfig,
  ProEditDataTableInstance,
  ProEditDataTableProps,
  ProEditGuardContext,
  ProEditGuards,
  // EditDataTable types
  ProEditMode,
  ProEditState,
  ProEditTrigger,
  ProFieldMapping,
  // Field types
  ProFieldSchema,
  ProFieldValueType,
  ProFormExtendProps,
  ProFormInstance,

  // Form types
  ProFormProps,
  ProRecordCreatorProps,
  ProRowActionConfig,
  ProRowChangeRecord,
  // SearchForm types
  ProSearchFormColumn,
  ProSearchFormProps,
  ProSize,
  ProTableDragSortOptions,
  ProValidationRule,
  ProValidationState,
  ProValueEnum,
  ProValueEnumItem,

  // QuickDate types
  QuickDateItem,
  // Common types
  Recordable,
  ShortcutItem,
  ValidateError,
  ValidationTrigger,
} from './types';

// ================== Utils ==================
export {
  deepClone,
  getChangedFields,
  // 配置
  getGlobalConfig,
  // 值转换
  getValueByPath,
  isEqual,
  setGlobalConfig,
  setValueByPath,
} from './utils';
