# 字典 Key 速查表

> **工具链说明**：本表由 `tools/dict-keys-meta.ts`（手动维护）衍生而来。  
> 后端新增 key → 先在 `dict-keys-meta.ts` 补中文说明 → 重跑脚本更新 `registry.ts`。  
> 详见 `spec-dict-toolchain.md`。

---

## 歧义 Key（必须指定 source）

这 3 个 key 同时存在于多个接口，`useDictOptions` 编译期强制要求第二参数 `source`：

| key | source | 说明 |
| --- | --- | --- |
| `countryList` | `'common'` | 后台自定义国家配置（业务侧维护，范围较小） |
| `countryList` | `'platform'` | 平台基础国家数据（完整列表，含国码/拨号前缀） |
| `currencyList` | `'common'` | 后台币种配置（业务侧维护，范围较小） |
| `currencyList` | `'platform'` | 平台基础币种数据（完整列表，含货币符号） |
| `financialTypeList` | `'common'` | 通用财务类型（充值/提现/调账等） |
| `financialTypeList` | `'v1'` | v1 平台财务类型（v1 特有分类） |

**用法**：

```ts
useDictOptions('countryList', 'platform'); // ✅ 必须指定 source
useDictOptions('countryList'); // ❌ 编译报错
```

---

## common 源（静态，登录预热）

| key | 中文含义 | 典型使用场景 |
| --- | --- | --- |
| `enableStateList` | **启用/禁用状态**（0=禁用 1=启用，全局最高频） | 用户/商户/通道等所有实体的状态列和筛选 |
| `stateList` | 通用状态列表（0=关闭 1=开启） | 比 enableStateList 更通用的开关状态 |
| `tenantStateList` | 商户状态（正常/冻结/停用） | 商户列表状态列、商户筛选 |
| `userTypeList` | 用户类型（普通用户/代理） | 用户管理筛选 |
| `rechargeStateList` | 充值订单状态（待处理/成功/失败等） | 充值订单列表、工单筛选 |
| `withdrawStateList` | 提现订单状态（待处理/成功/失败等） | 提现订单列表 |
| `withdrawWorkStateList` | 提现工单状态（完整） | 提现工单状态列和详情 |
| `withdrawWorkStateFilterList` | 提现工单状态（筛选专用） | 提现工单筛选区（比完整版少部分状态） |
| `withdrawAuditStateList` | 提现审核状态（待审/通过/拒绝） | 提现审核工作台 |
| `withdrawOrderActionTypeList` | 提现工单操作类型（派单/撤回/拒绝） | 提现工作台操作记录 |
| `withdrawCategory` | 提现大类枚举（common 系统级） | ⚠️ 系统枚举，非商户配置；商户侧用 dynamic `withdrawCategoryList` |
| `withdrawCategoryEnumList` | 提现大类枚举列表（common 系统级） | 同上 |
| `rechargeCategoryEnumList` | 充值大类枚举（common 系统级） | ⚠️ 系统枚举，非商户配置；商户侧用 dynamic `rechargeCategoryList` |
| `payModeList` | 支付方式（银行卡/钱包/UPI/PIX等） | 充提配置、工单筛选 |
| `bankCardTypeList` | 银行卡类型（储蓄卡/信用卡等） | 支付方式配置 |
| `pixWalletTypeList` | PIX 钱包类型（巴西支付） | PIX 充提配置 |
| `thirdPayChannelTypeList` | 三方支付通道类型（入金/出金/双向） | 三方通道配置 |
| `gameCategoryList` | 游戏分类（电子/真人/体育/彩票等） | 游戏管理、报表筛选 |
| `gameTypeList` | 游戏类型（细粒度） | 游戏管理 |
| `activityStateList` | 活动状态（启用/暂停/结束） | 营销活动列表和筛选 |
| `activityTypeList` | 活动类型（首充/连充/幸运翻倍等） | 活动创建和筛选 |
| `exportStateList` | 数据导出任务状态（待处理/成功/失败） | 导出记录查询 |
| `registerSourceList` | 用户注册来源（H5/APP/PC等） | 用户分析、筛选 |
| `language` | 语言列表（common 源，后台语言配置） | ⚠️ common 源；多语言设置页用 platform `languageList` |
| `frequencyList` | 频率类型（每日/每周/每月） | 任务周期、奖励发放频率配置 |
| `validTypeList` | 有效期类型（永久/固定天数） | 奖励/礼包有效期配置 |
| `targetList` | 目标对象类型（用户/商户/代理） | 营销活动目标配置 |
| `sendTimeTypeList` | 消息发送时间类型（立即/定时） | 站内信/推送配置 |
| `inmailTargetList` | 站内信目标用户类型 | 站内信发送配置 |
| `popupTypeList` | 弹窗类型（首页/活动/公告） | 弹窗管理 |
| `jumpTypeList` | 跳转类型（内页/外链/活动） | 活动/推送跳转配置 |
| `jumpPageList` | 跳转落地页列表 | 配合 jumpTypeList 使用 |
| `informationTypeList` | 资讯/公告类型 | 内容管理 |
| `orderDispatchModeList` | 提现工单派发模式（自动/手动） | 提现工作台配置 |
| `warningCategoryList` | 风控预警分类 | 风控预警规则配置 |
| `warningTypeList` | 风控预警类型 | 风控预警规则配置 |
| `blackContentTypeList` | 黑名单内容类型（IP/手机/设备等） | 风控黑名单管理 |
| `blackFreezeTypeList` | 黑名单冻结类型 | 风控冻结策略配置 |
| `userPermissionLevelList` | 用户权限等级 | 用户权限管控 |
| `userActivityBlockTypeList` | 用户活动屏蔽类型 | 活动黑名单配置 |
| `comparatorList` | 比较器类型（大于/小于/等于） | 规则引擎条件配置 |
| `schedulerTaskTypeList` | 定时任务类型 | 定时调度配置 |
| `schedulerTriggerTypeList` | 定时任务触发类型（Cron/固定间隔） | 定时调度配置 |
| `schedulerRequestMethodList` | 定时任务请求方法（GET/POST） | 定时调度配置 |
| `intervalTimeTypeList` | 时间间隔类型（分/时/天） | 调度配置、冷却时间 |
| `vipRewardTypeList` | VIP 奖励类型 | VIP 体系配置 |
| `rebateMode` | 返水计算模式 | 返水活动配置 |
| `giftPackRewardTypeList` | 礼包奖励类型 | 礼包配置 |
| `compensationTypeList` | 补偿类型（余额/积分/礼包等） | 补偿发放配置 |
| `compensationStateList` | 补偿状态（待发放/已发放/已过期） | 补偿记录查询 |
| `compensationReceiveTypeList` | 补偿领取方式 | 补偿配置 |
| `taskCycleList` | 活动任务周期类型 | 任务活动配置 |
| `withdrawUserRankList` | 提现用户风险等级 | 风控筛选 |
| `withdrawWalletTypeList` | 提现钱包类型（银行卡/电子钱包/加密货币） | 提现方式配置 |
| `withdrawUserActionTypeList` | 提现用户操作类型 | 提现行为日志 |
| `withdrawWorkProcessStateList` | 提现工单处理状态（流程节点） | 工单处理追踪 |
| `platformTypeList` | 平台类型 | 多平台管理 |
| `thirdStateList` | 三方服务状态 | 三方服务商管理 |
| `smsConfigList` | 短信服务商配置列表 | 短信通道选择 |
| `emailConfigList` | 邮件配置列表 | 邮件服务商选择 |
| `templateFileList` | 消息模板文件列表 | 邮件/短信模板管理 |
| `pushPriorityTypeList` | 消息推送优先级 | APP 推送配置 |
| `messageJumpTypeList` | 消息跳转类型（推送点击行为） | APP 推送配置 |
| `fbMsgSendStateList` | Facebook 消息发送状态 | FB 推送记录查询 |
| `fbTargetList` | Facebook 推送目标类型 | FB 推送任务配置 |
| `feedBackStateList` | 用户反馈状态（待处理/已处理） | 用户反馈管理 |
| `topRechargeWithdrawTypeList` | 充提排行统计类型 | 数据报表 |
| `eventLogStateList` | 事件日志状态 | 系统事件日志查询 |
| `eventTriggerModeList` | 事件触发模式（实时/定时/手动） | 营销事件配置 |
| `sysEventLogEventCategoryList` | 系统事件日志事件分类 | 事件日志查询筛选 |
| `sysUserNotifyMessageTypeList` | 系统通知消息类型（站内信/邮件/短信） | 通知配置 |
| `cacheDBList` | 缓存数据库列表（Redis 实例） | 缓存管理后台 |
| `cacheInstanceList` | 缓存实例列表 | 缓存管理后台 |
| `ossFileTypeEnum` | OSS 文件类型枚举 | 文件上传类型校验 |
| `orderStateEnum` | 工单状态枚举 | 提现工单状态流转 |
| `playTypeEnum` | 游戏玩法类型枚举 | 彩票/游戏玩法配置 |
| `lotteryGameCode` | 彩票游戏码 | 彩票管理 |
| `dictCategoryList` | 字典分类（后台字典管理用） | 后台字典管理页分类筛选 |
| `dynamicDictionaryKeyList` | 动态字典 key 枚举（后台配置用） | 管理后台选择 dynamic key |
| `disablePermissList` | 禁用权限列表 | 权限管控配置 |
| `approvalRoleAuthorizeList` | 审批角色授权列表 | 提现审批流配置 |
| `approvalSubRoleAuthorizeList` | 审批子角色授权列表 | 提现审批子流程配置 |
| `approvalUserRoleList` | 审批用户角色 | 工单审批员角色选择 |
| `artificialRechargeTypeList` | 人工充值类型（common 源） | ⚠️ common 源；v1 侧用 `manualRechargeTypeList` |
| `analyticsEventTypeList` | 数据分析事件类型 | 埋点事件配置 |
| `clickTypeList` | 点击类型（活动/广告） | 点击行为统计 |
| `luckyDoubleActivteStateList` | 幸运翻倍活动状态 | 幸运翻倍活动管理 |
| `luskyDoubleTargetGroupList` | 幸运翻倍目标用户组 | 幸运翻倍活动配置 |
| `lossReliefRewardTImeTypeList` | 亏损救援奖励发放时间类型 | 亏损救援活动配置 |
| `promotionShareRewardTypeList` | 分享活动奖励类型 | 分享活动规则配置 |
| `promotionShareClaimTypeList` | 分享活动奖励领取类型 | 分享活动规则配置 |
| `promotionShareClaimPriorityTypeList` | 分享活动奖励领取优先级 | 分享活动规则配置 |
| `promotionShareUserTypeList` | 分享活动用户类型（老用户/新用户） | 分享活动规则配置 |
| `packageTransferConfigTypeList` | 礼包转让配置类型 | 礼包转让规则配置 |
| `packageTransferRewardModeList` | 礼包转让奖励发放模式 | 礼包转让规则配置 |
| `packageTransferTargetTypeList` | 礼包转让目标用户类型 | 礼包转让规则配置 |

---

## v1 源（静态，登录预热）

> v1 是越南彩票平台接口，所有 v1 key 通过 `/v1/Common/GetDictionary` 获取。

| key | 中文含义 | 典型使用场景 |
| --- | --- | --- |
| `userStateList` | 会员账号状态（v1 平台） | ⚠️ 仅用于 v1 会员；通用启用/禁用用 common `enableStateList` |
| `agentTypeList` | 代理类型（直属/间接） | 代理层级管理 |
| `blockStateList` | 封号状态 | 用户封号管理 |
| `gameOrderStateList` | 游戏订单状态 | 游戏订单查询 |
| `orderStatusList` | 订单状态 | 订单查询 |
| `orderOrderByTypeList` | 订单列表排序字段 | 订单列表排序选择 |
| `logStateList` | 日志状态 | 操作日志查询 |
| `logTypeList` | 日志类型 | 操作日志分类 |
| `queryTimeTypeList` | 查询时间维度（今日/本周/本月） | 报表查询 |
| `manualRechargeTypeList` | 人工充值类型（v1 源） | ⚠️ v1 源；common 侧用 `artificialRechargeTypeList` |
| `manualRechargeRecordStateList` | 人工充值记录状态 | 人工充值记录查询 |
| `manualRechargePermissionStateList` | 人工充值权限状态 | 权限审批管理 |
| `manualRechargePermissionTypeList` | 人工充值权限类型 | 权限审批管理 |
| `onlineBankingStateList` | 网银通道状态 | 网银配置管理 |
| `phoneTypeList` | 手机号类型（本地/国际） | 区分本地/国际号码 |
| `subsetUserLevelList` | 下级代理用户等级 | 代理管理 |
| `subsetUserOrderList` | 下级用户列表排序字段 | 代理管理 |
| `userOrderByList` | 用户列表排序字段 | 会员列表排序 |
| `userRelativeLevelList` | 用户关联代理等级 | 代理关系查询 |
| `userRelativeOrderList` | 用户关联列表排序 | 代理关系查询 |
| `upiList` | UPI 支付账号列表（印度支付） | 支付配置 |
| `sportGamesOrderStatusList` | 体育游戏订单状态 | 体育订单查询 |
| `gameType5DList` | 5D 彩票游戏类型 | 5D 彩票管理 |
| `gameTypeK3List` | K3 彩票游戏类型 | K3 彩票管理 |
| `gameTypeWinList` | Win 彩票游戏类型 | Win 彩票管理 |
| `xosoBettingTypeList` | 越南彩票投注类型 | 越南彩票管理 |
| `xosoTypeParentList` | 越南彩票玩法父分类 | 越南彩票管理 |
| `fXosoOrderStatusList` | 快乐彩订单状态 | 快乐彩订单查询 |

---

## group 源（静态，登录预热）

> 通过 `/SysDictionary/GetGroupData` 获取，label=`dictName`，value=`dictCode`。

| key                      | 中文含义                | 典型使用场景     |
| ------------------------ | ----------------------- | ---------------- |
| `countryDictionaryList`  | 国家字典（含国码/国旗） | 商户国家配置     |
| `currencyDictionaryList` | 币种字典（含货币符号）  | 商户币种配置     |
| `languageDictionaryList` | 语言字典                | 商户语言支持配置 |
| `timeZoneDictionaryList` | 时区字典（含偏移量）    | 商户时区配置     |

---

## platform 源（静态，登录预热）

> 通过 `/Common/GetPlatformDic` 获取，label/value 字段按 key 用途差异（参见 PLATFORM_LABEL_CANDIDATES）。

| key | 中文含义 | 典型使用场景 |
| --- | --- | --- |
| `languageList` | 语言列表（platform 源，多语言设置） | 语言偏好设置页；⚠️ 后台语言配置用 common `language` |

---

## dynamic 源（懒加载，模块内按需触发）

> 通过 `/Common/GetDynamicDictionary` 获取，首次调用 `useDictOptions(key)` 时触发请求。  
> TanStack Query 提供 5 分钟 stale 缓存 + in-flight 去重。  
> CRUD 后需手动失效：`queryClient.invalidateQueries({ queryKey: ['dict', 'dynamic'] })`

| key | 中文含义 | label 字段 | value 字段 | 典型使用场景 |
| --- | --- | --- | --- | --- |
| `roleList` | **角色列表** | `roleName` | `roleId` | 员工账号角色分配（最常用） |
| `tenantList` | **商户列表** | `tenantName` | `tenantId` | 平台侧商户选择器（最常用） |
| `menuList` | 菜单列表 | `menuName` | `menuId` | 角色权限配置的菜单选择 |
| `organizationList` | 组织架构（商户分组） | `orgName` | `orgId` | 平台侧商户分组 |
| `sysCurrencyList` | 系统结算币种列表 | `sysCurrency` | `sysCurrency` | 财务配置 |
| `payCodeList` | 三方支付映射码 | `payCode` | `payCode` | 通道配置的支付方式选择 |
| `sysPayChannelList` | 系统支付通道（平台级） | `sysChannelName` | `sysChannelId` | 通道管理；含 `inOutType` 判断入/出金方向 |
| `tenantPayChannelList` | 商户支付通道 | `customName` | `tenantChannelId` | 商户通道配置；含 `tenantCategoryId` |
| `thirdPayMerchantList` | 三方商户（支付服务商） | `customName` | `merchantId` | 通道绑定 |
| `withdrawCategoryList` | 提现大类（商户级） | `name` | `id` | 提现通道配置、工单筛选；⚠️ 非 common 系统枚举 |
| `rechargeCategoryList` | 充值大类（商户级） | `name` | `id` | 充值通道配置、工单筛选；⚠️ 非 common 系统枚举 |
| `withdrawConfigGroupList` | 提现配置分组 | `groupName` | `configGroupId` | 提现规则分组管理 |

---

## 常见易混淆 Key 对照

| 场景 | 正确 key | 错误（易混） | 区别 |
| --- | --- | --- | --- |
| 通用启用/禁用状态 | `enableStateList` (common) | `stateList` | stateList 更通用，enableStateList 更语义化 |
| 商户侧提现大类下拉 | `withdrawCategoryList` (dynamic) | `withdrawCategory` / `withdrawCategoryEnumList` (common) | dynamic 是商户配置数据，common 是系统枚举 |
| 商户侧充值大类下拉 | `rechargeCategoryList` (dynamic) | `rechargeCategoryEnumList` (common) | 同上 |
| 多语言设置页语言 | `languageList` (platform) | `language` (common) / `languageDictionaryList` (group) | platform 是完整语言列表 |
| v1 会员状态 | `userStateList` (v1) | `enableStateList` (common) | 语义不同，不可混用 |
| 人工充值类型 common | `artificialRechargeTypeList` (common) | `manualRechargeTypeList` (v1) | 两个平台各自的类型，不通用 |
