/* oxlint-disable */
import type {
  ButtonProps,
  FormItemProps,
  GridItemProps,
  GridProps,
} from 'naive-ui';

import type { Ref, VNode } from 'vue';

import type { Recordable } from './common';
import type { ProFieldSchema } from './field';
import type { CreateProFormReturn } from './form';

/**
 * 搜索表单列渲染上下文
 */
export interface ProSearchFormRenderContext<T extends Recordable = Recordable> {
  /** 表单数据 */
  formModel: T;
  /** 设置当前字段值 */
  setValue: (value: any) => void;
  /** 当前字段路径 */
  field: string;
}

/**
 * ProSearchForm 列定义 (pro-naive-ui 风格)
 */
export interface ProSearchFormColumn<
  T extends Recordable = Recordable,
> extends Omit<ProFieldSchema<T>, 'isFull' | 'render'> {
  /** 隐藏此搜索项 */
  hideInSearch?: boolean;

  /** 列跨度 (grid 模式) */
  span?: number;

  /** 组件宽度 (flex 模式，覆盖全局 componentWidth) */
  componentWidth?: number | string;

  /** 排序 (越小越靠前) */
  order?: number;

  /** 自定义渲染函数 */
  render?: (context: ProSearchFormRenderContext<T>) => null | VNode | VNode[];

  /** 是否固定在主搜索区，默认 true。false 则归入高级筛选面板 */
  pin?: boolean;

  /** 高级筛选分组名，同 group 的字段归为一组。仅 pin: false 时生效 */
  group?: string;

  /** 覆盖字段默认尺寸规格��用于 FilterBar 弹性布局） */
  sizeOverride?: Partial<{
    fixed: boolean;
    max: number;
    min: number;
    preferred: number;
  }>;
}

/**
 * ProSearchForm Props (pro-naive-ui 风格)
 */
export interface ProSearchFormProps<T extends Recordable = Recordable> {
  /** 表单控制器 (必需) */
  form: CreateProSearchFormReturn<T>;

  /** 搜索列定义 */
  columns: ProSearchFormColumn<T>[];

  /** 搜索按钮属性 */
  searchButtonProps?: false | Partial<ButtonProps>;

  /** 重置按钮属性 */
  resetButtonProps?: false | Partial<ButtonProps>;

  /** 展开/收起按钮属性 */
  collapseButtonProps?: false | Partial<ButtonProps>;

  /** Grid 属性 */
  gridProps?: Partial<Omit<GridProps, 'collapsed'>>;

  /** 显示后缀 Grid Item */
  showSuffixGridItem?: boolean;

  /** 后缀 Grid Item 属性 */
  suffixGridItemProps?: Partial<Omit<GridItemProps, 'suffix'>>;

  /** 后缀 FormItem 属性 */
  suffixFormItemProps?: Partial<FormItemProps>;

  /** 标签宽度 */
  labelWidth?: number | string;

  /** 标签位置 */
  labelPlacement?: 'left' | 'top';

  /** 列间距 */
  xGap?: number | string;

  /** 响应式模式 */
  responsive?: 'screen' | 'self';

  /** 列数 (响应式) */
  cols?: number | string;

  /** 收起时显示行数 */
  collapsedRows?: number;
}

/**
 * createProSearchForm 选项 (pro-naive-ui 风格)
 */
export interface CreateProSearchFormOptions<T extends Recordable = Recordable> {
  /** 初始值 */
  initialValues?: Partial<T>;

  /** 默认是否收起 */
  defaultCollapsed?: boolean;

  /** 值变化回调 */
  onValuesChange?: (changedValues: Partial<T>, allValues: T) => void;
}

/**
 * createProSearchForm 返回值 (pro-naive-ui 风格)
 */
export interface CreateProSearchFormReturn<
  T extends Recordable = Recordable,
> extends CreateProFormReturn<T> {
  /** 搜索 */
  search: () => Promise<T>;

  /** 重置 */
  reset: () => void;

  /** 是否收起 */
  collapsed: Ref<boolean>;

  /** 切换收起状态 */
  toggleCollapsed: () => void;

  /** 展开 */
  expand: () => void;

  /** 收起 */
  collapse: () => void;

  /** 获取搜索参数 */
  getSearchParams: () => T;
}
