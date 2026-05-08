---
title: Vue3 SFC 组件书写规范
type: standard
code: FE-STD-003
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-03-26
scope: apps/*, packages/*
applies_to: human, ai-agent
---

# Vue3 SFC 组件书写规范

## 1. 目标

统一 Vue3 单文件组件（SFC）的书写方式、职责边界与可维护性要求，避免组件臃肿、状态外溢、事件混乱、样式失控和测试困难。

本文档聚焦 SFC 组件的对外接口、模板结构、样式组织和组件级状态边界；涉及逻辑封装、副作用控制与复用能力下沉时，应进一步遵守：

- `FE-STD-004-Composables-架构与编码规范.md`

---

## 2. 适用范围

本规范适用于：

- 所有 Vue3 `.vue` 单文件组件
- `apps/*` 下的业务页面组件
- `packages/*` 下的共享组件与基础组件
- AI 与人工共同参与编写的组件

本规范主要覆盖：

- `script setup`
- `props` / `emits`
- `template` 结构
- `style` 组织
- 状态边界
- 事件通信
- `slot` 使用
- 组件拆分
- 可测试性

---

## 3. 核心规则

### 3.1 优先使用 `script setup`

- 默认使用 `<script setup lang="ts">`
- 能用组合式 API 表达的逻辑，不回退到 Options API
- 组件逻辑应尽量短、直、可读
- 复杂逻辑应抽到 composable、工具函数或更小的子组件

### 3.2 `props` 只做输入，不做隐式状态

- `props` 用于描述组件输入
- 不要在组件内部偷偷复制 `props` 作为第二份状态
- 若需要局部可编辑状态，应显式声明本地 state，并说明与 `props` 的同步规则
- `props` 定义应尽量完整，避免“看代码才知道怎么传”

### 3.3 `emits` 只表达事件，不表达业务副作用

- 组件通过 `emits` 向外汇报行为
- 不要在子组件里直接操控父组件状态
- 事件名应语义明确，避免 `change1`、`updateData` 这类模糊命名
- 对于可受控组件，优先使用标准的 `v-model` 约定

### 3.4 `template` 结构应保持单一职责

- `template` 只负责结构与数据展示
- 不把大量条件判断、复杂拼接逻辑堆进模板
- 复杂判断应提前提炼成 `computed`、方法或子组件
- 模板层级应尽量清晰，避免深层嵌套

### 3.5 样式应局部、稳定、可预测

- 优先使用组件局部样式
- 避免无约束的全局选择器污染
- 组件样式优先服务自身职责，不写成页面级大杂烩
- 如果需要全局样式，应明确其原因和边界

### 3.6 状态边界必须清晰

- 页面状态、组件状态、共享状态应分层管理
- 组件不应无边界地持有全局逻辑
- 共享状态应上提到 store 或上层容器，不要散落在任意子组件
- 纯展示组件尽量保持无状态或弱状态

### 3.7 事件流应短且可追踪

- 组件之间的事件链路应尽量短
- 避免“组件 A 触发 B，B 再触发 C，最后才改变状态”
- 需要跨层传播时，应优先考虑提升状态或收敛事件中转层

### 3.8 `slot` 用于扩展，不用于失控拼装

- `slot` 用于保留可扩展区域
- 不要把组件设计成完全依赖 slot 拼接的壳
- `slot` 命名应清晰，默认 slot 只承担默认内容
- 当 slot 过多时，说明组件可能拆分粒度不合理

### 3.9 组件拆分要基于职责，不基于行数

- 当组件同时承担展示、状态、交互、适配、布局多重职责时，应拆分
- 不要等代码很长才拆
- 拆分优先级应根据职责边界和复用价值决定
- 页面容器、业务组件、基础组件的职责应分开

### 3.10 组件必须考虑可测试性

- 组件输入输出应尽量明确
- 副作用应可隔离
- 复杂逻辑应尽量外提，便于单测
- 关键交互应能通过组件测试或页面测试验证

---

## 4. 推荐示例

### 4.1 组件骨架

```vue
<script setup lang="ts">
type Props = {
  title: string;
  loading?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  (event: 'submit'): void;
  (event: 'cancel'): void;
}>();

const handleSubmit = () => {
  emit('submit');
};
</script>

<template>
  <section class="card">
    <header class="card__header">
      <h3>{{ props.title }}</h3>
    </header>

    <div class="card__body">
      <slot />
    </div>

    <footer class="card__actions">
      <button type="button" @click="handleSubmit">提交</button>
      <button type="button" @click="emit('cancel')">取消</button>
    </footer>
  </section>
</template>
```

### 4.2 状态外提

- 复杂计算放到 `computed` 或 composable
- 重复的交互逻辑放到可复用函数
- 页面级状态放到页面容器或 store

### 4.3 事件和 slot

- 事件只表达行为
- slot 只保留扩展位
- 组件对外接口保持稳定

---

## 5. 禁止项 / 反例

- 在子组件里直接改父组件状态
- `props` 和本地 state 长期不同步且无说明
- 模板里堆积过多嵌套判断和业务拼接
- 组件样式污染全局
- 一个组件同时承担页面、容器、业务和展示职责
- slot 过多导致组件行为不可预测
- 关键交互没有明确 `emits`
- 组件逻辑无法通过测试稳定覆盖

---

## 6. 例外说明

- 极小展示组件可以保持非常轻量，但仍应保持接口清晰
- 临时过渡组件可以先简写，但进入正式体系后应尽快收敛
- 某些高交互组件可能需要更复杂的本地状态，但必须显式说明同步规则
- 如果项目已有统一设计系统或组件库规范，应以更高优先级规范为准

---

## 7. 执行建议

- 先定义组件职责，再写模板
- 先定义输入输出，再写交互
- 先确定状态边界，再决定是否拆分
- 先抽出可测试的逻辑，再补 UI 细节
- 对于超过单一职责的组件，优先拆分为容器组件、展示组件和可复用逻辑
- 新增组件时，优先考虑后续测试和复用成本，而不是只看当前实现是否能跑
