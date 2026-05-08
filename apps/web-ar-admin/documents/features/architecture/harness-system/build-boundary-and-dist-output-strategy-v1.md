---
title: Harness build boundary 与 dist 输出策略 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: package-export-boundary-v1, package-export-landing-readiness-judgement-v1, build-dist-release-readiness-judgement-v1, package-structure-and-exports-map-v1
---

# Harness build boundary 与 dist 输出策略 V1

## 1. 目标

本文档用于回答一个比“是否进入 build / dist 阶段”更具体的问题：

- 如果后续真的开始做 build，Harness 的 build boundary 应该是什么
- `dist` 未来应承接什么，不应承接什么

它不负责真实建立 build 流程，也不负责选定具体构建工具。  
它只负责先把：

- 源码层
- 构建产物层
- 发布层

这三层边界收清楚。

## 2. 当前判断前提

当前 Harness package 已完成：

- `private / in-repo trial`
- 最小 `exports` 真实落盘
- `core + host` 的 package 结构承接

当前仍未完成：

- build 流程
- `dist` 产物
- 发布准备

因此本文档讨论的是：

- future build boundary

而不是：

- 当前已经开始 build

## 3. 为什么 future package 仍需要 build boundary

当前虽然源码直出即可支撑：

- 仓库内试运行
- 最小 `exports`

但如果后续真的要继续进入：

- `dist`
- 构建产物稳定性
- 发布前准备

那就不能只回答“用什么工具”，而要先回答：

- 哪些源码入口值得进入 build
- 哪些入口即使存在，也不应进入构建产物

所以 build boundary 的核心价值是：

- 防止把 internal-only 细节卷进 `dist`
- 防止把当前 trial 结构误扩成发布承诺
- 让 future build 只服务于稳定导出面

## 4. 三层边界定义

## 4.1 源码层

源码层指：

- `packages/harness/src/**`

它承接的是当前 package 的真实实现源文件。

源码层可以比最终导出面更宽，因为它包含：

- public core
- host layer
- internal shared
- internal diagnostics 占位

这层的职责是：

- 组织实现
- 形成 package 结构

而不是：

- 直接代表构建产物边界

## 4.2 构建产物层

构建产物层指 future 的：

- `dist/**`

这层的职责不是复制全部源码，而是：

- 只承接稳定导出面
- 只承接 future `exports` 所需入口
- 隔离 internal-only 实现

因此 `dist` 的设计原则应是：

- “按导出面构建”
- 而不是“按源码树全量镜像”

## 4.3 发布层

发布层指的是：

- `package.json`
- `exports`
- `files`
- 版本号
- 发布脚本
- 发布流程

这层回答的是：

- 什么会被真正暴露给包消费者
- 什么属于版本承诺

发布层一定比构建产物层更保守。  
即使未来 `dist` 存在，也不代表 `dist` 下的所有内容都进入 public API。

## 5. build boundary 的最小建议

## 5.1 build 只服务于当前已落盘 exports

如果后续开始 build，第一轮 build 只应服务于当前已经真实落盘的入口：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

也就是说，future build 的第一原则应是：

- 只构建当前 exports map 需要的入口

而不是：

- 把整个 `src/` 目录一股脑产出到 `dist/`

## 5.2 build 不应扩大当前 public surface

进入 build 阶段后，最容易发生的漂移是：

- 因为“既然构建了”，就顺手把 diagnostics / internal / CLI 一并产出

这正是必须避免的。

所以 build boundary 必须明确：

- build 不应扩大 public surface
- build 只是把当前已决定导出的入口转成产物层
- build 不能成为边界放宽的借口

## 5.3 build 不应先处理 diagnostics

当前 diagnostics 已有正式结论：

- 暂不外提
- 暂不进入 optional domain export

因此未来第一轮 build 也必须明确：

- `diagnostics` 不进入 build 目标范围

这不是因为 diagnostics 不重要，而是因为它当前还没有稳定到适合进入产物层承诺。

## 6. dist 输出策略建议

## 6.1 dist 应承接什么

future `dist` 最小应承接：

- 根入口聚合结果
- runtime 入口
- phase 入口
- plugin 入口
- host 入口
- host/codex 单独入口

也就是按当前最小 `exports` 一一承接。

## 6.2 dist 不应承接什么

future `dist` 第一轮明确不应承接：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

原因如下：

- `diagnostics`
  - 当前仍为 internal-only domain
- `cli`
  - 当前仍是仓库协作入口，不是 package API
- `tests`
  - 只属于质量保障，不属于消费面
- `internal/*`
  - 当前仍是实现细节隔离层
- `shared`
  - 当前只是一层 internal 公共依赖，不应独立导出

## 6.3 dist 不应等于源码镜像

future `dist` 不应追求：

- 目录和 `src` 一一对应

更合理的方向是：

- 只保留 exports 需要的最小入口
- 内部依赖由构建工具打包或重写

这样可以避免未来消费者：

- 根据 `dist/internal/*`
- 或 `dist/shared/*` 反向绕过边界

## 7. build boundary 与 exports 的关系

两者关系应是：

- `exports` 决定对外承诺什么
- build boundary 决定为了这些承诺，应该构建什么

顺序必须是：

1. 先定 exports boundary
2. 再定 build boundary
3. 最后才做 `dist` 产物

不能反过来：

- 先把东西构出来
- 再决定哪些入口该不该公开

否则会把实现细节先产出，再被动收边界。

## 8. 当前仍不应进入 dist 的理由

尽管本文已经给出 `dist` 策略，但这不代表现在应立即创建 `dist`。

当前仍不应直接进入 `dist` 的原因包括：

- phase contract 覆盖仍未完整
- host layer 仍只有单实现
- diagnostics / CLI 的长期边界还没有完全收死
- 尚未有 package 级 build smoke

因此本文档的作用是：

- 先把策略写清

而不是：

- 说明现在就该开始构建

## 9. 后续真实 build 实施前还差什么

若后续要进入真实 build 任务，至少还应先补：

## 9.1 build 工具与产物形式判断

至少要先明确：

- 是否需要 bundle
- 是否只做 ESM
- 是否要补类型产物
- 是否需要 source map

## 9.2 package 级消费 smoke

需要增加至少一组：

- 基于 `packages/harness/package.json` 的入口消费 smoke
- 基于 future 构建产物的 smoke

## 9.3 files / publish 白名单策略

即使当前不发布，也要先明确 future：

- 哪些进入 `files`
- 哪些永远不应进入发布包

## 10. 最终结论

最终结论如下：

1. Harness future package **需要 build boundary**
2. future `dist` **只应承接当前最小 exports 对应入口**
3. `diagnostics / cli / tests / internal/* / shared` 当前**不应进入 dist**
4. 当前这份策略文档已经足以支撑下一步：
   - `设计真实 build 实施方案`
5. 但当前仍不意味着：
   - 立即进入 build / dist 实施
