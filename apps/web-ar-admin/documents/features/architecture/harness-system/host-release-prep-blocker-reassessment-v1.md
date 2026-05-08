---
title: Harness host release prep 阻塞复评 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: package-export-landing-readiness-judgement-v1, release-prep-readiness-judgement-after-build-v1, diagnostics-release-prep-blocker-reassessment-v1
---

# Harness host release prep 阻塞复评 V1

## 1. 目标

本文档用于回答当前 host boundary 在已有：

- 正式 host contract object
- `codex` 单实现
- package `./host` 与 `./host/codex` 真实导出
- build / dist / smoke

之后的关键问题：

- host 当前是否仍然阻塞 Harness 进入 `release prep`

这里的判断语境不是：

- host 是否已经多实现

而是：

- 在当前 `private / in-repo trial`、且 package 只对外承接最小 `core + host` 的前提下，host 的单实现状态是否仍构成 release-prep 的主阻塞

## 2. 当前复评结论

当前明确结论是：

- host **已不再构成当前阶段进入 `release prep` 的主阻塞项**

但这同样不等于：

- host contract 已达到发布级稳定承诺
- host layer 已具备多宿主稳定性证明
- `./host` 已经适合被判断为长期稳定 public surface

更准确地说，当前 host 的状态应判断为：

1. `boundary established`
2. `single-implementation validated`
3. `package-exported`
4. `build-covered`
5. `not multi-host-proven`

因此当前结论不是：

- 继续把 host 单实现作为 release-prep 第一阻塞位

而是：

- 把 host 从“主阻塞项”降为“仍需后续增强验证的已落地边界”
- 当前 release-prep 的主阻塞更应转向 release boundary 与 public API 最终确认

## 3. 为什么它不再是主阻塞

## 3.1 host boundary 对象已经成立

当前 host 层并不是隐式约定，而是已经有正式对象层：

- `HostCapabilities`
- `HostCommandSurface`
- `HostContextInput`
- `HostRuntimeOutput`

这说明 host boundary 当前至少已经从“第一实现里的散写接口”收成：

- 可被复用的正式 contract 形状

这一步本身已经显著降低了 host 继续阻塞 release-prep 的强度。

## 3.2 `codex` 单实现已经完成 package 承接

当前 host 不只存在于脚本运行时中，也已经真实进入：

- `packages/harness/src/host.mjs`
- `packages/harness/src/host/codex/codex-adapter.mjs`

并且当前 package 已真实导出：

- `./host`
- `./host/codex`

这意味着 host boundary 当前已经具备：

- package 入口
- exports 承接
- dist 产物承接

因此它已经不再只是“内部实现里有一层 boundary”的状态。

## 3.3 host build / dist / public usage 已有自动化验证

当前自动回归至少覆盖：

- `package-host-split.test.mjs`
- `package-public-usage.test.mjs`
- `package-build-output.test.mjs`

这证明：

- `./host`
- `./host/codex`

当前不是只存在于文档和目录结构中，而是已经进入：

- package public usage
- build 后产物边界
- dist 输出白名单

的自动化兜底范围。

## 3.4 host 当前没有继续污染 internal-only 边界

host 当前虽然仍只有 `codex` 一个实现，但它没有像 diagnostics 那样继续拖着：

- issue 文件协议
- markdown / yaml 载体
- 仓库内升级链特例

它更接近：

- 一个已落地但仍待增强的 adapter layer

而不是：

- 一个仍然深入侵入内部执行链的特例域

这决定了它当前对 release-prep 的阻塞强度已经明显低于之前。

## 4. 为什么它仍不能被判断为完全收口

虽然 host 已不再是当前 release-prep 的主阻塞，但它仍未完成以下事项。

## 4.1 它仍只有单实现

当前 host 的真实实现仍只有：

- `codex`

这意味着当前 boundary 的稳定性仍主要来自：

- 单实现内部一致
- package 导出与 build 使用验证

而不是：

- 第二实现对 contract 的交叉验证

因此 host 当前虽然不再是第一阻塞位，但仍不是“发布级稳态 host layer”。

## 4.2 host contract 仍带有现实现实偏向

当前 `HostContextInput` 和 `codex` adapter 的字段设计，仍明显偏向：

- argv 输入
- runtime dir / diagnostics root override
- payload file 读取

这足以支撑当前 trial package，但还不足以证明：

- host contract 已经过第二视角抽象验证

## 4.3 当前 host smoke 更偏 package 承接验证

当前测试已经证明：

- 导出面可用
- build 不越界

但还没有进一步证明：

- 第二宿主能无痛接入
- 当前 contract 对不同宿主输入模型仍然稳定

这属于后续 host 稳定性增强项，而不是当前 release-prep 的第一阻塞项。

## 5. 当前真正更靠前的 release-prep 阻塞项

在 diagnostics 和 host 都降为次级阻塞之后，当前更应优先关注的 release-prep 阻塞项是：

## 5.1 release boundary 最终确认

当前虽然已经有：

- 最小 `exports`
- 最小 build
- 最小 `dist`
- package public usage smoke

但仍缺：

- 更最终的 public API 稳定承诺判断
- 发布前元数据边界最终确认
- release-prep 范围下的 package 边界命名与承诺收口

这比继续把 host 单实现当成第一问题更直接。

## 5.2 host 第二视角验证应后置为增强项

更合理的顺序是：

1. 先把 release boundary 收死
2. 再决定 host 是否需要：
   - 第二宿主实现
   - 伪实现
   - 或 contract 级对照验证

这样可以避免在 package 边界尚未最终确认前，把精力先投入到更重的 adapter 扩展任务。

## 6. 当前推荐判断

当前推荐判断如下：

1. host **不再是 release-prep 主阻塞**
2. host **仍是单实现已落地边界**
3. host **仍未经过 multi-host 级验证**
4. release-prep 的主阻塞优先级应转向：
   - release boundary 最终确认
   - 发布前元数据与 public API 承诺收口

## 7. 最终结论

最终结论如下：

- host 当前**已不再构成 `release prep` 的主阻塞项**
- host 当前最准确的状态是：
  - `boundary established`
  - `single-implementation validated`
  - `package-exported`
  - `build-covered`
  - `not multi-host-proven`
- 后续仍应继续补 host 的第二视角验证，但不必继续把它作为 release-prep 的第一阻塞位
- 当前更合理的下一步，应把主注意力转回：
  - `release boundary` 最终确认
  - 发布前 public API 与元数据边界收口
