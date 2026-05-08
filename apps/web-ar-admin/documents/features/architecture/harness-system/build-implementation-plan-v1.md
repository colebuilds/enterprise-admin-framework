---
title: Harness 真实 build 实施方案 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: build-boundary-and-dist-output-strategy-v1, build-dist-release-readiness-judgement-v1, package-export-landing-readiness-judgement-v1, package-structure-and-exports-map-v1
---

# Harness 真实 build 实施方案 V1

## 1. 目标

本文档用于回答一个更接近执行的问题：

- 如果下一步真的开始做 Harness build，应该按什么顺序做

它不直接建立 build 流程，也不直接新增 `dist/`。  
它只负责把 future build 收成一版可执行的实施方案，明确：

- 先动哪些文件
- 先补哪些验证
- 哪些范围本轮不碰
- 每一步的退出条件是什么

## 2. 当前前提

当前已完成：

- package 试拆五阶段
- `core + host` 的 package 结构承接
- 最小 `exports` 真实落盘
- package 入口 README 收口
- build boundary 与 dist 策略文档

当前仍成立的前提判断：

- `@ar/harness` 仍是 `private / in-repo trial`
- diagnostics 仍是 `internal-only`
- CLI 仍不属于 package public API
- 当前还未进入 build / dist 实施

因此本方案的职责是：

- 给真实 build 任务提供执行基线

而不是：

- 假装当前已经 build-ready

## 3. 实施原则

## 3.1 先补 package 级验证，再上构建工具

当前已经有：

- 内核级回归
- package core smoke
- package host smoke
- exports 边界 smoke

但若要进入真实 build，仍应先补：

- package 使用层 smoke
- future build 后入口一致性 smoke 预留判断

否则一旦开始 build，无法稳定判断：

- 产物没坏
- 边界没被放宽

## 3.2 先收 package 元数据，再做构建产物

真实 build 实施的第一轮，不应直接从 bundler 开始。  
更合理的顺序是先收：

- `package.json` 中 build 相关元数据边界
- `files` / 产物范围
- 入口与产物映射

再进入真正工具层。

## 3.3 build 只服务于当前最小 exports

第一轮 build 只应围绕当前已真实落盘的导出面：

- `.`
- `./runtime`
- `./phase`
- `./plugin`
- `./host`
- `./host/codex`

不应扩大到：

- diagnostics
- cli
- tests
- internal/\*
- shared

## 4. 推荐实施阶段

## 4.1 阶段 1：收 build 输入边界

目标：

- 在不真正 build 的前提下，先把 build 将要消费的 package 边界收死

优先修改对象：

- `packages/harness/package.json`
- 相关 package 设计文档
- package 级 smoke 结构

本阶段应明确：

- build 目标入口集合
- 不进入 build 的路径集合
- future `dist` 入口映射关系

本阶段不包含：

- 不引入构建工具
- 不新增 `dist`
- 不改 diagnostics / cli 边界

风险：

- 若边界没先收住，后面的 build 会把 internal-only 带进去

验证出口：

- package metadata 与 `exports` 一致
- build 输入边界有明确、可读、可测的定义

## 4.2 阶段 2：补 package 级消费 smoke

目标：

- 让 package 入口从“结构 smoke”升级到“使用层 smoke”

优先补的验证：

- 从 package 根入口消费核心对象
- 分别从 `runtime / phase / plugin / host / host/codex` 消费
- 明确 diagnostics / internal 路径不可消费

本阶段不包含：

- 不做真实 build
- 不做 `dist` 校验

风险：

- 若 package 使用层没先测，build 后问题会更难定位

验证出口：

- package 使用层 smoke 全绿
- internal-only 路径仍未被误开放

## 4.3 阶段 3：收 build 输出方案

目标：

- 把未来 `dist` 的最小输出面落到更接近实施的方案层

优先收敛内容：

- `dist` 入口文件集合
- 源码入口与构建入口的映射
- 是否只产 ESM
- 是否保留 source map
- 是否先不产类型

本阶段不包含：

- 不直接引入具体 bundler 配置

风险：

- 若输出面定义不清，构建工具选型再快也会反复返工

验证出口：

- 能画出 `src/* -> dist/* -> exports` 的清晰映射
- 能明确哪些入口不会出现在 `dist`

## 4.4 阶段 4：最小 build 工具落地

目标：

- 只为当前最小 exports 建立一个最轻的 build 流程

本阶段允许开始：

- 引入最小构建工具
- 补 build 脚本
- 产出第一轮 `dist`

但仍不包含：

- diagnostics
- cli
- 发布脚本
- 对外发布

风险：

- 若前面三阶段没做完，这一步最容易直接越界

验证出口：

- build 成功
- `dist` 只包含允许入口
- package 级 smoke 能同时覆盖源码入口与产物入口

## 4.5 阶段 5：build 后再评估发布准备

目标：

- 在真实 `dist` 存在后，再重新评估是否进入 release prep

本阶段只做判断，不直接发布。

原因：

- 有 `dist` 不等于可以发布
- package 消费边界、files 白名单、版本策略仍要再判断

## 5. 当前首轮 build 明确不包含

首轮真实 build 明确不应包含：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`
- 第二宿主
- 类型产物全量承诺
- 发布脚本

这些内容要么仍未稳定，要么尚不属于 build 第一轮目标。

## 6. 当前建议先动哪些文件

如果下一步真的开始真实 build，建议最先动的文件是：

- `packages/harness/package.json`
- package 级测试文件
- 与 build / dist 相关的 package 文档

不建议最先动：

- `packages/harness/src/core/*`
- `packages/harness/src/host/*`
- `scripts/harness-runtime/*`

因为当前真正缺的不是实现代码，而是：

- build 边界
- 产物映射
- 验证出口

## 7. 当前建议的验证出口

真实 build 执行任务至少应包含以下验证出口：

1. 当前 `pnpm harness:test` 仍全绿
2. package 入口 smoke 全绿
3. build 后 `dist` 只出现允许入口
4. 没有出现：
   - `dist/internal/*`
   - `dist/diagnostics/*`
   - `dist/cli/*`
5. `exports` 与产物路径仍一一对应

## 8. 最终结论

最终结论如下：

1. 当前已经具备“设计真实 build 方案”的条件
2. 真实 build 不应一步到位，而应分阶段实施
3. 第一轮真实 build 只应服务于当前最小 exports
4. 这份方案已经足以直接支撑下一步执行任务：
   - `开始 Harness 最小真实 build 第一阶段：收 build 输入边界与 package 级 smoke`
