<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

interface SensitiveItem {
  id: number;
  menuType: number;
  name: string;
  parentId: number;
}

interface TreeNode {
  children: TreeNode[];
  id: number;
  menuType: number;
  name: string;
  needSecondConfirm?: boolean;
  parentId?: number;
}

const props = defineProps<{
  sensitiveItems: SensitiveItem[];
  treeData: TreeNode[];
}>();

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'confirm'): void;
}>();

const { t } = useI18n();

const sensitiveTree = computed(() => {
  const sensitiveIds = new Set(props.sensitiveItems.map((i) => i.id));

  function collect(nodes: TreeNode[]): TreeNode[] {
    const result: TreeNode[] = [];
    for (const node of nodes) {
      if (sensitiveIds.has(node.id)) {
        result.push({ ...node, children: [] });
        continue;
      }
      const children = node.children?.length ? collect(node.children) : [];
      if (children.length > 0) {
        result.push({ ...node, children });
      }
    }
    return result;
  }

  return collect(props.treeData);
});
</script>

<template>
  <div class="sensitive-confirm">
    <n-alert type="warning" :show-icon="true" class="sensitive-confirm__alert">
      {{ t('system.role.sensitiveWarningContent') }}
    </n-alert>

    <n-scrollbar
      class="sensitive-confirm__list"
      :style="{ maxHeight: '360px' }"
    >
      <div
        v-for="group in sensitiveTree"
        :key="group.id"
        class="sensitive-confirm__group"
      >
        <div class="sensitive-confirm__module">
          <n-tag size="small" :type="group.menuType === 1 ? 'success' : 'info'">
            {{
              group.menuType === 1
                ? t('system.menu.module')
                : t('system.menu.menu')
            }}
          </n-tag>
          <span class="sensitive-confirm__module-name">{{ group.name }}</span>
        </div>

        <div
          v-for="child in group.children"
          :key="child.id"
          class="sensitive-confirm__sub"
        >
          <div v-if="child.children?.length" class="sensitive-confirm__menu">
            <n-tag size="small" type="info">{{ t('system.menu.menu') }}</n-tag>
            <span class="sensitive-confirm__menu-name">{{ child.name }}</span>
          </div>
          <div
            v-if="child.children?.length"
            class="sensitive-confirm__permissions"
          >
            <n-tag
              v-for="perm in child.children"
              :key="perm.id"
              size="small"
              type="error"
              :bordered="true"
            >
              {{ perm.name }}
            </n-tag>
          </div>

          <div
            v-if="!child.children?.length"
            class="sensitive-confirm__permissions"
          >
            <n-tag size="small" type="error" :bordered="true">
              {{ child.name }}
            </n-tag>
          </div>
        </div>
      </div>
    </n-scrollbar>

    <n-space justify="end" class="sensitive-confirm__actions">
      <n-button @click="emit('cancel')">{{ t('common.cancel') }}</n-button>
      <n-button type="warning" @click="emit('confirm')">
        {{ t('common.confirm') }}
      </n-button>
    </n-space>
  </div>
</template>

<style lang="less" scoped>
.sensitive-confirm__alert {
  margin-bottom: 16px;
}

.sensitive-confirm__group {
  padding: 12px;
  border: 1px solid rgb(15 23 42 / 8%);
  border-radius: 8px;
  background: rgb(248 250 252 / 60%);

  & + & {
    margin-top: 10px;
  }
}

.sensitive-confirm__module {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
}

.sensitive-confirm__sub {
  padding-left: 20px;

  & + & {
    margin-top: 8px;
  }
}

.sensitive-confirm__menu {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 6px;
}

.sensitive-confirm__permissions {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-left: 20px;
}

.sensitive-confirm__actions {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid rgb(15 23 42 / 8%);
}
</style>
