---
title: TypeScript 代码书写规范
type: standard
code: FE-STD-002
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-04-29
scope: apps/*, packages/*
applies_to: human, ai-agent
---

# TypeScript 代码书写规范

## 1. 目标

统一项目中的 TypeScript 代码书写方式，确保类型表达清晰、接口边界明确、错误可控、可维护性稳定，并降低多人协作和 AI 生成代码时常见的类型漂移、断言滥用与隐式 `any` 问题。

---

## 2. 适用范围

本规范适用于：

- `apps/*` 下的前端业务代码
- `packages/*` 下的共享包、工具包、基础设施包
- 新增模块、重构模块、迁移模块、补类型、补测试时的 TypeScript 代码
- 人工编写与 AI 生成的 TypeScript 代码

本规范主要约束：

- 类型定义
- 函数签名
- 泛型使用
- 断言使用
- 类型导入导出
- 错误处理
- 可读性与一致性

---

## 3. 核心规则

### 3.1 类型优先

- 能通过类型系统表达的约束，不要留给运行时猜测
- 先定义输入输出，再写实现
- 公共函数、公共组件、公共 composable、共享工具必须显式声明类型
- 复杂对象优先拆出类型别名或接口，不要把结构塞进实现体里

### 3.2 严控 `any` 与 `unknown`

- `any` 默认禁止使用
- 只有在外部边界、历史遗留、第三方不稳定类型无法及时补齐时，才考虑局部使用
- 使用 `any` 时必须说明原因，并尽快收敛
- `unknown` 优先于 `any`，但 `unknown` 之后必须继续收窄，不能直接透传到业务层

### 3.3 `interface` 与 `type` 的取舍

- 对象结构、可扩展契约、公共数据形状，优先使用 `interface`
- 联合类型、交叉类型、条件类型、映射类型、工具类型组合，使用 `type`
- 不要为了个人偏好机械统一成一种写法
- 同一模块内应保持一致，避免同义类型一会儿 `interface` 一会儿 `type`

### 3.4 函数签名必须先行

- 函数参数、返回值、可选项、默认值都应在签名层表达清楚
- 公共函数不应依赖调用方“看实现猜用法”
- 参数过多时应优先考虑对象参数，而不是继续堆位置参数
- 可能返回空值、错误值、可选值时，必须在类型上明确体现

### 3.5 泛型要解决真实复用问题

- 只有当函数、组件、工具确实需要保留调用方类型时才使用泛型
- 泛型参数命名应有语义，不要滥用 `T`、`K`、`V` 之外的无意义字母
- 泛型层级不要过深，避免把简单逻辑写成类型谜题
- 泛型约束应尽量具体，避免“万能泛型”掩盖边界

### 3.6 断言要克制

- `as` 断言只用于类型系统暂时无法表达、但运行时已被明确保证的场景
- 断言不能替代校验
- `as unknown as X` 属于高风险写法，默认不推荐
- 断言一旦出现，应优先检查是否可以通过类型收窄、判定分支、泛型约束替代

### 3.7 类型导入导出要稳定

- 类型导入应使用 `import type`
- 只作为类型使用的导出，应明确为类型导出
- 不要让运行时导入和类型导入混在一起增加歧义
- 公共包的导出结构应尽量稳定，避免频繁改动影响下游

### 3.8 错误处理必须明确

- 错误路径不能只靠 `console.error`
- 可预期错误应显式建模，必要时返回 `Result` 风格结构或明确异常边界
- 不要把所有错误都吞掉
- 不要把所有错误都抛到最外层才处理
- 外部请求、解析、反序列化、边界输入等场景必须考虑错误分支

### 3.9 可读性优先于炫技

- 类型表达应服务于代码理解，而不是展示技巧
- 一行写不清时，优先拆分中间变量和类型别名
- 复杂条件类型、深层嵌套泛型、过度压缩的函数签名都应谨慎使用
- 对多人协作和 AI 协作来说，显式、平直、可扫描的代码优先级更高

### 3.10 配置与工具链文件默认优先 TypeScript + ESM

- 在支持的前提下，新增或迁移配置文件、工具链文件时，默认优先使用 `.ts`
- 当仓库已启用 ESM（如 `package.json` 存在 `"type": "module"`）时，若工具支持 ESM 但不支持 TypeScript，优先退回 `.js` / `.mjs`
- 只有在工具明确不支持 ESM 时，才允许使用 `.cjs`
- 不要因为仓库里已有历史 `.cjs` / `.js` 文件，就默认沿用旧格式
- 修改配置文件前，应先确认工具支持矩阵，再决定最终文件后缀

适用对象包括但不限于：

- `commitlint`
- `vite` / `vitest`
- 脚本配置
- 工程工具配置

---

## 4. 推荐示例

### 4.1 显式函数签名

```ts
type UserId = string;

interface UserProfile {
  id: UserId;
  name: string;
  age?: number;
}

function formatUserName(user: UserProfile): string {
  return `${user.name} (${user.id})`;
}
```

### 4.2 用 `unknown` 收窄输入

```ts
function isUserProfile(value: unknown): value is UserProfile {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;
  return typeof candidate.id === 'string' && typeof candidate.name === 'string';
}
```

### 4.3 `interface` 与 `type` 分工

```ts
interface BaseRequest {
  requestId: string;
}

type ResponseState = 'idle' | 'loading' | 'success' | 'error';
type ResponseData<T> = BaseRequest & {
  state: ResponseState;
  data?: T;
};
```

### 4.4 类型导入

```ts
import type { UserProfile } from './types';

export function normalizeUser(user: UserProfile): UserProfile {
  return {
    ...user,
    name: user.name.trim(),
  };
}
```

### 4.5 错误边界显式化

```ts
type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

function parseJson(text: string): ParseResult<unknown> {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch {
    return { ok: false, error: 'Invalid JSON' };
  }
}
```

---

## 5. 禁止项 / 反例

- 不要让公共函数返回隐式 `any`
- 不要把 `any` 当作跳过类型设计的快捷方式
- 不要用断言掩盖空值、错值、错类型
- 不要把复杂对象参数拆成一长串位置参数
- 不要在同一模块里混用多种无意义的类型命名风格
- 不要把类型系统写成只有作者自己能看懂的谜题
- 不要把错误路径完全藏起来
- 不要把类型导入和运行时导入混成一团

---

## 6. 例外说明

- 历史遗留代码可分阶段收敛，不要求一次性改完
- 第三方库类型不完整时，可在局部使用断言或补充声明文件
- 对外部系统返回的非稳定数据，允许先用 `unknown` 进入边界，再逐层收窄
- 性能敏感且类型开销显著的极端场景，可在确保边界清楚的前提下适度简化类型表达

例外的前提是：

- 不能破坏核心可读性
- 不能让问题继续外溢
- 不能把临时例外变成默认写法

---

## 7. 执行建议

- 新增公共能力前先写类型，再写实现
- 每次出现 `any`、`as`、复杂泛型时先自查是否真的必要
- 提交前检查导入方式、返回值、错误路径和可读性
- 对共享包中的类型改动，优先考虑下游兼容性
- 如果某段 TypeScript 代码需要反复解释，通常说明类型边界还不够清晰

一句话原则：

**TypeScript 的目标不是“把代码写过编译”，而是把边界、错误和可读性都写清楚。**
