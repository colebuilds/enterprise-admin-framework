import { useAccessStore } from '@vben/stores';

export function usePermission() {
  const accessStore = useAccessStore();

  function hasPermission(code: string | string[]): boolean {
    const codes = Array.isArray(code) ? code : [code];
    return codes.some((c) => accessStore.accessCodes.includes(c.toLowerCase()));
  }

  return { hasPermission };
}
