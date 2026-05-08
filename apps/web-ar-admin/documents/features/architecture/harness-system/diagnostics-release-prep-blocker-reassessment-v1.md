---
title: Harness diagnostics release prep 阻塞复评 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: diagnostics-package-positioning-v1, diagnostics-domain-contract-v1, release-prep-readiness-judgement-after-build-v1
---

# Harness diagnostics release prep 阻塞复评 V1

## 1. 目标

本文档用于回答 diagnostics 在最近几轮前置收口之后的一个关键问题：

- diagnostics 当前是否仍然阻塞 Harness 进入 `release prep`

这里的判断语境不是：

- diagnostics 是否已经可以对外导出

而是：

- 在当前 `private / in-repo trial`、且 package 只对外承接 `core + host` 的前提下，diagnostics 现在是否仍构成 release-prep 的主阻塞

## 2. 当前复评结论

当前明确结论是：

- diagnostics **已不再构成当前阶段进入 `release prep` 的主阻塞项**

但这不等于：

- diagnostics 已可外提为 `public optional domain`
- diagnostics 已 package-ready
- diagnostics 已 release-prep-ready

更准确地说，当前 diagnostics 的状态应判断为：

1. `internal-only domain`
2. `boundary clearer`
3. `test-covered`
4. `not export-ready`
5. `not optional-domain-ready`

因此当前结论不是：

- 继续把 diagnostics 作为 release-prep 主阻塞

而是：

- 把 diagnostics 从“主阻塞项”降为“仍需持续收口的 internal domain”
- 当前 release-prep 的主阻塞应转向其他更直接影响 package 对外边界的项

## 3. 为什么它不再是主阻塞

## 3.1 internal-only 定位已经足够清晰

当前 diagnostics 的 package 定位仍明确为：

- `internal-only domain`

并且当前 package 真实 `exports`、真实 build 和真实 `dist` 都没有把 diagnostics 带入对外产物层。

这意味着 diagnostics 当前虽然仍在演进，但它并没有继续污染：

- `public core`
- `host adapter layer`
- 当前对外消费面

在这种前提下，diagnostics 的未完成项更像：

- internal 域继续收口问题

而不是：

- 当前 package release-prep 的直接边界问题

## 3.2 diagnostics domain contract 已经成立

当前 diagnostics 已具备正式的 domain contract 文档与实现承接，至少覆盖：

- input contract
- issue lifecycle contract
- upgrade path contract
- runtime output contract

这意味着 diagnostics 不再只是：

- 一条仓库内隐式约定链

而已经进入：

- internal domain 对象协议成立

的阶段。

## 3.3 monolith 已完成多轮最小拆分

当前 diagnostics 至少已经拆为：

- `contract`
- `issue-io`
- `report-content-builders`
- `report-writers`
- `state-builders`
- `protocol-readers`
- `upgrade-path`
- `phase-bridge`
- `index`

这说明 diagnostics 已不再主要依赖单文件 monolith 维持行为。

虽然它还没有完全收成 package internal domain，但它和最初“仓库内特殊链路”的状态相比，边界已经明显更可解释。

## 3.4 对象协议、文件协议与报告构造已经出现分层

当前 diagnostics 至少已经完成三类关键分层：

1. 对象构造与文件写入第一轮解耦
2. markdown 报告内容构造与 report writer 第一轮解耦
3. 文件协议读取与解析入口统一

这意味着 diagnostics 当前虽然仍依赖 markdown / yaml 文件协议，但这些协议细节已经不再像早期那样散落在多个编排点里直接混写。

## 3.5 diagnostics 已具备独立自动回归矩阵

当前 diagnostics 不再只靠单条主链 smoke 间接兜底。

已具备的独立回归维度至少包括：

- issue lifecycle
- upgrade path
- phase bridge
- output boundary
- state builders
- report content builders
- protocol readers

这使 diagnostics 的演进风险显著下降，也意味着它不再需要继续以“高不确定性内部特例”身份阻塞 release-prep 判断。

## 4. 为什么它仍不能被判断为已完全收口

虽然 diagnostics 已不再是当前 release-prep 的主阻塞，但它仍未完成以下事项。

## 4.1 它仍不是可导出的 optional domain

当前 diagnostics 仍然：

- 深度绑定 issue 目录协议
- 深度绑定 markdown / yaml 文件载体
- 深度绑定当前 issue -> remediation -> task-card -> boundary 的升级链

这决定了它仍不适合：

- 对外导出
- 写入 public optional domain 承诺

## 4.2 它仍未完成更深层 lifecycle helper 统一

当前 diagnostics 的 issue lifecycle 虽已进入 contract 和测试矩阵，但状态转换 helper 还没有进一步统一到更完整的内部状态机承接。

这属于后续 diagnostics internal domain 的收口项，而不是当前 package 对外边界的主阻塞项。

## 4.3 它仍未进入 package internal smoke 语境

当前 diagnostics 仍主要位于 `scripts/harness-runtime/*` 语境下被消费与验证，还没有进入：

- `packages/harness/src/internal/diagnostics/*`

这意味着它虽然对当前 release-prep 主判断影响下降，但仍不适合作为 package 导出层判断的一部分。

## 5. 当前真正更靠前的 release-prep 阻塞项

在 diagnostics 降为次级阻塞之后，当前更应优先关注的 release-prep 阻塞项是：

## 5.1 host contract 仍只有单实现

当前 host boundary 虽已存在：

- `./host`
- `./host/codex`

但仍只有：

- `codex`

这更直接影响对外宿主边界是否已具备发布前稳定性判断。

## 5.2 release boundary 还没有做最终收死

当前虽然已经有：

- 最小 `exports`
- 最小 build
- 最小 `dist`

但发布前边界仍缺：

- 更最终的 public API 稳定承诺判断
- 发布前元数据与脚本边界最终确认

## 5.3 buildable 不等于 release-prep ready

当前已经证明：

- package 可构建
- 产物边界没有放宽

但仍未证明：

- 当前 package 已经适合进入更靠近发布前的流程收口

因此 release-prep 的下一轮主判断，应更多围绕：

- host contract 稳定性
- release boundary 最终确认

而不是继续把 diagnostics 当成第一阻塞位。

## 6. 当前推荐判断

当前推荐判断如下：

1. diagnostics **不再是 release-prep 主阻塞**
2. diagnostics **仍是 internal-only 持续收口项**
3. diagnostics **仍不是 export-ready / optional-domain-ready**
4. release-prep 的主阻塞优先级应转向：
   - host contract 稳定性复评
   - release boundary 最终确认

## 7. 最终结论

最终结论如下：

- diagnostics 当前**已不再构成 `release prep` 的主阻塞项**
- diagnostics 当前最准确的状态是：
  - `internal-only`
  - `boundary clearer`
  - `test-covered`
  - `not export-ready`
- 后续仍应继续收口 diagnostics internal domain，但不必继续把它作为 release-prep 的第一阻塞位
- 当前更合理的下一步，应把主注意力转回：
  - `host contract` 稳定性复评
  - `release boundary` 最终确认
