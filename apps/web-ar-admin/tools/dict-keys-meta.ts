/**
 * dict-keys-meta.ts — 字典 key 中文元数据
 *
 * 【手动维护文件】后端新增字典 key 时，在此补充中文说明。
 * dict-snapshot.ts 生成 registry.ts 时读取本文件，将注释注入到每个 key 旁边。
 *
 * 规范：
 *   - 格式：一句话说清业务含义，括号内补充关键约束或与同名 key 的区别
 *   - 新增 dynamic key 时：同步在 src/composables/dict/useDictionary.ts 的 DYNAMIC_FIELDS 里补字段映射
 *   - 新增歧义 key 时：在 AMBIGUOUS_META 里补充，并说明各 source 的区别
 */

/** KEY_SOURCE 中每个 key 的中文说明 */
export const KEY_META: Record<string, string> = {
  // ─────────────────────────── common ───────────────────────────────────────

  /** 活动状态（启用/暂停/结束），用于各类营销活动列表和筛选 */
  activityStateList: '活动状态（启用/暂停/结束）',

  /** 活动类型（首充/连充/幸运翻倍等），用于活动创建和筛选 */
  activityTypeList: '活动类型（首充/连充/幸运翻倍等）',

  /** 数据分析事件类型，用于埋点事件配置 */
  analyticsEventTypeList: '数据分析事件类型',

  /** 审批角色授权列表，用于提现审批流配置 */
  approvalRoleAuthorizeList: '审批角色授权列表',

  /** 审批子角色授权列表，用于提现审批子流程配置 */
  approvalSubRoleAuthorizeList: '审批子角色授权列表',

  /** 审批用户角色，用于工单审批员角色选择 */
  approvalUserRoleList: '审批用户角色（工单审批配置）',

  /** 人工充值类型（common 源），区别于 v1 源的 manualRechargeTypeList */
  artificialRechargeTypeList: '人工充值类型（common 源）',

  /** 银行卡类型（储蓄卡/信用卡等），用于支付方式配置 */
  bankCardTypeList: '银行卡类型（储蓄卡/信用卡等）',

  /** 黑名单内容类型（IP/手机号/设备号等），用于风控黑名单管理 */
  blackContentTypeList: '黑名单内容类型（IP/手机/设备等）',

  /** 黑名单冻结类型，用于风控冻结策略配置 */
  blackFreezeTypeList: '黑名单冻结类型',

  /** Redis 缓存数据库列表，用于缓存管理后台 */
  cacheDBList: '缓存数据库列表（Redis 实例）',

  /** 缓存实例列表，用于缓存管理后台 */
  cacheInstanceList: '缓存实例列表',

  /** 点击类型，用于活动/广告点击行为统计 */
  clickTypeList: '点击类型（活动/广告）',

  /** 比较器类型（大于/小于/等于），用于规则引擎条件配置 */
  comparatorList: '比较器类型（大于/小于/等于）',

  /** 补偿领取方式（自动发放/手动领取等） */
  compensationReceiveTypeList: '补偿领取方式',

  /** 补偿状态（待发放/已发放/已过期） */
  compensationStateList: '补偿状态（待发放/已发放/已过期）',

  /** 补偿类型（余额/积分/礼包等） */
  compensationTypeList: '补偿类型（余额/积分/礼包等）',

  /** 字典分类，用于后台字典管理页的分类筛选 */
  dictCategoryList: '字典分类（后台字典管理用）',

  /** 禁用权限列表，用于权限管控配置 */
  disablePermissList: '禁用权限列表',

  /** 动态字典 key 枚举，用于管理后台选择 dynamic dict key（与 registry 的 key 对应） */
  dynamicDictionaryKeyList: '动态字典 key 枚举（后台配置 dynamic key 用）',

  /** 邮件配置列表，用于邮件服务商选择 */
  emailConfigList: '邮件配置列表',

  /** 启用/禁用状态（0=禁用 1=启用），全项目使用频率最高的字典，适用于用户/商户/通道等所有实体 */
  enableStateList: '启用/禁用状态（0=禁用 1=启用，全局最高频）',

  /** 事件日志状态，用于系统事件日志查询筛选 */
  eventLogStateList: '事件日志状态',

  /** 事件触发模式（实时/定时/手动），用于营销事件配置 */
  eventTriggerModeList: '事件触发模式（实时/定时/手动）',

  /** 数据导出任务状态（待处理/处理中/成功/失败），用于导出记录查询 */
  exportStateList: '数据导出任务状态',

  /** Facebook 消息发送状态，用于 FB 推送记录查询 */
  fbMsgSendStateList: 'Facebook 消息发送状态',

  /** Facebook 推送目标类型，用于 FB 推送任务配置 */
  fbTargetList: 'Facebook 推送目标类型',

  /** 用户反馈状态（待处理/处理中/已处理），用于用户反馈管理 */
  feedBackStateList: '用户反馈状态',

  /** 频率类型（每日/每周/每月），用于任务周期、奖励发放频率配置 */
  frequencyList: '频率类型（每日/每周/每月）',

  /** 游戏分类（电子/真人/体育/彩票等），用于游戏管理和报表筛选 */
  gameCategoryList: '游戏分类（电子/真人/体育/彩票等）',

  /** 游戏类型，比 gameCategoryList 更细粒度的游戏分类 */
  gameTypeList: '游戏类型（细粒度）',

  /** 礼包奖励类型（余额/积分/道具等），用于礼包配置 */
  giftPackRewardTypeList: '礼包奖励类型',

  /** 资讯/公告类型，用于内容管理 */
  informationTypeList: '资讯/公告类型',

  /** 站内信目标用户类型（全员/指定用户/等级段），用于站内信发送配置 */
  inmailTargetList: '站内信目标用户类型',

  /** 时间间隔类型（分钟/小时/天），用于定时任务和冷却时间配置 */
  intervalTimeTypeList: '时间间隔类型（分/时/天）',

  /** 跳转页面列表，用于活动/推送的落地页配置 */
  jumpPageList: '跳转落地页列表（活动/推送配置）',

  /** 跳转类型（内页跳转/外链/活动页），配合 jumpPageList 使用 */
  jumpTypeList: '跳转类型（内页/外链/活动）',

  /** 语言列表（common 源），用于后台语言配置；与 platform 源 languageList 不同 */
  language: '语言列表（common 源，后台语言配置）',

  /** 亏损救援奖励发放时间类型，用于亏损救援活动配置 */
  lossReliefRewardTImeTypeList: '亏损救援奖励发放时间类型',

  /** 彩票游戏码，用于彩票管理 */
  lotteryGameCode: '彩票游戏码',

  /** 幸运翻倍活动状态，用于幸运翻倍活动管理 */
  luckyDoubleActivteStateList: '幸运翻倍活动状态',

  /** 幸运翻倍目标用户组，用于幸运翻倍活动配置 */
  luskyDoubleTargetGroupList: '幸运翻倍目标用户组',

  /** 消息跳转类型（用于 APP 推送消息的点击跳转行为配置） */
  messageJumpTypeList: '消息跳转类型（推送点击行为）',

  /** 提现工单派发模式（自动派单/手动派单），用于提现工作台配置 */
  orderDispatchModeList: '提现工单派发模式（自动/手动）',

  /** 工单状态枚举，用于提现工单状态流转 */
  orderStateEnum: '工单状态枚举',

  /** OSS 文件类型枚举，用于文件上传类型校验 */
  ossFileTypeEnum: 'OSS 文件类型枚举',

  /** 礼包转让配置类型，用于礼包转让规则配置 */
  packageTransferConfigTypeList: '礼包转让配置类型',

  /** 礼包转让奖励发放模式，用于礼包转让规则配置 */
  packageTransferRewardModeList: '礼包转让奖励发放模式',

  /** 礼包转让目标用户类型，用于礼包转让规则配置 */
  packageTransferTargetTypeList: '礼包转让目标用户类型',

  /** 支付方式（银行卡/电子钱包/UPI/PIX/加密货币等），用于充提配置和工单筛选 */
  payModeList: '支付方式（银行卡/钱包/UPI/PIX等）',

  /** PIX 钱包类型（巴西快捷支付），用于 PIX 充提配置 */
  pixWalletTypeList: 'PIX 钱包类型（巴西支付）',

  /** 平台类型，用于多平台管理 */
  platformTypeList: '平台类型',

  /** 游戏玩法类型枚举，用于彩票/游戏玩法配置 */
  playTypeEnum: '游戏玩法类型枚举',

  /** 弹窗类型（首页弹窗/活动弹窗/公告弹窗等），用于弹窗管理 */
  popupTypeList: '弹窗类型（首页/活动/公告）',

  /** 分享活动奖励领取优先级类型，用于分享活动规则配置 */
  promotionShareClaimPriorityTypeList: '分享活动奖励领取优先级',

  /** 分享活动奖励领取类型，用于分享活动规则配置 */
  promotionShareClaimTypeList: '分享活动奖励领取类型',

  /** 分享活动奖励类型，用于分享活动规则配置 */
  promotionShareRewardTypeList: '分享活动奖励类型',

  /** 分享活动用户类型（老用户/新用户），用于分享活动规则配置 */
  promotionShareUserTypeList: '分享活动用户类型（老用户/新用户）',

  /** 消息推送优先级，用于 APP 推送配置 */
  pushPriorityTypeList: '消息推送优先级',

  /** 返水计算模式，用于返水活动配置 */
  rebateMode: '返水计算模式',

  /** 充值大类枚举（common 系统级），与 dynamic rechargeCategoryList（商户级）不同 */
  rechargeCategoryEnumList: '充值大类枚举（common 系统级，非商户配置）',

  /** 充值订单状态（待处理/处理中/成功/失败/撤销），用于充值订单列表和工单筛选 */
  rechargeStateList: '充值订单状态（待处理/成功/失败等）',

  /** 用户注册来源（H5/APP/PC/三方等），用于用户分析和筛选 */
  registerSourceList: '用户注册来源（H5/APP/PC等）',

  /** 定时任务请求方法（GET/POST），用于定时调度配置 */
  schedulerRequestMethodList: '定时任务请求方法（GET/POST）',

  /** 定时任务类型，用于定时调度配置 */
  schedulerTaskTypeList: '定时任务类型',

  /** 定时任务触发类型（Cron 表达式/固定间隔），用于定时调度配置 */
  schedulerTriggerTypeList: '定时任务触发类型（Cron/固定间隔）',

  /** 消息发送时间类型（立即发送/定时发送），用于站内信/推送配置 */
  sendTimeTypeList: '消息发送时间类型（立即/定时）',

  /** 短信服务商配置列表，用于短信通道选择 */
  smsConfigList: '短信服务商配置列表',

  /** 通用状态列表（0=关闭 1=开启），比 enableStateList 更通用 */
  stateList: '通用状态列表（0=关闭 1=开启）',

  /** 系统事件日志事件分类，用于事件日志查询筛选 */
  sysEventLogEventCategoryList: '系统事件日志事件分类',

  /** 系统用户通知消息类型（站内信/邮件/短信），用于通知配置 */
  sysUserNotifyMessageTypeList: '系统通知消息类型（站内信/邮件/短信）',

  /** 目标对象类型（用户/商户/代理），用于营销活动目标配置 */
  targetList: '目标对象类型（用户/商户/代理）',

  /** 活动任务周期类型，用于任务活动配置 */
  taskCycleList: '活动任务周期类型',

  /** 消息模板文件列表，用于邮件/短信模板管理 */
  templateFileList: '消息模板文件列表',

  /** 商户状态（正常/冻结/停用），用于商户列表和筛选 */
  tenantStateList: '商户状态（正常/冻结/停用）',

  /** 三方支付通道类型（入金/出金/双向），用于三方通道配置 */
  thirdPayChannelTypeList: '三方支付通道类型（入金/出金/双向）',

  /** 三方服务状态，用于三方服务商管理 */
  thirdStateList: '三方服务状态',

  /** 充提排行统计类型，用于数据报表 */
  topRechargeWithdrawTypeList: '充提排行统计类型（报表）',

  /** 用户活动屏蔽类型，用于活动黑名单配置 */
  userActivityBlockTypeList: '用户活动屏蔽类型',

  /** 用户权限等级，用于用户权限管控 */
  userPermissionLevelList: '用户权限等级',

  /** 用户类型（普通用户/代理），用于用户管理和筛选 */
  userTypeList: '用户类型（普通用户/代理）',

  /** 有效期类型（永久/固定天数），用于奖励/礼包有效期配置 */
  validTypeList: '有效期类型（永久/固定天数）',

  /** VIP 奖励类型，用于 VIP 体系配置 */
  vipRewardTypeList: 'VIP 奖励类型',

  /** 风控预警分类，用于风控预警规则配置 */
  warningCategoryList: '风控预警分类',

  /** 风控预警类型，用于风控预警规则配置 */
  warningTypeList: '风控预警类型',

  /** 提现审核状态（待审/审核中/通过/拒绝），用于提现审核工作台 */
  withdrawAuditStateList: '提现审核状态（待审/通过/拒绝）',

  /** 提现大类（common 枚举，系统级），与 dynamic withdrawCategoryList（商户配置级）不同 */
  withdrawCategory: '提现大类枚举（common 系统级，非商户配置）',

  /** 提现大类枚举列表（common 系统级），与 dynamic withdrawCategoryList（商户配置级）不同 */
  withdrawCategoryEnumList: '提现大类枚举列表（common 系统级）',

  /** 提现工单操作类型（派单/撤回/拒绝/完成），用于提现工作台操作记录 */
  withdrawOrderActionTypeList: '提现工单操作类型（派单/撤回/拒绝）',

  /** 提现订单状态（待处理/处理中/成功/失败/撤销），用于提现订单列表 */
  withdrawStateList: '提现订单状态（待处理/成功/失败等）',

  /** 提现用户操作类型，用于提现行为日志 */
  withdrawUserActionTypeList: '提现用户操作类型',

  /** 提现用户风险等级，用于风控筛选 */
  withdrawUserRankList: '提现用户风险等级',

  /** 提现钱包类型（银行卡/电子钱包/加密货币），用于提现方式配置 */
  withdrawWalletTypeList: '提现钱包类型（银行卡/电子钱包/加密货币）',

  /** 提现工单处理状态（自动化流程节点状态），用于工单处理追踪 */
  withdrawWorkProcessStateList: '提现工单处理状态（流程节点）',

  /** 提现工单状态筛选选项（前端用，比 withdrawWorkStateList 少部分状态），用于筛选区 */
  withdrawWorkStateFilterList: '提现工单状态（筛选专用）',

  /** 提现工单状态（完整），用于工单状态列和详情 */
  withdrawWorkStateList: '提现工单状态（完整）',

  // ─────────────────────────── v1 ───────────────────────────────────────────

  /** 代理类型（直属/间接），v1 平台用于代理层级管理 */
  agentTypeList: '代理类型（直属/间接，v1 平台）',

  /** 封号状态，v1 平台用于用户封号管理 */
  blockStateList: '封号状态（v1 平台）',

  /** 快乐彩订单状态，v1 彩票平台专用 */
  fXosoOrderStatusList: '快乐彩订单状态（v1 彩票）',

  /** 游戏订单状态，v1 平台用于游戏订单查询 */
  gameOrderStateList: '游戏订单状态（v1 平台）',

  /** 5D 彩票游戏类型，v1 彩票平台专用 */
  gameType5DList: '5D 彩票游戏类型（v1）',

  /** K3 彩票游戏类型，v1 彩票平台专用 */
  gameTypeK3List: 'K3 彩票游戏类型（v1）',

  /** Win 彩票游戏类型，v1 彩票平台专用 */
  gameTypeWinList: 'Win 彩票游戏类型（v1）',

  /** 日志状态，v1 平台操作日志查询用 */
  logStateList: '日志状态（v1 平台）',

  /** 日志类型，v1 平台操作日志分类 */
  logTypeList: '日志类型（v1 平台）',

  /** 人工充值权限状态，v1 平台用于权限审批管理 */
  manualRechargePermissionStateList: '人工充值权限状态（v1）',

  /** 人工充值权限类型，v1 平台用于权限审批管理 */
  manualRechargePermissionTypeList: '人工充值权限类型（v1）',

  /** 人工充值记录状态，v1 平台用于人工充值记录查询 */
  manualRechargeRecordStateList: '人工充值记录状态（v1）',

  /** 人工充值类型（v1 源），区别于 common 源的 artificialRechargeTypeList */
  manualRechargeTypeList: '人工充值类型（v1 源，非 common）',

  /** 网银通道状态，v1 平台用于网银配置管理 */
  onlineBankingStateList: '网银通道状态（v1 平台）',

  /** 订单列表排序字段，v1 平台用于订单列表排序选择 */
  orderOrderByTypeList: '订单列表排序字段（v1）',

  /** 订单状态，v1 平台订单查询用 */
  orderStatusList: '订单状态（v1 平台）',

  /** 手机号类型，v1 平台用于区分本地/国际号码 */
  phoneTypeList: '手机号类型（本地/国际，v1）',

  /** 查询时间维度（今日/本周/本月等），v1 平台报表查询用 */
  queryTimeTypeList: '查询时间维度（今日/本周/本月，v1）',

  /** 体育游戏订单状态，v1 平台专用 */
  sportGamesOrderStatusList: '体育游戏订单状态（v1）',

  /** 下级代理用户等级，v1 平台用于代理管理 */
  subsetUserLevelList: '下级代理用户等级（v1）',

  /** 下级用户列表排序字段，v1 平台用于代理管理 */
  subsetUserOrderList: '下级用户列表排序字段（v1）',

  /** UPI 支付账号列表，v1 平台（印度支付方式）用于支付配置 */
  upiList: 'UPI 支付账号列表（印度支付，v1）',

  /** 用户列表排序字段，v1 平台用于会员列表排序 */
  userOrderByList: '用户列表排序字段（v1）',

  /** 用户关联代理等级，v1 平台代理关系查询 */
  userRelativeLevelList: '用户关联代理等级（v1）',

  /** 用户关联列表排序，v1 平台代理关系查询 */
  userRelativeOrderList: '用户关联列表排序（v1）',

  /** 会员账号状态（v1 平台），与 common enableStateList 语义不同，仅用于 v1 会员 */
  userStateList: '会员账号状态（v1 平台会员，非 enableStateList）',

  /** 越南彩票投注类型，v1 平台越南彩票专用 */
  xosoBettingTypeList: '越南彩票投注类型（v1）',

  /** 越南彩票玩法父分类，v1 平台越南彩票专用 */
  xosoTypeParentList: '越南彩票玩法父分类（v1）',

  // ─────────────────────────── group ────────────────────────────────────────

  /** 国家字典（group 源），含国码/国旗/拨号前缀，用于商户国家配置 */
  countryDictionaryList: '国家字典（group 源，含国码/国旗）',

  /** 币种字典（group 源），含货币符号/精度，用于商户币种配置 */
  currencyDictionaryList: '币种字典（group 源，含货币符号）',

  /** 语言字典（group 源），用于商户语言支持配置 */
  languageDictionaryList: '语言字典（group 源）',

  /** 时区字典（group 源），含时区名称/偏移量，用于商户时区配置 */
  timeZoneDictionaryList: '时区字典（group 源，含偏移量）',

  // ─────────────────────────── platform ─────────────────────────────────────

  /** 语言列表（platform 源），平台基础语言数据，用于多语言设置页；与 group languageDictionaryList 不同 */
  languageList: '语言列表（platform 源，多语言设置用）',

  // ─────────────────────────── dynamic ──────────────────────────────────────

  /** 菜单列表（动态懒加载），用于角色权限配置的菜单选择 */
  menuList: '菜单列表（动态，权限配置用）',

  /** 组织架构（动态懒加载），平台侧商户分组，用于商户分配 */
  organizationList: '组织架构（动态，平台侧商户分组）',

  /** 三方支付映射码（动态懒加载），用于通道配置的支付方式选择 */
  payCodeList: '三方支付映射码（动态，通道配置用）',

  /** 充值大类（动态懒加载，商户级），用于充值通道配置和工单筛选；区别于 common rechargeCategoryEnumList（系统级） */
  rechargeCategoryList: '充值大类（动态，商户级；非 common 系统枚举）',

  /** 角色列表（动态懒加载），用于员工账号角色分配 */
  roleList: '角色列表（动态，员工权限配置）',

  /** 系统支持的结算币种列表（动态懒加载），用于财务配置 */
  sysCurrencyList: '系统结算币种列表（动态）',

  /** 系统支付通道（动态懒加载，平台级），含通道方向（入金/出金），用于通道管理 */
  sysPayChannelList: '系统支付通道（动态，平台级，含入/出金方向）',

  /** 商户列表（动态懒加载），用于平台侧商户选择器 */
  tenantList: '商户列表（动态，平台侧选择器）',

  /** 商户支付通道（动态懒加载，商户级），含通道 ID 和币种，用于商户通道配置 */
  tenantPayChannelList: '商户支付通道（动态，商户级）',

  /** 三方商户（动态懒加载），支付服务商账户列表，用于通道绑定 */
  thirdPayMerchantList: '三方商户（动态，支付服务商账户）',

  /** 提现大类（动态懒加载，商户级），用于提现通道配置和工单筛选；区别于 common withdrawCategory（系统枚举） */
  withdrawCategoryList: '提现大类（动态，商户级；非 common 系统枚举）',

  /** 提现配置分组（动态懒加载），用于提现规则分组管理 */
  withdrawConfigGroupList: '提现配置分组（动态）',
};

/** 歧义 key 各 source 的区别说明（消费者选 source 时的参考） */
export const AMBIGUOUS_META: Record<string, Record<string, string>> = {
  countryList: {
    common: '后台自定义国家配置（业务侧维护，范围较小）',
    platform: '平台基础国家数据（完整国家列表，含国码/拨号前缀）',
  },
  currencyList: {
    common: '后台币种配置（业务侧维护的币种，范围较小）',
    platform: '平台基础币种数据（完整币种列表，含货币符号）',
  },
  financialTypeList: {
    common: '通用财务类型（充值/提现/调账等）',
    v1: 'v1 平台财务类型（v1 特有分类）',
  },
};
