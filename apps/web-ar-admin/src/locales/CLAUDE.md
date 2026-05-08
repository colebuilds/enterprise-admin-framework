# i18n Agent Context

## 支持语言

zh-CN / en-US（仅这两种）

## 调用 API

- 模板: `$t('key.path')`
- script setup: `const { t } = useI18n(); → t('key.path')`
- 非组件上下文: `import { $t } from '#/locales' → $t('key.path')`

## Key 命名规范

- 以文件名为 namespace 前缀: `finance.withdrawOrder.title`
- 嵌套对象表达层次: `{ finance: { withdrawOrder: { title: "..." } } }`
- 新增 key 风格参考同文件已有 key

## 文件推断（业务域 → JSON 文件）

| 关键词含义 | 推断文件 |
| --- | --- |
| 充值/提现/结算/财务/手续费 | `finance.json` |
| 报表/报告/统计 | `report.json` |
| 系统/用户/角色/权限/管理员 | `system.json` |
| 商户/租户 | `tenant.json` |
| 会员/玩家 | `member.json` |
| 代理/分销 | `agent.json` |
| 游戏/彩票 | `game.json` |
| 菜单/导航 | `menu.json` |
| 运营/活动/公告 | `operations.json` |
| 通用按钮/状态/操作/提示 | `page.json` 或 `common.json` |

## 禁止

- 状态枚举 label（启用/禁用/订单状态）→ 走字典，不走 locale JSON
- 只改 zh-CN 不改 en-US（必须两套同步）
- 修改 `packages/locales/` 下的 vben 框架层文件

## 维护说明

本文件是 i18n 执行规则的唯一来源。变更时必须同步检查：

- `.claude/commands/i18n-fix.md`
- `.claude/commands/i18n.md`
- `.claude/commands/i18n-check.md`
- `documents/guides/development/国际化接入与运行时机制说明.md`

触发更新时机：新增/删除 locale JSON 文件、API 变化、命名规范调整、支持语言变更
