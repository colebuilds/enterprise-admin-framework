---
title: AI分阶段执行与连续交付协议（极简执行版）
code: FE-AI-007-LITE
type: standard
status: stable
author: hermes
owner: cole
created: 2026-04-11
updated: 2026-04-11
audience: human, ai-agent
---

# 1) 适用

复杂任务默认启用：阶段(Phase) -> 执行单元(EU) -> 验证 -> 阶段提交。

# 2) 必守规则

- 同一时刻仅 1 个 EU 为 in_progress。
- EU 验证失败，不得进入下一个 EU。
- 阶段验收失败，不得进入下一阶段。
- 每阶段一次 commit。
- 每步必须可恢复（记录阶段/EU/验证/下一步）。

# 3) todo 看板映射

- 1 个 EU = 1 个 todo。
- id 命名：`p<phase>-eu<index>`，如 `p2-eu3`。
- 状态：pending / in_progress / completed / cancelled。
- 仅当本阶段 EU 全 completed，才能做阶段验收与阶段提交。

# 4) 多Agent（可选）

- 仅同阶段内并行，且任务互不改同一核心文件。
- 并行上限 3。
- 并行完成后先统一验证，再继续。
- 阶段提交仍是一阶段一次。

# 5) 每个 EU 必填

- 执行命令
- 结果摘要
- 证据路径（日志/截图）
- 结论（pass/fail）
- 失败处置（回滚/修复后二次验证）
- 本次变更文件清单

# 6) 每阶段必填

- 阶段验收结论
- 阶段 DoD
- 风险/阻塞/升级触发条件
- 阶段提交信息（`<type>(<scope>): phase Px - <summary>`）

# 7) 启动前检查

- 方案评审通过
- 依赖策略确认
- 统计/验收口径冻结
- Git 前置完成（同步 main 后切分支）
