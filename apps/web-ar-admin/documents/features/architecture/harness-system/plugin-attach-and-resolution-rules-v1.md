---
title: Harness plugin attach / resolution 规则 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-02
updated: 2026-04-02
related_decisions: phase-hook-plugin-contract-v1, plugin-registry-and-manifest-model-v1, config-model-v1, runtime-and-config-schema-v1
---

# Harness plugin attach / resolution 规则 V1

## 1. 目标

本文档用于把 Harness 当前已经形成的：

- `plugin contract`
- `plugin manifest`
- `plugin registry`
- `project config`

继续收敛成一套可被后续装配、运行与调试统一消费的：

- `attach`
- `resolution`

规则模型。

本文档回答的问题是：

- plugin 什么时候算被挂上
- plugin 先看 contract、manifest、registry 还是 config
- 多个 plugin 同时命中同一 phase / hook 时如何决议
- `required / optional / replaceable` 在解析时如何生效
- plugin 挂载失败时主链路如何处理

## 2. 设计原则

### 2.1 attach 和 resolution 必须分离

V1 必须区分：

- `attach`
  - 某个 plugin 是否被允许挂到当前 phase / hook
- `resolution`
  - 当多个 plugin 同时可挂时，系统如何决定最终生效顺序与阻断关系

如果两者不分开，后续会出现：

- plugin 虽然存在，但不知道何时真正参与链路
- registry 顺序和 phase / hook 适配关系混在一起
- required plugin 失败时无法解释为什么主链路被阻断

### 2.2 resolution 只解决装配，不替代 plugin 行为本体

resolution 只负责回答：

- 哪些 plugin 生效
- 顺序如何
- 冲突如何处理
- 失败时如何升级

它不负责回答：

- plugin 具体怎样执行
- plugin 内部如何调用 method / tactic
- plugin 内部如何写 runtime 细节

### 2.3 V1 先做确定性规则，不做动态调度器

当前阶段不做：

- 基于运行效果的动态重排
- 自动评分式 plugin 选择
- 多版本 plugin 并存竞争
- 复杂依赖图求解

V1 只做：

- 稳定
- 可解释
- 可被文档、skill 和 runtime 一致引用

## 3. attach 的定义

### 3.1 attach 的含义

在 Harness V1 中，某个 plugin 被视为已 attach，至少要同时满足：

1. 该 plugin 在项目级 registry 中可发现
2. 该 plugin 的 manifest 可读取
3. 该 plugin 在 project config 中未被禁用
4. 当前 phase / hook 命中其 `attached_phases / attached_hooks`
5. 当前任务未命中会排除该 plugin 的 runtime override

只有同时满足以上条件，plugin 才进入可解析集合。

### 3.2 attach 不等于执行

plugin attach 只表示：

- 它有资格参与当前 phase / hook

不表示：

- 它一定已经执行
- 它一定已经写 runtime
- 它一定已经改变主链路结果

## 4. attach 的输入层级

V1 推荐按以下层级看 plugin attach 条件：

1. `plugin contract`
2. `plugin manifest`
3. `plugin registry`
4. `project config`
5. `task runtime overrides`

### 4.1 `plugin contract`

负责定义能力边界：

- 这个 plugin 至少应声明什么
- 它理论上可接哪些 phase / hook

它不负责项目是否启用。

### 4.2 `plugin manifest`

负责定义单个 plugin 的默认自我声明：

- 默认 attached phase / hook
- 默认 role
- 默认 reads / writes
- 默认 failure policy

### 4.3 `plugin registry`

负责定义项目是否能发现这个 plugin：

- 它是否存在于当前项目
- 默认 enabled / order / required 是什么

### 4.4 `project config`

负责项目实际装配：

- 是否启用
- 是否覆盖默认顺序
- 是否覆盖某些 attach 行为

### 4.5 `task runtime overrides`

负责当前任务的临时收紧或放宽。

例如：

- 当前任务禁用某个 diagnostics plugin
- 当前任务强制 single-agent，不允许 attach multi-agent orchestration enhancer
- 当前任务开启 protected mode，某些 plugin 只保留只读角色

## 5. resolution 的目标

当多个 plugin 同时 attach 到相同 phase / hook 时，resolution 负责回答：

- 哪个先执行
- 哪个后执行
- 谁是 owner
- 谁是 enhancer
- 谁只能作为 observer / writer / verifier
- 谁失败会阻断

## 6. resolution 规则 V1

### 6.1 先按 role 分组

V1 推荐先按角色分组，再按顺序解析。

建议角色优先理解为：

- `phase-owner`
- `phase-enhancer`
- `runtime-writer`
- `verifier`
- `diagnostics-provider`

### 6.2 同一 phase 原则上最多一个 owner

对于同一 phase：

- 原则上只能有 1 个 `phase-owner`

例如：

- `planning` 的 owner 通常应只有 1 个
- `execution` 的 owner 通常应只有 1 个

如果 registry / config 解析后出现多个 owner：

- 视为 attach 冲突
- 不得静默共存
- 必须进入明确冲突结论

### 6.3 enhancer 可多个，但不能覆盖 owner

多个 `phase-enhancer` 可以同时存在，但它们的职责是：

- 补充
- 建议
- 增强

而不是：

- 覆盖 owner 的出口定义
- 私自改 phase 的完成条件

### 6.4 runtime-writer 只能写合同内对象

多个 `runtime-writer` 可以同时挂载，但必须满足：

- 写入对象不冲突
- 或虽然写同一对象，但字段责任已被合同显式切开

若两个 writer 对同一字段拥有重叠写权限：

- 视为写冲突
- V1 不允许靠“最后写入覆盖”解决

### 6.5 verifier 不应反向改写 execution owner 结论

`verifier` 的职责是：

- 形成验证输出
- 触发 blocked / fail / pass 结论

但不应在 V1 中直接覆盖：

- execution owner 的执行结果描述

它只能在验证层追加判断。

## 7. 顺序决议规则

### 7.1 决议顺序

V1 建议按以下顺序决议：

1. `task runtime overrides`
2. `project config`
3. `plugin registry order`
4. `manifest default_order`
5. `kernel default order`

也就是：

- 当前任务临时策略优先
- 项目明确配置次之
- registry 是项目默认发现顺序
- manifest 只是 plugin 自报默认顺序
- kernel 默认值兜底

### 7.2 `required` 优先于 `optional`

当 required plugin 不满足 attach 条件时：

- 不能静默降级为 optional
- 应明确触发阻断或警告，按 `failure_policy` 处理

### 7.3 replaceable 只表示可被替换，不表示自动替换

若某类 owner 标记为 `replaceable`，表示：

- 项目可以换另一个 owner 进来

不表示：

- 运行时自动比较后替换
- 多个 owner 自动选最优

V1 中替换必须通过 config / registry 明确发生。

## 8. attach 冲突类型

V1 至少应识别以下冲突：

### 8.1 owner 冲突

同一 phase / hook 同时出现多个 owner。

### 8.2 写入冲突

多个 runtime-writer 写同一对象同一字段。

### 8.3 顺序冲突

多个 plugin 都要求优先，且 config / registry 未给出可解释顺序。

### 8.4 策略冲突

例如：

- 一个 plugin 要求自动推进
- 另一个 plugin 要求进入 blocked

且当前 phase 无 owner 统一收口。

### 8.5 受保护模式冲突

例如：

- task runtime override 开启 `protected_mode`
- 某 plugin 仍声明自己可写受保护对象

此时应以当前任务保护策略为准，plugin attach 应降级或直接失败。

## 9. failure policy 解析规则

### 9.1 `block`

表示：

- plugin attach / resolution 失败时阻断当前 phase 进入或退出

适合：

- `phase-owner`
- 关键 `runtime-writer`
- 关键 `verifier`

### 9.2 `warn`

表示：

- plugin 失败不阻断主链路
- 但必须记录 warning 结论

适合：

- 辅助 enhancer
- 次要 diagnostics provider

### 9.3 `ignore`

表示：

- plugin attach 失败可直接跳过
- 但 V1 仍建议保留最小事件记录

适合：

- 纯补充型能力
- 可选推荐能力

## 10. 与 runtime 的关系

attach / resolution 规则本身不等于 runtime，但应在 runtime 中留下最小可见性。

V1 至少建议可表达：

- 当前 phase 附着了哪些 plugin
- 当前 owner 是谁
- 当前哪些 plugin 被 skip
- 当前是否出现 attach / resolution warning

这些信息建议承接在：

- `current-task.yaml`
- 或后续独立的 plugin resolution 视图对象

当前阶段不要求单独新增复杂 runtime 文件。

## 11. 与 diagnostics 的关系

diagnostics 子系统在 V1 中应能消费 attach / resolution 结论，用于解释：

- 某个 plugin 为什么没被挂上
- 某个 plugin 为什么被降级
- 为什么主链路被阻断
- 为什么当前 phase 的 owner 不是预期中的那个 plugin

也就是说：

- diagnostics 不参与 resolution
- 但应能读取 resolution 结果

## 12. V1 推荐最小 attach / resolution 流程

推荐按以下顺序理解：

1. 读取 kernel defaults
2. 读取 project config
3. 读取 plugin registry
4. 读取相关 plugin manifest
5. 应用 task runtime overrides
6. 形成 attach 集合
7. 按 role 和 order 做 resolution
8. 形成最终 owner / enhancer / writer / verifier 清单
9. 将结果暴露给 phase 执行层与 runtime

## 13. 当前阶段明确不包含

V1 明确不包含：

- 自动评分式 plugin 选择
- 运行时动态重排 plugin 顺序
- 多版本 plugin 竞争
- 复杂依赖图求解
- 跨项目中心化 registry
- 远程 marketplace attach

## 14. 总结

Harness plugin attach / resolution 规则 V1 的核心结论是：

- `attach` 回答“谁有资格参与当前 phase / hook”
- `resolution` 回答“最终谁生效、顺序如何、谁负责阻断”
- 解析顺序以：
  - task overrides
  - project config
  - registry
  - manifest
  - kernel defaults为主
- 同一 phase 原则上只能有一个 owner
- enhancer、writer、verifier 可以并存，但必须遵守边界与冲突规则
- 当前阶段先做可解释、可配置、可诊断的最小规则，不进入动态调度器复杂度
