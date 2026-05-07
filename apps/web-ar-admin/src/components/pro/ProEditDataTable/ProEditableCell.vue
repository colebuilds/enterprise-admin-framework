<!-- oxlint-disable -->
<script lang="ts" setup>
import type { Component, PropType } from 'vue';

import type {
  ProColumn,
  ProFieldValueType,
  ProSize,
  Recordable,
} from '../types';

import { computed, markRaw, nextTick, ref, watch } from 'vue';

import { EditOutlined } from '@vicons/antd';
import {
  NCascader,
  NDatePicker,
  NIcon,
  NInput,
  NInputNumber,
  NSelect,
  NSwitch,
  NTimePicker,
  NTreeSelect,
} from 'naive-ui';

defineOptions({
  name: 'ProEditableCell',
});

const props = defineProps({
  /** 行数据 */
  row: {
    type: Object as PropType<Recordable>,
    required: true,
  },
  /** 行索引 */
  rowIndex: {
    type: Number,
    required: true,
  },
  /** 列配置 */
  column: {
    type: Object as PropType<ProColumn>,
    required: true,
  },
  /** 当前值 */
  value: {
    type: null as unknown as PropType<any>,
    default: undefined,
  },
  /** 是否编辑中 */
  editing: {
    type: Boolean,
    default: false,
  },
  /** 只读模式 */
  readonly: {
    type: Boolean,
    default: false,
  },
  /** 编辑触发方式 */
  trigger: {
    type: String as PropType<'click' | 'dblclick'>,
    default: 'click',
  },
  /** 失焦自动保存 */
  autoSave: {
    type: Boolean,
    default: false,
  },
  /** 显示编辑图标 */
  showEditIcon: {
    type: Boolean,
    default: true,
  },
  /** 尺寸 */
  size: {
    type: String as PropType<ProSize>,
    default: 'small',
  },
});
const emit = defineEmits<{
  (e: 'change', value: any): void;
  (e: 'save'): void;
  (e: 'cancel'): void;
  (e: 'edit'): void;
}>();
type EditableCellValueType = 'money' | 'percent' | ProFieldValueType;
type EditableColumn = Omit<ProColumn<Recordable>, 'valueType'> & {
  currency?: string;
  decimals?: number;
  valueType?: EditableCellValueType;
};

// 组件映射
const COMPONENT_MAP: Record<string, Component> = {
  text: markRaw(NInput),
  textarea: markRaw(NInput),
  number: markRaw(NInputNumber),
  select: markRaw(NSelect),
  date: markRaw(NDatePicker),
  datetime: markRaw(NDatePicker),
  time: markRaw(NTimePicker),
  switch: markRaw(NSwitch),
  cascader: markRaw(NCascader),
  treeSelect: markRaw(NTreeSelect),
};

// 值类型到编辑组件映射
const VALUE_TYPE_MAP: Partial<Record<EditableCellValueType, string>> = {
  text: 'text',
  textarea: 'textarea',
  password: 'text',
  number: 'number',
  money: 'number',
  percent: 'number',
  select: 'select',
  tenantSelect: 'select',
  dictSelect: 'select',
  date: 'date',
  datetime: 'datetime',
  time: 'time',
  switch: 'switch',
  checkbox: 'switch',
  radio: 'select',
  cascader: 'cascader',
  treeSelect: 'treeSelect',
};

// 输入框引用
const inputRef = ref<any>(null);

// 本地值
const localValue = ref(props.value);

// 编辑组件
const editComponent = computed(() => {
  // 优先使用列配置的编辑组件
  if (props.column.editComponent) {
    if (typeof props.column.editComponent === 'string') {
      return COMPONENT_MAP[props.column.editComponent] || NInput;
    }
    return props.column.editComponent;
  }

  // 根据值类型推断
  const valueType = (props.column.valueType || 'text') as EditableCellValueType;
  const componentType = VALUE_TYPE_MAP[valueType] || 'text';
  return COMPONENT_MAP[componentType] || NInput;
});

// 合并组件属性
const mergedComponentProps = computed(() => {
  const baseProps: Recordable = {};
  const column = props.column as EditableColumn;
  const valueType = column.valueType;

  // textarea 类型
  if (valueType === 'textarea') {
    baseProps.type = 'textarea';
    baseProps.autosize = { minRows: 1, maxRows: 3 };
  }

  // select 类型添加选项
  if (['radio', 'select'].includes(valueType || '')) {
    if (column.editOptions) {
      baseProps.options =
        typeof column.editOptions === 'function' ? [] : column.editOptions;
    } else if (column.valueEnum) {
      baseProps.options = Object.entries(column.valueEnum).map(
        ([value, item]) => ({
          value,
          label: typeof item === 'string' ? item : item.text,
        }),
      );
    }

    // 字段映射
    if (column.editFieldMapping) {
      baseProps.labelField = column.editFieldMapping.label || 'label';
      baseProps.valueField = column.editFieldMapping.value || 'value';
    }
  }

  // 日期类型
  if (valueType === 'datetime') {
    baseProps.type = 'datetime';
  }

  // 数字类型
  if (['money', 'number', 'percent'].includes(valueType || '')) {
    if (valueType === 'money') {
      baseProps.prefix = column.currency || '¥';
    }
    if (valueType === 'percent') {
      baseProps.suffix = '%';
    }
    baseProps.precision = column.decimals;
  }

  // 合并列配置的编辑属性
  return {
    ...baseProps,
    clearable: true,
    ...column.editComponentProps,
  };
});

// 显示值
const displayValue = computed(() => {
  const value = props.value;
  if (value === null || value === undefined) return '-';

  // 使用 valueEnum 映射
  if (props.column.valueEnum) {
    const enumItem = props.column.valueEnum[value];
    if (enumItem) {
      return typeof enumItem === 'string' ? enumItem : enumItem.text;
    }
  }

  return String(value);
});

// 监听编辑状态，聚焦输入框
watch(
  () => props.editing,
  (editing) => {
    if (editing) {
      localValue.value = props.value;
      nextTick(() => {
        inputRef.value?.focus?.();
      });
    }
  },
);

// 监听外部值变化
watch(
  () => props.value,
  (newValue) => {
    if (!props.editing) {
      localValue.value = newValue;
    }
  },
);

// 点击事件
function handleClick() {
  if (props.readonly || props.trigger !== 'click') return;
  emit('edit');
}

// 双击事件
function handleDblClick() {
  if (props.readonly || props.trigger !== 'dblclick') return;
  emit('edit');
}

// 保存
function handleSave() {
  emit('change', localValue.value);
  emit('save');
}

// 取消
function handleCancel() {
  localValue.value = props.value;
  emit('cancel');
}

// 失焦
function handleBlur() {
  if (props.autoSave) {
    handleSave();
  }
}
</script>

<template>
  <div class="pro-editable-cell" :class="{ 'is-editing': editing }">
    <!-- 编辑模式 -->
    <template v-if="editing">
      <component
        :is="editComponent"
        ref="inputRef"
        v-model:value="localValue"
        :size="size"
        v-bind="mergedComponentProps"
        @keydown.enter="handleSave"
        @keydown.esc="handleCancel"
        @blur="handleBlur"
      >
        <!-- 选项组件的选项 -->
        <template v-if="$slots.option" #option="slotProps">
          <slot name="option" v-bind="slotProps"></slot>
        </template>
      </component>
    </template>

    <!-- 显示模式 -->
    <template v-else>
      <div
        class="pro-editable-cell-content"
        @click="handleClick"
        @dblclick="handleDblClick"
      >
        <slot :value="value" :row="row" :row-index="rowIndex">
          {{ displayValue }}
        </slot>
        <NIcon
          v-if="showEditIcon && !readonly"
          class="pro-editable-cell-edit-icon"
          :size="14"
        >
          <EditOutlined />
        </NIcon>
      </div>
    </template>
  </div>
</template>

<style lang="less" scoped>
.pro-editable-cell {
  min-height: 32px;
  display: flex;
  align-items: center;

  &.is-editing {
    min-width: 100px;
  }

  &-content {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    width: 100%;

    &:hover {
      .pro-editable-cell-edit-icon {
        opacity: 1;
      }
    }
  }

  &-edit-icon {
    opacity: 0;
    color: var(--n-primary-color);
    transition: opacity 0.2s;
    flex-shrink: 0;
  }
}
</style>
