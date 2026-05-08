---
title: Composables 架构与编码规范
type: standard
code: FE-STD-004
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-03-26
scope: apps/*, packages/*
applies_to: human, ai-agent
---

# Composables 架构与编码规范

## 1. 目标

统一项目中 composables 的设计方式、命名方式、拆分粒度与测试要求，避免 composables 变成“把所有逻辑往里塞”的黑盒工具。

本规范的目标是让 composables 具备：

- 清晰职责
- 明确输入输出
- 可控副作用
- 稳定状态边界
- 良好可测试性

本文档聚焦逻辑封装、状态组织与副作用管理；涉及 SFC 组件本身的 `props` / `emits` / `template` / `slot` / 样式结构时，应进一步遵守：

- `FE-STD-003-Vue3-SFC-组件书写规范.md`

---

## 2. 适用范围

本规范适用于：

- `apps/*` 中的页面、组件、业务逻辑 composables
- `packages/*` 中的共享 composables
- 与 Vue3 相关的状态封装、行为封装、数据组织逻辑

常见场景包括：

- 数据拉取与缓存
- 表单状态管理
- 列表筛选、分页、排序
- UI 交互状态封装
- 计时器、节流、防抖
- 依赖注入后的领域逻辑封装

不适用于：

- 单纯的工具函数
- 与 Vue 生命周期无关的纯算法
- 明显应归入 service、api、utils 的逻辑

---

## 3. 核心规则

### 3.1 职责边界清晰

一个 composable 应优先只解决一类问题。

推荐职责：

- 封装一组相关状态
- 封装一段可复用行为
- 封装一条完整交互链路

不推荐职责：

- 同时负责数据请求、视图渲染、路由跳转、权限判断和全局通知
- 把多个互不相关业务硬塞进一个 `useXxx`

### 3.2 输入输出显式

composable 的输入应尽量显式化，避免依赖隐式全局状态。

推荐：

- 参数对象明确
- 返回值结构明确
- 事件或回调契约明确

示例：

```ts
type UseSearchOptions = {
  initialKeyword?: string;
  onSearch?: (keyword: string) => void;
};

export function useSearch(options: UseSearchOptions = {}) {
  const keyword = ref(options.initialKeyword ?? '');
  const submit = () => options.onSearch?.(keyword.value);

  return {
    keyword,
    submit,
  };
}
```

### 3.3 状态封装要克制

composable 可以封装状态，但不要把状态边界无限扩张。

推荐：

- 只暴露调用方真正需要的状态
- 将内部临时状态隐藏在 composable 内部
- 把派生状态用 `computed` 统一输出

不推荐：

- 把所有中间变量都返回给调用方
- 让外部组件直接操纵 composable 的内部实现细节

### 3.4 副作用要可控

副作用包括：

- 请求
- 定时器
- 事件监听
- 路由跳转
- 本地存储
- DOM 交互

规则要求：

- 副作用应集中在边界明确的地方
- 能注入的依赖尽量注入，不要直接硬编码
- 能延迟执行的副作用不要在创建时立刻触发

推荐把副作用拆成：

- 可配置的输入
- 可调用的 action
- 可回收的 cleanup

### 3.5 依赖注入优先于硬耦合

如果 composable 依赖外部能力，优先通过参数注入。

推荐注入项：

- API client
- storage adapter
- logger
- clock
- event bus
- router 适配层

这样可以让 composable 更容易测试，也更容易在不同环境复用。

### 3.6 命名要表达意图

composable 命名推荐以 `use` 开头，并表达“做什么”而不是“怎么做”。

推荐：

- `useSearch`
- `usePagination`
- `useCountdown`
- `useUserProfile`
- `useFormState`

不推荐：

- `useCommon`
- `useHelper`
- `useUtil`
- `useData1`
- `useNewLogic`

### 3.7 拆分粒度要稳定

一个 composable 太大时，应按职责拆分，不按文件数机械拆。

拆分信号：

- 输入输出开始变多
- 内部状态开始互相干扰
- 一个 composable 同时承担多个生命周期场景
- 测试难以稳定编写

拆分原则：

- 先按业务职责拆
- 再按副作用边界拆
- 再按可复用程度拆

### 3.8 可测试性是硬要求

composable 的设计应天然支持测试。

要求：

- 核心行为可在单元测试中验证
- 外部依赖可替换
- 副作用可被 mock
- 返回值和状态变化可稳定断言

如果一个 composable 难以测试，通常说明：

- 职责过多
- 副作用过散
- 依赖耦合过重

---

## 4. 推荐示例

### 4.1 推荐写法

```ts
export function useCountdown(duration: number, onDone?: () => void) {
  const remaining = ref(duration);
  const running = ref(false);

  let timer: ReturnType<typeof setInterval> | undefined;

  const stop = () => {
    running.value = false;
    if (timer) clearInterval(timer);
  };

  const start = () => {
    if (running.value) return;
    running.value = true;
    timer = setInterval(() => {
      if (remaining.value <= 1) {
        stop();
        remaining.value = 0;
        onDone?.();
        return;
      }
      remaining.value -= 1;
    }, 1000);
  };

  return {
    remaining,
    running,
    start,
    stop,
  };
}
```

这个示例的特点是：

- 输入明确
- 状态清晰
- 副作用集中
- 行为可测试

### 4.2 依赖注入示例

```ts
type Clock = {
  now: () => number;
};

export function useLastUpdated(clock: Clock) {
  const updatedAt = ref(clock.now());

  const refresh = () => {
    updatedAt.value = clock.now();
  };

  return {
    updatedAt,
    refresh,
  };
}
```

这个写法比直接在 composable 内部调用 `Date.now()` 更易测试。

---

## 5. 禁止项 / 反例

以下做法应避免：

- 一个 composable 同时负责请求、缓存、路由和 UI 提示
- 依赖大量隐式全局状态
- 返回过多内部中间值
- 把副作用散落在多个生命周期钩子里
- 命名无法表达职责
- 为了复用而复用，把无关逻辑硬拆成 composable

反例：

```ts
export function useEverything() {
  // 不推荐：职责过多，难以测试，难以复用
}
```

---

## 6. 例外说明

- 很小且只服务单一页面的 composable，可以适度简化，但仍要保持输入输出清晰
- 如果逻辑本质是纯工具函数，不要为了形式上的复用强行写成 composable
- 如果副作用极重且与领域耦合强，应考虑先拆 service，再由 composable 只做 UI 状态适配

---

## 7. 执行建议

当你准备新增 composable 时，先自问这几个问题：

- 它只解决一类问题吗
- 输入和输出清楚吗
- 副作用能否收敛
- 外部依赖是否可注入
- 是否容易写测试

如果答案有明显否定项，先拆职责，再落代码。
