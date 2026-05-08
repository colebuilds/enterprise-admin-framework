---
title: 出款数据看板 API Inventory
type: design
status: stable
author: hermes
owner: cole
created: 2026-04-11
updated: 2026-04-11
audience: human, ai-agent
---

# 0. 统计口径

- 接口唯一键：`domain + method + path`
- 覆盖统计维度：`real / mock / bridge / unknown`

# 1. 能力总览（按当前实现口径）

- 总能力项：8
- 已有真实接口可复用：5
- 缺口（需 bridge/mock 补位）：3

# 2. 能力清单

| 领域 | 能力项 | method+path（逻辑标识） | 当前状态 | 备注 |
| --- | --- | --- | --- | --- |
| finance.withdraw.dashboard | getStats | GET /withdraw/dashboard/stats | bridge | 真实聚合口径未齐，需补齐层 |
| finance.withdraw.dashboard | listAlerts | GET /withdraw/dashboard/alerts | mock | 缺口接口 |
| finance.withdraw.dashboard | resolveAlert | POST /withdraw/dashboard/alerts/{id}/resolve | mock | 缺口接口 |
| finance.withdraw.dashboard | listStaff | GET /withdraw/dashboard/staff | bridge | 真实接口未齐，用占位映射 |
| finance.withdraw.dashboard | updateStaffStatus | POST /withdraw/work-action | real | 已复用 `workAction` |
| finance.withdraw.dashboard | listStaffAccounts | GET /withdraw/staff/select | real | 已复用 `getStaffUserSelectList` |
| finance.withdraw.dashboard | listOrders | GET /withdraw/order/page | real | 已复用 `withdrawOrderGetPageList` |
| finance.withdraw.dashboard | reassignOrder | POST /withdraw/order/assign | real | 已复用 `assignOrder` |

# 3. 缺口统计

- 缺口总量：3
  1. 预警分页
  2. 异常解除
  3. 员工实时状态分页（当前仅有弱替代）

# 4. 联调阶段策略

- mock-full：全部 mock
- api-bridge：真实优先 + 缺口补齐（统一领域态输出）
- api-full：全部真实，禁止 fallback

# 5. 验收门槛（开发前约定）

- 可输出单接口 source
- 可输出总接口 real/mock/bridge 数量
- 可输出领域覆盖率（finance.withdraw.dashboard）
