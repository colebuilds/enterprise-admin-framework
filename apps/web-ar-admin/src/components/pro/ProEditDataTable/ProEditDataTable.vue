<!-- oxlint-disable -->
<script lang="ts" setup>
import type { DataTableColumn, DataTableInst, DataTableRowKey } from 'naive-ui';

import type { PropType, VNode } from 'vue';

import type {
  ProColumn,
  ProEditConfig,
  ProEditDataTableInstance,
  ProEditGuards,
  ProRecordCreatorProps,
  ProSize,
  Recordable,
} from '../types';

import {
  computed,
  h,
  onBeforeUnmount,
  provide,
  ref,
  shallowRef,
  triggerRef,
  watch,
} from 'vue';
import { useI18n } from 'vue-i18n';

import { NDataTable } from 'naive-ui';

import { useActionGuard } from '../composables/useActionGuard';
import { useColumnRenderer } from '../composables/useColumnRenderer';
import { useDragSort } from '../composables/useDragSort';
import { ProEditTableContextKey } from '../context';
import { getGlobalConfig } from '../utils';
import { deepClone } from '../utils/valueTransform';
import CreatorButton from './components/CreatorButton.vue';
import DragHandle from './components/DragHandle.vue';
import RowActions from './components/RowActions.vue';
import ProEditableCell from './ProEditableCell.vue';

defineOptions({
  name: 'ProEditDataTable',
  inheritAttrs: false,
});

const props = defineProps({
  /** 数据源 (v-model) */
  modelValue: {
    type: Array as PropType<Recordable[]>,
    default: () => [],
  },
  /** 列定义 */
  columns: {
    type: Array as PropType<ProColumn[]>,
    default: () => [],
  },
  /** 编辑配置 */
  editConfig: {
    type: Object as PropType<ProEditConfig>,
    default: () => ({}),
  },
  /** 操作守卫 */
  guards: {
    type: Object as PropType<ProEditGuards>,
    default: () => ({}),
  },
  /** 新增行配置 */
  recordCreator: {
    type: [Object, Boolean] as PropType<boolean | ProRecordCreatorProps>,
    default: () => ({}),
  },
  /** 可编辑行键 */
  editableKeys: {
    type: Array as PropType<DataTableRowKey[]>,
    default: undefined,
  },
  /** 行键 */
  rowKey: {
    type: [String, Function] as PropType<
      ((row: Recordable) => DataTableRowKey) | string
    >,
    default: 'id',
  },
  /** 尺寸 */
  size: {
    type: String as PropType<ProSize>,
    default: undefined,
  },
  /** 边框 */
  bordered: {
    type: Boolean,
    default: true,
  },
  /** 单行显示 */
  singleLine: {
    type: Boolean,
    default: true,
  },
  /** 斑马纹 */
  striped: {
    type: Boolean,
    default: false,
  },
  /** 最大高度 */
  maxHeight: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  /** 最小高度 */
  minHeight: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  /** 横向滚动宽度 */
  scrollX: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  /** 虚拟滚动 */
  virtualScroll: {
    type: Boolean,
    default: false,
  },
  /** 加载状态 */
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: Recordable[]): void;
  (e: 'update:editableKeys', keys: DataTableRowKey[]): void;
  (e: 'register', instance: ProEditDataTableInstance): void;
  (e: 'edit', row: Recordable, rowIndex: number): void;
  (e: 'save', row: Recordable, rowIndex: number, isNew: boolean): void;
  (e: 'cancel', row: Recordable, rowIndex: number): void;
  (e: 'delete', row: Recordable, rowIndex: number): void;
  (e: 'add', row: Recordable): void;
  (e: 'values-change', changedRow: Recordable, allData: Recordable[]): void;
  (e: 'drag-sort', from: number, to: number, data: Recordable[]): void;
}>();

const { t } = useI18n();

// 全局配置
const globalConfig = getGlobalConfig();

// 列渲染器
const { renderColumnWithEllipsis } = useColumnRenderer();

// 操作守卫
const { executeGuard } = useActionGuard({ guards: props.guards });

// Refs
const tableRef = ref<DataTableInst | null>(null);
const tableContainerRef = ref<HTMLElement | null>(null);

// 表格数据 - 使用 shallowRef 避免深度响应式
const tableData = shallowRef<Recordable[]>([...props.modelValue]);

// 尺寸
const tableSize = computed(
  () => props.size || globalConfig.table?.size || 'medium',
);

// 加载状态
const isLoading = computed(() => props.loading);

// 编辑配置 - 合并为单个 computed 减少计算
const editConfigComputed = computed(() => ({
  mode: props.editConfig?.mode || 'row',
  trigger: props.editConfig?.trigger || 'click',
  autoSave: props.editConfig?.autoSave || false,
  showActions: props.editConfig?.showActions !== false,
  actionPosition: props.editConfig?.actionPosition || 'right',
  actionWidth: props.editConfig?.actionWidth || 150,
  allowAdd: props.editConfig?.allowAdd !== false,
  allowDelete: props.editConfig?.allowDelete !== false,
  allowDragSort: props.editConfig?.allowDragSort || false,
  dragHandleColumn: props.editConfig?.dragHandleColumn || false,
}));

// 简化访问器
const editMode = computed(() => editConfigComputed.value.mode);
const editTrigger = computed(() => editConfigComputed.value.trigger);
const autoSave = computed(() => editConfigComputed.value.autoSave);
const showActions = computed(() => editConfigComputed.value.showActions);
const actionPosition = computed(() => editConfigComputed.value.actionPosition);
const actionWidth = computed(() => editConfigComputed.value.actionWidth);
const allowAdd = computed(() => editConfigComputed.value.allowAdd);
const allowDelete = computed(() => editConfigComputed.value.allowDelete);
const allowDragSort = computed(() => editConfigComputed.value.allowDragSort);
const dragHandleColumn = computed(
  () => editConfigComputed.value.dragHandleColumn,
);

/**
 * 编辑状态管理 - 使用普通对象避免过度响应式
 */
const editingRows = new Map<DataTableRowKey, Recordable>();
const editingCells = new Map<string, any>();
const newRowKeys = new Set<DataTableRowKey>();
const originalRowCache = new Map<DataTableRowKey, Recordable>();
let addedRows: Recordable[] = [];
const updatedRows = new Map<DataTableRowKey, Recordable>();
let deletedRows: Recordable[] = [];

// 状态版本号 - 用于触发组件更新
const stateVersion = ref(0);

// 触发状态更新
function triggerStateUpdate(): void {
  stateVersion.value++;
}

// 列渲染函数缓存
const columnRenderCache = new WeakMap<
  ProColumn,
  (rowData: Recordable, rowIndex: number) => VNode
>();

// 行键函数
const rowKeyFn = computed(() => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey;
  }
  return (row: Recordable) => row[props.rowKey as string];
});

// 是否显示新增按钮
const showCreator = computed(() => {
  if (props.recordCreator === false) return false;
  if (!allowAdd.value) return false;
  return true;
});

// 新增按钮配置
const creatorConfig = computed(() => {
  if (typeof props.recordCreator === 'boolean') {
    return {};
  }
  return props.recordCreator || {};
});

const creatorPosition = computed(
  () => creatorConfig.value.position || 'bottom',
);
const creatorText = computed(
  () => creatorConfig.value.text || t('components.proEditDataTable.addRow'),
);
const creatorButtonProps = computed(
  () => creatorConfig.value.buttonProps || {},
);
const creatorDisabled = computed(() => {
  if (creatorConfig.value.disabled) return true;
  const maxRows = props.editConfig?.maxRows;
  if (maxRows && tableData.value.length >= maxRows) return true;
  return false;
});

// 判断行是否在编辑中
function isRowEditing(rowKey: DataTableRowKey): boolean {
  // 使用 stateVersion 确保响应式更新
  void stateVersion.value;
  return editingRows.has(rowKey);
}

// 判断单元格是否在编辑中
function isCellEditing(rowKey: DataTableRowKey, columnKey: string): boolean {
  void stateVersion.value;
  return editingCells.has(`${rowKey}:${columnKey}`);
}

// 获取行类名
function getRowClassName(row: Recordable, index: number): string {
  void stateVersion.value;
  const key = rowKeyFn.value(row);
  const classes: string[] = [];

  if (editingRows.has(key)) {
    classes.push('is-editing');
  }

  if (newRowKeys.has(key)) {
    classes.push('is-new');
  }

  return classes.join(' ');
}

// 开始编辑行
async function startEdit(rowIndex: number) {
  const row = tableData.value[rowIndex];
  if (!row) return;

  const key = rowKeyFn.value(row);

  // 执行编辑前守卫
  const canEdit = await executeGuard('beforeEdit', row, rowIndex);
  if (!canEdit) return;

  // 缓存原始数据
  originalRowCache.set(key, deepClone(row));

  // 标记编辑状态
  editingRows.set(key, row);
  triggerStateUpdate();

  // 更新可编辑键
  if (props.editableKeys !== undefined) {
    const keys = [...(props.editableKeys || []), key];
    emit('update:editableKeys', keys);
  }

  emit('edit', row, rowIndex);
  props.guards?.afterEdit?.(row, rowIndex);
}

// 保存编辑行
async function saveEdit(rowIndex?: number): Promise<boolean> {
  const index = rowIndex ?? findFirstEditingRowIndex();
  if (index === -1) return false;

  const row = tableData.value[index];
  if (!row) return false;

  const key = rowKeyFn.value(row);
  const isNew = newRowKeys.has(key);

  // 执行保存前守卫
  const canSave = await executeGuard('beforeSave', row, index, isNew);
  if (!canSave) return false;

  // 更新变更追踪
  if (isNew) {
    // 新增行保存
    const addIndex = addedRows.findIndex((r) => rowKeyFn.value(r) === key);
    if (addIndex === -1) {
      addedRows.push(row);
    } else {
      addedRows[addIndex] = row;
    }
    newRowKeys.delete(key);
  } else {
    // 更新行
    updatedRows.set(key, row);
  }

  // 清除编辑状态
  editingRows.delete(key);
  originalRowCache.delete(key);
  triggerStateUpdate();

  // 更新可编辑键
  if (props.editableKeys !== undefined) {
    const keys = (props.editableKeys || []).filter((k) => k !== key);
    emit('update:editableKeys', keys);
  }

  // 触发数据更新
  emit('update:modelValue', [...tableData.value]);
  emit('save', row, index, isNew);
  props.guards?.afterSave?.(row, index, isNew);

  return true;
}

// 取消编辑行
async function cancelEdit(rowIndex?: number) {
  const index = rowIndex ?? findFirstEditingRowIndex();
  if (index === -1) return;

  const row = tableData.value[index];
  if (!row) return;

  const key = rowKeyFn.value(row);
  const isNew = newRowKeys.has(key);

  // 执行取消前守卫
  const canCancel = await executeGuard('beforeCancel', row, index);
  if (!canCancel) return;

  if (isNew) {
    // 新增行取消 - 删除行
    tableData.value.splice(index, 1);
    triggerRef(tableData);
    newRowKeys.delete(key);
  } else {
    // 恢复原始数据
    const original = originalRowCache.get(key);
    if (original) {
      Object.assign(row, original);
    }
  }

  // 清除编辑状态
  editingRows.delete(key);
  originalRowCache.delete(key);
  triggerStateUpdate();

  // 更新可编辑键
  if (props.editableKeys !== undefined) {
    const keys = (props.editableKeys || []).filter((k) => k !== key);
    emit('update:editableKeys', keys);
  }

  emit('cancel', row, index);
  props.guards?.afterCancel?.(row, index);
}

// 新增行
async function addRow(defaultRecord?: Partial<Recordable>, index?: number) {
  // 执行新增前守卫
  const result = await executeGuard('beforeAdd');
  if (result === false) return;

  // 生成默认行数据
  let newRow: Recordable = {};

  if (typeof result === 'object') {
    newRow = { ...result };
  } else if (defaultRecord) {
    newRow = { ...defaultRecord };
  } else if (creatorConfig.value.defaultRecord) {
    const defaultFn = creatorConfig.value.defaultRecord;
    newRow =
      typeof defaultFn === 'function' ? { ...defaultFn() } : { ...defaultFn };
  }

  // 生成唯一键
  const tempKey = `__new_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  if (typeof props.rowKey === 'string' && !newRow[props.rowKey]) {
    newRow[props.rowKey] = tempKey;
  }

  // 插入位置
  const insertIndex = index ?? tableData.value.length;

  // 插入数据
  tableData.value.splice(insertIndex, 0, newRow);
  triggerRef(tableData);

  // 标记为新增行
  const key = rowKeyFn.value(newRow);
  newRowKeys.add(key);
  triggerStateUpdate();

  // 开始编辑
  startEdit(insertIndex);

  emit('add', newRow);
  props.guards?.afterAdd?.(newRow, insertIndex);
}

// 删除行
async function deleteRow(rowIndex: number): Promise<boolean> {
  const row = tableData.value[rowIndex];
  if (!row) return false;

  const key = rowKeyFn.value(row);
  const isNew = newRowKeys.has(key);

  // 执行删除前守卫
  const canDelete = await executeGuard('beforeDelete', row, rowIndex);
  if (!canDelete) return false;

  // 最小行数检查
  const minRows = props.editConfig?.minRows;
  if (minRows && tableData.value.length <= minRows) {
    return false;
  }

  // 删除数据
  tableData.value.splice(rowIndex, 1);
  triggerRef(tableData);

  // 清除相关状态
  editingRows.delete(key);
  originalRowCache.delete(key);
  newRowKeys.delete(key);

  // 追踪删除
  if (isNew) {
    // 从新增记录中移除
    const addIndex = addedRows.findIndex((r) => rowKeyFn.value(r) === key);
    if (addIndex !== -1) {
      addedRows.splice(addIndex, 1);
    }
  } else {
    deletedRows.push(row);
    // 从更新记录中移除
    updatedRows.delete(key);
  }

  triggerStateUpdate();

  // 触发数据更新
  emit('update:modelValue', [...tableData.value]);
  emit('delete', row, rowIndex);
  props.guards?.afterDelete?.(row, rowIndex);

  return true;
}

// 单元格编辑相关
function startCellEdit(rowIndex: number, columnKey: string) {
  const row = tableData.value[rowIndex];
  if (!row) return;

  const key = rowKeyFn.value(row);
  const cellKey = `${key}:${columnKey}`;

  // 缓存原始值
  originalRowCache.set(key, deepClone(row));

  // 标记编辑状态
  editingCells.set(cellKey, row[columnKey]);
  triggerStateUpdate();
}

async function saveCellEdit(
  rowIndex: number,
  columnKey: string,
): Promise<boolean> {
  const row = tableData.value[rowIndex];
  if (!row) return false;

  const key = rowKeyFn.value(row);
  const cellKey = `${key}:${columnKey}`;
  const isNew = newRowKeys.has(key);

  // 执行保存前守卫
  const canSave = await executeGuard('beforeSave', row, rowIndex, isNew);
  if (!canSave) return false;

  // 清除编辑状态
  editingCells.delete(cellKey);
  originalRowCache.delete(key);
  triggerStateUpdate();

  // 更新变更追踪
  if (!isNew) {
    updatedRows.set(key, row);
  }

  // 触发数据更新
  emit('update:modelValue', [...tableData.value]);
  emit('values-change', row, tableData.value);

  return true;
}

function cancelCellEdit(rowIndex: number, columnKey: string) {
  const row = tableData.value[rowIndex];
  if (!row) return;

  const key = rowKeyFn.value(row);
  const cellKey = `${key}:${columnKey}`;

  // 恢复原始值
  const original = originalRowCache.get(key);
  if (original && columnKey in original) {
    row[columnKey] = original[columnKey];
  }

  // 清除编辑状态
  editingCells.delete(cellKey);
  originalRowCache.delete(key);
  triggerStateUpdate();
}

// 更新单元格值
function updateCellValue(rowIndex: number, columnKey: string, value: any) {
  const row = tableData.value[rowIndex];
  if (!row) return;

  row[columnKey] = value;
  emit('values-change', row, tableData.value);
}

// 查找第一个编辑中的行索引
function findFirstEditingRowIndex(): number {
  for (let i = 0; i < tableData.value.length; i++) {
    const key = rowKeyFn.value(tableData.value[i]);
    if (editingRows.has(key)) {
      return i;
    }
  }
  return -1;
}

// 处理新增行
async function handleAddRow() {
  await addRow();
}

// 处理列配置
const processedColumns = computed(() => {
  const columns: DataTableColumn[] = [];

  // 拖拽手柄列
  if (allowDragSort.value && dragHandleColumn.value) {
    columns.push({
      key: '__drag',
      title: '',
      width: 50,
      align: 'center',
      render: (row, rowIndex) => {
        return h(DragHandle, {
          disabled: isRowEditing(rowKeyFn.value(row)),
        });
      },
    });
  }

  // 数据列
  props.columns.forEach((col) => {
    if (col.hideInTable) return;

    const column: DataTableColumn = {
      key: col.key as string,
      title: col.title,
      width: col.width,
      minWidth: col.minWidth,
      maxWidth: col.maxWidth,
      fixed: col.fixed,
      align: col.align,
      render: (rowData: Recordable, rowIndex: number) => {
        const dataKey = (col.dataIndex || col.key) as string;
        const value = rowData[dataKey];
        const rowKey = rowKeyFn.value(rowData);
        const isEditable = col.editable !== false;

        // 判断是否在编辑状态
        const isEditing =
          editMode.value === 'row'
            ? isRowEditing(rowKey)
            : isCellEditing(rowKey, dataKey);

        // 可编辑单元格
        if (isEditable) {
          return h(ProEditableCell, {
            row: rowData,
            rowIndex,
            column: col,
            value,
            editing: isEditing,
            trigger: editTrigger.value,
            autoSave: autoSave.value,
            size: tableSize.value,
            onEdit: () => {
              if (editMode.value === 'row') {
                startEdit(rowIndex);
              } else {
                startCellEdit(rowIndex, dataKey);
              }
            },
            onChange: (newValue: any) => {
              updateCellValue(rowIndex, dataKey, newValue);
            },
            onSave: () => {
              if (editMode.value === 'cell') {
                saveCellEdit(rowIndex, dataKey);
              }
            },
            onCancel: () => {
              if (editMode.value === 'cell') {
                cancelCellEdit(rowIndex, dataKey);
              }
            },
          });
        }

        // 非编辑列 - 使用默认渲染
        return renderColumnWithEllipsis(value, rowData, rowIndex, col) as VNode;
      },
    };

    columns.push(column);
  });

  // 操作列
  if (showActions.value && editMode.value === 'row') {
    const actionCol: DataTableColumn = {
      key: '__action',
      title: t('common.action'),
      width: actionWidth.value,
      fixed: actionPosition.value === 'right' ? 'right' : 'left',
      align: 'center',
      render: (rowData: Recordable, rowIndex: number) => {
        const rowKey = rowKeyFn.value(rowData);
        const editing = isRowEditing(rowKey);

        return h(RowActions, {
          row: rowData,
          rowIndex,
          editing,
          showEdit: true,
          showSave: true,
          showCancel: true,
          showDelete: allowDelete.value,
          editText: props.editConfig?.editText || t('common.edit'),
          saveText: props.editConfig?.saveText || t('common.save'),
          cancelText: props.editConfig?.cancelText || t('common.cancel'),
          deleteText: props.editConfig?.deleteText || t('common.delete'),
          confirmDelete: props.editConfig?.confirmDelete !== false,
          deleteConfirmText:
            props.editConfig?.deleteConfirmText ||
            t('components.proEditDataTable.deleteConfirm'),
          onEdit: () => startEdit(rowIndex),
          onSave: () => saveEdit(rowIndex),
          onCancel: () => cancelEdit(rowIndex),
          onDelete: () => deleteRow(rowIndex),
        });
      },
    };

    columns.push(actionCol);
  }

  return columns;
});

// 拖拽排序
const { destroy: destroyDragSort } = useDragSort({
  containerRef: tableContainerRef,
  tableSelector: '.n-data-table-tbody',
  rowSelector: 'tr',
  handleSelector:
    allowDragSort.value && dragHandleColumn.value
      ? '.pro-drag-handle'
      : undefined,
  disabled: !allowDragSort.value,
  onEnd: async (oldIndex, newIndex) => {
    // 执行拖拽守卫
    const canSort = await executeGuard('beforeDragSort', oldIndex, newIndex);
    if (!canSort) return;

    // 移动数据
    const item = tableData.value.splice(oldIndex, 1)[0];
    tableData.value.splice(newIndex, 0, item);

    // 触发更新
    emit('update:modelValue', [...tableData.value]);
    emit('drag-sort', oldIndex, newIndex, tableData.value);
    props.guards?.afterDragSort?.(oldIndex, newIndex, tableData.value);
  },
});

// 监听外部数据变化 - 使用长度和引用变化触发
watch(
  () => [props.modelValue, props.modelValue.length] as const,
  ([newValue]) => {
    if (newValue !== tableData.value) {
      tableData.value = [...newValue];
    }
  },
);

// 清理
onBeforeUnmount(() => {
  destroyDragSort();
  editingRows.clear();
  originalRowCache.clear();
});

// 暴露实例方法
const exposedMethods: ProEditDataTableInstance = {
  // 基础表格方法
  reload: async () => {
    tableData.value = [...props.modelValue];
  },
  reset: () => {
    tableData.value = [...props.modelValue];
    editingRows.clear();
    editingCells.clear();
    originalRowCache.clear();
    newRowKeys.clear();
    addedRows = [];
    updatedRows.clear();
    deletedRows = [];
    triggerStateUpdate();
  },
  getDataSource: () => tableData.value,
  setDataSource: (data) => {
    tableData.value = data;
    emit('update:modelValue', data);
  },
  getColumns: () => props.columns,
  setColumns: () => {},
  getSelectedRows: () => [],
  getSelectedRowKeys: () => [],
  setSelectedRowKeys: () => {},
  clearSelection: () => {},
  setLoading: () => {},
  getLoading: () => isLoading.value,
  setPagination: () => {},
  getPagination: () => null,
  scrollTo: (options) => tableRef.value?.scrollTo(options),
  clearSorter: () => {},
  clearFilters: () => {},
  updatePage: () => {},
  downloadCsv: (options) => tableRef.value?.downloadCsv(options),

  // 编辑方法
  startEdit,
  saveEdit,
  cancelEdit,
  startCellEdit,
  saveCellEdit,
  cancelCellEdit,
  addRow,
  deleteRow,
  getEditingState: () => ({
    rowIndex: findFirstEditingRowIndex(),
    cellKey: editingCells.size > 0 ? [...editingCells.keys()][0] : null,
    mode: editMode.value,
  }),
  validateRow: async () => true,
  validateAllRows: async () => true,
  getChangedRows: () => ({
    added: addedRows,
    updated: [...updatedRows.values()],
    deleted: deletedRows,
  }),
  resetChanges: () => {
    addedRows = [];
    updatedRows.clear();
    deletedRows = [];
    triggerStateUpdate();
  },
  getEditableKeys: () => [...editingRows.keys()],
  setEditableKeys: (keys) => {
    editingRows.clear();
    keys.forEach((key) => {
      const row = tableData.value.find((r) => rowKeyFn.value(r) === key);
      if (row) {
        editingRows.set(key, row);
      }
    });
    triggerStateUpdate();
  },
  hasChanges: () => {
    return (
      addedRows.length > 0 || updatedRows.size > 0 || deletedRows.length > 0
    );
  },
  moveUp: (rowIndex) => {
    if (rowIndex <= 0) return;
    const item = tableData.value.splice(rowIndex, 1)[0];
    tableData.value.splice(rowIndex - 1, 0, item);
    emit('update:modelValue', [...tableData.value]);
  },
  moveDown: (rowIndex) => {
    if (rowIndex >= tableData.value.length - 1) return;
    const item = tableData.value.splice(rowIndex, 1)[0];
    tableData.value.splice(rowIndex + 1, 0, item);
    emit('update:modelValue', [...tableData.value]);
  },
  move: (fromIndex, toIndex) => {
    const item = tableData.value.splice(fromIndex, 1)[0];
    tableData.value.splice(toIndex, 0, item);
    emit('update:modelValue', [...tableData.value]);
  },
  insert: (row, index) => {
    tableData.value.splice(index, 0, row as Recordable);
    emit('update:modelValue', [...tableData.value]);
  },
  remove: (rowIndex) => {
    tableData.value.splice(rowIndex, 1);
    emit('update:modelValue', [...tableData.value]);
  },
  batchInsert: (rows, index = tableData.value.length) => {
    tableData.value.splice(index, 0, ...(rows as Recordable[]));
    emit('update:modelValue', [...tableData.value]);
  },
  batchRemove: (rowIndices) => {
    const sorted = [...rowIndices].toSorted((a, b) => b - a);
    sorted.forEach((index) => {
      tableData.value.splice(index, 1);
    });
    emit('update:modelValue', [...tableData.value]);
  },
};

defineExpose(exposedMethods);

// 提供上下文 - 使用 computed 包装普通对象以提供响应式访问
provide(ProEditTableContextKey, {
  tableRef,
  dataSource: tableData,
  stateVersion,
  getEditingRows: () => editingRows,
  getEditingCells: () => editingCells,
  isRowEditing,
  isCellEditing,
  startEdit,
  saveEdit,
  cancelEdit,
  addRow,
  deleteRow,
});

// 注册事件
emit('register', exposedMethods);
</script>

<template>
  <div ref="tableContainerRef" class="pro-edit-data-table">
    <!-- 顶部新增按钮 -->
    <CreatorButton
      v-if="showCreator && creatorPosition === 'top'"
      position="top"
      :text="creatorText"
      :button-props="creatorButtonProps"
      :disabled="creatorDisabled"
      @click="handleAddRow"
    />

    <!-- 数据表格 -->
    <NDataTable
      ref="tableRef"
      :columns="processedColumns"
      :data="tableData"
      :loading="isLoading"
      :row-key="rowKeyFn"
      :size="tableSize"
      :bordered="bordered"
      :single-line="singleLine"
      :striped="striped"
      :max-height="maxHeight"
      :min-height="minHeight"
      :row-class-name="getRowClassName"
      :scroll-x="scrollX"
      :virtual-scroll="virtualScroll"
      v-bind="$attrs"
    />

    <!-- 底部新增按钮 -->
    <CreatorButton
      v-if="showCreator && creatorPosition === 'bottom'"
      position="bottom"
      :text="creatorText"
      :button-props="creatorButtonProps"
      :disabled="creatorDisabled"
      @click="handleAddRow"
    />
  </div>
</template>

<style lang="less" scoped>
.pro-edit-data-table {
  ::v-deep(.is-editing) {
    background-color: var(--n-th-color) !important;
  }

  ::v-deep(.is-new) {
    background-color: rgba(var(--n-primary-color-hover), 0.1) !important;
  }
}
</style>
