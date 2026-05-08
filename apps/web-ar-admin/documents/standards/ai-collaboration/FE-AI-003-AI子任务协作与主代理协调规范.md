---
title: AI子任务协作与主代理协调规范
type: standard
code: FE-AI-003
status: stable
author: cole
owner: cole
created: 2026-03-26
updated: 2026-04-10
scope: multi-agent coordination
applies_to: human, ai-agent
---

# AI子任务协作与主代理协调规范

## 1. 目标

用于复杂任务下的主代理/子代理协作，提升并行效率并降低冲突。

## 2. 何时拆分

满足任意两项可拆分：

- 多模块或多目录
- 可并行盘点
- 分析与实施并存
- 主代理连续卡住

## 3. 何时不拆

- 小任务（1~2 文件）
- 高耦合单链路
- 边界不清
- 频繁碰撞同一核心文件

## 4. 角色边界

主代理负责：

- 收边界、定方案、分配文件所有权、统一收口

子代理负责：

- 在授权范围内执行子任务
- 返回结构化结果
- 发现冲突立即回主代理

## 5. 协作顺序

1. 主代理收边界
2. 并发只读盘点
3. 主代理定实施方案
4. 并发实施
5. 主代理统一校验与回报

## 6. 文件与风险控制

- 同一核心文件默认单负责人。
- 入口文件、索引文件、全局配置默认主代理负责。
- 计划外改动与高风险动作必须先暂停确认。
- 未获得明确执行授权前，不落盘修改。

## 7. 子任务回报格式

- 结论
- 文件清单
- 风险点
- 建议下一步

## 8. 关联文档

- `documents/standards/ai-collaboration/FE-AI-001-AI变更控制协议.md`
- `documents/standards/ai-collaboration/FE-AI-002-AI任务边界模板.md`
- `documents/standards/ai-collaboration/FE-AI-006-AI协作执行速查卡.md`
- `documents/standards/ai-collaboration/FE-AI-007-AI分阶段执行与连续交付协议.md`
