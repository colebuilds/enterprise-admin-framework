<!-- oxlint-disable -->
<script lang="ts" setup>
import type {
  DateRangeDefaultShortcut,
  DateRangeShortcuts,
  DateRangeTimezone,
} from '../types';
import type { RangeValue } from './useDateRange';

import { computed, ref, toRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import { CalendarOutlined, CloseCircleFilled } from '@vicons/antd';
import { format } from 'date-fns';
import { NEl, NIcon, NPopover } from 'naive-ui';

import { useProFormContextSafe } from '../context';
import { createZonedDefaultShortcutValue } from './composables/useZonedShortcuts';
import ProDateRangePicker from './ProDateRangePicker.vue';
import { useDateRangeTrigger } from './useDateRange';
import { resolveTimezoneId } from './utils/zonedDateMath';

defineOptions({
  name: 'ProDateRangeInput',
});

const props = withDefaults(
  defineProps<{
    /** 是否允许选择未来日期 */
    allowFuture?: boolean;
    /** 是否可清除 */
    clearable?: boolean;
    /** 初始为空时按快捷项 key 写入默认区间 */
    defaultShortcut?: DateRangeDefaultShortcut;
    /** 是否禁用 */
    disabled?: boolean;
    /** 显示格式 */
    displayFormat?: string;
    /** 最大可选天数 */
    maxDays?: number;
    /**
     * 把起止两端的值直接展平写回 form model 对应字段。数组顺序 = [start, end]。
     * 例：`['beginTime', 'endTime']` → 起始 → form.beginTime，结束 → form.endTime。
     * 设置后：组件初始化时从这两个字段读初值、交互时把起止值写回它们；
     * 自身 `update:value` 不再发射（聚合数组不再落 form 里，避免冗余）。
     * 仅在 ProField 包裹下生效（需要 form context）。
     */
    modelKeys?: string[];
    /** 占位符 */
    placeholder?: string;
    /** 弹出框宽度 */
    popoverWidth?: number;
    /** 快捷选项预设 */
    shortcutPreset?: 'default' | 'report' | 'simple';
    /** 快捷选项：false 隐藏，true/不传显示默认，数组使用外部自定义 */
    shortcuts?: DateRangeShortcuts;
    /** 是否显示时分秒选择 */
    showTime?: boolean;
    /** 商户时区。string=自定义；false=强制 UTC；未传=CrudTable 上下文或默认商户 */
    timezone?: DateRangeTimezone;
    /** 当前值 [start, end]。number 元组用于 timestamp 模式；string 元组仅 valueFormat='string' 时生效 */
    value?: [number, number] | [string, string] | null;
    /** 出站格式：'timestamp'（默认）emit 毫秒时间戳；'string' emit 格式化字符串（不做任何 tz 处理） */
    valueFormat?: 'string' | 'timestamp';
    /** valueFormat='string' 时的字符串格式，默认 'yyyy-MM-dd HH:mm:ss' */
    valueStringPattern?: string;
  }>(),
  {
    value: null,
    valueFormat: 'timestamp',
    valueStringPattern: 'yyyy-MM-dd HH:mm:ss',
    timezone: null,
    placeholder: '',
    disabled: false,
    clearable: true,
    popoverWidth: 650,
    displayFormat: 'yyyy-MM-dd',
    maxDays: 31,
    allowFuture: false,
    shortcutPreset: 'default',
    defaultShortcut: undefined,
    showTime: true,
    modelKeys: undefined,
  },
);

const emit = defineEmits<{
  change: [value: RangeValue];
  clear: [];
  'update:value': [value: RangeValue];
}>();

const { t } = useI18n();

const showPopover = ref(false);
const modelValue = ref<RangeValue>(props.value);

// 走 ProField 包装时能拿到 form context；直接 v-model 使用时为 null
const formContext = useProFormContextSafe();

/** 是否启用 modelKeys 展平模式：modelKeys 长度 >=2 + 有 form context */
const useModelKeys = computed(
  () =>
    Array.isArray(props.modelKeys) &&
    props.modelKeys.length >= 2 &&
    !!formContext,
);

function readFromModelKeys(): RangeValue {
  if (!useModelKeys.value) return null;
  const [startKey, endKey] = props.modelKeys!;
  const startVal = formContext!.getFieldValue(startKey);
  const endVal = formContext!.getFieldValue(endKey);
  if (
    (startVal === undefined || startVal === null || startVal === '') &&
    (endVal === undefined || endVal === null || endVal === '')
  ) {
    return null;
  }
  return [startVal, endVal] as RangeValue;
}

function writeToModelKeys(val: RangeValue) {
  if (!useModelKeys.value) return;
  const [startKey, endKey] = props.modelKeys!;
  if (Array.isArray(val) && val.length === 2) {
    formContext!.setFieldValue(startKey, val[0]);
    formContext!.setFieldValue(endKey, val[1]);
  } else {
    formContext!.setFieldValue(startKey, null);
    formContext!.setFieldValue(endKey, null);
  }
}

/**
 * 统一的"值变化"出口：
 * - modelKeys 模式：只写回展平字段，不再 emit update:value，避免 form 里出现冗余的 aggregate
 * - 普通模式：按原路走 update:value（外层 ProField 会把它写入 form[path]）
 */
function commitValue(val: RangeValue) {
  modelValue.value = val;
  if (useModelKeys.value) {
    writeToModelKeys(val);
  } else {
    emit('update:value', val);
  }
}

const effectivePlaceholder = computed(
  () => props.placeholder || t('common.dateRange.placeholder'),
);

// 共用触发器状态机：面板时区 / 显示 / string 规范化 / tz 切换全部在 composable 里
const { pickerTimezone, startDisplay, endDisplay } = useDateRangeTrigger({
  value: modelValue,
  externalValue: toRef(props, 'value'),
  valueFormat: toRef(props, 'valueFormat'),
  valueStringPattern: toRef(props, 'valueStringPattern'),
  displayFormat: toRef(props, 'displayFormat'),
  propTimezone: toRef(props, 'timezone'),
  onStringNormalize: (normalized) => {
    commitValue(normalized);
    emit('change', normalized);
  },
});

const defaultShortcutValue = computed(() => {
  const timezone = pickerTimezone.value;
  if (timezone === null && props.timezone !== false) return null;
  return createZonedDefaultShortcutValue({
    defaultShortcut: props.defaultShortcut,
    timezoneId: resolveTimezoneId(timezone === false ? null : timezone),
    valueFormat: props.valueFormat,
    valueStringPattern: props.valueStringPattern,
    preset: props.shortcutPreset,
    t,
  });
});
const suppressDefaultShortcut = ref(false);

function isEmptyRange(value: RangeValue): boolean {
  if (!Array.isArray(value) || value.length !== 2) return true;
  const startEmpty =
    value[0] === undefined || value[0] === null || value[0] === '';
  const endEmpty =
    value[1] === undefined || value[1] === null || value[1] === '';
  return startEmpty && endEmpty;
}

function getCurrentRange(): RangeValue {
  return useModelKeys.value ? readFromModelKeys() : modelValue.value;
}

function getTimezoneIdentity(value: DateRangeTimezone | undefined): string {
  if (value === false || value === null || value === undefined) return 'UTC';
  return resolveTimezoneId(value);
}

function resetDefaultShortcut() {
  const next = defaultShortcutValue.value;
  if (!next) return false;
  suppressDefaultShortcut.value = false;
  commitValue(next);
  return true;
}

function applyDefaultShortcutIfEmpty(): boolean {
  const next = defaultShortcutValue.value;
  if (!next) return false;
  if (suppressDefaultShortcut.value) {
    suppressDefaultShortcut.value = false;
    return false;
  }
  if (!isEmptyRange(getCurrentRange())) return false;
  commitValue(next);
  return true;
}

// 外部 props.value 变化 → modelValue 同步
//   - string 模式 number 元组已由 composable 规范化后写回，这里跳过
//   - modelKeys 模式下 props.value（= form[path]）不是权威源，空值时从分字段回填
//   - 其他情况直接镜像
watch(
  () => props.value,
  (val) => {
    if (
      props.valueFormat === 'string' &&
      Array.isArray(val) &&
      val.length === 2 &&
      typeof val[0] === 'number' &&
      typeof val[1] === 'number'
    ) {
      return;
    }
    if (useModelKeys.value && (val === null || val === undefined)) {
      modelValue.value = readFromModelKeys();
      applyDefaultShortcutIfEmpty();
      return;
    }
    modelValue.value = val;
    applyDefaultShortcutIfEmpty();
  },
  { immediate: true, flush: 'sync' },
);

// modelKeys 模式下单独追踪 form 里两个分字段：父组件 reset / setFieldValue 清掉它们时
// props.value 不会变（ProField 在 modelKeys 模式下不写回 path），上面那条 watch 触发不了，
// 必须靠这条 computed + watch 把清空回灌到自己的 modelValue 里，UI 才能同步回到 placeholder
const modelKeysSnapshot = computed<RangeValue>(() =>
  useModelKeys.value ? readFromModelKeys() : null,
);
watch(
  modelKeysSnapshot,
  (next) => {
    if (!useModelKeys.value) return;
    if (
      props.valueFormat === 'string' &&
      Array.isArray(next) &&
      next.length === 2 &&
      typeof next[0] === 'number' &&
      typeof next[1] === 'number'
    ) {
      const pattern = props.valueStringPattern;
      commitValue([format(next[0], pattern), format(next[1], pattern)]);
      return;
    }
    // 和当前 modelValue 比较，避免自己写回后又被回灌触发无限循环
    const curr = modelValue.value;
    const nextStart = next?.[0] ?? null;
    const nextEnd = next?.[1] ?? null;
    const currStart = curr?.[0] ?? null;
    const currEnd = curr?.[1] ?? null;
    if (nextStart === currStart && nextEnd === currEnd) return;
    modelValue.value = next;
    applyDefaultShortcutIfEmpty();
  },
  { flush: 'sync' },
);

// 切换搜索商户时，配置了 defaultShortcut 的日期范围按新商户时区重新初始化。
// 例如 today 始终重新落到新商户的 00:00:00 ~ 23:59:59，而不是沿用旧商户的 UTC 毫秒值。
watch(
  pickerTimezone,
  (nextTimezone, previousTimezone) => {
    if (!props.defaultShortcut) return;
    if (
      getTimezoneIdentity(nextTimezone) ===
      getTimezoneIdentity(previousTimezone)
    )
      return;
    resetDefaultShortcut();
  },
  { flush: 'sync' },
);

watch(
  defaultShortcutValue,
  () => {
    applyDefaultShortcutIfEmpty();
  },
  { immediate: true, flush: 'sync' },
);

function handlePopoverShow(show: boolean) {
  showPopover.value = show;
}

function handleConfirm(value: [number, number] | [string, string]) {
  showPopover.value = false;
  commitValue(value);
  emit('change', value);
}

function handleReset() {
  suppressDefaultShortcut.value = true;
  commitValue(null);
  emit('change', null);
}

function handleClear() {
  suppressDefaultShortcut.value = true;
  commitValue(null);
  emit('change', null);
  emit('clear');
}
</script>

<template>
  <NPopover
    trigger="click"
    placement="bottom-start"
    :show="showPopover"
    :width="showTime ? undefined : popoverWidth"
    :style="showTime ? 'max-width: none;' : ''"
    @update:show="handlePopoverShow"
  >
    <template #trigger>
      <!-- n-el 把 naive-ui theme vars（--border-color / --border-radius / --ui-accent-hover
           / --text-color / --placeholder-color / --icon-color 等）挂到根元素，
           子元素走 CSS 继承即可消费，切换主题时自动跟随 -->
      <NEl
        tag="div"
        class="pro-date-range-trigger"
        :class="{ 'is-disabled': disabled }"
        @click="!disabled && (showPopover = true)"
      >
        <span
          class="pro-date-range-trigger__value"
          :class="{ 'is-placeholder': !startDisplay }"
          >{{ startDisplay || effectivePlaceholder }}</span>
        <span class="pro-date-range-trigger__separator">→</span>
        <span
          class="pro-date-range-trigger__value"
          :class="{ 'is-placeholder': !endDisplay }"
          >{{ endDisplay || effectivePlaceholder }}</span>
        <span class="pro-date-range-trigger__icons">
          <NIcon
            v-if="clearable && modelValue"
            class="clear-icon"
            @click.stop="handleClear"
          >
            <CloseCircleFilled />
          </NIcon>
          <NIcon v-else><CalendarOutlined /></NIcon>
        </span>
      </NEl>
    </template>

    <ProDateRangePicker
      :value="modelValue"
      :value-format="valueFormat"
      :value-string-pattern="valueStringPattern"
      :timezone="pickerTimezone"
      :max-days="maxDays"
      :allow-future="allowFuture"
      :shortcuts="shortcuts"
      :shortcut-preset="shortcutPreset"
      :show-time="showTime"
      @confirm="handleConfirm"
      @reset="handleReset"
    />
  </NPopover>
</template>

<style lang="less" scoped>
// 由外层 <n-el> 暴露 naive-ui theme vars：--border-color / --border-radius /
// --ui-accent-hover / --text-color / --placeholder-color / --icon-color
// / --cubic-bezier-ease-in-out，切换明暗主题和主色时自动跟随

.pro-date-range-trigger {
  display: flex;
  align-items: center;
  width: 100%;
  height: 26px;
  padding: 0 8px;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  background: var(--card-color);
  cursor: pointer;
  transition: border-color 0.3s var(--cubic-bezier-ease-in-out);
  font-size: 13px;
  box-sizing: border-box;

  &:hover {
    border-color: var(--ui-accent-hover);
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.pro-date-range-trigger__value {
  flex: 1;
  min-width: 0;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--text-color);

  &.is-placeholder {
    color: var(--placeholder-color);
  }
}

.pro-date-range-trigger__separator {
  flex-shrink: 0;
  color: var(--text-color-3);
  font-size: 12px;
  margin: 0 4px;
}

.pro-date-range-trigger__icons {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-left: 4px;
  color: var(--icon-color);
}

.clear-icon {
  cursor: pointer;
  transition: color 0.3s var(--cubic-bezier-ease-in-out);

  &:hover {
    color: var(--icon-color-hover);
  }
}
</style>
