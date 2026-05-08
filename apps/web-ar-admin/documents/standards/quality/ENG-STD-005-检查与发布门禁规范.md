---
title: ENG-STD-005 检查与发布门禁规范
type: standard
code: ENG-STD-005
status: review
author: cole
owner: cole
created: 2026-03-31
updated: 2026-03-31
scope: Vue 3 + TypeScript + pnpm Monorepo
applies_to: human, ai-agent
---

# ENG-STD-005 检查与发布门禁规范

## 1. 文档定位

本文档用于定义工程治理中的检查分层、测试分层、执行时机与门禁规则，重点回答：

- `check / verify / test` 各负责什么
- 单元测试、集成测试、E2E 测试如何分层
- 本地开发、提交前、CI 各执行哪些检查
- 门禁失败后如何处理

本文档不展开业务测试设计、具体测试用例编写方法或 CI 平台配置细节。

## 2. 目标

本规范希望解决以下问题：

- 开发者不知道平时应该跑哪个命令
- `check`、`verify`、`test` 职责重叠
- 测试层级混乱，单元 / 集成 / E2E 使用边界不清
- 本地、提交前、CI 检查内容不一致
- 门禁失败后缺少统一处理规则

## 3. 命令分层原则

### 3.1 `check`

`check` 用于开发过程中的主动检查，重点解决基础静态质量问题。  
它适合作为本地高频执行入口，但不等同于完整发布门禁。

### 3.2 `check:fix`

`check:fix` 用于自动修复可安全修复的问题，例如格式和部分静态问题。  
不应对可能改变语义或扩大影响面的规则默认使用自动修复。

### 3.3 `verify`

`verify` 用于提交前或 CI 的完整门禁入口。  
其职责是聚合当前项目要求的关键检查，确保变更在进入主干前满足统一质量要求。

### 3.4 `test`

`test` 用于统一触发测试能力，但不应长期只保留单一模糊入口。  
测试命令应按测试层级拆分。

## 4. 测试层级

### 4.1 `test:unit`

单元测试用于验证局部模块、函数或组件的独立行为。

适用场景：

- 纯逻辑函数
- 工具方法
- 组件局部行为
- 单一模块状态变更

### 4.2 `test:integration`

集成测试用于验证模块之间协作、接口拼装与流程组合。

适用场景：

- 跨模块数据流
- 接口调用与状态协作
- 页面局部流程组合
- 包之间集成行为

### 4.3 `test:e2e`

E2E 测试用于验证真实用户链路、关键业务路径与系统级交互行为。

适用场景：

- 登录
- 下单
- 提交表单
- 支付或充值类关键路径
- 需要浏览器真实交互的流程

## 5. 执行层级

### 5.1 本地开发层

开发者在编码过程中应主动执行：

- `check`
- 必要时执行：
  - `test:unit`
  - `test:integration`
  - `lint:style`
  - `lint:deps`

目标是在本地尽早发现问题，而不是提交后再返工。

### 5.2 提交前层

提交前通过 Git hooks 自动执行：

- 暂存区静态检查
- 暂存区样式检查
- commit message 校验

提交前门禁应优先关注：

- 快速反馈
- 低误伤
- 只检查当前变更相关内容

### 5.3 CI 层

CI 应执行全量检查：

- `verify`
- 全量样式检查
- 依赖边界检查
- 项目要求的测试层

CI 的目标不是替代本地开发检查，而是作为进入主干前的最终质量门禁。

## 6. 推荐进入条件

### 6.1 何时至少应跑 `test:unit`

- 局部逻辑改动
- 工具方法改动
- 单模块行为修复
- 小型 bugfix

### 6.2 何时应补 `test:integration`

- 跨模块流程改动
- 数据流协作改动
- 包之间协作改动
- 中等复杂度功能变更

### 6.3 何时应补 `test:e2e`

- 关键用户路径变更
- 页面级主流程改动
- 高风险业务链路
- 需要真实交互链路验证的改动

## 7. 门禁失败处理

### 7.1 本地开发失败

- 建议先修复后再继续编码
- 不要求每次失败都阻断开发过程
- 但不应长期忽略

### 7.2 提交前失败

- 默认阻断提交
- 开发者必须修复或进入例外流程

### 7.3 CI 失败

- 默认阻断合并
- 开发者必须修复或获得明确例外批准

## 8. 推荐脚本清单

推荐在 `package.json` 中维护以下脚本：

```json
{
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "check": "vp check",
    "check:fix": "vp check --fix",
    "test": "vp test",
    "test:unit": "vp test --unit",
    "test:integration": "vp test --integration",
    "test:e2e": "vp test --e2e",
    "lint:style": "stylelint \"apps/**/*.{css,scss,less,vue}\" \"packages/**/*.{css,scss,less,vue}\"",
    "lint:style:fix": "stylelint \"apps/**/*.{css,scss,less,vue}\" \"packages/**/*.{css,scss,less,vue}\" --fix",
    "lint:deps": "depcruise --config .dependency-cruiser.cjs apps packages",
    "verify": "pnpm check && pnpm lint:style && pnpm lint:deps && pnpm test"
  }
}
```

上述脚本属于推荐命名，不要求当前仓库已全部实现。  
若项目采用不同命名方式，应保证职责边界等价。

## 9. 例外机制

当某类检查暂时无法满足时，可申请例外，但必须满足：

1. 有明确原因
2. 有影响评估
3. 有临时范围
4. 有后续治理计划
5. 有明确确认人

例外不应以口头方式长期存在，应进入专项规范或技术债记录。

## 10. 一句话总结

本规范的核心不是堆更多命令，而是把检查和测试命令按职责、层级和门禁场景拆清楚，让开发者知道：

- 平时跑什么
- 提交前会拦什么
- CI 会全量查什么
- 失败后该怎么处理
