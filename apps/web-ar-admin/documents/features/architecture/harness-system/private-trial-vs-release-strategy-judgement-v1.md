---
title: Harness private trial 与更高层发布策略评估判断 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-04
updated: 2026-04-04
related_decisions: release-prep-final-closure-judgement-v1, release-prep-readiness-judgement-after-boundary-freeze-v1, package-export-landing-readiness-judgement-v1
---

# Harness private trial 与更高层发布策略评估判断 V1

## 1. 目标

本文档用于回答当前 Harness 在完成：

- frozen trial scope
- `trial-scope release prep`

之后的更高层问题：

- 当前是否应继续停留在 `private / in-repo trial`
- 还是已经值得进入更高层发布策略评估

这里的“进入更高层发布策略评估”指的是：

- 开始评估 Harness 是否值得继续向 publish-ready 方向推进
- 开始评估未来的发布目标、发布范围与发布前置条件

它不等于：

- 立即进入真实发布
- 去掉 `private`
- 立即开始 publish 实施

## 2. 最终结论

当前明确结论是：

- **当前实现状态已经值得进入更高层发布策略评估**

但必须同时保留一个现实边界：

- **在新的发布策略结论形成之前，当前 package 仍应继续保持 `private / in-repo trial`**

更准确地说，当前状态应判断为：

1. `private-trial-stable`
2. `trial-scope-release-prep-closed`
3. `release-strategy-assessment-worthy`
4. `not publish-ready`

这意味着：

- 当前不应继续无限期停留在“只做 trial 边界收口”的层级
- 但当前也不应跳过策略判断直接进入 publish 语义

## 3. 为什么当前值得进入更高层发布策略评估

## 3.1 内核已经不再只是架构草图

当前 Harness 已经具备：

- runtime state 内核
- phase contract 全覆盖
- phase transition 统一语义
- plugin registry / manifest / assembly / resolution
- diagnostics domain 多轮收口
- host boundary

这意味着当前不是“规则想法”，而是：

- 已有真实对象层
- 已有真实模块边界
- 已有真实运行主链

## 3.2 package trial 已经形成真实包边界

当前 `packages/harness/` 已经具备：

- 最小 `exports`
- 最小 `build`
- 第一轮 `dist`
- frozen public API
- frozen trial 元数据边界

这意味着当前 package 也不再只是：

- 目录试拆

而是已经进入：

- 可消费的 in-repo private package

## 3.3 trial-scope release prep 已经完整收口

当前已经连续完成：

1. 元数据与路径白名单
2. 脚本与流程边界
3. 一致性检查与辅助脚本边界
4. 最终实施入口判断
5. `trial-scope release prep` 最终收口判断

这说明当前已经把 trial 范围内该收的边界收完了。

如果此时仍然不进入更高层判断，就会开始重复做：

- 同层边界复述
- 低收益微收口
- 延后真正的战略决策

## 3.4 当前自动回归强度已足以支撑策略判断升级

当前 `pnpm harness:test` 已通过：

- runtime / phase / plugin 主链
- diagnostics 主链与独立矩阵
- package exports / build output / public usage
- release boundary freeze
- release-prep 各阶段边界

这意味着当前开始讨论更高层发布策略，并不是建立在脆弱试验品之上。

## 4. 为什么当前仍不能离开 private trial 现实边界

虽然当前已经值得进入更高层发布策略评估，但在策略结论形成之前，当前 package 仍必须继续保持：

- `private`
- `in-repo trial`

原因在于：

## 4.1 当前仍未形成发布级元数据策略

当前仍未正式决定：

- `main`
- `types`
- source map
- `publishConfig`
- 发布脚本
- 版本发布策略

因此现在能进入的是：

- 策略评估

不是：

- 发布实施

## 4.2 当前 frozen public API 仍只是 trial scope 冻结边界

当前对外入口虽然已冻结，但它仍然是：

- trial scope 下冻结

还不是：

- 长期稳定对外承诺

也就是说，当前可以讨论“是否值得把它升级成长期稳定 API”，但不能假装这个结论已经成立。

## 4.3 当前 diagnostics / CLI / internal-only 边界仍明确保持封闭

当前仍明确不进入对外面的有：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

这说明当前 package 仍然处于：

- 有意受限的最小可消费形态

因此它仍应继续被表述为：

- `private / in-repo trial`

## 5. 当前最合理的下一步评估目标

既然当前已经值得进入更高层发布策略评估，那么下一步最合理的最小评估目标应是：

## 5.1 是否长期继续保持 private trial

需要明确回答：

- Harness 是否只服务于当前仓库内部
- 还是未来确实希望形成可复用 package

这是所有后续判断的总前提。

## 5.2 若未来继续推进，目标是何种发布层级

至少应区分：

- 长期 internal-only package
- private registry package
- 未来 public package

不同目标，会直接决定：

- 元数据策略
- API 承诺级别
- 文档与测试要求
- 发布脚本与流程要求

## 5.3 若未来要从 trial 进入更高层级，还差哪些前置

至少应回答：

- 哪些元数据必须新增
- 哪些 API 需要升级为稳定承诺
- 哪些测试需要提升到发布级
- 哪些流程需要从“判断文档”升级为“真实脚本”

## 6. 如果当前不进入更高层评估，会发生什么

如果当前选择继续停留在 `private trial` 且不进入更高层发布策略评估，短期当然不会出错，但会出现三个问题：

1. 当前 trial-scope release prep 已经结束，后续很容易开始重复写同层边界
2. 团队无法明确 Harness 是否值得继续向可复用 package 推进
3. 当前 package 会长期停留在“已经很完整，但战略状态未定义”的状态

因此当前最合理的选择不是：

- 继续无限期停在同一层

而是：

- 保持当前现实边界不变
- 但正式进入更高层发布策略评估

## 7. 最终结论

最终结论如下：

- 当前**不应再只是停留在 `private / in-repo trial` 的同层边界维护**
- 当前**已经值得进入更高层发布策略评估**
- 但在新的策略结论形成之前，当前 package 仍必须继续保持：
  - `private`
  - `in-repo trial`
- 当前**仍不是 `publish-ready`**
- 因此下一步最合理的是：
  - `开始 Harness 发布策略评估：定义 future package 的目标发布层级与推进条件`
