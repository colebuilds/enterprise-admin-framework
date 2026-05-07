/* oxlint-disable */
import type { DataTableRowKey } from 'naive-ui';

import type { ComputedRef, Ref, ShallowRef } from 'vue';

import type { Recordable } from '../../types';

import { computed, ref, watch } from 'vue';

export interface UseRowSelectionOptions<T extends Recordable = Recordable> {
  tableData: ShallowRef<T[]>;
  rowKeyFn: ComputedRef<(row: T) => DataTableRowKey>;
  disabledFn?: ComputedRef<((row: T) => boolean) | undefined>;
  onSelectionChange?: (keys: DataTableRowKey[], rows: T[]) => void;
}

export interface UseRowSelectionReturn<T extends Recordable = Recordable> {
  checkedRowKeys: Ref<DataTableRowKey[]>;
  isAllCurrentPageSelected: ComputedRef<boolean>;
  isIndeterminate: ComputedRef<boolean>;
  getSelectedRows: () => T[];
  handleCheckedRowKeysChange: (keys: DataTableRowKey[]) => void;
  handleSelectAllCurrentPage: (checked: boolean) => void;
  clearSelection: () => void;
  setSelectedRowKeys: (keys: DataTableRowKey[]) => void;
}

export function useRowSelection<T extends Recordable = Recordable>(
  options: UseRowSelectionOptions<T>,
): UseRowSelectionReturn<T> {
  const { tableData, rowKeyFn, disabledFn, onSelectionChange } = options;

  const checkedRowKeys = ref<DataTableRowKey[]>([]);

  const selectableRows = computed(() => {
    const fn = disabledFn?.value;
    return fn ? tableData.value.filter((row) => !fn(row)) : tableData.value;
  });

  const allRowKeys = computed(() =>
    selectableRows.value.map((row) => rowKeyFn.value(row)),
  );

  const isAllCurrentPageSelected = computed(
    () =>
      allRowKeys.value.length > 0 &&
      allRowKeys.value.every((key) => checkedRowKeys.value.includes(key)),
  );

  const isIndeterminate = computed(
    () =>
      !isAllCurrentPageSelected.value &&
      allRowKeys.value.some((key) => checkedRowKeys.value.includes(key)),
  );

  function getSelectedRows(): T[] {
    return tableData.value.filter((row) =>
      checkedRowKeys.value.includes(rowKeyFn.value(row)),
    );
  }

  function handleCheckedRowKeysChange(keys: DataTableRowKey[]) {
    checkedRowKeys.value = keys;
    onSelectionChange?.(keys, getSelectedRows());
  }

  function handleSelectAllCurrentPage(checked: boolean) {
    checkedRowKeys.value = checked
      ? [...new Set([...checkedRowKeys.value, ...allRowKeys.value])]
      : checkedRowKeys.value.filter((key) => !allRowKeys.value.includes(key));
    onSelectionChange?.(checkedRowKeys.value, getSelectedRows());
  }

  function clearSelection() {
    checkedRowKeys.value = [];
  }

  function setSelectedRowKeys(keys: DataTableRowKey[]) {
    checkedRowKeys.value = keys;
  }

  // tableData 变化（删除后 reload / 刷新）时，把 checkedRowKeys 与新数据交集化，
  // 避免"已选中的行被删除、但选中计数/已选列表仍保留旧行"的统计错误。
  // 并同步 emit selection-change 让业务页的 selectedRows 立即跟随。
  //
  // ⚠️ trade-off：跨页选中场景（翻页时 tableData 整体换掉）会只保留当前页的选中。
  // 目前项目没有跨页选中的业务；若后续需要，可改为"仅在单行/批量删除场景"调用。
  watch(tableData, () => {
    if (checkedRowKeys.value.length === 0) return;
    const keysInData = new Set(
      tableData.value.map((row) => rowKeyFn.value(row)),
    );
    const nextKeys = checkedRowKeys.value.filter((key) => keysInData.has(key));
    if (nextKeys.length !== checkedRowKeys.value.length) {
      checkedRowKeys.value = nextKeys;
      onSelectionChange?.(nextKeys, getSelectedRows());
    }
  });

  return {
    checkedRowKeys,
    isAllCurrentPageSelected,
    isIndeterminate,
    getSelectedRows,
    handleCheckedRowKeysChange,
    handleSelectAllCurrentPage,
    clearSelection,
    setSelectedRowKeys,
  };
}
