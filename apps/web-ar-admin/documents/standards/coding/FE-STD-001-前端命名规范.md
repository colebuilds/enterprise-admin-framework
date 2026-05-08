---
title: 前端命名规范
type: standard
code: FE-STD-001
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-03-26
scope: apps/*, packages/*
applies_to: human, ai-agent
---

# 前端命名规范

## 1. 目标

统一项目中的前端命名方式，减少“同一概念多种叫法”“缩写失真”“文件名难检索”“变量语义不清”的问题，让命名同时满足可读、可查、可维护、可复用。

## 2. 适用范围

本规范适用于：

- `apps/*` 下所有前端业务代码
- `packages/*` 下所有共享包、工具包、基础设施包
- 页面、组件、组合式函数、工具函数、常量、类型、枚举、路由、状态字段命名
- 文件名、目录名、变量名、函数名、组件名、composable 名称、props / emits / slot 名称

本规范主要覆盖：

- 文件与目录命名
- 变量与常量命名
- 函数与方法命名
- 组件命名
- composable 命名
- 类型、接口、枚举命名
- 布尔值命名

## 3. 核心规则

### 3.1 先表达语义，再考虑简短

命名应优先表达清晰语义，避免为了短而失真。

### 3.2 同一概念统一叫法

同一领域概念应在项目中保持统一，例如：

- `userId` 不应与 `uid`、`memberId` 混用
- `isLoading` 不应与 `loading`、`hasLoading` 混用
- `fetchUserList` 不应与 `getUsers`、`loadUserList` 交替使用

### 3.3 文件名应服务于检索

文件名应能让人和 AI 通过目录快速判断内容，不应只靠打开文件才能理解。

### 3.4 布尔值要带语义前缀

布尔值命名应尽量使用：

- `is...`
- `has...`
- `can...`
- `should...`
- `need...`

避免使用无前缀的抽象布尔名。

### 3.5 组件名必须可区分

组件名应具有稳定、明确的业务或职责语义，避免 `A`、`Base1`、`CommonThing` 这类弱语义命名。

### 3.6 composable 命名要体现“能力”

composable 名称应体现它提供的能力或状态，而不是简单复制内部实现细节。

### 3.7 类型命名要稳定

类型、接口、枚举应体现“是什么”，不要和运行时函数名混淆。

类型定义方式、`interface` 与 `type` 的取舍，应进一步遵守：

- `FE-STD-002-TypeScript-代码书写规范.md`

### 3.8 缩写要可解释

除业内稳定缩写外，不应随意制造难以理解的缩写。

## 4. 推荐示例

### 4.1 文件与目录

推荐：

- `user-profile.ts`
- `order-list.vue`
- `use-user-auth.ts`
- `components/`
- `composables/`

不推荐：

- `a.ts`
- `tmp2.vue`
- `new.js`
- `test1/`

### 4.2 变量与常量

推荐：

```ts
const isLoading = ref(false);
const userName = computed(() => profile.value.name);
const DEFAULT_PAGE_SIZE = 20;
```

不推荐：

```ts
const loadingFlag = ref(false);
const name1 = computed(() => profile.value.name);
const dps = 20;
```

### 4.3 函数

推荐：

```ts
function formatCurrency(amount: number) {}
function fetchUserProfile(userId: string) {}
function resolveRouteTitle(routeName: string) {}
```

不推荐：

```ts
function doIt() {}
function getData1() {}
function handleThing() {}
```

### 4.4 组件

推荐：

- `UserProfileCard`
- `OrderStatusBadge`
- `NavigationMenu`

不推荐：

- `Card1`
- `CommonHeader2`
- `box`

### 4.5 composable

推荐：

- `useUserProfile`
- `useThemeSwitch`
- `usePagination`

不推荐：

- `userProfileComposable`
- `doFetch`
- `logic1`

### 4.6 类型、接口、枚举

推荐：

```ts
interface UserProfile {}
type PageStatus = 'idle' | 'loading' | 'success' | 'error';
enum OrderType {
  Online = 'online',
  Offline = 'offline',
}
```

不推荐：

```ts
interface IUserProfile {}
type dataType = any;
enum statusEnum {}
```

## 5. 禁止项与反例

### 5.1 禁止模糊命名

以下命名应避免：

- `data`
- `list`
- `obj`
- `item`
- `temp`
- `foo`
- `bar`

除非上下文足够明确，否则这些命名会降低可读性。

### 5.2 禁止语义漂移

不要让一个名字在不同模块里代表不同含义。

### 5.3 禁止过度缩写

不要使用只有自己能看懂的缩写。

### 5.4 禁止混用中英文和多套风格

同一仓库内不要同时出现：

- `get_user_info`
- `getUserInfo`
- `GetUserInfo`

应按项目约定保持统一。

### 5.5 禁止功能名和实现细节混写

命名应表达职责，不应把实现细节塞进名字里。

例如：

- `useFetchUserList` 优先于 `useAxiosUserList`
- `formatDate` 优先于 `dayjsFormatDate`
- `resolveUserRole` 优先于 `userRoleHandler`

## 6. 例外说明

以下情况可以适度放宽：

- 外部协议、第三方 API、历史遗留接口名称必须保留
- 类型声明需要对齐后端返回字段时，可在适配层做映射
- 领域术语本身就是短缩写，且团队已明确统一含义

放宽时应遵守：

- 在边界层做映射
- 不把异常命名继续扩散到全局
- 只在必要范围内保留例外

## 7. 执行建议

- 新增文件前先确定文件职责，再定文件名
- 新增组件前先确定业务语义，再定组件名
- 新增 composable 前先确定它提供的能力，再定 `use...` 名称
- 提交前检查命名是否和现有同类文件一致
- 若发现历史命名不一致，优先在局部收敛，不要一口气全仓重命名
- 若命名影响可读性、可检索性或协作效率，应优先修正
