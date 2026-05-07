<!-- oxlint-disable -->
<script lang="ts" setup>
import type { DateRangeShortcuts, DateRangeTimezone } from '../types';

import { ref, toRef } from 'vue';
import { useI18n } from 'vue-i18n';

import { CalendarOutlined, CloseCircleFilled } from '@vicons/antd';
import { NIcon, NPopover, NSelect } from 'naive-ui';

import ProDateRangePicker from './ProDateRangePicker.vue';
import { useDateRangeTrigger } from './useDateRange';

defineOptions({ name: 'ProSelectDateRange' });

const props = withDefaults(
  defineProps<{
    /** 是否允许选择未来日期 */
    allowFuture?: boolean;
    /** 是否可清除日期 */
    clearable?: boolean;
    /** 日期区间值 [start, end]。number 元组用于 timestamp 模式；string 元组仅 valueFormat='string' 时生效 */
    dateValue?: [number, number] | [string, string] | null;
    /** 日期显示格式 */
    displayFormat?: string;
    /** 最大可选天数 */
    maxDays?: number;
    /** 下拉选项 */
    options: { label: string; value: number }[];
    /** 日期区间占位符 */
    placeholder?: string;
    /** 下拉选中值 */
    selectValue?: number;
    /** Select 宽度（px） */
    selectWidth?: number;
    /** 快捷选项预设 */
    shortcutPreset?: 'default' | 'report' | 'simple';
    /** 快捷选项：false 隐藏，true/不传显示默认，数组使用外部自定义 */
    shortcuts?: DateRangeShortcuts;
    /** 是否显示时分秒 */
    showTime?: boolean;
    /** 尺寸 */
    size?: 'large' | 'medium' | 'small';
    /** 商户时区。string=自定义；false=强制 UTC；未传=CrudTable 上下文或默认商户 */
    timezone?: DateRangeTimezone;
    /** 出站格式：'timestamp'（默认）emit 毫秒时间戳；'string' emit 格式化字符串（不做任何 tz 处理） */
    valueFormat?: 'string' | 'timestamp';
    /** valueFormat='string' 时的字符串格式，默认 'yyyy-MM-dd HH:mm:ss' */
    valueStringPattern?: string;
  }>(),
  {
    selectValue: 1,
    dateValue: null,
    valueFormat: 'timestamp',
    valueStringPattern: 'yyyy-MM-dd HH:mm:ss',
    timezone: null,
    placeholder: '',
    size: 'small',
    selectWidth: 80,
    clearable: true,
    displayFormat: 'yyyy-MM-dd',
    shortcutPreset: 'default',
    maxDays: 31,
    allowFuture: false,
    showTime: true,
  },
);

const emit = defineEmits<{
  'update:dateValue': [value: [number, number] | [string, string] | null];
  'update:selectValue': [value: number];
}>();

const { t } = useI18n();
const showPopover = ref(false);

// Select 去掉右侧圆角
const selectThemeOverrides = {
  peers: { InternalSelection: { borderRadius: '6px 0 0 6px' } },
};

// 共用触发器状态机：面板时区 / 显示 / string 规范化 / tz 切换都在 composable 里
// SelectDateRange 不维护本地 ref，value 和 externalValue 都指向 props.dateValue
const dateValueRef = toRef(props, 'dateValue');
const { pickerTimezone, startDisplay, endDisplay } = useDateRangeTrigger({
  value: dateValueRef,
  externalValue: dateValueRef,
  valueFormat: toRef(props, 'valueFormat'),
  valueStringPattern: toRef(props, 'valueStringPattern'),
  displayFormat: toRef(props, 'displayFormat'),
  propTimezone: toRef(props, 'timezone'),
  onStringNormalize: (normalized) => emit('update:dateValue', normalized),
});

function handleSelectUpdate(val: number) {
  emit('update:selectValue', val);
}

function handleConfirm(val: [number, number] | [string, string]) {
  showPopover.value = false;
  emit('update:dateValue', val);
}

function handleReset() {
  emit('update:dateValue', null);
}

function handleClear() {
  emit('update:dateValue', null);
}
</script>

<template>
  <div class="pro-select-date-range" :class="{ 'is-active': showPopover }">
    <NSelect
      :value="selectValue"
      :options="options"
      :size="size"
      :theme-overrides="selectThemeOverrides"
      class="pro-select-date-range__select"
      :style="{ flex: `0 0 ${selectWidth}px` }"
      @update:value="handleSelectUpdate"
    />
    <NPopover
      trigger="click"
      placement="bottom-start"
      :show="showPopover"
      :width="showTime ? undefined : 650"
      :style="showTime ? 'max-width: none;' : ''"
      @update:show="showPopover = $event"
    >
      <template #trigger>
        <div
          class="pro-select-date-range__date-trigger"
          @click="showPopover = true"
        >
          <span
            class="pro-select-date-range__value"
            :class="{ 'is-placeholder': !startDisplay }"
          >
            {{
              startDisplay || placeholder || t('common.dateRange.placeholder')
            }}
          </span>
          <span class="pro-select-date-range__separator">→</span>
          <span
            class="pro-select-date-range__value"
            :class="{ 'is-placeholder': !endDisplay }"
          >
            {{ endDisplay || placeholder || t('common.dateRange.placeholder') }}
          </span>
          <span class="pro-select-date-range__icons">
            <NIcon
              v-if="clearable && dateValue"
              class="clear-icon"
              @click.stop="handleClear"
            >
              <CloseCircleFilled />
            </NIcon>
            <NIcon v-else><CalendarOutlined /></NIcon>
          </span>
        </div>
      </template>
      <ProDateRangePicker
        :value="dateValue"
        :value-format="valueFormat"
        :value-string-pattern="valueStringPattern"
        :timezone="pickerTimezone"
        :show-time="showTime"
        :shortcut-preset="shortcutPreset"
        :shortcuts="shortcuts"
        :max-days="maxDays"
        :allow-future="allowFuture"
        @confirm="handleConfirm"
        @reset="handleReset"
      />
    </NPopover>
  </div>
</template>

<style lang="less" scoped>
// 模拟 NInput readonly small 的外观，不依赖 Naive UI 的 --n-* CSS 变量
@border-color: #e0e0e6;
@border-color-hover: #36ad6a;
@text-color: #333639;
@placeholder-color: #c2c2c2;
@icon-color: #c2c2c2;
@icon-color-hover: #999;

.pro-select-date-range {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;

  &__date-trigger {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    height: 26px;
    padding: 0 8px;
    margin-left: -1px;
    border: 1px solid @border-color;
    border-radius: 0 3px 3px 0;
    background: #fff;
    cursor: pointer;
    font-size: 13px;
    box-sizing: border-box;
    transition: border-color 0.3s;

    &:hover {
      border-color: @border-color-hover;
    }
  }

  &__value {
    flex: 1;
    min-width: 0;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: @text-color;

    &.is-placeholder {
      color: @placeholder-color;
    }
  }

  &__separator {
    flex-shrink: 0;
    color: #999;
    font-size: 12px;
    margin: 0 4px;
  }

  &__icons {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    margin-left: 4px;
    color: @icon-color;
  }

  .clear-icon {
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: @icon-color-hover;
    }
  }
}
</style>
