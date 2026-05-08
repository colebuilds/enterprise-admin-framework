---
title: Mock可观测方案模块接入指南
type: guide
status: stable
author: hermes
owner: cole
created: 2026-04-11
updated: 2026-04-11
audience: human, ai-agent
---

# 1. 目标

指导任意业务模块复用全局 mock 可观测方案，避免技术实现散落。

# 2. 接入前检查

- 已阅读并遵循：`standards/api/FE-API-005`、`standards/api/FE-API-006`
- 已冻结本域接口清单（domain+method+path）
- 已确认当前阶段模式（mock-full/api-bridge/api-full）

# 3. 最小接入步骤

1. 定义 domain（例：finance.withdraw.dashboard）
2. 注册 endpoint 清单（method/path/endpointKey）
3. gateway 接入三态模式
4. 页面仅通过 gateway 访问数据
5. 上报 source event（source + reason）
6. 页面展示模式与覆盖统计

# 4. 推荐目录（应用内先行）

- `src/mock-core/mode.ts`
- `src/mock-core/registry.ts`
- `src/mock-core/telemetry.ts`
- `src/mock-core/coverage.ts`

说明：稳定后可评估迁移到 `packages/mock-observability`。

# 5. 统一事件字段

- domain
- endpoint
- method
- path
- source: real|mock|bridge|unknown
- reason: strategy-forced|api-null|timeout|not-implemented|error
- ts

# 6. 验收清单

- [ ] 单接口 source 可见
- [ ] 总量统计可见
- [ ] 领域覆盖可见
- [ ] api-full 下 fallback=0
- [ ] 无未经批准新增依赖
