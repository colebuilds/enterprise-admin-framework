---
title: Stylelint 接入手册
type: guide
status: stable
author: cole
owner: cole
created: 2026-03-31
updated: 2026-03-31
audience: human, ai-agent
tool: Stylelint
related_standards:
  - ENG-STD-001
  - ENG-STD-003
  - ENG-STD-005
---

# Stylelint 接入手册

## 1. 文档定位

本文档用于说明如何在工程中接入 Stylelint，并把样式检查逐步收敛到统一入口与统一规则。  
本文档只讲接入和迁移，不复写样式规范正文。

## 2. 适用场景

适合以下情况：

- 仓库已有 CSS / SCSS / Less / Vue SFC style
- 样式规则分散，缺少统一检查
- 团队希望把样式问题前置到本地和提交前
- 需要逐步从历史样式债迁移到统一规则

## 3. 前置条件

接入前建议确认：

- 已经有明确的样式治理目标
- 能接受先建立基线，再逐步收紧
- 已能区分样式检查与 JS/TS 静态检查
- 已有或计划建立统一的脚本入口

## 4. 推荐接入步骤

### 4.1 安装基础能力

先按项目需要安装 Stylelint 及其对应的语法支持插件、配置插件。

### 4.2 建立配置文件

建议把样式规则放在独立配置文件中，例如：

- `.stylelintrc.*`
- `stylelint.config.*`

配置应只关注样式层，不要混入业务架构规则。

### 4.3 先建立检查命令

建议先提供两个入口：

- `lint:style`
- `lint:style:fix`

这样团队能区分只检查与自动修复。

### 4.4 再接入提交前门禁

若项目已有 `lint-staged` 或 `Husky`，再把暂存区样式检查接入提交前流程。

### 4.5 再纳入完整门禁

当基础规则稳定后，再把样式检查纳入 `verify` 或 CI 全量门禁。

## 5. 推荐配置落点

建议主要落在以下位置：

- `stylelint.config.*` 或 `.stylelintrc.*`
  - 样式规则主体
- `package.json`
  - `lint:style`、`lint:style:fix`
- `lint-staged`
  - 若要做提交前样式校验
- `Husky`
  - 若要把暂存区检查挂到 Git hooks

## 6. 与标准规范关系

- [ENG-STD-001](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/standards/engineering/ENG-STD-001-工程治理与工具链规范.md)
  - 定义样式治理在工程体系中的位置
- [ENG-STD-003](/Users/cola/Documents/gs/ar_v2_vue-feature-documents/documents/standards/engineering/ENG-STD-003-样式规范.md)
  - 定义样式应该遵守什么规则

## 7. 常见注意事项

- 不要把 Stylelint 当成架构工具
- 不要一开始就把规则收得过死，尤其是历史代码
- 不要让自动修复覆盖语义风险
- 不要把样式检查和 JS/TS 检查混在同一个模糊入口里

## 8. 渐进迁移建议

建议按以下顺序迁移：

1. 先跑通样式检查命令
2. 再接入提交前检查
3. 再建立 baseline
4. 最后逐步收紧规则

## 9. 一句话总结

Stylelint 接入的目标不是一次性把所有旧样式修完，而是让新样式问题从一开始就被稳定发现，并把历史问题逐步收敛。
