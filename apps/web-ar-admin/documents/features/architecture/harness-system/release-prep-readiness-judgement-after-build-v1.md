---
title: Harness build 后 release prep 准备度复评 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: build-dist-release-readiness-judgement-v1, build-boundary-and-dist-output-strategy-v1, build-implementation-plan-v1, diagnostics-package-positioning-v1
---

# Harness build 后 release prep 准备度复评 V1

## 1. 目标

本文档用于回答 build 第三阶段完成后的关键判断问题：

- 当前 Harness 是否已经适合进入 `release prep`

这里的 `release prep` 指的是 package 从：

- `private / in-repo trial`

继续推进到：

- 发布前元数据收口
- 发布前路径白名单确认
- 发布前脚本与流程判断

它不负责真实发布，也不负责直接改发布配置。

## 2. 当前复评结论

当前明确结论是：

- **仍不适合进入 `release prep`**

更准确地说，当前已经具备：

- 最小真实 `exports`
- 最小真实 build
- 第一轮真实 `dist`
- package 使用层 smoke

但仍只适合判断为：

- `private buildable package landing`
- `in-repo trial`

而不是：

- `release-prep ready`
- `publish-ready`

## 3. 为什么 build 后仍不适合进入 release prep

## 3.1 build 已成立，但 public API 还不是发布级稳定承诺

当前已经能真实产出：

- `dist/index.mjs`
- `dist/runtime.mjs`
- `dist/phase.mjs`
- `dist/plugin.mjs`
- `dist/host.mjs`
- `dist/host/codex/codex-adapter.mjs`

并且当前 `exports` 也已切到这些产物路径。

这说明：

- build boundary 已经成立
- 最小 package 产物链已经成立

但这并不等于：

- public API 已经达到发布级稳定承诺

当前更准确的状态仍然是：

- 为仓库内消费提供稳定边界

而不是：

- 对外发布兼容承诺

## 3.2 phase contract 覆盖仍不完整

当前最关键的内核阻塞没有因为 build 落地而消失。

仍然缺少同等级完整收口的 phase 包括：

- `planning`
- `execution`
- `verification`
- `submission`
- `closure`

这意味着：

- 当前 build 只能证明 package 结构和入口已可构建
- 不能证明 Harness core 已稳定到适合进入发布准备

## 3.3 diagnostics 仍明确保持 internal-only

当前 diagnostics 已有正式定位：

- `internal-only domain`
- 暂不外提
- 暂不进入 optional domain export

这会直接影响 release prep 判断，因为发布前准备不仅要看：

- 现在导出了什么

还要看：

- 当前 package 的非导出域是否已经处于稳定边界

在 diagnostics 仍保持内部特例链的情况下，当前更合理的判断仍是：

- 继续保留 trial package 定位

## 3.4 host layer 仍只有单实现

当前 `./host` 与 `./host/codex` 已具备真实构建产物，这说明：

- host boundary 已可构建

但仍然只有：

- `codex`

这足以支撑当前 trial package，不足以支撑更进一步的 release prep 判断，因为：

- host contract 仍缺第二视角验证
- 当前 boundary 仍更像“已落地的第一实现”

而不是：

- 已稳定的发布级宿主层

## 3.5 当前 build 只证明“可构建”，还没证明“可发布前收口”

当前自动回归已经能覆盖：

- package public usage
- exports 边界
- build 输出边界
- runtime / plugin / phase / diagnostics 主链

这足够证明：

- build 没有放宽当前 public boundary
- `dist` 没有卷入 internal-only 范围

但仍不足以证明：

- 发布前元数据已经稳定
- 版本策略已稳定
- files 白名单已经最终冻结
- 发布脚本与消费边界已经准备好

## 4. 当前阶段最准确的状态判断

当前 Harness package 最准确的状态应判断为：

1. `exports-ready`
2. `build-ready (trial scope)`
3. `dist-ready (trial scope)`
4. **not release-prep-ready**
5. **not publish-ready**

也就是说，当前比之前更进一步，但仍停留在：

- buildable trial package

而不是：

- release-prep package

## 5. 进入 release prep 前至少还应补什么

## 5.1 phase contract 全覆盖收口

这是当前最优先、最核心的前置项。

至少要把：

- `planning`
- `execution`
- `verification`
- `submission`
- `closure`

都补到与 `task_card / boundary` 同等级的 contract gate。

## 5.2 diagnostics domain 前置收口

至少应补：

- diagnostics domain contract
- monolith 拆分
- 文件协议与对象协议进一步解耦
- diagnostics 独立自动回归

在这之前，不建议把当前 package 进一步判断为 release-prep ready。

## 5.3 host contract 稳定性复评

不一定要求立刻做第二宿主，但至少要先补：

- host contract 稳定性复评
- 或一个对照实现 / 伪实现验证

否则 release prep 仍会建立在单实现边界上。

## 5.4 发布前元数据最终确认

在上述前置项完成后，才适合进一步确认：

- 是否保留 `private`
- 版本策略
- `files` 白名单最终形态
- 是否补 `main`
- 是否补 `types`
- 是否补 source map 相关字段

## 6. 当前推荐下一步

当前最合理的下一步不是直接开始 release prep，而是：

- `phase contract 全覆盖收口`

若继续按优先顺序推进，建议是：

1. `phase contract 全覆盖收口`
2. `phase-driven state machine 继续收实`
3. `diagnostics domain 前置收口`
4. 再做 `release prep` 复评

## 7. 最终结论

最终结论如下：

- 当前 **仍不适合进入 `release prep`**
- 当前最准确的 package 状态是：
  - `private`
  - `in-repo trial`
  - `exports-ready`
  - `build-ready (trial scope)`
  - `dist-ready (trial scope)`
  - **not release-prep-ready**
- 下一步不应直接开 release 任务，而应先继续补：
  - phase contract 覆盖
  - diagnostics domain 前置收口
  - host contract 稳定性复评
