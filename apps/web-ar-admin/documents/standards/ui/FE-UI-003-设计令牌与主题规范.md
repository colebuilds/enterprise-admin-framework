---
title: 设计令牌与主题规范
type: standard
code: FE-UI-003
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-03-26
scope: apps/*, packages/*
applies_to: human, ai-agent
---

# 设计令牌与主题规范

## 1. 目标

统一项目中设计令牌（design tokens）与主题（theme）的定义、命名、分层与使用方式，保证语义色、间距、字号、圆角、阴影、`z-index`、`motion token` 等基础视觉能力能够跨页面、跨组件、跨主题稳定复用。

本文档聚焦“值与语义怎么定义、怎么切换、怎么命名”，不重复 UI 结构、组件拆分或 CSS 组织方式等内容。

---

## 2. 适用范围

本规范适用于：

- `apps/*` 下所有前端业务页面与组件
- `packages/*` 下共享 UI 能力、主题能力、基础视觉能力
- AI 与人工共同参与的 UI 设计、实现、重构与迁移

本规范主要覆盖：

- 语义色与基础色
- 间距与尺寸刻度
- 字号与行高
- 圆角
- 阴影
- `z-index`
- `motion token`
- 主题切换
- 变量命名与分层

本规范不直接规定：

- 页面结构怎么排
- 组件如何拆分
- CSS 文件怎么组织
- class 命名策略

这些内容应由其他架构或编码规范继续约束。

---

## 3. 核心规则

### 3.1 先定义原子值，再定义语义值

- 设计令牌应至少分为两层
- 原子层描述真实数值，例如颜色、间距、字号、圆角、阴影、层级、动画时长
- 语义层描述用途，例如背景、文本、边框、强调、危险、弱化、浮层
- 业务代码优先消费语义层，不直接依赖原子层

建议示例：

```css
:root {
  --color-neutral-0: #ffffff;
  --color-neutral-900: #111827;
  --space-4: 16px;
  --font-size-14: 14px;
  --radius-md: 12px;
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.08);
  --z-modal: 1000;
  --motion-fast: 120ms;
}

[data-theme='light'] {
  --ui-bg-primary: var(--color-neutral-0);
  --ui-text-primary: var(--color-neutral-900);
}
```

### 3.2 语义色优先

- 语义色应表达用途，而不是单纯表达色相
- 推荐语义包括：
  - `bg`
  - `text`
  - `border`
  - `fill`
  - `accent`
  - `success`
  - `warning`
  - `danger`
  - `info`
- 同一个语义在不同主题下可以映射不同原子值，但语义名保持稳定
- 业务代码不要因为“浅色主题 / 深色主题”而直接写死颜色值

### 3.3 间距、字号、圆角、阴影应使用有限刻度

- 间距应使用固定刻度，不要在页面中随意扩散出大量小数值
- 字号应形成稳定层级，不要到处发明新字号
- 圆角应保持少量离散档位，避免同一产品出现很多近似圆角值
- 阴影应控制在可维护的少量层级，避免不同组件各写各的阴影表达

推荐做法：

- 间距使用统一的 4px 或 8px 刻度体系
- 字号、行高、圆角、阴影都按设计系统配置集中管理
- 业务代码只消费 token，不直接扩展新的视觉尺度

### 3.4 `z-index` 必须分层管理

- `z-index` 应有统一层级表
- 不要在组件中随意写大整数
- 应区分基础内容层、固定层、浮层、弹窗层、通知层、遮罩层
- 层级数量应尽量少，层级语义应清晰

推荐做法：

```css
:root {
  --z-base: 0;
  --z-sticky: 100;
  --z-dropdown: 300;
  --z-overlay: 500;
  --z-modal: 1000;
  --z-toast: 1100;
}
```

### 3.5 `motion token` 应显式定义

- 动画时长、缓动曲线、过渡节奏应集中管理
- 不要在组件中随意拼接动画时长
- 对于强调系统一致性的项目，应为进入、退出、悬停、反馈状态分别定义可复用的 motion token
- 如项目需要支持降低动态效果，应为 `prefers-reduced-motion` 预留退化路径

推荐示例：

```css
:root {
  --motion-fast: 120ms;
  --motion-normal: 180ms;
  --motion-slow: 240ms;
  --motion-ease-standard: cubic-bezier(0.2, 0, 0, 1);
  --motion-ease-emphasized: cubic-bezier(0.2, 0, 0, 1.2);
}
```

### 3.6 主题切换应以变量覆盖为主

- 主题切换优先采用属性切换或 class 切换，再通过变量覆盖实现
- 推荐在根节点或主题容器上声明主题标记，例如 `data-theme`
- 同一语义 token 在不同主题下只改变映射，不改变调用方式
- 不建议把主题逻辑散落在业务组件中

推荐示例：

```css
:root {
  --ui-bg-primary: #ffffff;
  --ui-bg-secondary: #f9fafb;
  --ui-text-primary: #111827;
}

[data-theme='dark'] {
  --ui-bg-primary: #111827;
  --ui-bg-secondary: #1f2937;
  --ui-text-primary: #f9fafb;
}
```

### 3.7 变量命名要稳定、分层、可推导

- 原子层变量应尽量体现“数值类型 + 尺度”
- 语义层变量应尽量体现“用途 + 场景”
- 命名应避免同义不同名、不同义同名
- 命名应避免过多缩写，除非该缩写已成为项目公共语义

推荐命名层次：

- 原子层：`--color-neutral-100`
- 语义层：`--ui-bg-primary`
- 组件别名层：`--button-bg-primary`

### 3.8 令牌消费优先于硬编码

- 页面和组件应优先消费 token
- 只有在系统级 token 尚未定义、且属于明确过渡场景时，才允许临时硬编码
- 临时硬编码必须有后续回收计划
- 一旦某个值在多个地方重复出现，就应优先抽成 token

---

## 4. 推荐示例

### 4.1 基础 token 与语义 token 分层

```css
:root {
  --color-neutral-0: #ffffff;
  --color-neutral-50: #f9fafb;
  --color-neutral-900: #111827;
  --color-brand-600: #2563eb;
  --color-danger-600: #dc2626;

  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;

  --font-size-12: 12px;
  --font-size-14: 14px;
  --font-size-16: 16px;

  --radius-sm: 4px;
  --radius-md: 12px;

  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.08);
  --shadow-md: 0 8px 24px rgb(0 0 0 / 0.12);

  --z-dropdown: 300;
  --z-modal: 1000;

  --motion-fast: 120ms;
  --motion-normal: 180ms;
}

[data-theme='light'] {
  --ui-bg-primary: var(--color-neutral-0);
  --ui-bg-secondary: var(--color-neutral-50);
  --ui-text-primary: var(--color-neutral-900);
  --ui-text-accent: var(--color-brand-600);
  --ui-text-danger: var(--color-danger-600);
}
```

### 4.2 组件消费示意

```css
.card {
  background: var(--ui-bg-primary);
  color: var(--ui-text-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--space-4);
  transition:
    background-color var(--motion-normal) var(--motion-ease-standard),
    color var(--motion-normal) var(--motion-ease-standard);
}
```

### 4.3 主题切换示意

```html
<div data-theme="dark">
  <!-- 页面内容 -->
</div>
```

主题切换后，业务代码仍然使用同一组语义 token：

- `--ui-bg-primary`
- `--ui-bg-secondary`
- `--ui-text-primary`
- `--ui-text-accent`

---

## 5. 禁止项 / 反例

- 在业务组件中直接散落写死颜色值、字号、间距、圆角或阴影
- 同一语义在不同地方使用不同命名
- 为每个页面单独发明一套 token
- 用过多细碎的 `z-index` 值解决层级问题
- 将主题切换逻辑写进每个组件内部
- 让 motion 只在个别组件里临时定义，导致全局不一致
- 把 token 当成 CSS 常量的简单堆叠，而不是可复用的系统语义

---

## 6. 例外说明

- 临时实验页面可以先硬编码，但进入正式体系后必须回收为 token
- 第三方组件库的固定样式不一定能完全被 token 化，但项目侧的包装层应尽量向 token 收敛
- 某些特殊动效或品牌活动页可能需要临时突破标准 token 范围，但必须显式标记，不可默认化

例外的前提是：

- 不破坏主题切换
- 不破坏 token 分层
- 不把临时值固化成默认模式

---

## 7. 执行建议

- 先定义原子 token，再定义语义 token
- 先确定主题切换入口，再确定变量覆盖关系
- 先收敛颜色、间距、字号，再逐步补圆角、阴影、`z-index`、motion token
- 让页面和组件优先消费语义 token，不要直接消费原子值
- 每新增一个新的视觉值，先问它是否应成为 token
- 任何“到处写同一个值”的情况，都应优先回收为 token
