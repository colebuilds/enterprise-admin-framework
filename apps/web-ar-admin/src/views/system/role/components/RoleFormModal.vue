<script lang="ts" setup>
import type { FormInst, FormRules } from 'naive-ui';

import type { AddRoleReq, RolePageRsp, UpdateRoleReq } from '#/api/system';

import { computed, onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useMessage } from 'naive-ui';

import { api } from '#/api';

const props = defineProps<{
  mode: 'add' | 'edit';
  record?: EditableRoleRecord;
}>();
const emit = defineEmits<{
  close: [];
  success: [];
}>();
const { t } = useI18n();
const message = useMessage();

type EditableRoleRecord = Pick<RolePageRsp, 'id' | 'name' | 'remark' | 'state'>;

interface RoleFormData {
  id?: number;
  name: string;
  remark: string;
  state: boolean;
}

const formRef = ref<FormInst | null>(null);
const loading = ref(false);
const isEditMode = computed(() => props.mode === 'edit');

const formData = reactive<RoleFormData>({
  id: undefined,
  name: '',
  remark: '',
  state: true,
});

const rules: FormRules = {
  name: [
    { required: true, message: t('system.role.roleNameTip'), trigger: 'blur' },
  ],
};

function handleClose() {
  emit('close');
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    loading.value = true;

    const isAdd = props.mode === 'add';
    const basePayload: AddRoleReq = {
      name: formData.name.trim(),
      remark: formData.remark.trim() || undefined,
    };
    const editPayload: UpdateRoleReq & { state?: boolean } = {
      id: formData.id,
      ...basePayload,
      state: formData.state,
    };
    const { code, msg } = await (isAdd
      ? api.system.roleAdd(basePayload)
      : api.system.roleUpdate(editPayload));

    if (code !== 0) {
      message.error(msg);
      return;
    }

    message.success(isAdd ? t('common.add_success') : t('common.edit_success'));
    emit('success');
  } catch {
    // validation failed
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (props.mode === 'edit' && props.record) {
    formData.id = props.record.id;
    formData.name = props.record.name;
    formData.remark = props.record.remark ?? '';
    formData.state = props.record.state;
  }
});
</script>

<template>
  <n-spin :show="loading">
    <n-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-placement="top"
      :label-width="120"
    >
      <n-form-item :label="t('system.role.roleName')" path="name">
        <n-input
          v-model:value="formData.name"
          :placeholder="t('system.role.roleNameTip')"
        />
      </n-form-item>
      <n-form-item v-if="isEditMode" :label="t('common.status')" path="state">
        <n-switch v-model:value="formData.state">
          <template #checked>{{ t('common.enable') }}</template>
          <template #unchecked>{{ t('common.disable') }}</template>
        </n-switch>
      </n-form-item>
      <n-form-item :label="t('system.role.roleDescription')" path="remark">
        <n-input
          v-model:value="formData.remark"
          type="textarea"
          :maxlength="100"
          show-count
          :placeholder="t('system.role.roleDescriptionTip')"
        />
      </n-form-item>
    </n-form>
    <div class="flex justify-end gap-3">
      <n-button @click="handleClose">{{ t('common.cancel') }}</n-button>
      <n-button type="primary" :loading="loading" @click="handleSubmit">
        {{ t('common.confirm') }}
      </n-button>
    </div>
  </n-spin>
</template>
