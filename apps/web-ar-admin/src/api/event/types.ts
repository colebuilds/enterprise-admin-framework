export interface NodeInfoVO {
  /**
   * 节点 ID
   */
  id: string;
  /**
   * 主机名
   */
  hostname: string;
  /**
   * IP 地址
   */
  ip: string;
  /**
   * 端口
   */
  port?: number;
  /**
   * 进程 ID
   */
  pid: number;
  /**
   * 最后心跳时间戳
   */
  lastHeartbeat: number;
  /**
   * 启动时间戳
   */
  startTime: number;
}

/**
 * @description: 获取活跃节点列表 响应
 * @url: /api/event/traffic/nodes
 * @name: NodeInfoListResponseVO
 */
export type NodeInfoListResponseVO = NodeInfoVO[];

export interface SdkMetricsVO {
  /**
   * 每秒请求数
   */
  qps: number;
  /**
   * 每秒事件数
   */
  eps: number;
  /**
   * 错误率(%)
   */
  errorRate: number;
  /**
   * 平均延迟(ms)
   */
  avgLatency: number;
  /**
   * 总请求数
   */
  totalRequests: number;
  /**
   * 总事件数
   */
  totalEvents: number;
}

export interface JobMetricsVO {
  /**
   * 消费速率(条/秒)
   */
  consumeRate: number;
  /**
   * 写入速率(条/秒)
   */
  writeRate: number;
  /**
   * 队列积压数量(内存buffer)
   */
  queueSize: number;
  /**
   * 总消费数量
   */
  totalConsumed: number;
  /**
   * 总写入数量
   */
  totalWritten: number;
}

export interface RabbitMQMetricsVO {
  /**
   * Management API 是否可用
   */
  available: boolean;
  /**
   * 队列消息总数
   */
  messagesTotal: number;
  /**
   * 就绪消息数
   */
  messagesReady: number;
  /**
   * 未确认消息数
   */
  messagesUnacked: number;
  /**
   * 死信队列消息数
   */
  dlxMessages: number;
  /**
   * 消费者总数
   */
  consumers: number;
  /**
   * 发布速率(条/秒)
   */
  publishRate: number;
  /**
   * 消费速率(条/秒)
   */
  consumeRate: number;
}

/**
 * @description: 获取汇总指标 响应
 * @url: /api/event/traffic/metrics
 * @name: AggregatedMetricsVO
 */
export interface AggregatedMetricsVO {
  /**
   * SDK 实例数
   */
  sdkInstances: number;
  /**
   * Job 实例数
   */
  jobInstances: number;
  /**
   * SDK 层指标
   */
  sdk: SdkMetricsVO;
  /**
   * Job 层指标
   */
  job: JobMetricsVO;
  /**
   * RabbitMQ 指标
   */
  rabbitmq: RabbitMQMetricsVO;
}

export type AggregatedMetricsResponseVO = AggregatedMetricsVO;

export interface TrafficTrendPointVO {
  /**
   * 时间点
   */
  time: string;
  /**
   * SDK 请求数
   */
  sdkRequests: number;
  /**
   * SDK 事件数
   */
  sdkEvents: number;
  /**
   * Job 消费数
   */
  jobConsumed: number;
  /**
   * Job 写入数
   */
  jobWritten: number;
  /**
   * 队列大小
   */
  queueSize: number;
}

/**
 * @description: 获取流量趋势 响应
 * @url: /api/event/traffic/trend
 * @name: TrafficTrendListResponseVO
 */
export type TrafficTrendListResponseVO = TrafficTrendPointVO[];

export interface InstanceHealthVO {
  /**
   * 实例 ID
   */
  instanceId: string;
  /**
   * 服务类型
   */
  service: "sdk" | "job" | "admin";
  /**
   * 是否健康
   */
  healthy: boolean;
  /**
   * 最后心跳时间戳
   */
  lastHeartbeat: number;
  /**
   * 运行时间(ms)
   */
  uptime: number;
}

/**
 * @description: 获取实例健康状态 响应
 * @url: /api/event/traffic/health
 * @name: HealthSummaryVO
 */
export interface HealthSummaryVO {
  /**
   * 健康实例数
   */
  healthy: number;
  /**
   * 不健康实例数
   */
  unhealthy: number;
  /**
   * 实例列表
   */
  instances: InstanceHealthVO[];
}

export type HealthSummaryResponseVO = HealthSummaryVO;

export interface SdkServiceSummaryVO {
  /**
   * 实例数
   */
  instances: number;
  /**
   * 总 QPS
   */
  totalQps: number;
  /**
   * 每秒事件数
   */
  eps: number;
  /**
   * 平均延迟(ms)
   */
  avgLatency: number;
  /**
   * 总请求数
   */
  totalRequests: number;
}

export interface JobServiceSummaryVO {
  /**
   * 实例数
   */
  instances: number;
  /**
   * 消费速率(条/秒)
   */
  consumeRate: number;
  /**
   * 写入速率(条/秒)
   */
  writeRate: number;
  /**
   * 队列积压
   */
  queueSize: number;
  /**
   * 总消费数
   */
  totalConsumed: number;
  /**
   * 总写入数
   */
  totalWritten: number;
}

export interface OverallSummaryVO {
  /**
   * 总实例数
   */
  totalInstances: number;
  /**
   * 总事件数
   */
  totalEvents: number;
  /**
   * 总 QPS
   */
  totalQps: number;
  /**
   * 平均延迟(ms)
   */
  avgLatency: number;
  /**
   * 错误率(%)
   */
  errorRate: number;
}

/**
 * @description: 获取服务统计摘要 响应
 * @url: /api/event/traffic/summary
 * @name: ServiceSummaryVO
 */
export interface ServiceSummaryVO {
  /**
   * SDK 服务摘要
   */
  sdk: SdkServiceSummaryVO;
  /**
   * Job 服务摘要
   */
  job: JobServiceSummaryVO;
  /**
   * 整体摘要
   */
  overall: OverallSummaryVO;
}

export type ServiceSummaryResponseVO = ServiceSummaryVO;

export interface OptionItemVO {
  /**
   * 选项值
   */
  value: Record<string, any>;
  /**
   * 中文显示名
   */
  label: string;
}

export interface FieldOptionVO {
  /**
   * 字段标识（snake_case）
   */
  key: string;
  /**
   * 中文显示名
   */
  label: string;
  /**
   * 应用层字段类型
   */
  type: "string" | "number" | "datetime";
  /**
   * 是否允许在 SQL filter 中作为顶层列引用
   */
  queryable: boolean;
}

/**
 * @description: 获取全局配置选项 响应
 * @url: /api/event/options
 * @name: OptionsResponseVO
 */
export interface OptionsResponseVO {
  /**
   * 卡片类型
   */
  cardTypes: OptionItemVO[];
  /**
   * 时间粒度
   */
  granularities: OptionItemVO[];
  /**
   * 汇总指标
   */
  togetherList: OptionItemVO[];
  /**
   * 留存类型
   */
  retentionTypes: OptionItemVO[];
  /**
   * 数据格式
   */
  dataFormats: OptionItemVO[];
  /**
   * 组合类型
   */
  combineTypes: OptionItemVO[];
  /**
   * 筛选规则
   */
  filterRules: OptionItemVO[];
  /**
   * 刷新频率（秒）
   */
  refreshFrequencies: OptionItemVO[];
  /**
   * 是否去重
   */
  isRepeatOptions: OptionItemVO[];
  /**
   * 可用字段列表
   */
  fields: FieldOptionVO[];
}

export interface EventItemDto {
  /**
   * 埋点标识
   */
  eventKey: string;
  /**
   * 事件唯一标识。未传时服务端会生成，客户端重试时建议保持不变
   */
  eventId?: string;
  /**
   * 业务幂等键。关键转化事件如 register/first_deposit 必须传入稳定值
   */
  idempotencyKey?: string;
  /**
   * 自定义属性
   */
  properties?: Record<string, any>;
}

export interface EventContextDto {
  /**
   * 匿名用户ID
   */
  anonymousId: string;
  /**
   * 登录用户ID
   */
  userId?: string;
  /**
   * 设备ID
   */
  deviceId?: string;
  /**
   * 会话ID
   */
  sessionId: string;
  /**
   * 平台
   */
  platform?: string;
  /**
   * 操作系统
   */
  os?: string;
  /**
   * 操作系统版本
   */
  osVersion?: string;
  /**
   * 浏览器
   */
  browser?: string;
  /**
   * 浏览器版本
   */
  browserVersion?: string;
  /**
   * 设备类型
   */
  deviceType?: string;
  /**
   * 屏幕宽度
   */
  screenWidth?: number;
  /**
   * 屏幕高度
   */
  screenHeight?: number;
  /**
   * 页面URL
   */
  pageUrl?: string;
  /**
   * 页面标题
   */
  pageTitle?: string;
  /**
   * 来源页面
   */
  referrer?: string;
  /**
   * SDK版本
   */
  sdkVersion?: string;
}

/**
 * @description: 批量事件上报 请求
 * @url: /api/event/sdk/collect/batch
 * @name: EventBatchDto
 */
export interface EventBatchDto {
  /**
   * 集团 ID（SDK 必填注入）
   */
  orgId: string;
  /**
   * 商户 ID（SDK 必填注入）
   */
  tenantId: string;
  /**
   * 渠道 ID（SDK 必填注入；channel 跟商户走，与项目层级平行）
   */
  channelId: string;
  /**
   * 项目标识
   */
  projectKey: string;
  /**
   * 事件列表（1-10条）
   */
  events: EventItemDto[];
  /**
   * 上下文信息
   */
  context: EventContextDto;
}

/**
 * @description: 单个事件上报 请求
 * @url: /api/event/sdk/collect/event
 * @name: SingleEventDto
 */
export interface SingleEventDto {
  /**
   * 集团 ID（SDK 必填注入）
   */
  orgId: string;
  /**
   * 商户 ID（SDK 必填注入）
   */
  tenantId: string;
  /**
   * 渠道 ID（SDK 必填注入；channel 跟商户走，与项目层级平行）
   */
  channelId: string;
  /**
   * 项目标识
   */
  projectKey: string;
  /**
   * 埋点标识
   */
  eventKey: string;
  /**
   * 事件唯一标识。未传时服务端会生成，客户端重试时建议保持不变
   */
  eventId?: string;
  /**
   * 业务幂等键。关键转化事件如 register/first_deposit 必须传入稳定值
   */
  idempotencyKey?: string;
  /**
   * 自定义属性
   */
  properties?: Record<string, any>;
  /**
   * 上下文信息
   */
  context: EventContextDto;
}

/**
 * @description: PV 上报 请求
 * @url: /api/event/sdk/collect/pageview
 * @name: PageViewDto
 */
export interface PageViewDto {
  /**
   * 集团 ID（SDK 必填注入）
   */
  orgId: string;
  /**
   * 商户 ID（SDK 必填注入）
   */
  tenantId: string;
  /**
   * 渠道 ID（SDK 必填注入；channel 跟商户走，与项目层级平行）
   */
  channelId: string;
  /**
   * 项目标识
   */
  projectKey: string;
  /**
   * 页面URL
   */
  url: string;
  /**
   * 页面标题
   */
  title?: string;
  /**
   * 来源页面
   */
  referrer?: string;
  /**
   * 事件唯一标识。未传时服务端会生成，客户端重试时建议保持不变
   */
  eventId?: string;
  /**
   * 上下文信息
   */
  context: EventContextDto;
}

/**
 * @description: 创建项目 请求
 * @url: /api/event/admin/project
 * @name: CreateProjectDto
 */
export interface CreateProjectDto {
  /**
   * 集团 ID（仅平台总控传入；集团成员忽略，由 user.orgId 决定）
   */
  orgId?: number;
  /**
   * 项目标识 (只允许小写字母、数字、点、下划线、短横线)
   */
  projectKey: string;
  /**
   * 项目名称
   */
  name: string;
  /**
   * 平台类型
   */
  platform: "web" | "miniprogram" | "ios" | "android" | "react_native";
}

/**
 * @description: 创建项目 响应
 * @url: /api/event/admin/project
 * @name: ProjectVO
 */
export interface ProjectVO {
  /**
   * 项目 ID
   */
  id: string;
  /**
   * 项目标识
   */
  projectKey: string;
  /**
   * 项目名称
   */
  name: string;
  /**
   * 平台类型
   */
  platform: "web" | "miniprogram" | "ios" | "android" | "react_native";
  /**
   * 项目状态
   */
  status: "active" | "paused" | "archived";
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;
}

export type ProjectResponseVO = ProjectVO;

/**
 * @description: 项目列表 响应
 * @url: /api/event/admin/project
 * @name: ProjectListResponseVO
 */
export type ProjectListResponseVO = ProjectVO[];

/**
 * @description: 更新项目 请求
 * @url: /api/event/admin/project/{id}
 * @name: UpdateProjectDto
 */
export interface UpdateProjectDto {
  /**
   * 项目名称
   */
  name?: string;
  /**
   * 项目状态
   */
  status?: "active" | "paused" | "archived";
}

/**
 * @description: 创建告警规则 请求
 * @url: /api/event/admin/alarm
 * @name: CreateAlarmDto
 */
export interface CreateAlarmDto {
  /**
   * 集团 ID（仅平台总控创建时必填，集团成员忽略）
   */
  orgId?: number;
  /**
   * 告警名称
   */
  name: string;
  /**
   * 监控的点位标识
   */
  pointKey: string;
  /**
   * 触发条件
   */
  condition?: Record<string, any>;
  /**
   * 阈值
   */
  threshold: number;
  /**
   * 比较类型
   */
  compareType: "gt" | "lt" | "gte" | "lte" | "eq" | "neq";
  /**
   * 检测窗口（分钟）
   */
  windowMinutes?: number;
  /**
   * 通知类型
   */
  notifyTypes: "email" | "webhook" | "dingtalk" | "feishu" | "wechat"[];
  /**
   * 通知配置
   */
  notifyConfig?: Record<string, any>;
}

/**
 * @description: 创建告警规则 响应
 * @url: /api/event/admin/alarm
 * @name: AlarmRuleVO
 */
export interface AlarmRuleVO {
  /**
   * 告警规则 ID
   */
  id: string;
  /**
   * 规则名称
   */
  name: string;
  /**
   * 监控的埋点标识
   */
  pointKey: string;
  /**
   * 触发条件
   */
  condition: Record<string, any>;
  /**
   * 阈值
   */
  threshold: number;
  /**
   * 比较类型
   */
  compareType: "gt" | "lt" | "gte" | "lte" | "eq" | "neq";
  /**
   * 检测窗口(分钟)
   */
  windowMinutes: number;
  /**
   * 通知类型
   */
  notifyTypes: "email" | "webhook" | "dingtalk" | "feishu" | "wechat"[];
  /**
   * 通知配置
   */
  notifyConfig: Record<string, any>;
  /**
   * 规则状态
   */
  status: "enabled" | "disabled";
  /**
   * 最后触发时间
   */
  lastTriggered?: Record<string, any>;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;
}

export type AlarmRuleResponseVO = AlarmRuleVO;

/**
 * @description: 告警规则列表 响应
 * @url: /api/event/admin/alarm
 * @name: AlarmRuleListResponseVO
 */
export type AlarmRuleListResponseVO = AlarmRuleVO[];

/**
 * @description: 标记消息已读 响应
 * @url: /api/event/admin/alarm/messages/{messageId}/read
 * @name: AlarmMessageVO
 */
export interface AlarmMessageVO {
  /**
   * 消息 ID
   */
  id: string;
  /**
   * 关联规则 ID
   */
  ruleId: string;
  /**
   * 消息内容
   */
  content: string;
  /**
   * 消息状态
   */
  status: "sent" | "failed" | "read";
  /**
   * 创建时间
   */
  createdAt: string;
}

/**
 * @description: 获取告警消息 响应
 * @url: /api/event/admin/alarm/messages
 * @name: AlarmMessageListResponseVO
 */
export type AlarmMessageListResponseVO = AlarmMessageVO[];

/**
 * @description: 告警统计 响应
 * @url: /api/event/admin/alarm/stats
 * @name: AlarmStatsVO
 */
export interface AlarmStatsVO {
  /**
   * 规则总数
   */
  totalRules: number;
  /**
   * 启用的规则数
   */
  enabledRules: number;
  /**
   * 禁用的规则数
   */
  disabledRules: number;
  /**
   * 过去 24 小时消息数
   */
  messagesLast24h: number;
}

export type AlarmStatsResponseVO = AlarmStatsVO;

export type AlarmMessageResponseVO = AlarmMessageVO;

/**
 * @description: 更新告警规则 请求
 * @url: /api/event/admin/alarm/{id}
 * @name: UpdateAlarmDto
 */
export interface UpdateAlarmDto {
  /**
   * 告警名称
   */
  name?: string;
  /**
   * 监控的点位标识
   */
  pointKey?: string;
  /**
   * 触发条件
   */
  condition?: Record<string, any>;
  /**
   * 阈值
   */
  threshold?: number;
  /**
   * 比较类型
   */
  compareType?: "gt" | "lt" | "gte" | "lte" | "eq" | "neq";
  /**
   * 检测窗口（分钟）
   */
  windowMinutes?: number;
  /**
   * 通知类型
   */
  notifyTypes?: "email" | "webhook" | "dingtalk" | "feishu" | "wechat"[];
  /**
   * 通知配置
   */
  notifyConfig?: Record<string, any>;
  /**
   * 状态
   */
  status?: "enabled" | "disabled";
}

/**
 * @description: 测试告警 响应
 * @url: /api/event/admin/alarm/{id}/test
 * @name: TestAlarmResultVO
 */
export interface TestAlarmResultVO {
  /**
   * 是否成功
   */
  success: boolean;
  /**
   * 消息 ID
   */
  messageId: string;
}

export type TestAlarmResultResponseVO = TestAlarmResultVO;

export interface CalcFieldDto {
  /**
   * 字段名称
   */
  fieldName: string;
  /**
   * 是否去重
   */
  isRepeat: "true" | "false";
}

export interface FilterCriteriaDto {
  /**
   * 唯一标识（用于前端 key）
   */
  id: string;
  /**
   * 字段名称
   */
  fieldName: string;
  /**
   * 筛选规则
   */
  rule: "=" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "not_contains" | "in" | "not_in";
  /**
   * 筛选值（单值或数组）
   */
  value: Record<string, any>;
}

export interface PrePointConfigDto {
  /**
   * 事件标识
   */
  eventKey: string;
  /**
   * 计数字段配置
   */
  calcField: CalcFieldDto;
  /**
   * 筛选条件列表
   */
  queryCriteria?: FilterCriteriaDto[];
}

export interface DataStepDto {
  /**
   * 唯一标识
   */
  id: string;
  /**
   * 计算名称（显示名）
   */
  calcName: string;
  /**
   * 组合类型: a=且, o=或
   */
  combineType: "a" | "o";
  /**
   * 点位配置
   */
  prePoint: PrePointConfigDto;
  /**
   * 是否折叠
   */
  collapsed?: boolean;
}

export interface RetentionBehaviorDto {
  /**
   * 事件标识
   */
  eventKey: string;
  /**
   * 筛选条件
   */
  queryCriteria?: FilterCriteriaDto[];
}

export interface CardConfigDto {
  /**
   * 卡片描述
   */
  describe?: string;
  /**
   * 展示类型
   */
  chartTableShow?: "chart" | "table";
  /**
   * 同时显示选项
   */
  togetherList?: "total" | "average" | "chainRatio" | "yearOnYear"[];
  /**
   * 刷新频率(秒)
   */
  refreshFrequency?: 0 | 30 | 60 | 300;
  /**
   * 数据步骤配置
   */
  calcRule?: DataStepDto[];
  /**
   * 初始行为
   */
  initialBehavior?: RetentionBehaviorDto;
  /**
   * 后续行为
   */
  subsequentBehavior?: RetentionBehaviorDto;
  /**
   * 分组字段
   */
  groupByField?: string;
  /**
   * 时间格式
   */
  timeFormat?: "default" | "custom";
  /**
   * 留存/流失类型
   */
  retentionType?: "retention" | "churn";
  /**
   * 显示当日
   */
  showToday?: boolean;
  /**
   * 数据格式
   */
  dataFormat?: "percent" | "number";
  /**
   * 留存天数
   */
  retentionDays?: number[];
  /**
   * 漏斗转化周期(天)
   */
  conversionCycle?: number;
}

/**
 * @description: 创建卡片 请求
 * @url: /api/event/admin/card
 * @name: CreateCardDto
 */
export interface CreateCardDto {
  /**
   * 集团 ID（仅平台总控传入；集团成员忽略，由 user.orgId 决定）
   */
  orgId?: number;
  /**
   * 关联页面ID
   */
  pageId?: string;
  /**
   * 卡片名称
   */
  name: string;
  /**
   * 卡片类型
   */
  cardType: "bar" | "line" | "bar_line" | "stacked" | "funnel" | "pie" | "table" | "number" | "retention" | "path";
  /**
   * 图表配置
   */
  config: CardConfigDto;
  /**
   * 排序位置
   */
  position?: number;
}

export interface CalcFieldVO {
  /**
   * 字段名称
   */
  fieldName: string;
  /**
   * 是否去重
   */
  isRepeat: "true" | "false";
}

export interface FilterCriteriaVO {
  /**
   * 唯一标识
   */
  id: string;
  /**
   * 字段名称
   */
  fieldName: string;
  /**
   * 筛选规则
   */
  rule: "=" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "not_contains" | "in" | "not_in";
  /**
   * 筛选值（单值或数组）
   */
  value: Record<string, any>;
}

export interface PrePointConfigVO {
  /**
   * 事件标识
   */
  eventKey: string;
  /**
   * 计数字段配置
   */
  calcField: CalcFieldVO;
  /**
   * 筛选条件列表
   */
  queryCriteria?: FilterCriteriaVO[];
}

export interface DataStepVO {
  /**
   * 唯一标识
   */
  id: string;
  /**
   * 计算名称（显示名）
   */
  calcName: string;
  /**
   * 组合类型: a=且, o=或
   */
  combineType: "a" | "o";
  /**
   * 点位配置
   */
  prePoint: PrePointConfigVO;
  /**
   * 是否折叠
   */
  collapsed?: boolean;
}

export interface RetentionBehaviorVO {
  /**
   * 事件标识
   */
  eventKey: string;
  /**
   * 筛选条件
   */
  queryCriteria?: FilterCriteriaVO[];
}

export interface CardConfigVO {
  /**
   * 卡片描述
   */
  describe?: string;
  /**
   * 展示类型
   */
  chartTableShow?: "chart" | "table";
  /**
   * 同时显示选项
   */
  togetherList?: "total" | "average" | "chainRatio" | "yearOnYear"[];
  /**
   * 刷新频率(秒)
   */
  refreshFrequency?: 0 | 30 | 60 | 300;
  /**
   * 数据步骤配置
   */
  calcRule?: DataStepVO[];
  /**
   * 初始行为
   */
  initialBehavior?: RetentionBehaviorVO;
  /**
   * 后续行为
   */
  subsequentBehavior?: RetentionBehaviorVO;
  /**
   * 分组字段
   */
  groupByField?: string;
  /**
   * 时间格式
   */
  timeFormat?: "default" | "custom";
  /**
   * 留存/流失类型
   */
  retentionType?: "retention" | "churn";
  /**
   * 显示当日
   */
  showToday?: boolean;
  /**
   * 数据格式
   */
  dataFormat?: "percent" | "number";
  /**
   * 留存天数
   */
  retentionDays?: number[];
}

/**
 * @description: 创建卡片 响应
 * @url: /api/event/admin/card
 * @name: CardVO
 */
export interface CardVO {
  /**
   * 卡片 ID
   */
  id: string;
  /**
   * 卡片名称
   */
  name: string;
  /**
   * 卡片类型
   */
  cardType: "bar" | "line" | "bar_line" | "stacked" | "funnel" | "pie" | "table" | "number" | "retention" | "path";
  /**
   * 图表配置
   */
  config: CardConfigVO;
  /**
   * 排序位置
   */
  position: number;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;
}

export type CardResponseVO = CardVO;

/**
 * @description: 卡片列表 响应
 * @url: /api/event/admin/card
 * @name: CardListResponseVO
 */
export type CardListResponseVO = CardVO[];

/**
 * @description: 卡片列表含数据 请求
 * @url: /api/event/admin/card/list-with-data
 * @name: CardListWithDataQueryDto
 */
export interface CardListWithDataQueryDto {
  /**
   * 集团 ID 筛选（仅平台总控传入；集团成员忽略）
   */
  orgId?: number;
  /**
   * 项目标识（可选，不传则跨项目查询）
   */
  projectKey?: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 页面ID筛选
   */
  pageId?: string;
  /**
   * 页面标识筛选
   */
  pageKey?: string;
  /**
   * 卡片类型筛选
   */
  cardType?: "bar" | "line" | "bar_line" | "stacked" | "funnel" | "pie" | "table" | "number" | "retention" | "path";
}

export interface CalcDataPointVO {
  /**
   * 数值
   */
  count: Record<string, any>;
  /**
   * 日期
   */
  happenDate: string;
  /**
   * 百分比
   */
  percentage: number;
}

export interface StatisticItemVO {
  /**
   * 系列索引
   */
  fieldIndex: number;
  /**
   * 系列名称
   */
  calcName: string;
  /**
   * 单位
   */
  unit?: string;
  /**
   * 总计值
   */
  calcTotail: number;
  /**
   * 总转化率
   */
  calcTotailRate: number;
  /**
   * 时序数据
   */
  calcData: CalcDataPointVO[];
}

export interface CardWithDataVO {
  /**
   * 卡片ID
   */
  cardId: string;
  /**
   * 卡片类型
   */
  type: string;
  /**
   * 卡片名称
   */
  cardName: string;
  /**
   * 卡片配置
   */
  config: CardConfigVO;
  /**
   * 转化周期
   */
  conversionCycle: number;
  /**
   * 是否分组
   */
  groupByFlag: number;
  /**
   * 展示类型
   */
  chartTableShow: string;
  /**
   * 同时显示项
   */
  togetherList: string;
  /**
   * 刷新频率
   */
  refreshFrequency: number;
  /**
   * 刷新时间
   */
  refreshTime: string;
  /**
   * 告警状态
   */
  alarmStatus: number;
  /**
   * 排序
   */
  sort: number;
  /**
   * 布局信息（JSON字符串）
   */
  dataGrid: string;
  /**
   * 描述
   */
  describe: string;
  /**
   * 统计数据列表
   */
  statisticList: StatisticItemVO[];
}

/**
 * @description: 卡片列表含数据 响应
 * @url: /api/event/admin/card/list-with-data
 * @name: CardListWithDataResponseVO
 */
export type CardListWithDataResponseVO = CardWithDataVO[];

/**
 * @description: 更新卡片 请求
 * @url: /api/event/admin/card/{id}
 * @name: UpdateCardDto
 */
export interface UpdateCardDto {
  /**
   * 关联页面ID
   */
  pageId?: string;
  /**
   * 卡片名称
   */
  name?: string;
  /**
   * 卡片类型
   */
  cardType?: "bar" | "line" | "bar_line" | "stacked" | "funnel" | "pie" | "table" | "number" | "retention" | "path";
  /**
   * 图表配置
   */
  config?: CardConfigDto;
  /**
   * 排序位置
   */
  position?: number;
}

/**
 * @description: 卡片排序 请求
 * @url: /api/event/admin/card/sort
 * @name: SortCardsDto
 */
export interface SortCardsDto {
  /**
   * 卡片ID顺序
   */
  cardIds: string[];
}

/**
 * @description: 卡片排序 响应
 * @url: /api/event/admin/card/sort
 * @name: SortResultVO
 */
export interface SortResultVO {
  /**
   * 是否成功
   */
  success: boolean;
}

export type SortResultResponseVO = SortResultVO;

/**
 * @description: 获取卡片数据 请求
 * @url: /api/event/admin/card/{id}/data
 * @name: CardDataQueryDto
 */
export interface CardDataQueryDto {
  /**
   * 项目标识（可选，不传则跨项目查询）
   */
  projectKey?: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 额外筛选条件
   */
  filters?: Record<string, any>;
}

/**
 * @description: 获取卡片数据 响应
 * @url: /api/event/admin/card/{id}/data
 * @name: CardDataVO
 */
export interface CardDataVO {
  /**
   * 图表数据
   */
  data: Record<string, any>;
  /**
   * 摘要信息
   */
  summary: Record<string, any>;
}

export type CardDataResponseVO = CardDataVO;

/**
 * @description: 分组查询 请求
 * @url: /api/event/admin/card/group-by
 * @name: GroupByQueryDto
 */
export interface GroupByQueryDto {
  /**
   * 集团 ID（仅平台总控传入；集团成员忽略）
   */
  orgId?: number;
  /**
   * 项目标识
   */
  projectKey: string;
  /**
   * 事件标识
   */
  eventKey: string;
  /**
   * 分组字段
   */
  groupBy: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 指标类型
   */
  metric?: "pv" | "uv";
  /**
   * 限制数量
   */
  limit?: number;
}

export interface GroupByResultVO {
  /**
   * 维度名称
   */
  dimension: string;
  /**
   * 维度值
   */
  value: string;
  /**
   * 数量
   */
  count: number;
}

/**
 * @description: 分组查询 响应
 * @url: /api/event/admin/card/group-by
 * @name: GroupByResultListResponseVO
 */
export type GroupByResultListResponseVO = GroupByResultVO[];

/**
 * @description: 热力图数据 请求
 * @url: /api/event/admin/card/heatmap
 * @name: HeatmapQueryDto
 */
export interface HeatmapQueryDto {
  /**
   * 集团 ID（仅平台总控传入；集团成员忽略）
   */
  orgId?: number;
  /**
   * 项目标识
   */
  projectKey: string;
  /**
   * 页面URL
   */
  pageUrl: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
}

/**
 * @description: 热力图数据 响应
 * @url: /api/event/admin/card/heatmap
 * @name: HeatmapDataVO
 */
export interface HeatmapDataVO {
  /**
   * 热力图数据矩阵
   */
  data: any[][];
  /**
   * X轴标签
   */
  xLabels: string[];
  /**
   * Y轴标签
   */
  yLabels: string[];
}

export type HeatmapDataResponseVO = HeatmapDataVO;

/**
 * @description: 创建页面/分组 请求
 * @url: /api/event/admin/card-page
 * @name: CreateCardPageDto
 */
export interface CreateCardPageDto {
  /**
   * 集团 ID（仅平台总控传入；集团成员忽略，由 user.orgId 决定）
   */
  orgId?: number;
  /**
   * 类型
   */
  type: "group" | "page";
  /**
   * 父级ID（页面归属的分组）
   */
  parentId?: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 标识
   */
  key: string;
  /**
   * 排序位置
   */
  position?: number;
}

/**
 * @description: 创建页面/分组 响应
 * @url: /api/event/admin/card-page
 * @name: CardPageVO
 */
export interface CardPageVO {
  /**
   * 页面/分组 ID
   */
  id: string;
  /**
   * 类型
   */
  type: "group" | "page";
  /**
   * 父级 ID
   */
  parentId?: Record<string, any>;
  /**
   * 名称
   */
  name: string;
  /**
   * 标识
   */
  key: string;
  /**
   * 排序
   */
  position: number;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;
  /**
   * 父级信息
   */
  parent?: CardPageVO;
  /**
   * 子级列表
   */
  children?: CardPageVO[];
}

export type CardPageResponseVO = CardPageVO;

/**
 * @description: 页面列表 响应
 * @url: /api/event/admin/card-page
 * @name: CardPageListResponseVO
 */
export type CardPageListResponseVO = CardPageVO[];

export interface CardPageTreeVO {
  /**
   * 分组 ID
   */
  id: string;
  /**
   * 类型
   */
  type: "group";
  /**
   * 名称
   */
  name: string;
  /**
   * 标识
   */
  key: string;
  /**
   * 排序
   */
  position: number;
  /**
   * 子页面列表
   */
  children: CardPageVO[];
}

/**
 * @description: 树形结构 响应
 * @url: /api/event/admin/card-page/tree
 * @name: CardPageTreeResponseVO
 */
export type CardPageTreeResponseVO = CardPageTreeVO[];

/**
 * @description: 更新页面/分组 请求
 * @url: /api/event/admin/card-page/{id}
 * @name: UpdateCardPageDto
 */
export interface UpdateCardPageDto {
  /**
   * 名称
   */
  name?: string;
  /**
   * 标识
   */
  key?: string;
  /**
   * 排序位置
   */
  position?: number;
}

/**
 * @description: 绑定用户身份 请求
 * @url: /api/event/admin/identity/{projectId}/bind
 * @name: BindIdentityDto
 */
export interface BindIdentityDto {
  /**
   * 匿名ID
   */
  anonymousId: string;
  /**
   * 用户ID
   */
  userId: string;
  /**
   * 设备ID
   */
  deviceId?: string;
  /**
   * 集团ID（SDK 必填注入）
   */
  orgId: string;
  /**
   * 商户ID（SDK 必填注入）
   */
  tenantId: string;
  /**
   * 渠道ID（SDK 必填注入）
   */
  channelId: string;
}

/**
 * @description: 绑定用户身份 响应
 * @url: /api/event/admin/identity/{projectId}/bind
 * @name: BindResultVO
 */
export interface BindResultVO {
  /**
   * 是否成功
   */
  success: boolean;
  /**
   * 匿名 ID
   */
  anonymousId: string;
  /**
   * 用户 ID
   */
  userId: string;
}

export type BindResultResponseVO = BindResultVO;

/**
 * @description: 解绑用户身份 请求
 * @url: /api/event/admin/identity/{projectId}/unbind
 * @name: UnbindIdentityDto
 */
export interface UnbindIdentityDto {
  /**
   * 匿名ID
   */
  anonymousId: string;
}

/**
 * @description: 解绑用户身份 响应
 * @url: /api/event/admin/identity/{projectId}/unbind
 * @name: UnbindResultVO
 */
export interface UnbindResultVO {
  /**
   * 是否成功
   */
  success: boolean;
}

export type UnbindResultResponseVO = UnbindResultVO;

/**
 * @description: PV/UV 统计 请求
 * @url: /api/event/analysis/event/pv-uv
 * @name: PvUvQueryDto
 */
export interface PvUvQueryDto {
  /**
   * 项目标识，缺省时按集团聚合
   */
  projectKey?: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 时间粒度
   */
  granularity: "hour" | "day";
  /**
   * 页面URL筛选
   */
  pageUrl?: string;
}

export interface PvUvResultVO {
  /**
   * 时间
   */
  time: string;
  /**
   * 页面浏览量
   */
  pv: number;
  /**
   * 独立访客数
   */
  uv: number;
}

/**
 * @description: PV/UV 统计 响应
 * @url: /api/event/analysis/event/pv-uv
 * @name: PvUvResultListResponseVO
 */
export type PvUvResultListResponseVO = PvUvResultVO[];

/**
 * @description: 事件趋势 请求
 * @url: /api/event/analysis/event/event-trend
 * @name: EventTrendQueryDto
 */
export interface EventTrendQueryDto {
  /**
   * 项目标识，缺省时按集团聚合
   */
  projectKey?: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 事件标识
   */
  eventKey: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 时间粒度
   */
  granularity: "hour" | "day";
}

export interface EventTrendVO {
  /**
   * 时间
   */
  time: string;
  /**
   * 事件数量
   */
  count: number;
  /**
   * 独立用户数
   */
  uniqueUsers: number;
}

/**
 * @description: 事件趋势 响应
 * @url: /api/event/analysis/event/event-trend
 * @name: EventTrendListResponseVO
 */
export type EventTrendListResponseVO = EventTrendVO[];

/**
 * @description: 实时统计 响应
 * @url: /api/event/analysis/event/realtime
 * @name: RealtimeStatsVO
 */
export interface RealtimeStatsVO {
  /**
   * 页面浏览量
   */
  pv: number;
  /**
   * 独立访客数
   */
  uv: number;
  /**
   * 事件数
   */
  events: number;
}

export type RealtimeStatsResponseVO = RealtimeStatsVO;

/**
 * @description: 热门页面 请求
 * @url: /api/event/analysis/event/top-pages
 * @name: TopPagesQueryDto
 */
export interface TopPagesQueryDto {
  /**
   * 项目标识，缺省时按集团聚合
   */
  projectKey?: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 返回数量限制
   */
  limit?: number;
}

export interface TopPageVO {
  /**
   * 页面 URL
   */
  pageUrl: string;
  /**
   * 页面浏览量
   */
  pv: number;
  /**
   * 独立访客数
   */
  uv: number;
}

/**
 * @description: 热门页面 响应
 * @url: /api/event/analysis/event/top-pages
 * @name: TopPageListResponseVO
 */
export type TopPageListResponseVO = TopPageVO[];

/**
 * @description: 概览统计 请求
 * @url: /api/event/analysis/event/overview
 * @name: OverviewQueryDto
 */
export interface OverviewQueryDto {
  /**
   * 项目标识，缺省时按集团聚合
   */
  projectKey?: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 开始日期，默认7天前
   */
  startDate?: string;
  /**
   * 结束日期，默认今天
   */
  endDate?: string;
}

/**
 * @description: 概览统计 响应
 * @url: /api/event/analysis/event/overview
 * @name: OverviewStatsVO
 */
export interface OverviewStatsVO {
  /**
   * 总 PV
   */
  totalPv: number;
  /**
   * 总 UV
   */
  totalUv: number;
  /**
   * 日均 PV
   */
  avgPvPerDay: number;
  /**
   * 日均 UV
   */
  avgUvPerDay: number;
}

export type OverviewStatsResponseVO = OverviewStatsVO;

/**
 * @description: 留存分析 请求
 * @url: /api/event/analysis/retention/analyze
 * @name: RetentionQueryDto
 */
export interface RetentionQueryDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 初始事件点位（默认任意事件）
   */
  startPointKey?: string;
  /**
   * 回访事件点位（默认任意事件）
   */
  returnPointKey?: string;
  /**
   * 留存类型
   */
  retentionType?: "day1" | "day7" | "day30" | "custom";
  /**
   * 是否计算流失（而非留存）
   */
  calculateChurn?: boolean;
  /**
   * 数据展示类型
   */
  dataShowType?: "percent" | "number";
  /**
   * 最大天数（自定义时使用）
   */
  maxDays?: number;
}

export interface RetentionRateVO {
  /**
   * 天数
   */
  day: number;
  /**
   * 留存值(人数或百分比)
   */
  value: Record<string, any>;
}

export interface RetentionAnalysisVO {
  /**
   * 日期
   */
  date: string;
  /**
   * 群组规模
   */
  cohortSize: number;
  /**
   * 各天留存数据
   */
  retention: RetentionRateVO[];
}

/**
 * @description: 留存分析 响应
 * @url: /api/event/analysis/retention/analyze
 * @name: RetentionAnalysisListResponseVO
 */
export type RetentionAnalysisListResponseVO = RetentionAnalysisVO[];

export interface RetentionMetricVO {
  /**
   * 留存人数
   */
  retained: number;
  /**
   * 留存率(%)
   */
  rate: string;
}

/**
 * @description: 快速留存统计 响应
 * @url: /api/event/analysis/retention/quick
 * @name: QuickRetentionVO
 */
export interface QuickRetentionVO {
  /**
   * 总用户数
   */
  totalUsers: number;
  /**
   * 次日留存
   */
  day1: RetentionMetricVO;
  /**
   * 7日留存
   */
  day7: RetentionMetricVO;
  /**
   * 30日留存
   */
  day30: RetentionMetricVO;
}

export type QuickRetentionResponseVO = QuickRetentionVO;

/**
 * @description: 留存矩阵 请求
 * @url: /api/event/analysis/retention/matrix
 * @name: RetentionMatrixQueryDto
 */
export interface RetentionMatrixQueryDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 初始事件点位
   */
  startPointKey?: string;
  /**
   * 回访事件点位
   */
  returnPointKey?: string;
  /**
   * 最大天数
   */
  maxDays?: number;
}

export interface RetentionDayVO {
  /**
   * 天数
   */
  day: number;
  /**
   * 留存人数
   */
  retained: number;
  /**
   * 留存率(%)
   */
  rate: string;
}

export interface RetentionMatrixRowVO {
  /**
   * 日期
   */
  date: string;
  /**
   * 群组规模
   */
  cohortSize: number;
  /**
   * 各天留存数据
   */
  days: RetentionDayVO[];
}

/**
 * @description: 留存矩阵 响应
 * @url: /api/event/analysis/retention/matrix
 * @name: RetentionMatrixResponseVO
 */
export type RetentionMatrixResponseVO = RetentionMatrixRowVO[];

/**
 * @description: 分群留存分析 请求
 * @url: /api/event/analysis/retention/cohort
 * @name: CohortQueryDto
 */
export interface CohortQueryDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 分组字段
   */
  groupBy?: string;
}

export interface CohortRetentionMetricVO {
  /**
   * 留存人数
   */
  retained: number;
  /**
   * 留存率(%)
   */
  rate: string;
}

export interface CohortAnalysisVO {
  /**
   * 分群名称
   */
  group: string;
  /**
   * 群组规模
   */
  cohortSize: number;
  /**
   * 次日留存
   */
  day1: CohortRetentionMetricVO;
  /**
   * 7日留存
   */
  day7: CohortRetentionMetricVO;
}

/**
 * @description: 分群留存分析 响应
 * @url: /api/event/analysis/retention/cohort
 * @name: CohortAnalysisListResponseVO
 */
export type CohortAnalysisListResponseVO = CohortAnalysisVO[];

/**
 * @description: 路径分析 请求
 * @url: /api/event/analysis/path/analyze
 * @name: PathQueryDto
 */
export interface PathQueryDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 起始点位
   */
  startPointKey?: string;
  /**
   * 路径方向
   */
  direction?: "forward" | "backward";
  /**
   * 路径深度
   */
  depth?: number;
  /**
   * 最小用户数阈值
   */
  minUsers?: number;
}

export interface PathNodeVO {
  /**
   * 节点名称
   */
  name: string;
  /**
   * 访问次数
   */
  count: number;
  /**
   * 子节点
   */
  children: PathNodeVO[];
}

/**
 * @description: 路径分析 响应
 * @url: /api/event/analysis/path/analyze
 * @name: PathAnalysisVO
 */
export interface PathAnalysisVO {
  /**
   * 根节点名称
   */
  name: string;
  /**
   * 访问次数
   */
  count: number;
  /**
   * 子节点
   */
  children: PathNodeVO[];
}

export type PathAnalysisResponseVO = PathAnalysisVO;

/**
 * @description: 页面路径分析 请求
 * @url: /api/event/analysis/path/pages
 * @name: PagePathQueryDto
 */
export interface PagePathQueryDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 起始页面URL
   */
  startPage?: string;
  /**
   * 路径深度
   */
  depth?: number;
}

export interface PagePathVO {
  /**
   * 路径
   */
  path: string;
  /**
   * 访问次数
   */
  count: number;
}

/**
 * @description: 页面路径分析 响应
 * @url: /api/event/analysis/path/pages
 * @name: PagePathListResponseVO
 */
export type PagePathListResponseVO = PagePathVO[];

/**
 * @description: 用户路径 请求
 * @url: /api/event/analysis/path/user
 * @name: UserPathQueryDto
 */
export interface UserPathQueryDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 用户ID
   */
  userId: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 最大事件数
   */
  limit?: number;
}

export interface UserPathEventVO {
  /**
   * 事件时间
   */
  eventTime: string;
  /**
   * 点位标识
   */
  pointCode: string;
  /**
   * 页面 URL
   */
  pageUrl: string;
  /**
   * 页面标题
   */
  pageTitle: string;
  /**
   * 会话 ID
   */
  sessionId: string;
  /**
   * 事件属性
   */
  properties: Record<string, any>;
}

/**
 * @description: 用户路径 响应
 * @url: /api/event/analysis/path/user
 * @name: UserPathEventListResponseVO
 */
export type UserPathEventListResponseVO = UserPathEventVO[];

/**
 * @description: 会话路径 请求
 * @url: /api/event/analysis/path/session
 * @name: SessionPathQueryDto
 */
export interface SessionPathQueryDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 会话ID
   */
  sessionId: string;
}

export interface SessionPathEventVO {
  /**
   * 事件时间
   */
  eventTime: string;
  /**
   * 点位标识
   */
  pointCode: string;
  /**
   * 页面 URL
   */
  pageUrl: string;
  /**
   * 页面标题
   */
  pageTitle: string;
  /**
   * 事件属性
   */
  properties: Record<string, any>;
}

/**
 * @description: 会话路径 响应
 * @url: /api/event/analysis/path/session
 * @name: SessionPathEventListResponseVO
 */
export type SessionPathEventListResponseVO = SessionPathEventVO[];

/**
 * @description: 热门路径 请求
 * @url: /api/event/analysis/path/top
 * @name: TopPathsQueryDto
 */
export interface TopPathsQueryDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 路径长度
   */
  pathLength?: number;
  /**
   * 返回数量
   */
  limit?: number;
}

export interface TopPathVO {
  /**
   * 路径数组
   */
  path: string[];
  /**
   * 路径字符串
   */
  pathString: string;
  /**
   * 会话数
   */
  sessions: number;
}

/**
 * @description: 热门路径 响应
 * @url: /api/event/analysis/path/top
 * @name: TopPathListResponseVO
 */
export type TopPathListResponseVO = TopPathVO[];

export interface FlowNodeVO {
  /**
   * 节点名称
   */
  name: string;
}

export interface FlowLinkVO {
  /**
   * 源节点
   */
  source: string;
  /**
   * 目标节点
   */
  target: string;
  /**
   * 流量值
   */
  value: number;
}

/**
 * @description: 流向数据 响应
 * @url: /api/event/analysis/path/flow
 * @name: FlowDataVO
 */
export interface FlowDataVO {
  /**
   * 节点列表
   */
  nodes: FlowNodeVO[];
  /**
   * 链接列表
   */
  links: FlowLinkVO[];
}

export type FlowDataResponseVO = FlowDataVO;

export interface UserRelationVO {
  /**
   * 关联 ID
   */
  id: string;
  /**
   * 项目 ID
   */
  projectId: string;
  /**
   * 匿名 ID
   */
  anonymousId: string;
  /**
   * 用户 ID
   */
  userId?: Record<string, any>;
  /**
   * 设备 ID
   */
  deviceId?: Record<string, any>;
  /**
   * 首次访问时间
   */
  firstSeen: string;
  /**
   * 最后访问时间
   */
  lastSeen: string;
}

/**
 * @description: 查询用户关联 响应
 * @url: /api/event/analysis/user/relations
 * @name: UserRelationListResponseVO
 */
export type UserRelationListResponseVO = UserRelationVO[];

/**
 * @description: 获取用户身份 请求
 * @url: /api/event/analysis/user/identities
 * @name: UserIdentityDto
 */
export interface UserIdentityDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 用户ID
   */
  userId: string;
}

/**
 * @description: 获取用户身份 响应
 * @url: /api/event/analysis/user/identities
 * @name: UserIdentityVO
 */
export interface UserIdentityVO {
  /**
   * 用户 ID
   */
  userId: string;
  /**
   * 关联的匿名 ID 列表
   */
  anonymousIds: string[];
  /**
   * 关联的设备 ID 列表
   */
  deviceIds: string[];
  /**
   * 首次访问时间
   */
  firstSeen?: Record<string, any>;
  /**
   * 最后访问时间
   */
  lastSeen?: Record<string, any>;
}

export type UserIdentityResponseVO = UserIdentityVO;

/**
 * @description: 用户完整旅程 请求
 * @url: /api/event/analysis/user/journey
 * @name: UserJourneyQueryDto
 */
export interface UserJourneyQueryDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 用户ID
   */
  userId: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
  /**
   * 最大事件数
   */
  limit?: number;
}

export interface UserJourneyEventVO {
  /**
   * 事件 ID
   */
  id: string;
  /**
   * 事件时间
   */
  eventTime: string;
  /**
   * 点位标识
   */
  pointCode: string;
  /**
   * 用户 ID
   */
  userId: string;
  /**
   * 匿名 ID
   */
  anonymousId: string;
  /**
   * 会话 ID
   */
  sessionId: string;
  /**
   * 设备 ID
   */
  deviceId: string;
  /**
   * 平台
   */
  platform: string;
  /**
   * 页面 URL
   */
  pageUrl: string;
  /**
   * 页面标题
   */
  pageTitle: string;
  /**
   * 事件属性
   */
  properties: Record<string, any>;
  /**
   * 是否登录前行为
   */
  isPreLogin: boolean;
  /**
   * 身份类型
   */
  identityType: "anonymous" | "logged_in";
}

/**
 * @description: 用户完整旅程 响应
 * @url: /api/event/analysis/user/journey
 * @name: UserJourneyEventListResponseVO
 */
export type UserJourneyEventListResponseVO = UserJourneyEventVO[];

/**
 * @description: 转化归因分析 请求
 * @url: /api/event/analysis/user/attribution
 * @name: ConversionAttributionDto
 */
export interface ConversionAttributionDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 用户ID
   */
  userId: string;
  /**
   * 转化事件点位
   */
  conversionPointKey: string;
  /**
   * 归因窗口（天）
   */
  attributionWindow?: number;
}

export interface TouchPointVO {
  /**
   * 点位标识
   */
  pointCode: string;
  /**
   * 来源
   */
  source: string;
  /**
   * 活动
   */
  campaign: string;
  /**
   * 媒介
   */
  medium: string;
  /**
   * 引荐来源
   */
  referrer: string;
  /**
   * 首次触达时间
   */
  firstTouchTime: string;
  /**
   * 最后触达时间
   */
  lastTouchTime: string;
  /**
   * 触达次数
   */
  touchCount: number;
}

export interface AttributionDetailVO {
  /**
   * 首次触点
   */
  firstTouch?: TouchPointVO;
  /**
   * 末次触点
   */
  lastTouch?: TouchPointVO;
  /**
   * 所有触点
   */
  allTouchPoints: TouchPointVO[];
  /**
   * 总触达次数
   */
  totalTouches: number;
}

/**
 * @description: 转化归因分析 响应
 * @url: /api/event/analysis/user/attribution
 * @name: AttributionVO
 */
export interface AttributionVO {
  /**
   * 是否已转化
   */
  converted: boolean;
  /**
   * 转化时间
   */
  conversionTime?: Record<string, any>;
  /**
   * 用户 ID
   */
  userId: string;
  /**
   * 归因详情
   */
  attribution?: AttributionDetailVO;
}

export type AttributionResponseVO = AttributionVO;

/**
 * @description: 跨设备行为 请求
 * @url: /api/event/analysis/user/cross-device
 * @name: CrossDeviceQueryDto
 */
export interface CrossDeviceQueryDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 用户ID
   */
  userId: string;
  /**
   * 开始日期
   */
  startDate: string;
  /**
   * 结束日期
   */
  endDate: string;
}

export interface DeviceBehaviorVO {
  /**
   * 设备 ID
   */
  deviceId: string;
  /**
   * 平台
   */
  platform: string;
  /**
   * 事件数
   */
  eventCount: number;
  /**
   * 会话数
   */
  sessionCount: number;
  /**
   * 首次访问时间
   */
  firstSeen: string;
  /**
   * 最后访问时间
   */
  lastSeen: string;
  /**
   * 常用事件
   */
  topEvents: string[];
}

/**
 * @description: 跨设备行为 响应
 * @url: /api/event/analysis/user/cross-device
 * @name: CrossDeviceVO
 */
export interface CrossDeviceVO {
  /**
   * 用户 ID
   */
  userId: string;
  /**
   * 设备数量
   */
  deviceCount: number;
  /**
   * 设备列表
   */
  devices: DeviceBehaviorVO[];
}

export type CrossDeviceResponseVO = CrossDeviceVO;

/**
 * @description: 合并用户身份 请求
 * @url: /api/event/analysis/user/merge
 * @name: MergeUsersDto
 */
export interface MergeUsersDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 主用户ID（保留）
   */
  primaryUserId: string;
  /**
   * 待合并的用户ID列表
   */
  mergeUserIds: string[];
}

/**
 * @description: 合并用户身份 响应
 * @url: /api/event/analysis/user/merge
 * @name: MergeResultVO
 */
export interface MergeResultVO {
  /**
   * 是否成功
   */
  success: boolean;
  /**
   * 主用户 ID
   */
  primaryUserId: string;
  /**
   * 合并数量
   */
  mergedCount: number;
}

export type MergeResultResponseVO = MergeResultVO;

/**
 * @description: 关联统计 响应
 * @url: /api/event/analysis/user/{projectId}/stats
 * @name: RelationStatsVO
 */
export interface RelationStatsVO {
  /**
   * 总关联数
   */
  totalRelations: number;
  /**
   * 独立用户数
   */
  uniqueUsers: number;
  /**
   * 平均每用户匿名 ID 数
   */
  avgAnonymousIdsPerUser: string;
  /**
   * 最近24小时关联数
   */
  relationsLast24h: number;
}

export type RelationStatsResponseVO = RelationStatsVO;

export interface SourceValueVO {
  /**
   * 字段值
   */
  fieldValue: string;
  /**
   * 数量
   */
  count: number;
  /**
   * 独立用户数
   */
  uniqueUsers: number;
}

/**
 * @description: 来源字段值 响应
 * @url: /api/event/analysis/user/{projectId}/source-values
 * @name: SourceValueListResponseVO
 */
export type SourceValueListResponseVO = SourceValueVO[];

/**
 * @description: 暂无描述 请求
 * @url: /api/event/metrics
 * @name: EventMetricsQueryDto
 */
export interface EventMetricsQueryDto {
  /**
   * 
   */
  format: string;
}

/**
 * @description: 获取流量趋势 请求
 * @url: /api/event/traffic/trend
 * @name: TrendQueryDto
 */
export interface TrendQueryDto {
  /**
   * 获取最近多少分钟的数据，默认60
   */
  minutes?: string;
}

/**
 * @description: 项目列表 请求
 * @url: /api/event/admin/project
 * @name: AdminProjectGetQueryDto
 */
export interface AdminProjectGetQueryDto {
  /**
   * 集团 ID 筛选（仅平台总控传入；集团成员忽略）
   */
  orgId?: number;
  /**
   * 项目状态筛选
   */
  status?: "active" | "paused" | "archived";
  /**
   * 平台类型筛选
   */
  platform?: "web" | "miniprogram" | "ios" | "android" | "react_native";
}

/**
 * @description: 告警规则列表 请求
 * @url: /api/event/admin/alarm
 * @name: AdminAlarmGetQueryDto
 */
export interface AdminAlarmGetQueryDto {
  /**
   * 集团 ID（仅总控可指定）
   */
  orgId?: number;
  /**
   * 状态筛选
   */
  status?: "enabled" | "disabled";
  /**
   * 点位标识
   */
  pointKey?: string;
}

/**
 * @description: 获取告警消息 请求
 * @url: /api/event/admin/alarm/messages
 * @name: MessagesQueryDto
 */
export interface MessagesQueryDto {
  /**
   * 集团 ID（仅总控可指定）
   */
  orgId?: number;
  /**
   * 告警规则ID，不传则查询所有
   */
  ruleId?: string;
  /**
   * 开始时间
   */
  startDate?: string;
  /**
   * 结束时间
   */
  endDate?: string;
}

/**
 * @description: 告警统计 请求
 * @url: /api/event/admin/alarm/stats
 * @name: AlarmStatsQueryDto
 */
export interface AlarmStatsQueryDto {
  /**
   * 集团 ID（仅总控可指定）
   */
  orgId?: number;
  /**
   * 状态筛选
   */
  status?: "enabled" | "disabled";
  /**
   * 点位标识
   */
  pointKey?: string;
}

/**
 * @description: 卡片列表 请求
 * @url: /api/event/admin/card
 * @name: AdminCardGetQueryDto
 */
export interface AdminCardGetQueryDto {
  /**
   * 集团 ID 筛选（仅平台总控传入；集团成员忽略）
   */
  orgId?: number;
  /**
   * 页面ID筛选
   */
  pageId?: string;
  /**
   * 页面标识筛选
   */
  pageKey?: string;
  /**
   * 卡片类型
   */
  cardType?: "bar" | "line" | "bar_line" | "stacked" | "funnel" | "pie" | "table" | "number" | "retention" | "path";
}

/**
 * @description: 页面列表 请求
 * @url: /api/event/admin/card-page
 * @name: AdminCardPageGetQueryDto
 */
export interface AdminCardPageGetQueryDto {
  /**
   * 集团 ID 筛选（仅平台总控传入；集团成员忽略）
   */
  orgId?: number;
  /**
   * 类型筛选
   */
  type?: "group" | "page";
  /**
   * 父级ID筛选
   */
  parentId?: string;
}

/**
 * @description: 树形结构 请求
 * @url: /api/event/admin/card-page/tree
 * @name: TreeQueryDto
 */
export interface TreeQueryDto {
  /**
   * 集团 ID（仅平台总控使用，可指定查看某个集团树）
   */
  orgId?: string;
}

/**
 * @description: 获取集团初始化状态 请求
 * @url: /api/event/admin/init/status
 * @name: StatusQueryDto
 */
export interface StatusQueryDto {
  /**
   * 目标集团 ID（平台总控必填，集团成员可省略）
   */
  orgId?: number;
}

/**
 * @description: 实时统计 请求
 * @url: /api/event/analysis/event/realtime
 * @name: RealtimeQueryDto
 */
export interface RealtimeQueryDto {
  /**
   * 项目标识，缺省时按集团聚合
   */
  projectKey?: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 统计最近 N 分钟
   */
  minutes?: number;
}

/**
 * @description: 查询用户关联 请求
 * @url: /api/event/analysis/user/relations
 * @name: RelationsQueryDto
 */
export interface RelationsQueryDto {
  /**
   * 项目ID
   */
  projectId: string;
  /**
   * 渠道ID，仅按指定渠道过滤
   */
  channelId?: string;
  /**
   * 用户ID
   */
  userId?: string;
  /**
   * 匿名ID
   */
  anonymousId?: string;
  /**
   * 设备ID
   */
  deviceId?: string;
}

/**
 * @description: 来源字段值 请求
 * @url: /api/event/analysis/user/{projectId}/source-values
 * @name: SourceValuesQueryDto
 */
export interface SourceValuesQueryDto {
  /**
   * 
   */
  fieldName: string;
}

