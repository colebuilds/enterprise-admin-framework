---
title: Harness diagnostics package 定位判断 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: package-export-boundary-v1, package-structure-and-exports-map-v1, package-structure-trial-split-implementation-plan-v1, diagnostics-runtime-and-issue-runtime-model-v1
---

# Harness diagnostics package 定位判断 V1

## 1. 目标

本文档用于回答 package 结构试拆第五阶段的核心问题：

- 当前 `diagnostics` 是否适合外提到 future package

它不负责真实迁移，也不负责真实 `exports` 落盘。  
它只负责基于当前真实实现状态，给出：

- 现在是否应外提
- 若不外提，核心阻塞点是什么
- 若未来外提，最小前置条件是什么

## 2. 当前结论

当前明确结论是：

- `diagnostics` **暂不适合外提为 future package 的 public optional domain**

当前更合理的定位是：

- `internal-only domain`

更准确地说：

- 它已经具备“未来可外提候选域”的形态
- 但还不具备“当前就应外提”的边界稳定度

因此第五阶段的结论不是：

- 现在开始迁 `diagnostics`

而是：

- 继续保持 `diagnostics` 为 internal-only
- 先补它与 core / host / CLI 的边界清理
- 之后再判断是否升级为 `optional domain export`

## 3. 当前真实耦合关系

## 3.1 对 runtime 的耦合

当前 `diagnostics/index.mjs` 直接依赖：

- `loadTaskRuntimeState`
- `saveTaskRuntimeState`
- `appendEvent`

并直接推动以下对象链：

- `issue-runtime`
- `diagnostic-report`
- `remediation-task-draft`
- `task-card-entry`
- `formal-task`
- `task-card-start`
- `boundary-start`

这说明 `diagnostics` 当前不是只读型插件，也不是单纯 provider。  
它已经是一个会直接推进任务对象升级链的 domain。

## 3.2 对 phase 的耦合

当前 `diagnostics` 直接依赖：

- `assertCanEnterPhase`
- `createPhaseStatePatch`

并已主动推动：

- `task_card`
- `boundary`

两类 phase gate。

这说明它不是“围绕 diagnostics 自己内部闭环”的子域，而是已经进入主 phase chain 的推进点。

## 3.3 对 plugin 的耦合

当前 `diagnostics` 的语义上属于：

- `diagnostics-provider`

但实现上它并没有先收成一个独立 plugin contract，再由 host/runtime 挂载消费。  
它仍是当前仓库运行时中的特例入口。

换句话说：

- diagnostics 在架构语义上像 plugin / domain
- 但在代码实现上仍更像 runtime 的内建子域

## 3.4 对 host 的耦合

当前 `diagnostics` 并不直接依赖 `codex-adapter`。

它消费的是一个已经被标准化的输入对象：

- `runtimeDir`
- `diagnosticsIssuesRoot`
- `options`

这说明 host boundary 对 diagnostics 是有效的。  
但这并不等于 diagnostics 已可独立外提，因为它仍深度依赖当前 runtime 文件体系与当前 issue 目录协议。

## 3.5 对 CLI 的耦合

当前 `diagnostics` 没有直接解析 CLI 参数。  
这部分已经被 host/CLI 层隔开。

但它仍强依赖当前仓库内的命令式升级链，例如：

- `collect-diagnostics`
- `analyze-diagnostics`
- `upgrade-diagnostics-task`
- `promote-diagnostics-draft`
- `upgrade-task-card-entry-to-formal-task`
- `start-formal-task-card`
- `start-task-boundary`

因此它虽然不直接吃 CLI 参数，却仍绑定当前仓库的动作编排语义。

## 4. 为什么现在不适合外提

## 4.1 它仍绑定当前 issue 目录与文件协议

当前 diagnostics 直接写入并维护：

- `/.harness-diagnostics/issues/<issue-id>/issue.md`
- `issue-runtime.yaml`
- `diagnostic-report.md`
- `remediation-task-draft.md`
- `task-card-entry.md`

这些文件不仅是数据载体，也是当前仓库流程语义的一部分。

这意味着：

- diagnostics 还不是“只依赖正式 schema 的纯 domain”
- 它仍绑定当前仓库内部的目录协议和文档形态

## 4.2 它仍绑定当前任务升级链

当前 diagnostics 不只是产出一个诊断结论，而是直接承接：

- issue
- remediation draft
- task-card-entry
- formal-task
- task-card-start
- boundary-start

这条链已经深入当前主流程对象体系。

如果现在外提为 package public optional domain，就等于提前固化：

- diagnostics 到主流程的升级链
- 相关文件形态
- 相关事件命名
- 相关对象层级

这会把仍在演进中的内部流程过早固定为 public API。

## 4.3 它仍是单文件 monolith

当前 diagnostics 仍集中在：

- `scripts/harness-runtime/diagnostics/index.mjs`

这说明它虽然功能成熟，但边界还没有被拆成：

- input contract
- issue file writer
- report / draft writer
- upgrade path controller
- phase bridge

在这种状态下直接外提，后续很容易出现：

- optional domain 的 public surface 过大
- 内部细节被迫一并稳定

## 4.4 它还没有完成 plugin/domain 化收口

当前 diagnostics 虽然在文档语义上接近：

- provider
- enhancer
- future optional domain

但实现上仍没有完成这一步：

- 先抽 diagnostics domain contract
- 再抽 domain runtime boundary
- 最后才判断 package export

所以现在外提，时机会偏早。

## 5. 当前推荐定位

当前推荐定位为：

- `packages/harness/src/internal/diagnostics/`

也就是：

- 在 future package 结构上保留 internal 位置
- 但不进入当前 V1 的 public `exports`

这意味着：

- diagnostics 可以继续作为 future package 的内部候选域存在
- 但不能在当前阶段被宣称为稳定可导出的 optional domain

## 6. 未来若要外提，最小前置条件

若未来希望把 diagnostics 升级为：

- `public optional domain`

至少还需要先完成以下前置条件。

## 6.1 抽 diagnostics domain contract

至少需要先把以下边界收成正式 contract：

- diagnostics input contract
- issue lifecycle contract
- upgrade path contract
- diagnostics runtime output contract

没有这一步，外提只是在暴露当前仓库内的实现细节。

## 6.2 拆 diagnostics monolith

至少应把当前单文件拆成可独立判断的模块，例如：

- issue io
- report / draft writer
- upgrade path
- phase bridge

否则 future optional domain 的导出面会过粗。

## 6.3 清理当前文件协议与对象协议的混写

需要把下面两类东西进一步分开：

- 正式对象协议
- 当前仓库内 markdown / yaml 文件协议

只有这样，diagnostics 才可能被其他 host 或其他 runner 复用。

## 6.4 补 diagnostics 独立自动回归

当前已有 diagnostics 主链测试，但还不够支持独立 optional domain 导出。

未来至少应补：

- diagnostics issue lifecycle 测试
- diagnostics upgrade path 测试
- diagnostics phase bridge 测试
- diagnostics package-internal smoke

## 7. 对第六阶段的影响

当前这轮判断的直接结论是：

- **第六阶段不应直接开始 diagnostics package 导出实现**

更合理的下一步应是二选一：

1. 继续 package 结构收口
   - 保持 diagnostics 为 internal-only
   - 先收 `bin/CLI` 与 future exports 的最小真实落盘

2. 若确实想让 diagnostics 成为可选域
   - 应先单独立任务，做 diagnostics domain boundary 收口

## 8. 最终结论

当前 `diagnostics` 的状态应判断为：

- **成熟的 internal domain**
- **未来 optional domain 候选**
- **当前不应外提**

因此第五阶段的正式结论是：

- 现在不迁 `diagnostics`
- 现在不把 `./diagnostics` 加入 future public exports
- 继续保留在 `internal-only`
- 等 diagnostics domain contract 和 boundary 再稳定一轮后，再判断是否外提
