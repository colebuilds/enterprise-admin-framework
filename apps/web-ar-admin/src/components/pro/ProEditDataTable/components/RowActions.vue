<!-- oxlint-disable -->
<script lang="ts" setup>
import type { ButtonProps } from 'naive-ui';

import type { PropType } from 'vue';

import type { Recordable } from '../../types';

import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { NButton, NPopconfirm, NSpace } from 'naive-ui';

defineOptions({
  name: 'ProRowActions',
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
  /** 是否编辑中 */
  editing: {
    type: Boolean,
    default: false,
  },
  /** 显示编辑按钮 */
  showEdit: {
    type: Boolean,
    default: true,
  },
  /** 显示保存按钮 */
  showSave: {
    type: Boolean,
    default: true,
  },
  /** 显示取消按钮 */
  showCancel: {
    type: Boolean,
    default: true,
  },
  /** 显示删除按钮 */
  showDelete: {
    type: Boolean,
    default: true,
  },
  /** 编辑按钮文本 */
  editText: {
    type: String,
    default: '',
  },
  /** 保存按钮文本 */
  saveText: {
    type: String,
    default: '',
  },
  /** 取消按钮文本 */
  cancelText: {
    type: String,
    default: '',
  },
  /** 删除按钮文本 */
  deleteText: {
    type: String,
    default: '',
  },
  /** 删除确认 */
  confirmDelete: {
    type: Boolean,
    default: true,
  },
  /** 删除确认文本 */
  deleteConfirmText: {
    type: String,
    default: '',
  },
  /** 编辑按钮属性 */
  editButtonProps: {
    type: Object as PropType<Partial<ButtonProps>>,
    default: () => ({}),
  },
  /** 保存按钮属性 */
  saveButtonProps: {
    type: Object as PropType<Partial<ButtonProps>>,
    default: () => ({}),
  },
  /** 取消按钮属性 */
  cancelButtonProps: {
    type: Object as PropType<Partial<ButtonProps>>,
    default: () => ({}),
  },
  /** 删除按钮属性 */
  deleteButtonProps: {
    type: Object as PropType<Partial<ButtonProps>>,
    default: () => ({}),
  },
});

const emit = defineEmits<{
  (e: 'edit'): void;
  (e: 'save'): void;
  (e: 'cancel'): void;
  (e: 'delete'): void;
}>();

const { t } = useI18n();

const editText = computed(() => props.editText || t('common.edit'));
const saveText = computed(() => props.saveText || t('common.save'));
const cancelText = computed(() => props.cancelText || t('common.cancel'));
const deleteText = computed(() => props.deleteText || t('common.delete'));
const deleteConfirmText = computed(
  () =>
    props.deleteConfirmText || t('components.proEditDataTable.deleteConfirm'),
);

// 保存中状态
const saving = ref(false);

// 删除中状态
const deleting = ref(false);

// 编辑
function handleEdit() {
  emit('edit');
}

// 保存
async function handleSave() {
  saving.value = true;
  try {
    emit('save');
  } finally {
    saving.value = false;
  }
}

// 取消
function handleCancel() {
  emit('cancel');
}

// 删除
async function handleDelete() {
  deleting.value = true;
  try {
    emit('delete');
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <NSpace :size="8" align="center">
    <!-- 编辑模式按钮 -->
    <template v-if="editing">
      <NButton
        v-if="showSave"
        type="primary"
        size="small"
        :loading="saving"
        v-bind="saveButtonProps"
        @click="handleSave"
      >
        {{ saveText }}
      </NButton>
      <NButton
        v-if="showCancel"
        size="small"
        v-bind="cancelButtonProps"
        @click="handleCancel"
      >
        {{ cancelText }}
      </NButton>
    </template>

    <!-- 查看模式按钮 -->
    <template v-else>
      <NButton
        v-if="showEdit"
        type="primary"
        text
        size="small"
        v-bind="editButtonProps"
        @click="handleEdit"
      >
        {{ editText }}
      </NButton>
      <NPopconfirm
        v-if="showDelete && confirmDelete"
        :positive-text="t('common.confirm')"
        :negative-text="t('common.cancel')"
        @positive-click="handleDelete"
      >
        <template #trigger>
          <NButton
            type="error"
            text
            size="small"
            :loading="deleting"
            v-bind="deleteButtonProps"
          >
            {{ deleteText }}
          </NButton>
        </template>
        {{ deleteConfirmText }}
      </NPopconfirm>
      <NButton
        v-else-if="showDelete"
        type="error"
        text
        size="small"
        :loading="deleting"
        v-bind="deleteButtonProps"
        @click="handleDelete"
      >
        {{ deleteText }}
      </NButton>
    </template>

    <!-- 额外按钮插槽 -->
    <slot :editing="editing" :row="row" :row-index="rowIndex"></slot>
  </NSpace>
</template>
