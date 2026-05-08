---
title: 样式组织与 CSS 规范
type: standard
code: FE-UI-001
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-03-26
scope: apps/*, packages/*
applies_to: human, ai-agent
---

# 样式组织与 CSS 规范

## 1. 目标

统一项目中样式组织、类名设计、选择器边界、作用域控制与样式复用方式，减少全局污染、样式耦合、层级失控和维护成本过高的问题。

本文档聚焦 CSS / SCSS / CSS Modules / 组件局部样式的组织方式，不重复 `FE-STD-003-Vue3-SFC-组件书写规范.md` 中关于 `props`、`emits`、`template` 结构与组件职责边界的内容。

## 2. 适用范围

本规范适用于：

- 所有 Vue3 单文件组件中的 `<style>` 片段
- `apps/*` 下的业务页面样式
- `packages/*` 下的共享组件样式
- CSS、SCSS、Less 等样式实现
- CSS Modules、`scoped` 样式、局部样式与少量全局样式

本规范主要覆盖：

- class 命名
- 选择器边界
- 层级深度
- 状态类
- 作用域控制
- 样式污染防止
- 可维护的样式组织方式

不在本规范中展开的内容：

- 组件的 `props` / `emits` 设计
- 事件和状态流转
- 页面路由与业务数据结构
- 设计系统的 token 定义细节

## 3. 核心规则

### 3.1 样式应服务组件职责

- 样式优先服务当前组件或当前页面的职责
- 不要把局部样式写成隐式的全局规则
- 同一个样式块应尽量只表达一个视觉区域或交互区域
- 当样式开始覆盖多个独立职责时，应优先拆分组件或拆分样式模块

### 3.2 class 命名应清晰、稳定、可扩展

- class 名称应表达结构或状态，不要只写视觉形容词
- 优先使用稳定的语义命名，例如 `card`、`card__header`、`card--compact`
- 避免把样式写成临时用途命名，例如 `red-box`、`tmp-wrap`、`fix-1`
- 命名应尽量和组件职责一致，不要依赖短期实现细节

### 3.3 选择器边界应尽量窄

- 优先选择组件根节点及其内部 class
- 避免跨层级、跨组件、跨页面的宽选择器
- 选择器优先使用 class，而不是标签名或深层后代链
- 只有在确实需要覆盖第三方库或子组件内部结构时，才有限使用更强的选择器

### 3.4 层级深度应可控

- 选择器层级应保持简洁，避免深层嵌套
- 优先通过语义 class 表达结构，而不是堆砌父子后代选择器
- 层级越深，越容易被后续修改击穿
- 当选择器开始依赖多层结构时，说明样式边界已经偏弱

### 3.5 状态类应显式表达

- 状态应通过明确的状态类或数据属性表达
- 常见状态包括：`is-active`、`is-disabled`、`is-loading`、`is-error`
- 不要把状态藏在无语义的颜色类或位置类里
- 状态类应和结构类保持区分，避免一个 class 同时承担结构和状态两种职责

### 3.6 局部样式优先，必要时再提升范围

- 优先使用组件局部样式
- `scoped` 样式适合组件内部边界明确的场景
- CSS Modules 适合需要更强隔离的局部样式场景
- 只有在确实有跨组件复用、主题覆盖或基础设施级需求时，才引入更大范围的样式

### 3.7 全局样式必须克制

- 全局样式应尽量只承载基础变量、基础排版、统一重置和设计系统级规则
- 不要把页面级视觉细节写进全局样式
- 全局 class 名必须慎重，避免和局部 class 冲突
- 如果某个样式规则只属于一个页面或一个组件，就不要放入全局

### 3.8 深度覆盖要显式声明

- 当必须覆盖子组件、第三方组件或插槽内容时，应显式说明原因
- 深度穿透能力只用于少量必要场景，不应作为默认方案
- 一旦使用 `:deep`、穿透选择器或类似能力，应明确其作用范围
- 穿透样式应尽量局限在最小必要边界

### 3.9 SCSS / CSS Modules / 局部样式按职责选择

- SCSS 适合表达嵌套结构、变量、混入和局部组织，但不要滥用嵌套
- CSS Modules 适合强隔离、局部可控、避免命名冲突的场景
- `scoped` 适合 Vue 组件内部样式隔离，但仍需保持 class 命名可读
- 不要因为“能用”就叠加多种方案，先确认实际隔离需求

### 3.10 样式组织应支持长期维护

- 同类样式应保持集中
- 复杂页面可按区域拆分样式块
- 共享样式、主题变量、页面局部样式应分层组织
- 当样式文件开始明显变长时，应先考虑拆分结构，而不是继续堆叠规则

## 4. 推荐示例

### 4.1 BEM 风格的局部 class

```vue
<template>
  <section class="card card--compact">
    <header class="card__header">
      <h3 class="card__title">概览</h3>
      <span class="card__status is-active">启用中</span>
    </header>

    <div class="card__body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.card {
  padding: 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--surface-color);

  &--compact {
    padding: 12px;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  &__status {
    color: var(--text-muted);

    &.is-active {
      color: var(--success-color);
    }
  }
}
</style>
```

### 4.2 CSS Modules 适合强隔离区域

```vue
<script setup lang="ts">
import styles from './panel.module.scss';
</script>

<template>
  <div :class="styles.panel">
    <div :class="styles.panelHeader">标题</div>
    <div :class="styles.panelBody">
      <slot />
    </div>
  </div>
</template>
```

### 4.3 只在必要时使用深度覆盖

```vue
<style scoped lang="scss">
.form {
  :deep(.el-input__inner) {
    min-height: 40px;
  }
}
</style>
```

## 5. 禁止项 / 反例

- 使用 `div > div > div` 这类结构性选择器依赖页面层级
- 把全局选择器写成“默认覆盖所有页面”
- 使用 `red-box`、`temp-style` 这类临时命名长期存在
- 在局部样式里频繁写过深嵌套
- 让一个 class 同时承担结构、状态和视觉三个职责
- 把第三方库的覆盖规则散落在多个组件里
- 用 `:deep` 作为默认手段去解决本应通过组件边界解决的问题
- 在需要隔离的区域继续追加全局样式

## 6. 例外说明

- 全局 reset、基础排版、设计 token、主题变量可以放在全局样式中
- 与第三方组件库强耦合的极少数覆盖样式，可以采用有限的深度穿透，但必须控制范围
- 某些历史页面可能短期无法完全重构，但新增样式应按照本规范收敛
- 如果项目已有更高优先级的设计系统或主题规范，应优先遵守上位规范

## 7. 执行建议

- 先决定样式归属，再决定具体写法
- 优先使用语义清晰的 class 命名
- 能局部解决的样式不要上升为全局规则
- 深度穿透和全局覆盖都应视为例外方案
- 复杂页面建议先划分区域，再分段写样式
- 新增样式前，先判断是否会污染其他组件或页面
- 如果样式规则开始变成“到处复制粘贴”，应优先抽取公共层或拆分组件
