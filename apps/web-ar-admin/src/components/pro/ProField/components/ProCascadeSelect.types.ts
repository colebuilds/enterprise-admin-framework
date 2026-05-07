/* oxlint-disable */
import type { SelectOption } from 'naive-ui';

/** 级联下拉每级的值；null 表示当前级未选择 */
export type CascadeValue = null | number | string;

/** 异步加载器上下文：给到当前级序号、父级值、以及所有级别的快照 */
export interface CascadeLoaderContext {
  /** 0-based 级别序号 */
  level: number;
  /** 上一级的已选值；level === 0 时为 null */
  parentValue: CascadeValue;
  /** 所有级别当前值的快照（只读） */
  values: readonly CascadeValue[];
}

/** 每级一个 loader；返回该级可选项。level > 0 时只有在 parentValue 非空才会调用 */
export type CascadeLoader = (
  ctx: CascadeLoaderContext,
) => Promise<SelectOption[]>;

/** 树形节点：value / label / children 字段名通过 `keyField` / `labelField` / `childrenField` 指定 */
export type CascadeTreeNode = Record<string, unknown>;

/**
 * 树形数据源：同步数组 或 同步 getter 函数。
 * 必须是同步：组件把它包成 `computed`，getter 内部读到的响应式源（pinia 字典、ref 等）
 * 会被自动追踪，字典加载完毕时 computed 失效 → 自动 reload 级联选项。
 * 需要真正异步拉取？请改用 `loaders`。
 */
export type CascadeSource = (() => CascadeTreeNode[]) | CascadeTreeNode[];
