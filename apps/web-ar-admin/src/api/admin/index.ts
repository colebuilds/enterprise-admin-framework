import { requestClient } from '#/api/request';
import type {
  HomeSysUserInfoRsp,
  StringApiResponse,
  HealthCheckRsp,
  LoginReq,
  LoginRsp,
  HomeBasicInfoRsp,
  GetStartupProbeQueryDto,
  GetReadinessProbeQueryDto,
  GetStaticCacheQueryDto,
  CreateSchedulerTaskReq,
  GetSchedulerTaskListReq,
  SchedulerTaskDtoListApiResponse,
  GetSchedulerTaskDetailReq,
  SchedulerTaskDetailListRspListPageBaseResponse,
  UpdateSchedulerTaskReq,
  DeleteSchedulerTaskReq,
  PauseSchedulerTaskReq,
  ResumeSchedulerTaskReq,
  UpdateTaskStateReq,
  RunNowSchedulerTaskReq,
  RegisterTasksForTenantsReq,
  GetSchedulerTaskLogsReq,
  SchedulerTaskLogRspListPageBaseResponse,
  DeleteTaskJobReq,
  UpdateSettingReq,
  BooleanApiResponse
} from './types';

// 导出类型
export * from './types';

// ==================== AwsAuth ====================

/**
 * @description: 获取OpenId配置
 * @url: /.well-known/openid-configuration
 */
export const openidConfiguration = () => {
  return requestClient.get<any>('/.well-known/openid-configuration');
}

/**
 * @description: 获取Jwks配置
 * @url: /.well-known/jwks.json
 */
export const jwksJson = () => {
  return requestClient.get<any>('/.well-known/jwks.json');
}

// ==================== Home ====================

/**
 * @description: 获取当前系统用户的信息 (Auth)
 * @url: /api/Home/GetSysUserInfo
 */
export const getSysUserInfo = () => {
  return requestClient.post<HomeSysUserInfoRsp>('/Home/GetSysUserInfo');
}

/**
 * @description: 用来自测的： 返回一个字符串，看看 k8s 是否发布成功
 * @url: /api/Home/GetVersion
 */
export const getVersion = () => {
  return requestClient.post<StringApiResponse>('/Home/GetVersion');
}

/**
 * @description: 健康检查：检测所有配置的外部服务是否可访问（读+写）
 * @url: /api/Home/CheckHealth
 */
export const checkHealth = () => {
  return requestClient.post<HealthCheckRsp>('/Home/CheckHealth');
}

// ==================== Login ====================

/**
 * @description: 用户登录
1. 如果系统和用户设置都开启了谷歌验证，
    1.1 用户没有谷歌验证码核验，就需要 vCode 参数进行绑定，否则返回信息中包含: "googleVerifyInfo": {"googleImageUrl": "二维码图片地址","googleVerify": false} 
    1.2 用户通过谷歌验证码检验了，请求参数中没有 vCode，返回错误信息： {    "data": null,    "code": 1,    "msg": "vCode isn't correct",    "msgCode": 41}
 * @param {LoginReq} params
 * @url: /api/Login/Login
 */
export const login = (params: LoginReq) => {
  return requestClient.post<LoginRsp>('/Login/Login', params);
}

/**
 * @description: 获取基础信息
 * @url: /api/Login/HomeBasic
 */
export const homeBasic = () => {
  return requestClient.post<HomeBasicInfoRsp>('/Login/HomeBasic');
}

/**
 * @description: 退出登录 (Auth)
 * @url: /api/Login/LoginOff
 */
export const loginOff = () => {
  return requestClient.post<any>('/Login/LoginOff');
}

// ==================== Probe ====================

/**
 * @description: 启动探针 确认程序是否正常启动
 * @param {GetStartupProbeQueryDto} params
 * @url: /api/Probe/GetStartupProbe
 */
export const getStartupProbe = (params?: GetStartupProbeQueryDto) => {
  return requestClient.get<any>('/Probe/GetStartupProbe', { params });
}

/**
 * @description: 就绪探针 确认程序是否就绪
 * @param {GetReadinessProbeQueryDto} params
 * @url: /api/Probe/GetReadinessProbe
 */
export const getReadinessProbe = (params?: GetReadinessProbeQueryDto) => {
  return requestClient.get<any>('/Probe/GetReadinessProbe', { params });
}

/**
 * @description: 获取静态缓存数据
 * @param {GetStaticCacheQueryDto} params
 * @url: /api/StaticCache/GetStaticCache
 */
export const getStaticCache = (params?: GetStaticCacheQueryDto) => {
  return requestClient.get<any>('/StaticCache/GetStaticCache', { params });
}

// ==================== SchedulerTask ====================

/**
 * @description: 创建调度任务 (Auth)
 * @param {CreateSchedulerTaskReq} params
 * @url: /api/SchedulerTask/Create
 */
export const create = (params: CreateSchedulerTaskReq) => {
  return requestClient.post<any>('/SchedulerTask/Create', params);
}

/**
 * @description: 获取调度任务列表 (Auth)
 * @param {GetSchedulerTaskListReq} params
 * @url: /api/SchedulerTask/GetList
 */
export const getList = (params: GetSchedulerTaskListReq) => {
  return requestClient.post<SchedulerTaskDtoListApiResponse>('/SchedulerTask/GetList', params);
}

/**
 * @description: 获取调度任务详情 (Auth)
 * @param {GetSchedulerTaskDetailReq} params
 * @url: /api/SchedulerTask/GetDetail
 */
export const getDetail = (params: GetSchedulerTaskDetailReq) => {
  return requestClient.post<SchedulerTaskDetailListRspListPageBaseResponse>('/SchedulerTask/GetDetail', params);
}
/**
 * @description: 获取调度任务详情 (Auth)（导出，返回原生 blob 响应）
 * @param {GetSchedulerTaskDetailReq} params
 * @url: /api/SchedulerTask/GetDetail
 */
export const getDetailExport = (params: GetSchedulerTaskDetailReq) => {
  return requestClient.post<Blob>('/SchedulerTask/GetDetail', params, { responseType: 'blob' });
}

/**
 * @description: 更新调度任务 (Auth)
 * @param {UpdateSchedulerTaskReq} params
 * @url: /api/SchedulerTask/Update
 */
export const schedulerTaskUpdate = (params: UpdateSchedulerTaskReq) => {
  return requestClient.post<any>('/SchedulerTask/Update', params);
}

/**
 * @description: 删除调度任务 (Auth)
 * @param {DeleteSchedulerTaskReq} params
 * @url: /api/SchedulerTask/Delete
 */
export const schedulerTaskDelete = (params: DeleteSchedulerTaskReq) => {
  return requestClient.post<any>('/SchedulerTask/Delete', params);
}

/**
 * @description: 暂停调度任务 (Auth)
 * @param {PauseSchedulerTaskReq} params
 * @url: /api/SchedulerTask/Pause
 */
export const pause = (params: PauseSchedulerTaskReq) => {
  return requestClient.post<any>('/SchedulerTask/Pause', params);
}

/**
 * @description: 恢复调度任务 (Auth)
 * @param {ResumeSchedulerTaskReq} params
 * @url: /api/SchedulerTask/Resume
 */
export const resume = (params: ResumeSchedulerTaskReq) => {
  return requestClient.post<any>('/SchedulerTask/Resume', params);
}

/**
 * @description: 启用调度任务 (Auth)
 * @param {UpdateTaskStateReq} params
 * @url: /api/SchedulerTask/Enable
 */
export const enable = (params: UpdateTaskStateReq) => {
  return requestClient.post<any>('/SchedulerTask/Enable', params);
}

/**
 * @description: 禁用调度任务 (Auth)
 * @param {UpdateTaskStateReq} params
 * @url: /api/SchedulerTask/Disable
 */
export const disable = (params: UpdateTaskStateReq) => {
  return requestClient.post<any>('/SchedulerTask/Disable', params);
}

/**
 * @description: 立即执行调度任务 (Auth)
 * @param {RunNowSchedulerTaskReq} params
 * @url: /api/SchedulerTask/RunNow
 */
export const runNow = (params: RunNowSchedulerTaskReq) => {
  return requestClient.post<any>('/SchedulerTask/RunNow', params);
}

/**
 * @description: 为多个集团注册所有调度任务 (Auth)
 * @param {RegisterTasksForTenantsReq} params
 * @url: /api/SchedulerTask/RegisterTasksForTenants
 */
export const registerTasksForTenants = (params: RegisterTasksForTenantsReq) => {
  return requestClient.post<any>('/SchedulerTask/RegisterTasksForTenants', params);
}

/**
 * @description: 获取调度任务日志列表 (Auth)
 * @param {GetSchedulerTaskLogsReq} params
 * @url: /api/SchedulerTask/GetLogs
 */
export const getLogs = (params: GetSchedulerTaskLogsReq) => {
  return requestClient.post<SchedulerTaskLogRspListPageBaseResponse>('/SchedulerTask/GetLogs', params);
}
/**
 * @description: 获取调度任务日志列表 (Auth)（导出，返回原生 blob 响应）
 * @param {GetSchedulerTaskLogsReq} params
 * @url: /api/SchedulerTask/GetLogs
 */
export const getLogsExport = (params: GetSchedulerTaskLogsReq) => {
  return requestClient.post<Blob>('/SchedulerTask/GetLogs', params, { responseType: 'blob' });
}

/**
 * @description: 删除调度任务的作业 (Auth)
 * @param {DeleteTaskJobReq} params
 * @url: /api/SchedulerTask/DeleteTaskJob
 */
export const deleteTaskJob = (params: DeleteTaskJobReq) => {
  return requestClient.post<any>('/SchedulerTask/DeleteTaskJob', params);
}

// ==================== Setting ====================

/**
 * @description:  (Auth)
 * @param {UpdateSettingReq} params
 * @url: /api/Setting/Update
 */
export const settingUpdate = (params: UpdateSettingReq) => {
  return requestClient.post<BooleanApiResponse>('/Setting/Update', params);
}
