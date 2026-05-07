import type { DirectiveBinding, ObjectDirective } from 'vue';

import { useAccessStore } from '@vben/stores';

interface PermissionBinding {
  action: string[];
  effect?: 'disabled' | 'remove';
}

export const permission: ObjectDirective = {
  mounted(
    el: HTMLElement,
    binding: DirectiveBinding<PermissionBinding | string[]>,
  ) {
    const { accessCodes } = useAccessStore();

    let actions: string[];
    let effect: string | undefined;

    if (Array.isArray(binding.value)) {
      actions = binding.value;
    } else {
      actions = binding.value?.action ?? [];
      effect = binding.value?.effect;
    }

    const hasPermission =
      actions.length === 0 ||
      actions.some((code) => accessCodes.includes(code.toLowerCase()));

    if (!hasPermission) {
      if (effect === 'disabled') {
        (el as HTMLButtonElement).disabled = true;
        el.classList.add('n-button--disabled');
      } else {
        el.remove();
      }
    }
  },
};
