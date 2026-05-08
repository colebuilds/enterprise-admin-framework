---
name: module-permission-onboarding-sop
description: 用于在当前仓库按既定 SOP 处理单个模块或页面的权限码接入、核对与修复，特别适合用户提到权限、authCode、菜单树、v-permission、hasPermission、操作列、Tab、按钮权限、页面权限、权限遗漏、权限未接线等场景。
keywords: permission, 权限, authCode, 菜单树, menuType, v-permission, hasPermission, auth, 操作列, 按钮权限, 页面权限, Tab权限, 权限遗漏, 权限核对, 模块权限接入, 页面权限接入, module-permission-onboarding-sop
---

# Module Permission Onboarding SOP

## 目标

- 为当前仓库提供“单个模块 / 页面权限码接入与核对”的稳定执行口径。
- 把“接口层已有权限码，但前端未消费 / 用错 / 消费不完整”的问题收束到一次可复用的 skill 中。
- 强制把“真实权限树数据是否就绪”放在执行前置门槛，而不是允许缺数据时继续降级排查。

## 适用场景

- 用户要求排查一个页面或模块的权限问题。
- 用户提到 `权限`、`authCode`、`菜单树`、`menuType`、`v-permission`、`hasPermission`、`auth`。
- 用户希望先盘点“这个模块 / 页面有哪些权限码”，再检查“这些权限码是否在页面里对应上”。
- 用户希望处理的是单个模块或页面下的权限码接入问题，而不是整站权限架构设计。
- 用户明确提到“有权限码，但是权限码没有对应上”。
- 用户怀疑“UI 已经隐藏，但接口还在请求”或“数据权限与展示权限没联动”。

不优先用于：

- 纯后端授权逻辑排查，但不涉及前端权限消费。
- 只改一个明确缺失的按钮权限，且不需要做模块级盘点。
- 与权限无关的普通页面开发。

## 输入要求

- 至少给出一个真实目标：
  - 模块目录路径，例如 `src/views/finance/withdrawOrder/dashboard`
  - 或页面文件路径，例如 `src/views/finance/withdrawOrder/index.vue`
- 必须具备至少一项真实权限源数据获取条件：
  - 一份真实权限树返回体（`menus/authCode/menuType/children`）
  - 或可用 `token`，可据此拉到目标账号的真实权限树
  - 或可登录的账号 / 密码 / 环境信息，可据此拿到真实权限树
- 后台角色勾选截图、期望行为与异常描述只作为辅助证据，不能替代真实权限树数据。
- 如果用户没有给路径，但上下文能明确模块，也可以继续。
- 如果没有真实权限树数据，也拿不到可用 `token` 或账号 / 密码，则本 SOP 必须中断，不允许降级成静态预审继续执行。

## 执行步骤

1. 先读取正式规则源：
   - `AGENTS.md`
   - `documents/guides/development/权限接入与模块核对SOP.md`
   - `docs/page-development-guide.md`
   - 与当前模块最接近的正式规范或历史文档
2. 先检查真实权限树数据是否就绪：
   - 若已拿到真实 `menus/authCode/menuType/children`，继续
   - 若只拿到 `token` 或账号 / 密码 / 环境信息，先补抓真实权限树，再继续
   - 若三者都没有，立即中断，并明确提示用户补以下其一：
     - 真实权限树返回体
     - 可用 `token`
     - 可登录账号 / 密码 / 环境信息
3. 明确本次目标：
   - 只做权限盘点
   - 盘点后给修复建议
   - 直接实施修复
   - 只生成提示词 / SOP
4. 建立模块权限源头地图，至少覆盖：
   - 用户权限注入：`src/store/modules/user.ts`
   - 路由过滤：`src/router/generator.ts`
   - 路由守卫：`src/router/guards.ts`
   - 权限 hook：`src/hooks/web/usePermission.ts`
   - 权限指令：`src/directives/permission.ts`
5. 基于真实权限树盘点权限码来源：
   - 梳理“接口层 / 权限树层”已有权限码
   - 明确 `menuType === 1/2/3` 的层级语义
   - 区分页面入口权限、查询列表权限、操作权限、导出 / 日志 / 详情 / 批量操作等子权限
6. 盘点“页面层实际交互点”，至少覆盖：
   - 路由入口 / 顶层 tab
   - 查询、重置、刷新
   - 普通按钮
   - 表格操作列
   - 批量操作
   - 开关类组件
   - 弹窗入口与弹窗内操作
   - 卡片点击、二级 tab、动态下拉项
   - handler 内的高风险动作
   - `onMounted`、`watch`、轮询、预加载、默认查询、上下文初始化等自动数据请求入口
7. 为每个交互点建立“权限码 -> 消费方式 -> 期望行为”的映射，优先按以下口径判断：
   - 路由 / 页面入口：`meta.permissions`
   - 静态按钮：`v-permission`
   - 动态区块 / tab / layout：`hasPermission`
   - 表格行操作：`auth`
   - 批量操作：`batchActions.auth`
   - 组件内禁用态：`permission` prop
   - 高风险动作：handler 二次权限兜底
   - 自动数据请求：同一权限条件下的 `request`、`loadData`、`onMounted`、`watch`、轮询、预加载是否同步收口
8. 把问题归类为以下几种，而不是笼统说“权限有问题”：
   - 有权限码，但前端完全未消费
   - 有消费，但用错层级（把 `GetPageList` 当成 `操作`）
   - 页面只消费了一部分（例如 tab 可见，但按钮没控）
   - UI 做了隐藏 / 禁用，但 handler 没做兜底
   - UI 已做权限控制，但数据请求、预加载、自动刷新仍然越权触发
   - 前端使用了不存在或过时的权限码
   - 同模块内不同页面权限口径不一致
9. 如果进入修复，优先遵守以下原则：
   - 页面可见性和操作可用性分层处理，不混用一个权限码兜所有场景
   - 能用声明式入口（`v-permission` / `auth` / `permission`）时，优先不用散落的 `v-if`
   - 动态结构（tab、行操作、批量操作）要在数据构造阶段过滤，不要等到渲染后再补
   - 高风险操作只做 UI 隐藏不够，要在 handler 再校一次权限
   - 不因为当前页面能进，就默认页面内所有按钮都该显示
   - UI 隐藏 / 禁用和数据请求控制必须同源；如果某块 UI 不可见，对应的初始化请求、轮询、自动刷新、跨 tab 预加载也要同步拦住
10. 完成后至少回报：

- 本次真实权限树数据来源（返回体 / token 拉取 / 账号登录获取）
- 模块权限码清单
- 页面交互点清单
- 问题分类结果
- 建议修复方式
- 如已实施，说明改动文件、验证结果和剩余风险

## 风险与禁止项

- 不要在没有真实权限树数据时继续做权限接入或权限问题定性。
- 不要把后台角色勾选截图当成真实权限树的替代品。
- 不要只根据权限名字面猜语义，优先对照真实权限树或真实账号拉取结果。
- 不要把 `GetPageList`、`查询列表`、`操作`、`导出`、`日志` 混成一个权限层。
- 不要只搜 `v-permission` 就声称完成排查；`hasPermission`、`auth`、`permission`、handler 兜底都要看。
- 不要只确认“按钮不显示了”；还要检查无权限时 `onMounted`、`watch`、轮询、预加载是否仍在请求接口。
- 不要只修截图暴露的问题，漏掉同模块其他 tab / 弹窗 / 批量操作的同类缺口。
- 不要顺手重构无关业务逻辑。

## 输出要求

- 如果真实权限树数据未就绪：
  - 直接说明当前中断
  - 明确缺少的是返回体、可用 `token`，还是账号 / 密码 / 环境信息
  - 明确告知用户补齐后才能继续本 SOP
- 如果用户要盘点：
  - 优先给模块权限清单与消费映射表
  - 明确哪些是已接、已确认漏接、已确认错接、已确认部分接
  - 明确是否存在“UI 权限与数据请求权限不同步”
- 如果用户要实施：
  - 先给受影响文件和修复策略，再开始改动
  - 结束后回报验证结果、剩余风险、推荐烟测路径
- 如果用户要沉淀 SOP：
  - 优先输出稳定检查步骤、问题分类、推荐处理方式
  - 说明这套 SOP 适合什么模块、输入最少需要什么
  - 长期正式文档默认落到 `documents/guides/development/`
  - 单次模块排查记录、临时执行清单默认落到 `/.local-work/`

## 关联

- `documents/guides/development/权限接入与模块核对SOP.md`
- `AGENTS.md`
- `docs/page-development-guide.md`
- `src/store/modules/user.ts`
- `src/router/generator.ts`
- `src/router/guards.ts`
- `src/hooks/web/usePermission.ts`
- `src/directives/permission.ts`
- `src/components/Table/src/createActionColumn.ts`
- `src/components/Table/src/components/TableAction.vue`
- `src/components/ProComponents/ProCrudTable/ProCrudTable.vue`
- `src/components/ConfirmSwitch/index.vue`
