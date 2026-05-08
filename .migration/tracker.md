# 模块迁移状态追踪

> 状态说明：⬜ 未开始 / 🔄 进行中 / ✅ 完成 / ❌ 阻塞

## 基础设施

| 子系统 | 状态 | e2e 验收 | 备注 |
| --- | --- | --- | --- |
| Env 重构 | ⬜ | — | spec-env.md |
| HTTP 客户端 | ✅ | — | spec-request.md；585 APIs / 12 模块；0 TS errors |
| ProComponents 搬入 | ✅ | — | 96 文件，lint 规则已 suppress |
| 登录 + 权限路由 | ✅ | smoke/auth | spec-access.md；routes 用小写 authority，roles:codes 传递，全部验收通过 |
| 字典体系 | ⬜ | smoke/dict-loading | spec-dict.md |
| 多语言 | ⬜ | 手动验证 | spec-i18n.md |

## 业务模块

| 模块 | 路径 | 状态 | e2e(老项目) | e2e(新项目) | 备注 |
| --- | --- | --- | --- | --- | --- |
| **system** |  |  |  |  |  |
| 系统用户 | /system/user | ✅ | — | ✅ | e2e/system/user.spec.ts 5/5 通过（2026-05-08） |
| 角色管理 | /system/role | ✅ | — | ✅ | e2e/system/role.spec.ts 3/3通过，2跳过（SIT无角色数据）（2026-05-08） |
| 系统监控 | /system/monitor | ⬜ | ⬜ | ⬜ |  |
| 缓存管理 | /system/cache | ⬜ | ⬜ | ⬜ |  |
| 平台日志 | /system/platformLog | ⬜ | ⬜ | ⬜ |  |
| **tenant** |  |  |  |  |  |
| 集团管理 | /tenant/organization | ⬜ | ⬜ | ⬜ |  |
| 调度器 | /tenant/scheduler | ⬜ | ⬜ | ⬜ |  |
| 样式管理 | /tenant/styleManage | ⬜ | ⬜ | ⬜ |  |
| 商户列表 | /tenant/tenantList | ⬜ | ⬜ | ⬜ |  |
| 字典管理 | /tenant/dictionary | ⬜ | ⬜ | ⬜ |  |
| 管理员 | /tenant/adminUser | ⬜ | ⬜ | ⬜ |  |
| **dashboard** |  |  |  |  |  |
| 欢迎页 | /dashboard/welcome | ⬜ | ⬜ | ⬜ |  |
| **member** |  |  |  |  |  |
| 在线用户 | /member/onlineUsers | ⬜ | ⬜ | ⬜ |  |
| 会员管理 | /member/user | ⬜ | ⬜ | ⬜ |  |
| 资金变动 | /member/fundChange | ⬜ | ⬜ | ⬜ |  |
| 银行卡 | /member/bankCard | ⬜ | ⬜ | ⬜ |  |
| 下级会员 | /member/subsetUser | ⬜ | ⬜ | ⬜ |  |
| 等级管理 | /member/level | ⬜ | ⬜ | ⬜ |  |
| **game** |  |  |  |  |  |
| 投注记录 | /game/betRecord | ⬜ | ⬜ | ⬜ |  |
| **report** |  |  |  |  |  |
| 统计报表 | /report/statistics | ⬜ | ⬜ | ⬜ | 依赖 echarts |
| **analytics** |  |  |  |  |  |
| 数据分析 | /analytics | ⬜ | ⬜ | ⬜ | 第三方 SDK |
| **finance** |  |  |  |  |  |
| 充值订单 | /finance/rechargeOrder | ⬜ | ⬜ | ⬜ | 复杂，后做 |
| 提现审核 | /finance/withdrawOrder | ⬜ | ✅(已有) | ⬜ | 已有 e2e spec |
| 充值配置 | /finance/rechargeType | ⬜ | ⬜ | ⬜ |  |
| 提现配置 | /finance/withdrawType | ⬜ | ⬜ | ⬜ |  |
| 提现配置 | /finance/withdrawConfig | ⬜ | ⬜ | ⬜ |  |
| **operations** |  |  |  |  |  |
| 站点列表 | /operations/siteList | ⬜ | ⬜ | ⬜ | 依赖 platformDic |
| APP管理 | /operations/app | ⬜ | ⬜ | ⬜ |  |
| 版本管理 | /operations/version | ⬜ | ⬜ | ⬜ |  |
| 打包管理 | /operations/takePackage | ⬜ | ⬜ | ⬜ |  |
| **运行时旁路** |  |  |  |  |  |
| AWS WebSocket | adminWs store | ⬜ | — | — | 最后迁 |
| SSE Stream | useSSEStream | ⬜ | — | — | 最后迁 |
