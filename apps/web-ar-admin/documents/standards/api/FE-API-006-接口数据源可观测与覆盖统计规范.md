---
title: 接口数据源可观测与覆盖统计规范
code: FE-API-006
type: standard
status: stable
author: hermes
owner: cole
created: 2026-04-11
updated: 2026-04-11
scope: frontend-mock-observability
applies_to: human, ai-agent
---

# 1. 目的

建立项目级“接口数据源可观测与覆盖统计”统一规范，支撑业务在 mock-full/api-bridge/api-full 各阶段可控推进。

# 2. 适用范围

- 所有需要 mock 与真实接口并行演进的业务域
- 包含开发联调、测试预演、接口齐套前后切换

# 3. 核心定义

1. 数据源模式

- mock-full：整域统一 mock
- api-bridge：整域真实优先，缺口由 bridge/mock 补齐
- api-full：整域全真实，禁止 fallback

2. 接口唯一键

- `domain + method + path`

3. source 枚举

- real | mock | bridge | unknown

4. reason 枚举

- strategy-forced | api-null | timeout | not-implemented | error

# 4. 分层约束

- 页面层仅调用 gateway，禁止直接混用 adapter 与 mockGateway。
- gateway 负责模式路由与 source 上报。
- adapter 仅处理 DTO->VM 映射与真实请求。
- mockGateway 仅处理高保真模拟与状态回流。

# 5. 可观测最小要求

必须提供：

- 当前模式展示
- 单接口 source 明细
- 总体统计（total/real/mock/bridge/unknown）
- 领域覆盖统计（按 domain 聚合）

# 6. 统计口径

- 覆盖统计：按接口唯一键去重统计
- 运行统计：按请求次数统计
- 页面展示至少包含覆盖统计；运行统计可选增强

# 7. 依赖治理

- 默认零新增依赖。
- 如需引入 MSW 等新依赖，必须先完成依赖评审并获批准。

# 8. 验收门禁

- api-full 模式下出现 mock fallback 视为不通过。
- 新增业务域接入时，必须补 endpoint registry 与 source 上报。

# 9. 关联

- `FE-API-005-接口Mock与联调协作规范.md`
- `../../guides/integration/Mock可观测方案模块接入指南.md`
