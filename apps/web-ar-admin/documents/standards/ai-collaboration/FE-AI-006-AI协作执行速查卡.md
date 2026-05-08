---
title: AI协作执行速查卡
type: standard
code: FE-AI-006
status: stable
author: cole
owner: cole
created: 2026-04-10
updated: 2026-04-10
scope: ai collaboration quick guide
applies_to: human, ai-agent
---

# AI协作执行速查卡

## 1. 执行流

1. 明确目标与不包含项
2. 明确边界（允许改/禁止改）
3. 形成计划（文件+命令+验证）
4. 获得明确执行授权
5. 执行最小必要改动
6. 输出结果与偏差审计

## 2. 红线

- 未授权不落盘
- 未授权不做依赖变更
- 不做全仓高副作用操作
- 不顺手扩改

## 3. 必停

- 需要改计划外文件
- 需要高风险计划外命令
- 需要依赖或 lockfile 变更
- 原方案失效

## 4. 回报四件套

- 文件：改了哪些、是否计划内
- 命令：跑了什么、结果如何、是否计划内
- 变化：新增/删除/重命名
- 审计：计划外改动、计划外命令、未完成项、风险点

## 5. 入口

- `documents/standards/ai-collaboration/FE-AI-999-AI协作一页纸.md`
- `documents/standards/ai-collaboration/FE-AI-007-AI分阶段执行与连续交付协议.md`

## 6. 可直接执行口令模板（按 FE-AI-007）

- 启动阶段：
  - “开始 P1，初始化 EU 看板，按协议推进。”
- 推进下一个单元：
  - “继续下一个 EU，先报当前阶段/当前EU/验证状态。”
- 阶段验收：
  - “执行阶段验收，输出证据与结论。”
- 阶段提交：
  - “阶段通过后执行一次 phase commit，并给出文件清单。”
- 故障恢复：
  - “从上次中断点恢复，先回报当前阶段/当前EU/下一步。”
