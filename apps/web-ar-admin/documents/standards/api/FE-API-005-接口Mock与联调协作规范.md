---
title: 接口Mock与联调协作规范
code: FE-API-005
type: standard
status: stable
author: hermes
owner: cole
created: 2026-04-10
updated: 2026-04-11
scope: frontend-mock-and-api-integration
applies_to: human, ai-agent
---

# 1. 目的

建立项目级统一 Mock 与联调规范，保证“页面数据一致性、接口切换可控、后续可演进”。

# 2. 适用范围

- 所有前端业务模块的接口联调阶段
- 包含 dev 本地联调、测试环境预演、后端未齐期间的功能开发

# 3. 核心原则

1. 单一状态源

- 同一业务域内，统计、列表、详情必须来自同一份领域状态推导。

2. 统一筛选口径

- tenant/time/status 等筛选条件在卡片、列表、分页统计中口径一致。

3. 操作后联动一致

- 单条/批量操作后，统计与列表必须同步刷新并保持一致。

4. 禁止页面层混源

- 禁止页面层“部分真实接口 + 部分mock结果”自由拼装。
- 仅允许 gateway/adapter 层做桥接。

5. 可观测

- 页面必须显示当前模式与数据源。
- 必须能精确到单接口 source（real/mock/bridge）。

# 4. 三态模式定义

1. mock-full：整域统一 mock。
2. api-bridge：整域真实优先，缺口由 bridge/mock 补齐，输出统一领域态。
3. api-full：整域全真实，禁止 fallback 到 mock。

# 5. 技术选型规范

推荐顺序：MSW > json-server/express > vite-plugin-mock。

- MSW：最接近真实请求链路，适合复杂联动。
- json-server/express：适合独立假后端服务。
- vite-plugin-mock：适合简单快速场景，不作为复杂联动长期默认。

注：是否引入新依赖必须经过依赖评审；默认先走“零新增依赖”方案。

# 6. 最低能力要求（高保真边界）

每个业务域 Mock 至少满足：

- 分页/排序/筛选组合
- 状态变更与回流
- 错误语义（超时、权限、冲突、重复提交）
- 字典与时区口径对齐
- scenario 可复现实验

# 7. 可观测与统计口径

统一事件字段：

- domain、endpoint、method、path
- source：real|mock|bridge|unknown
- reason：strategy-forced|api-null|timeout|not-implemented|error
- ts

统一统计口径：

- 接口唯一键：domain + method + path
- 同时输出：
  - 覆盖统计（去重接口）
  - 运行统计（请求次数）

# 8. 联调切换策略

1. 后端未齐：使用 mock-full。
2. 后端部分可用：使用 api-bridge（推荐 80% 阶段）。
3. 后端齐套：切换 api-full 并禁止 fallback。

# 9. 文档与变更要求

- 每个需求目录必须包含：
  - preflight-analysis.md
  - api-inventory.md
  - technical-design.md
  - mock-strategy.md
  - dependency-review.md
  - test-plan.md
- 开发计划分两类：
  - 需求级计划：放在需求目录内
  - 全局能力计划：放在 `guides/development/`，需求目录仅保留引用
- 任何新增筛选字段，必须同步更新：列表过滤、统计计算、分页 total 逻辑。
- 任何新增依赖，必须先记录评审结论。

# 10. 验收清单

- [ ] 页面显示当前模式与数据源
- [ ] 单接口 source 可观测
- [ ] 同一筛选下统计与列表一致
- [ ] 操作后统计与列表联动一致
- [ ] 覆盖统计（total/real/mock/bridge）可导出
- [ ] api-full 模式下 fallback=0
- [ ] 文档已更新（需求文档 + 本规范）
