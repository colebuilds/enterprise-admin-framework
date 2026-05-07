/* oxlint-disable */
import type { DataTableRowKey } from 'naive-ui';

import type { ComputedRef, InjectionKey, Ref, ShallowRef } from 'vue';

import type { ColumnSettingItem } from '../ProCrudTable/composables/useColumnSettingStorage';
import type {
  CreateProSearchFormReturn,
  ProColumn,
  ProSearchFormColumn,
  Recordable,
} from '../types';

import { inject, provide } from 'vue';

/**
 * ProCrudTable 上下文接口
 */
export interface ProCrudTableContext<T extends Recordable = Recordable> {
  // === 搜索 ===
  searchForm: CreateProSearchFormReturn;
  advancedSearchForm: CreateProSearchFormReturn;
  advancedSearchOpen: Ref<boolean>;
  searchColumns: ComputedRef<ProSearchFormColumn[]>;
  pinnedColumns: ComputedRef<ProSearchFormColumn[]>;
  advancedColumns: ComputedRef<ProSearchFormColumn[]>;
  userPinnedPaths: Ref<string[]>;
  searchLabelWidth: ComputedRef<number | string>;
  searchAutoSpan: ComputedRef<boolean>;
  advancedSearchCols: ComputedRef<number>;
  maxPinCount: ComputedRef<number>;

  // === 列设置 ===
  columns: ComputedRef<ProColumn<T>[]>;
  columnSettings: Ref<ColumnSettingItem[]>;
  toggleColumnVisibility: (key: string) => void;
  toggleColumnFixed: (key: string) => void;
  updateColumnOrder: (keys: string[]) => void;
  resetColumnSetting: () => void;
  setAllVisible: (visible: boolean) => void;

  // === 数据 ===
  tableData: ShallowRef<T[]>;
  loading: Ref<boolean>;

  // === 行选择 ===
  checkedRowKeys: Ref<DataTableRowKey[]>;
  isAllCurrentPageSelected: ComputedRef<boolean>;
  isIndeterminate: ComputedRef<boolean>;
  handleCheckedRowKeysChange: (keys: DataTableRowKey[]) => void;
  handleSelectAllCurrentPage: (checked: boolean) => void;
  getSelectedRows: () => T[];

  // === 方法 ===
  handleSearch: (values: Recordable) => void;
  handleReset: () => void;
  loadData: (extraParams?: Recordable) => Promise<void>;

  // === 时区上下文（picker 共享单一权威源）===
  /** 当前生效的时区 id：IANA 名（如 'Asia/Kolkata'）/ 归一化偏移（如 '+05:30'）/ null 表 UTC+0 字面协议 */
  timezoneId: Ref<null | string>;
  /** 切换组件（ProTenantSelect / 自定义 select 等）通过它写入时区；ProCrudTable 自身不做派生计算 */
  setTimezoneId: (tz: null | string) => void;
}

export const ProCrudTableContextKey: InjectionKey<ProCrudTableContext> = Symbol(
  'ProCrudTableContext',
);

export function createProCrudTableContext<T extends Recordable = Recordable>(
  context: ProCrudTableContext<T>,
): void {
  provide(ProCrudTableContextKey, context as ProCrudTableContext);
}

export function useProCrudTableContext<
  T extends Recordable = Recordable,
>(): ProCrudTableContext<T> {
  const context = inject(ProCrudTableContextKey);
  if (!context) {
    throw new Error(
      '[ProComponents] useProCrudTableContext must be used within a ProCrudTable',
    );
  }
  return context as ProCrudTableContext<T>;
}

export function useProCrudTableContextSafe<
  T extends Recordable = Recordable,
>(): null | ProCrudTableContext<T> {
  return inject(ProCrudTableContextKey, null) as null | ProCrudTableContext<T>;
}
