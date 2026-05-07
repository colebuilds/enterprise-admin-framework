import { requestClient } from '#/api/request';
import {
  CodeNameRspListApiResponse,
  CountryListReq,
  CountryModelRspListPageBaseResponse,
  AddCountryReq,
  UpdateCountryReq,
  CountryGetReq,
  CountryModelRsp,
  CurrencyListReq,
  CurrencyModelRspListPageBaseResponse,
  AddCurrencyReq,
  UpdateCurrencyReq,
  CurrencyGetReq,
  CurrencyModelRsp,
  LanguageListReq,
  LanguageModelRspListPageBaseResponse,
  AddLanguageReq,
  UpdateLanguageReq,
  LanguageGetReq,
  LanguageModelRsp,
  GetOrganizationReq,
  OrganizationDetailRsp,
  OrganizationPageListReq,
  OrganizationPageListRspListPageBaseResponse,
  AddOrganizationReq,
  UpdateOrganizationReq,
  UpdateOrganizationStateReq,
  DeleteOrganizationReq,
  OrganizationSelectRspListApiResponse,
  MasterApiRequest,
  BooleanApiResponse,
  TenantV3ModeReq,
  AddTenantReq,
  AddTenantRsp,
  TenantSelectReq,
  IdNameRspListApiResponse,
  TenantByFiatCurrencyReq,
  FiatCurrencyTenantRsp,
  TenantSearchReq,
  TenantRspListPageBaseResponse,
  TenantReq,
  TenantUpdateStateReq,
  TenantUpdateRemarkReq,
  TenantChildReq,
  OwnerTenantInfoListApiResponse
} from './types';

// 导出类型
export * from './types';

// ==================== Country ====================

/**
 * @description: 获取可新增的国家列表 (Auth)
 * @url: /api/Country/GetAvailableCountryList
 */
export const getAvailableCountryList = () => {
  return requestClient.post<CodeNameRspListApiResponse>('/Country/GetAvailableCountryList');
}

/**
 * @description: 获取可新增的时区列表 (Auth)
 * @url: /api/Country/GetAvailableTimeZoneList
 */
export const getAvailableTimeZoneList = () => {
  return requestClient.post<CodeNameRspListApiResponse>('/Country/GetAvailableTimeZoneList');
}

/**
 * @description: 查询国家列表 (Auth)
 * @param {CountryListReq} params
 * @url: /api/Country/GetPageList
 */
export const countryGetPageList = (params: CountryListReq) => {
  return requestClient.post<CountryModelRspListPageBaseResponse>('/Country/GetPageList', params);
}
/**
 * @description: 查询国家列表 (Auth)（导出，返回原生 blob 响应）
 * @param {CountryListReq} params
 * @url: /api/Country/GetPageList
 */
export const countryGetPageListExport = (params: CountryListReq) => {
  return requestClient.post<Blob>('/Country/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 新增 (Auth)
 * @param {AddCountryReq} params
 * @url: /api/Country/Add
 */
export const countryAdd = (params: AddCountryReq) => {
  return requestClient.post<any>('/Country/Add', params);
}

/**
 * @description: 编辑 (Auth)
 * @param {UpdateCountryReq} params
 * @url: /api/Country/Update
 */
export const countryUpdate = (params: UpdateCountryReq) => {
  return requestClient.post<any>('/Country/Update', params);
}

/**
 * @description: 按CountryCode查询 (Auth)
 * @param {CountryGetReq} params
 * @url: /api/Country/Get
 */
export const countryGet = (params: CountryGetReq) => {
  return requestClient.post<CountryModelRsp>('/Country/Get', params);
}

// ==================== Currency ====================

/**
 * @description: 获取可新增的币种列表 (Auth)
 * @url: /api/Currency/GetAvailableCurrencyList
 */
export const getAvailableCurrencyList = () => {
  return requestClient.post<CodeNameRspListApiResponse>('/Currency/GetAvailableCurrencyList');
}

/**
 * @description: 查询币种列表 (Auth)
 * @param {CurrencyListReq} params
 * @url: /api/Currency/GetPageList
 */
export const currencyGetPageList = (params: CurrencyListReq) => {
  return requestClient.post<CurrencyModelRspListPageBaseResponse>('/Currency/GetPageList', params);
}
/**
 * @description: 查询币种列表 (Auth)（导出，返回原生 blob 响应）
 * @param {CurrencyListReq} params
 * @url: /api/Currency/GetPageList
 */
export const currencyGetPageListExport = (params: CurrencyListReq) => {
  return requestClient.post<Blob>('/Currency/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 新增 (Auth)
 * @param {AddCurrencyReq} params
 * @url: /api/Currency/Add
 */
export const currencyAdd = (params: AddCurrencyReq) => {
  return requestClient.post<any>('/Currency/Add', params);
}

/**
 * @description: 编辑 (Auth)
 * @param {UpdateCurrencyReq} params
 * @url: /api/Currency/Update
 */
export const currencyUpdate = (params: UpdateCurrencyReq) => {
  return requestClient.post<any>('/Currency/Update', params);
}

/**
 * @description: 按CurrencyCode查询 (Auth)
 * @param {CurrencyGetReq} params
 * @url: /api/Currency/Get
 */
export const currencyGet = (params: CurrencyGetReq) => {
  return requestClient.post<CurrencyModelRsp>('/Currency/Get', params);
}

// ==================== Language ====================

/**
 * @description: 获取可新增的语种列表 (Auth)
 * @url: /api/Language/GetAvailableLanguageList
 */
export const getAvailableLanguageList = () => {
  return requestClient.post<CodeNameRspListApiResponse>('/Language/GetAvailableLanguageList');
}

/**
 * @description: 查询语言列表 (Auth)
 * @param {LanguageListReq} params
 * @url: /api/Language/GetPageList
 */
export const languageGetPageList = (params: LanguageListReq) => {
  return requestClient.post<LanguageModelRspListPageBaseResponse>('/Language/GetPageList', params);
}
/**
 * @description: 查询语言列表 (Auth)（导出，返回原生 blob 响应）
 * @param {LanguageListReq} params
 * @url: /api/Language/GetPageList
 */
export const languageGetPageListExport = (params: LanguageListReq) => {
  return requestClient.post<Blob>('/Language/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 新增 (Auth)
 * @param {AddLanguageReq} params
 * @url: /api/Language/Add
 */
export const languageAdd = (params: AddLanguageReq) => {
  return requestClient.post<any>('/Language/Add', params);
}

/**
 * @description: 编辑 (Auth)
 * @param {UpdateLanguageReq} params
 * @url: /api/Language/Update
 */
export const languageUpdate = (params: UpdateLanguageReq) => {
  return requestClient.post<any>('/Language/Update', params);
}

/**
 * @description: 按LanguageCode查询 (Auth)
 * @param {LanguageGetReq} params
 * @url: /api/Language/Get
 */
export const languageGet = (params: LanguageGetReq) => {
  return requestClient.post<LanguageModelRsp>('/Language/Get', params);
}

// ==================== Organization ====================

/**
 * @description: 获取集团详情 (Auth)
 * @param {GetOrganizationReq} params
 * @url: /api/Organization/Get
 */
export const organizationGet = (params: GetOrganizationReq) => {
  return requestClient.post<OrganizationDetailRsp>('/Organization/Get', params);
}

/**
 * @description: 分页获取集团列表 (Auth)
 * @param {OrganizationPageListReq} params
 * @url: /api/Organization/GetPageList
 */
export const organizationGetPageList = (params: OrganizationPageListReq) => {
  return requestClient.post<OrganizationPageListRspListPageBaseResponse>('/Organization/GetPageList', params);
}
/**
 * @description: 分页获取集团列表 (Auth)（导出，返回原生 blob 响应）
 * @param {OrganizationPageListReq} params
 * @url: /api/Organization/GetPageList
 */
export const organizationGetPageListExport = (params: OrganizationPageListReq) => {
  return requestClient.post<Blob>('/Organization/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 新增集团 (Auth)
 * @param {AddOrganizationReq} params
 * @url: /api/Organization/Add
 */
export const organizationAdd = (params: AddOrganizationReq) => {
  return requestClient.post<any>('/Organization/Add', params);
}

/**
 * @description: 编辑集团 (Auth)
 * @param {UpdateOrganizationReq} params
 * @url: /api/Organization/Update
 */
export const organizationUpdate = (params: UpdateOrganizationReq) => {
  return requestClient.post<any>('/Organization/Update', params);
}

/**
 * @description: 更新集团状态（启用/禁用，禁用时强制退出集团所有后台账号） (Auth)
 * @param {UpdateOrganizationStateReq} params
 * @url: /api/Organization/UpdateState
 */
export const updateState = (params: UpdateOrganizationStateReq) => {
  return requestClient.post<any>('/Organization/UpdateState', params);
}

/**
 * @description: 删除集团 (Auth)
 * @param {DeleteOrganizationReq} params
 * @url: /api/Organization/Delete
 */
export const organizationDelete = (params: DeleteOrganizationReq) => {
  return requestClient.post<any>('/Organization/Delete', params);
}

/**
 * @description: 获取集团下拉列表（新增商户时使用） (Auth)
 * @url: /api/Organization/GetSelectList
 */
export const organizationGetSelectList = () => {
  return requestClient.post<OrganizationSelectRspListApiResponse>('/Organization/GetSelectList');
}

// ==================== Tenant ====================

/**
 * @description: 获取商户V3模式状态 (Auth)
 * @param {MasterApiRequest} params
 * @url: /api/Tenant/GetV3Mode
 */
export const getV3Mode = (params: MasterApiRequest) => {
  return requestClient.post<BooleanApiResponse>('/Tenant/GetV3Mode', params);
}

/**
 * @description: 设置商户V3模式开关 (Auth)
 * @param {TenantV3ModeReq} params
 * @url: /api/Tenant/SetV3Mode
 */
export const setV3Mode = (params: TenantV3ModeReq) => {
  return requestClient.post<any>('/Tenant/SetV3Mode', params);
}

/**
 * @description: 新增商户 (Auth)
 * @param {AddTenantReq} params
 * @url: /api/Tenant/Add
 */
export const tenantAdd = (params: AddTenantReq) => {
  return requestClient.post<AddTenantRsp>('/Tenant/Add', params);
}

/**
 * @description: 商户下拉列表 (Auth)
 * @param {TenantSelectReq} params
 * @url: /api/Tenant/GetSelectList
 */
export const tenantGetSelectList = (params: TenantSelectReq) => {
  return requestClient.post<IdNameRspListApiResponse>('/Tenant/GetSelectList', params);
}

/**
 * @description: 获取币种及商户列表 (Auth)
 * @param {TenantByFiatCurrencyReq} params
 * @url: /api/Tenant/GetFiatCurrencyList
 */
export const getFiatCurrencyList = (params: TenantByFiatCurrencyReq) => {
  return requestClient.post<FiatCurrencyTenantRsp>('/Tenant/GetFiatCurrencyList', params);
}

/**
 * @description: 获取商户信息列表（带分页） (Auth)
 * @param {TenantSearchReq} params
 * @url: /api/Tenant/GetPageList
 */
export const tenantGetPageList = (params: TenantSearchReq) => {
  return requestClient.post<TenantRspListPageBaseResponse>('/Tenant/GetPageList', params);
}
/**
 * @description: 获取商户信息列表（带分页） (Auth)（导出，返回原生 blob 响应）
 * @param {TenantSearchReq} params
 * @url: /api/Tenant/GetPageList
 */
export const tenantGetPageListExport = (params: TenantSearchReq) => {
  return requestClient.post<Blob>('/Tenant/GetPageList', params, { responseType: 'blob' });
}

/**
 * @description: 更新商户信息 (Auth)
 * @param {TenantReq} params
 * @url: /api/Tenant/Update
 */
export const tenantUpdate = (params: TenantReq) => {
  return requestClient.post<any>('/Tenant/Update', params);
}

/**
 * @description: 修改商户状态（关站时强制退出所有相关后台账号） (Auth)
 * @param {TenantUpdateStateReq} params
 * @url: /api/Tenant/SwitchTenantState
 */
export const switchTenantState = (params: TenantUpdateStateReq) => {
  return requestClient.post<any>('/Tenant/SwitchTenantState', params);
}

/**
 * @description: 修改商户备注 (Auth)
 * @param {TenantUpdateRemarkReq} params
 * @url: /api/Tenant/UpdateTenantRemark
 */
export const updateTenantRemark = (params: TenantUpdateRemarkReq) => {
  return requestClient.post<any>('/Tenant/UpdateTenantRemark', params);
}

/**
 * @description: 获取所属租户信息 (Auth)
 * @param {TenantChildReq} params
 * @url: /api/Tenant/GetOwnerTenantList
 */
export const getOwnerTenantList = (params: TenantChildReq) => {
  return requestClient.post<OwnerTenantInfoListApiResponse>('/Tenant/GetOwnerTenantList', params);
}
