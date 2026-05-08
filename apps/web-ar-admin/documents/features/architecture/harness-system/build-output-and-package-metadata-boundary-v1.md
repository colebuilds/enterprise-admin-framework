---
title: Harness build 输出方案与 package 元数据边界 V1
type: design
status: draft
author: cole
owner: cole
created: 2026-04-03
updated: 2026-04-03
related_decisions: build-boundary-and-dist-output-strategy-v1, build-implementation-plan-v1, package-export-landing-readiness-judgement-v1
---

# Harness build 输出方案与 package 元数据边界 V1

## 1. 目标

本文档用于回答 build 第二阶段最接近实施的问题：

- future `dist` 最小应该长什么样
- 当前源码入口如何映射到未来产物入口
- `packages/harness/package.json` 在 build 前有哪些字段需要先收死

它不直接建立 build 流程，也不直接生成 `dist/`。  
它只负责把：

- build 输出面
- package 元数据边界

先收成一版后续可执行的约束。

## 2. 当前前提

当前 `packages/harness/` 已具备：

- `private / in-repo trial`
- 最小真实 `exports`
- `core + host` 的真实目录承接
- package README 与 package 使用层 smoke

当前仍未具备：

- build 工具
- `dist/`
- 发布脚本
- 对外发布准备

因此本文档讨论的是：

- future build 输出约束

而不是：

- 当前已经进入构建产物阶段

## 3. future dist 的最小形态

future `dist` 第一轮只应承接当前真实 `exports` 需要的入口文件。

最小建议形态：

```text
dist/
├── index.mjs
├── runtime.mjs
├── phase.mjs
├── plugin.mjs
├── host.mjs
└── host/
    └── codex/
        └── codex-adapter.mjs
```

关键约束：

- `dist` 不是 `src/` 的镜像
- `dist` 只承接当前 public surface
- `dist` 不承担 internal-only 实现可见性

## 4. 源码入口到产物入口的映射

当前建议的最小映射如下：

| 源码入口 | future 产物入口 | 对应 exports |
| --- | --- | --- |
| `src/index.mjs` | `dist/index.mjs` | `.` |
| `src/runtime.mjs` | `dist/runtime.mjs` | `./runtime` |
| `src/phase.mjs` | `dist/phase.mjs` | `./phase` |
| `src/plugin.mjs` | `dist/plugin.mjs` | `./plugin` |
| `src/host.mjs` | `dist/host.mjs` | `./host` |
| `src/host/codex/codex-adapter.mjs` | `dist/host/codex/codex-adapter.mjs` | `./host/codex` |

这意味着第一轮 build 的目标不是：

- 为每个源码文件都单独产物化

而是：

- 只让 exports 所需入口形成稳定产物路径

## 5. 当前明确不进入产物层的路径

当前 future `dist` 第一轮明确不应承接：

- `diagnostics`
- `cli`
- `tests`
- `internal/*`
- `shared`

原因如下：

- `diagnostics`
  - 当前仍为 `internal-only domain`
- `cli`
  - 当前仍是仓库执行入口，不是 package API
- `tests`
  - 当前只属于质量保障层
- `internal/*`
  - 当前仍属于实现细节隔离层
- `shared`
  - 当前只作为 package 内部公共依赖存在

## 6. package 元数据边界

## 6.1 当前已应视为冻结的字段

在进入真实 build 前，以下字段应视为当前已冻结边界：

- `name`
- `private`
- `version`
- `type`
- `sideEffects`
- `exports`

其中最关键的是：

- `private: true`
- 当前最小 `exports` 集合

这两者共同决定了：

- 当前 package 的消费边界
- 当前 package 仍不是发布目标

## 6.2 build 前需要先收死的字段

若后续进入真实 build，建议先明确以下字段策略，再开始 build 工具落地：

- `files`
- build 后 `exports` 是否切到 `dist/*`
- 是否增加 `main`
- 是否增加 `types`
- 是否增加 source map 相关声明

当前阶段的建议是：

- 先设计这些字段的边界
- 但先不把它们写进 `package.json`

原因是当前还没有真实 build 输出，过早落盘会制造假边界。

## 6.3 files 白名单的最小建议

future 一旦进入真实 build，`files` 应优先服务于最小产物面，而不是源码树全量暴露。

第一轮更合理的方向是：

- 只允许 `dist/**`
- 允许 `README.md`
- 允许 `package.json`

而不是：

- 同时开放 `src/**`
- 或把 `internal/**` 带进产物白名单

## 7. package.json 在当前阶段不应提前写入的内容

当前明确不建议提前写入：

- build 脚本
- 发布脚本
- 指向 `dist/*` 的 `exports`
- 会让外部误读为 release-ready 的字段组合

原因是当前还停留在：

- `private / in-repo trial`
- build 方案已设计
- build 工具尚未落地

## 8. 与当前 README 的关系

当前 `packages/harness/README.md` 负责说明：

- 当前真实 exports
- 当前不导出范围
- 当前 package 定位

本文档负责补充：

- future `dist` 的最小形态
- 源码入口到未来产物入口的映射
- package 元数据在 build 前的冻结边界

两者关系应是：

- README 面向当前 package 使用者
- 本文档面向后续 build 实施者

## 9. 当前阶段结论

当前 build 第二阶段应收住的结论是：

1. future `dist` 只承接当前最小 exports
2. `diagnostics / cli / tests / internal / shared` 仍不得进入产物层
3. `package.json` 当前已冻结字段和 future 待补字段必须分开处理
4. 在没有真实 build 输出前，不应把 `exports`、`files`、`main`、`types` 提前写成假实现

因此这一步完成后，下一阶段才适合进入：

- 最小 build 工具落地

而不是继续在边界层来回猜测。
