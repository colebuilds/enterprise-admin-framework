---
title: 出款数据看板 Test Plan
type: guide
status: stable
author: hermes
owner: cole
created: 2026-04-10
updated: 2026-04-11
audience: human, ai-agent
---

# 0. 测试目标

验证三态模式下数据一致性、可观测准确性与可复用接入能力。

# 1. 测试范围

- 三态模式切换（mock-full/api-bridge/api-full）
- 统计/列表/操作回流一致性
- 单接口 source 明细与总览统计
- 领域覆盖率统计
- fallback reason 分类

# 2. 用例矩阵

| ID | 用例 | 前置 | 预期 |
| --- | --- | --- | --- |
| WD-TC-001 | 商户筛选口径一致 | 选择商户A | 统计与列表一致收敛 |
| WD-TC-002 | 员工状态操作联动 | 更新员工状态 | 统计+列表同步刷新 |
| WD-TC-003 | 订单转派联动 | 单条/批量转派 | 统计+列表同步刷新 |
| WD-TC-004 | 模式展示正确 | 切换模式 | 页面展示当前模式正确 |
| WD-TC-005 | 单接口source准确 | 触发多接口请求 | 每个endpoint可见source |
| WD-TC-006 | 总览统计准确 | 触发real+mock混合场景 | total/real/mock/bridge正确 |
| WD-TC-007 | api-full门禁 | api-full下触发缺口接口 | fallback被阻断并报错 |

# 3. 验收门槛

- 单接口 source 可见（非仅页面级标签）
- 可导出总量统计（real/mock/bridge）
- 能按领域输出覆盖率
- api-full 模式下 mock fallback=0

# 4. 执行节奏

- 先完成 Phase 0 文档评审
- 再按 `../../../standards/ai-collaboration/FE-AI-007-AI分阶段执行与连续交付协议.md` 分阶段执行

# 5. 关联

- `technical-design.md`
- `mock-strategy.md`
- `api-inventory.md`
- `../../../standards/ai-collaboration/FE-AI-007-AI分阶段执行与连续交付协议.md`
