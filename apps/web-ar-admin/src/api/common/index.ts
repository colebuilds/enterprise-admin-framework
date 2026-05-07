import { requestClient } from '#/api/request';
import {
  CheckAuthReq,
  GetSysUserInfoRsp,
  OrgTenantListRspListApiResponse,
  DateTimeScopeTypeRsp,
  StringListApiResponse,
  SyncBasicTableToRedisReq,
  DeleteRedisKeyReq,
  GetListRedisKeyReq,
  GetListRedisValueReq,
  ObjectGetListRedisValueRsp,
  TemplateFileReq,
  FileTemplateRsp,
  GetSettingReq,
  SettingsReadOnlyEntity,
  GetDynamicDictionaryReq,
  DynamicDictionaryRsp,
  DictionaryRsp,
  PlatformDicRsp,
  ThirdPayMerchantSelectReq,
  ThirdPayMerchantSelectRsp,
  ChannelSelectReq,
  ChannelSelectRsp,
  CurrencySelectReq,
  UploadToOssFormDto,
  ObjectListApiResponse,
  BucketFilesReq,
  BucketFilesRsp
} from './types';

// 导出类型
export * from './types';

// ==================== Auth ====================

/**
 * @description:  (Auth)
 * @param {CheckAuthReq} params
 * @url: /api/Auth/CheckAuth
 */
export const checkAuth = (params: CheckAuthReq) => {
  return requestClient.post<GetSysUserInfoRsp>('/Auth/CheckAuth', params);
}

/**
 * @description: 获取集团商户列表- 内网调用
 * @url: /api/Auth/GetOrgTenantList
 */
export const getOrgTenantList = () => {
  return requestClient.post<OrgTenantListRspListApiResponse>('/Auth/GetOrgTenantList');
}

// ==================== Common ====================

/**
 * @description: 页面重新加载后刷新当前系统用户的实时推送数据 (Auth)
 * @url: /api/Common/ReloadedPage
 */
export const reloadedPage = () => {
  return requestClient.post<any>('/Common/ReloadedPage');
}

/**
 * @description: 获取时间范围枚举类型 (Auth)
 * @url: /api/Common/GetDateTimeScopeTypes
 */
export const getDateTimeScopeTypes = () => {
  return requestClient.post<DateTimeScopeTypeRsp>('/Common/GetDateTimeScopeTypes');
}

/**
 * @description: 获取基础表名列表 (Auth)
 * @url: /api/Common/GetListBasicTable
 */
export const getListBasicTable = () => {
  return requestClient.post<StringListApiResponse>('/Common/GetListBasicTable');
}

/**
 * @description: 同步基础表至Redis (Auth)
 * @param {SyncBasicTableToRedisReq} params
 * @url: /api/Common/SyncBasicTableToRedis
 */
export const syncBasicTableToRedis = (params: SyncBasicTableToRedisReq) => {
  return requestClient.post<any>('/Common/SyncBasicTableToRedis', params);
}

/**
 * @description: 删除RedisKey (Auth)
 * @param {DeleteRedisKeyReq} params
 * @url: /api/Common/DeleteRedisKey
 */
export const deleteRedisKey = (params: DeleteRedisKeyReq) => {
  return requestClient.post<any>('/Common/DeleteRedisKey', params);
}

/**
 * @description: 查询RedisKey(支持模糊查询) (Auth)
 * @param {GetListRedisKeyReq} params
 * @url: /api/Common/GetListRedisKey
 */
export const getListRedisKey = (params: GetListRedisKeyReq) => {
  return requestClient.post<StringListApiResponse>('/Common/GetListRedisKey', params);
}

/**
 * @description: 查询RedisValue (Auth)
 * @param {GetListRedisValueReq} params
 * @url: /api/Common/GetListRedisValue
 */
export const getListRedisValue = (params: GetListRedisValueReq) => {
  return requestClient.post<ObjectGetListRedisValueRsp>('/Common/GetListRedisValue', params);
}
/**
 * @description: 查询RedisValue (Auth)（导出，返回原生 blob 响应）
 * @param {GetListRedisValueReq} params
 * @url: /api/Common/GetListRedisValue
 */
export const getListRedisValueExport = (params: GetListRedisValueReq) => {
  return requestClient.post<Blob>('/Common/GetListRedisValue', params, { responseType: 'blob' });
}

/**
 * @description: 获取模板文件下载地址(功能模板文件下载) : (Auth)
 * @param {TemplateFileReq} params
 * @url: /api/Common/GetExeclTemplateFileURL
 */
export const getExeclTemplateFileURL = (params: TemplateFileReq) => {
  return requestClient.post<FileTemplateRsp>('/Common/GetExeclTemplateFileURL', params);
}

/**
 * @description: 根据key获取系统字典值 (Auth)
 * @param {GetSettingReq} params
 * @url: /api/Common/GetSettingByKey
 */
export const getSettingByKey = (params: GetSettingReq) => {
  return requestClient.post<SettingsReadOnlyEntity>('/Common/GetSettingByKey', params);
}

/**
 * @description: 获取动态字典（来自 DB / 缓存的运行时数据，区别于 GetDictionary 里的枚举常量）。
当前支持的 Key:
  - RechargeCategoryList: 充值大类列表
  - WithdrawCategoryList: 提现大类列表
  - OrganizationList: 集团下拉框数据
  - TenantList: 商户下拉框数据
  - SysCurrencyList: 币种下拉框数据
  - PayCodeList: 三方映射码下拉框数据
  - ThirdPayMerchantList: 三方商户昵称/商户号下拉框数据
  - TenantPayChannelList: 商户通道下拉框数据
  - SysPayChannelList: 系统通道字典下拉框数据
  - UserName: 当前集团内系统用户 UserId → UserName 映射（Dictionary<int, string>） (Auth)
 * @param {GetDynamicDictionaryReq} params
 * @url: /api/Common/GetDynamicDictionary
 */
export const getDynamicDictionary = (params: GetDynamicDictionaryReq) => {
  return requestClient.post<DynamicDictionaryRsp>('/Common/GetDynamicDictionary', params);
}

/**
 * @description: 获取公共字典映射 (Auth)
 * @url: /api/Common/GetDictionary
 */
export const getDictionary = () => {
  return requestClient.post<DictionaryRsp>('/Common/GetDictionary');
}

/**
 * @description: 获取平台配置数据-国家语言币种 (Auth)
 * @url: /api/Common/GetPlatformDic
 */
export const getPlatformDic = () => {
  return requestClient.post<PlatformDicRsp>('/Common/GetPlatformDic');
}

// ==================== LottoBasicSelect ====================

/**
 * @description: 【通道查询条件】获取通道查询下拉数据
按商户ID(TenantId)+通道类型(ChannelType)关联，
返回三方映射码、通道名称、三方商户昵称、币种（均去重） (Auth)
 * @param {ThirdPayMerchantSelectReq} params
 * @url: /api/LottoBasicSelect/GetThirdPayMerchantSelectData
 */
export const getThirdPayMerchantSelectData = (params: ThirdPayMerchantSelectReq) => {
  return requestClient.post<ThirdPayMerchantSelectRsp>('/LottoBasicSelect/GetThirdPayMerchantSelectData', params);
}

/**
 * @description: 【通道字典管理】获取通道字典下拉数据
按通道类型(Recharge/Withdraw)直接从对应通道字典表获取三方映射码、通道名称、币种（均去重） (Auth)
 * @param {ChannelSelectReq} params
 * @url: /api/LottoBasicSelect/GetChannelSelectData
 */
export const getChannelSelectData = (params: ChannelSelectReq) => {
  return requestClient.post<ChannelSelectRsp>('/LottoBasicSelect/GetChannelSelectData', params);
}

/**
 * @description: 获取通道字典币种下拉数据（按通道类型区分，去重） (Auth)
 * @param {CurrencySelectReq} params
 * @url: /api/LottoBasicSelect/GetCurrencySelectData
 */
export const getCurrencySelectData = (params: CurrencySelectReq) => {
  return requestClient.post<StringListApiResponse>('/LottoBasicSelect/GetCurrencySelectData', params);
}

// ==================== UploadFile ====================

/**
 * @description: 上传文件到阿里云OSS文件服务器（支持一次上传多个文件） (Auth)
 * @param {UploadToOssFormDto} params
 * @url: /api/UploadFile/UploadToOss
 */
export const uploadToOss = (params: UploadToOssFormDto) => {
  return requestClient.post<ObjectListApiResponse>('/UploadFile/UploadToOss', params);
}

/**
 * @description: 获取某个桶里的所有数据 (Auth)
 * @param {BucketFilesReq} params
 * @url: /api/UploadFile/GetBucketFiles
 */
export const getBucketFiles = (params: BucketFilesReq) => {
  return requestClient.post<BucketFilesRsp>('/UploadFile/GetBucketFiles', params);
}
