<!-- oxlint-disable -->
<script lang="ts">
import { computed, defineComponent, PropType, toRaw } from 'vue';

import { DownOutlined } from '@vicons/antd';

import { usePermission } from '#/hooks/web/usePermission';
import { isBoolean, isFunction } from '#/utils/is';

import { ActionItem } from '../types/tableAction';
import Popconfirm from './Popconfirm.vue';

export default defineComponent({
  name: 'TableAction',
  components: { DownOutlined, Popconfirm },
  props: {
    actions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
      required: true,
    },
    dropDownActions: {
      type: Array as PropType<ActionItem[]>,
      default: null,
    },
    style: {
      type: String as PropType<string>,
      default: 'text',
    },
    select: {
      type: Function as PropType<Function>,
      default: () => {},
    },
  },
  setup(props) {
    const { hasPermission } = usePermission();
    const actionType =
      props.style === 'button'
        ? 'default'
        : (props.style === 'text'
          ? 'primary'
          : 'default');
    const actionText =
      props.style === 'button'
        ? undefined
        : (props.style === 'text'
          ? true
          : undefined);

    const getMoreProps = computed(() => {
      return {
        text: actionText,
        type: actionType,
        size: 'small',
      };
    });

    const getDropdownList = computed(() => {
      return (toRaw(props.dropDownActions) || [])
        .filter((action) => {
          return hasPermission(action.auth as string[]) && isIfShow(action);
        })
        .map((action) => {
          const { popConfirm } = action;
          return {
            size: 'small',
            text: actionText,
            type: actionType,
            ...action,
            ...popConfirm,
            onConfirm: popConfirm?.confirm,
            onCancel: popConfirm?.cancel,
          };
        });
    });

    function isIfShow(action: ActionItem): boolean {
      const ifShow = action.ifShow;

      let isIfShow = true;

      if (isBoolean(ifShow)) {
        isIfShow = ifShow;
      }
      if (isFunction(ifShow)) {
        isIfShow = ifShow(action);
      }
      return isIfShow;
    }

    const getActions = computed(() => {
      return (toRaw(props.actions) || [])
        .filter((action) => {
          return hasPermission(action.auth as string[]) && isIfShow(action);
        })
        .map((action) => {
          const { popConfirm } = action;
          return {
            size: 'small',
            text: actionText,
            type: actionType,
            ...action,
            ...popConfirm,
            onConfirm: popConfirm?.confirm || action.onClick,
            onCancel: popConfirm?.cancel,
            enable: !!popConfirm,
          };
        });
    });
    const onSelect = (key: string) => {
      const item = props.dropDownActions.find((item) => item.key === key);
      if (item && item.onClick) {
        item.onClick();
      } else {
        props.select(key);
      }
    };

    return {
      getActions,
      getDropdownList,
      getMoreProps,
      onSelect,
    };
  },
});
</script>

<template>
  <div class="tableAction">
    <n-space size="small" justify="center">
      <template
        v-for="(action, index) in getActions"
        :key="`${index}-${action.label}`"
      >
        <n-button
          v-bind="action"
          class="mx-1"
          v-if="!['delete'].includes(action.action)"
        >
          {{ action.label }}
          <template #icon v-if="action.hasOwnProperty('icon')">
            <n-icon :component="action.icon" />
          </template>
        </n-button>
        <Popconfirm v-else v-bind="action" />
      </template>
      <n-dropdown
        v-if="dropDownActions && getDropdownList.length > 0"
        trigger="hover"
        :options="getDropdownList"
        @select="onSelect"
      >
        <slot name="more"></slot>
        <n-button
          v-bind="getMoreProps"
          class="mx-1"
          v-if="!$slots.more"
          icon-placement="right"
        >
          <div class="flex items-center">
            <span>{{ $t('common.more') }}</span>
            <n-icon size="14" class="ml-1">
              <DownOutlined />
            </n-icon>
          </div>
        </n-button>
      </n-dropdown>
    </n-space>
  </div>
</template>
