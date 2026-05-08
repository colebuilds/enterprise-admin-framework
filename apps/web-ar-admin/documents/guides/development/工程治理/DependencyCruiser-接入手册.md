---
title: DependencyCruiser 接入手册
type: guide
status: stable
author: cole
owner: cole
created: 2026-03-31
updated: 2026-03-31
audience: human, ai-agent
tool: Dependency Cruiser
tool_version: stable
related_standards:
  - ENG-STD-001
  - ENG-STD-004
  - ENG-STD-005
---

# DependencyCruiser 接入手册

## 1. 文档定位

本文档用于说明如何把依赖边界检查接入工程流程，并把循环依赖、分层违规与测试污染等问题前置到可检查、可收敛的治理路径上。  
本文档只讲接入与迁移，不重复依赖边界规范正文，也不把当前仓库状态写成既成事实。

## 2. 适用场景

适合以下情况：

- 仓库开始出现跨层引用混乱
- monorepo 中 app / package / shared 的边界不清
- 团队希望提前发现循环依赖
- 需要控制测试代码对生产代码的污染
- 希望为架构治理建立 baseline 和持续收敛机制

## 3. 前置条件

接入前建议先确认：

- 仓库已有相对稳定的目录与分层约定
- 能接受先建立 baseline，再逐步治理历史违规
- 团队愿意把依赖问题视为架构问题，而不是单纯 lint 问题
- 已有或计划统一依赖检查脚本入口

## 4. 推荐接入步骤

### 4.1 先定义检查范围

先明确哪些目录、包和层级要纳入检查，例如：

- `apps`
- `packages`
- 共享目录
- 测试目录

检查范围应与仓库实际结构匹配，不要一次性覆盖所有可能路径。

### 4.2 建立 Dependency Cruiser 配置

建议将规则放在独立配置文件中，例如：

- `.dependency-cruiser.*`

配置重点应放在：

- 循环依赖
- 分层依赖违规
- 非公开入口引用
- 测试 / 生产隔离

### 4.3 提供脚本入口

建议提供单独脚本入口，例如：

- `lint:deps`

这样本地调试、提交前检查和 CI 聚合时都能复用同一入口。

### 4.4 先建立 baseline

对历史仓库，建议先记录当前已存在的问题，不要一开始就把所有旧违规都变成阻断项。  
先让新问题不能继续扩大，再逐步消化旧问题。

### 4.5 再逐步收紧

当团队对规则达成共识后，再逐步把高风险违规从 warning 收紧到 error。

## 5. 推荐配置 / 脚本落点

建议主要落在以下位置：

- `.dependency-cruiser.*`
  - 依赖边界规则主体
- `package.json`
  - `lint:deps`
- `verify`
  - 若项目希望把依赖治理纳入完整门禁，可在更高层入口中聚合

## 6. 与标准规范关系

- [ENG-STD-001](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/standards/engineering/ENG-STD-001-工程治理与工具链规范.md)
  - 定义依赖治理在工程体系中的职责边界
- [ENG-STD-004](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/standards/engineering/ENG-STD-004-依赖边界与架构约束规范.md)
  - 定义哪些依赖关系应该被检查
- [ENG-STD-005](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/standards/engineering/ENG-STD-005-检查与发布门禁规范.md)
  - 定义依赖检查在本地、提交前与 CI 中如何执行

## 7. 常见注意事项

- 不要把 Dependency Cruiser 当成架构决策工具，它只负责发现问题
- 不要一开始就把全部历史违规变成阻断项
- 不要把检查规则写得只适配当前目录结构，后续迁移会很痛
- 不要把测试目录与生产目录的边界做成模糊规则

## 8. 渐进迁移建议

建议按以下顺序迁移：

1. 先盘点当前依赖边界
2. 再建立 baseline
3. 再把高风险违规纳入检查
4. 最后逐步把新代码要求收紧到统一标准

## 9. 一句话总结

Dependency Cruiser 接入的目标不是“一次性消灭所有依赖问题”，而是把架构边界变成可检查、可记录、可逐步收敛的治理对象。
