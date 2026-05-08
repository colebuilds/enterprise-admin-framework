---
title: 出款数据看板 Preflight Analysis
type: design
status: stable
author: hermes
owner: cole
created: 2026-04-11
updated: 2026-04-11
audience: human, ai-agent
---

# 0. 目标

在开发前完成“现状-复用-缺口-风险”预研，确保先定方案再编码。

# 1. 现状盘点

- 当前页面目录：`src/views/finance/withdrawOrder/dashboard/`
- 当前分层：`domain + gateway + apiAdapter + mockGateway`
- 当前已具备：
  - 全局商户筛选（tenantIds）
  - 统计/列表联动刷新能力
  - 数据源标签显示（MOCK/API）
- 当前缺项：
  - 三态模式（mock-full/api-bridge/api-full）未成体系
  - 单接口 source 级可观测缺失
  - 领域覆盖率统计缺失

# 2. 复用能力盘点（优先复用，不重复造轮子）

- 请求链路：`src/utils/http/axios/index.ts`
- 时区能力：`src/utils/dateUtil.ts`
- 页面状态与组合：Vue + Pinia + composables
- UI 组件：Naive UI + 现有 ProComponents
- 事件能力：项目已存在 `mitt` 依赖，可用于轻量事件广播（可选）

# 3. 方案边界

- 本轮先做“方案与文档完备”，再进入代码实现。
- 本轮默认零新增第三方依赖；如需 MSW，必须先走依赖评审。
- 可观测统计口径固定为：`domain + method + path` 唯一接口键。

# 4. 风险与应对

1. 风险：页面层自由混用 mock/real 导致口径不一致

- 应对：统一经 gateway 输出单一领域态

2. 风险：fallback 原因不可追踪

- 应对：source event 统一上报 `reason`

3. 风险：模块接入后技术代码散落

- 应对：抽出 `mock-core` 目录，统一 registry/coverage/mode

# 5. 开发前置结论

- 必须先完成：
  - 三态模式设计
  - 可观测数据模型
  - 依赖评审清单
  - 复用接入手册
- 上述文档评审通过后，才进入开发。
