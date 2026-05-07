/* oxlint-disable */
import type { ComputedRef, Ref } from 'vue';

/**
 * @description ProCrudTable 自适应高度计算：跟踪容器、汇总区和底部工具栏高度，动态计算表格可用最大高度。
 * @author sum
 * @date 2026-04-17
 * @scope 仅用于 `src/components/ProComponents/ProCrudTable/composables/useAutoHeight.ts`
 */
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue';

import { useWindowSize } from '@vueuse/core';

export interface UseAutoHeightOptions {
  containerRef: Ref<HTMLElement | null>;
  summaryRef?: Ref<HTMLElement | null>;
  footerRef: Ref<HTMLElement | null>;
  autoHeight: ComputedRef<boolean>;
  autoHeightOffset: ComputedRef<number>;
  maxHeight: ComputedRef<number | string | undefined>;
}

export interface UseAutoHeightReturn {
  actualMaxHeight: ComputedRef<number | string | undefined>;
  recalculate: () => void;
  lockHeight: () => void;
  unlockHeight: () => void;
}

function normalizeHeightValue(
  value: number | string | undefined,
): number | undefined {
  if (value === undefined) return undefined;
  const num = typeof value === 'string' ? Number.parseFloat(value) : value;
  return Number.isFinite(num) ? num : undefined;
}

export function useAutoHeight(
  options: UseAutoHeightOptions,
): UseAutoHeightReturn {
  const { height: windowHeight } = useWindowSize();
  const stableContainerTop = ref(0);
  const stableSummaryHeight = ref(0);
  const stableFooterHeight = ref(0);
  const isHeightLocked = ref(false);
  const lockedHeight = ref<number | undefined>(undefined);

  let containerObserver: null | ResizeObserver = null;
  let summaryObserver: null | ResizeObserver = null;
  let footerObserver: null | ResizeObserver = null;

  function updatePositions() {
    if (options.containerRef.value) {
      stableContainerTop.value =
        options.containerRef.value.getBoundingClientRect().top;
    }
    if (options.summaryRef?.value) {
      stableSummaryHeight.value = options.summaryRef.value.offsetHeight;
    }
    if (options.footerRef.value) {
      stableFooterHeight.value = options.footerRef.value.offsetHeight;
    }
  }

  function setupObservers() {
    cleanupObservers();
    if (options.containerRef.value) {
      containerObserver = new ResizeObserver(() => {
        if (!isHeightLocked.value) updatePositions();
      });
      containerObserver.observe(options.containerRef.value);
    }
    if (options.summaryRef?.value) {
      summaryObserver = new ResizeObserver(() => {
        if (!isHeightLocked.value) updatePositions();
      });
      summaryObserver.observe(options.summaryRef.value);
    }
    if (options.footerRef.value) {
      footerObserver = new ResizeObserver(() => {
        if (!isHeightLocked.value) updatePositions();
      });
      footerObserver.observe(options.footerRef.value);
    }
  }

  function cleanupObservers() {
    containerObserver?.disconnect();
    summaryObserver?.disconnect();
    footerObserver?.disconnect();
    containerObserver = null;
    summaryObserver = null;
    footerObserver = null;
  }

  onMounted(() => {
    nextTick(() => {
      updatePositions();
      setupObservers();
    });
  });

  onBeforeUnmount(cleanupObservers);

  const observerSources: Ref<HTMLElement | null>[] = [
    options.containerRef,
    options.footerRef,
  ];
  if (options.summaryRef) {
    observerSources.splice(1, 0, options.summaryRef);
  }

  watch(observerSources, () => nextTick(setupObservers));
  watch(windowHeight, updatePositions);

  const actualMaxHeight = computed(() => {
    if (options.maxHeight.value !== undefined) return options.maxHeight.value;
    if (isHeightLocked.value && lockedHeight.value !== undefined)
      return lockedHeight.value;
    if (
      options.autoHeight.value &&
      stableContainerTop.value &&
      windowHeight.value
    ) {
      const available =
        windowHeight.value -
        stableContainerTop.value -
        stableSummaryHeight.value -
        stableFooterHeight.value -
        options.autoHeightOffset.value -
        50;
      return Math.max(Math.floor(available), 200);
    }
    return undefined;
  });

  function recalculate() {
    nextTick(updatePositions);
  }

  function lockHeight() {
    lockedHeight.value = normalizeHeightValue(actualMaxHeight.value);
    isHeightLocked.value = true;
  }

  function unlockHeight() {
    nextTick(() => {
      updatePositions();
      requestAnimationFrame(() => {
        isHeightLocked.value = false;
        lockedHeight.value = undefined;
      });
    });
  }

  return { actualMaxHeight, recalculate, lockHeight, unlockHeight };
}
