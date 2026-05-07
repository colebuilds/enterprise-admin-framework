/* oxlint-disable */
import type { Ref } from 'vue';

import type {
  CreateProSearchFormOptions,
  CreateProSearchFormReturn,
  Recordable,
} from '../types';

import { ref } from 'vue';

import { createProForm } from './createProForm';

/**
 * 创建搜索表单实例 (pro-naive-ui 风格)
 * 基于 createProForm 扩展，增加搜索相关功能
 */
export function createProSearchForm<T extends Recordable = Recordable>(
  options: CreateProSearchFormOptions<T> = {},
): CreateProSearchFormReturn<T> {
  const {
    initialValues = {} as T,
    defaultCollapsed = true,
    onValuesChange,
  } = options;

  // 基础表单实例
  const baseForm = createProForm<T>({
    initialValues,
    onValuesChange,
  });

  // 收起状态
  const collapsed: Ref<boolean> = ref(defaultCollapsed);

  /**
   * 获取搜索参数
   */
  function getSearchParams(): T {
    return baseForm.getFieldsValue();
  }

  /**
   * 执行搜索
   */
  async function search(): Promise<T> {
    const params = await baseForm.validate();
    return params;
  }

  /**
   * 重置搜索
   */
  function reset(): void {
    baseForm.resetFields();
  }

  /**
   * 切换收起状态
   */
  function toggleCollapsed(): void {
    collapsed.value = !collapsed.value;
  }

  /**
   * 展开
   */
  function expand(): void {
    collapsed.value = false;
  }

  /**
   * 收起
   */
  function collapse(): void {
    collapsed.value = true;
  }

  // 返回搜索表单实例
  return {
    // 继承基础表单方法
    ...baseForm,

    // 搜索特有方法
    search,
    reset,
    collapsed,
    toggleCollapsed,
    expand,
    collapse,
    getSearchParams,
  };
}

export default createProSearchForm;
