import type {
  AddDictionaryReq,
  AddOrDeleteRoleAuthorizeReq,
  AddRoleReq,
  AddSysUsersReq,
  BatchAddSysUsersReq,
  BatchAddSysUsersRsp,
  BatchDeleteSysUsersReq,
  BatchUpdateSysUserCurrentProcessingOrderLimitReq,
  BatchUpdateSysUserWithdrawAuditAmountRangeReq,
  BatchUpdateTenantSysUserPermissionReq,
  CodeNameRspListApiResponse,
  IpsModelAddReq,
  IpsModelIpReq,
  IpsModelPageListReq,
  IpsModelRspListPageBaseResponse,
  IpsModelUpdateRemarkReq,
  IpsModelUpdateStateReq,
  MenuDeleteReq,
  MenuGetReq,
  MenuModelReq,
  MenuModelRsp,
  MenuModelStateReq,
  MenuTreeBaseRspIEnumerableApiResponse,
  MenuTreeByRoleIdReq,
  MenuTreeGetReq,
  OrganizationIdReq,
  OrgMenuTreeGetReq,
  RoleDeleteReq,
  RoleDeletListReq,
  RoleInfoRspListApiResponse,
  RoleListReq,
  RolePageReq,
  RolePageRspListPageBaseResponse,
  SysDictionaryCodeList,
  SysDictionaryCodeListRspListApiResponse,
  SysDictionaryGetReq,
  SysDictionaryListReq,
  SysDictionaryListRspListApiResponse,
  SysDictionaryModelRsp,
  SysDictionaryModelRspListPageBaseResponse,
  SysDictionaryTypeListReq,
  SysGropDictionaryRsp,
  SysLogPageListItemRspListPageBaseResponse,
  SysLogPageListReq,
  SysUserNotifyCountRsp,
  SysUserNotifyDetailRsp,
  SysUserNotifyGetReq,
  SysUserNotifyMarkReadReq,
  SysUserNotifyScrollListReq,
  SysUserNotifyScrollListRsp,
  SysUserPageListReq,
  SysUsersAdminUpdateReq,
  SysUsersApprovalAuthorizeEnumReq,
  SysUsersApprovalAuthorizeEnumRsp,
  SysUsersDeleteReq,
  SysUsersDetailRsp,
  SysUsersGoogleAccountReq,
  SysUsersInfoReq,
  SysUsersPageListRspListPageBaseResponse,
  SysUsersResetPasswordReq,
  SysUsersRevisePasswordReq,
  SysUsersSuperiorReq,
  SysUsersSuperiorRspListApiResponse,
  SysUsersUpdateIsOpenGoogleReq,
  SysUsersUpdateReq,
  SysUsersUpdateStateReq,
  TenantAdminRevisePasswordRsp,
  TenantSysUserSelectReq,
  TenantSysUserSelectRspListApiResponse,
  TenantSysUserWithdrawConfigSelectRsp,
  UpdateDictionaryReq,
  UpdateOrgAuthorizeReq,
  UpdateRoleReq,
  UpdateSuperAuthUserReq,
  UpdateSysUserStateReq,
  UpdateTenantAdminResetPwdReq,
} from './types';

import { requestClient } from '#/api/request';

// 导出类型
export * from './types';

// ==================== IpWhitelist ====================

/**
 * @description: IP白名单分页查询 (Auth)
 * @param {IpsModelPageListReq} params
 * @url: /api/IpWhitelist/GetPageList
 */
export const ipWhitelistGetPageList = (params: IpsModelPageListReq) => {
  return requestClient.post<IpsModelRspListPageBaseResponse>(
    '/IpWhitelist/GetPageList',
    params,
  );
};
/**
 * @description: IP白名单分页查询 (Auth)（导出，返回原生 blob 响应）
 * @param {IpsModelPageListReq} params
 * @url: /api/IpWhitelist/GetPageList
 */
export const ipWhitelistGetPageListExport = (params: IpsModelPageListReq) => {
  return requestClient.post<Blob>('/IpWhitelist/GetPageList', params, {
    responseType: 'blob',
  });
};

/**
 * @description: 添加IP白名单 (Auth)
 * @param {IpsModelAddReq} params
 * @url: /api/IpWhitelist/Add
 */
export const ipWhitelistAdd = (params: IpsModelAddReq) => {
  return requestClient.post<any>('/IpWhitelist/Add', params);
};

/**
 * @description: 删除IP白名单 (Auth)
 * @param {IpsModelIpReq} params
 * @url: /api/IpWhitelist/Delete
 */
export const ipWhitelistDelete = (params: IpsModelIpReq) => {
  return requestClient.post<any>('/IpWhitelist/Delete', params);
};

/**
 * @description: 修改IP白名单备注 (Auth)
 * @param {IpsModelUpdateRemarkReq} params
 * @url: /api/IpWhitelist/UpdateRemark
 */
export const updateRemark = (params: IpsModelUpdateRemarkReq) => {
  return requestClient.post<any>('/IpWhitelist/UpdateRemark', params);
};

/**
 * @description: 修改IP白名单状态 (Auth)
 * @param {IpsModelUpdateStateReq} params
 * @url: /api/IpWhitelist/UpdateState
 */
export const ipWhitelistUpdateState = (params: IpsModelUpdateStateReq) => {
  return requestClient.post<any>('/IpWhitelist/UpdateState', params);
};

// ==================== Menu ====================

/**
 * @description: 新增或修改 -- 支持最多12层级 (Auth)
 * @param {MenuModelReq} params
 * @url: /api/Menu/Submit
 */
export const submit = (params: MenuModelReq) => {
  return requestClient.post<any>('/Menu/Submit', params);
};

/**
 * @description: 查询单个 (Auth)
 * @param {MenuGetReq} params
 * @url: /api/Menu/Get
 */
export const menuGet = (params: MenuGetReq) => {
  return requestClient.post<MenuModelRsp>('/Menu/Get', params);
};

/**
 * @description: 删除 (Auth)
 * @param {MenuDeleteReq} params
 * @url: /api/Menu/Delete
 */
export const menuDelete = (params: MenuDeleteReq) => {
  return requestClient.post<any>('/Menu/Delete', params);
};

/**
 * @description: 修改菜单状态 (Auth)
 * @param {MenuModelStateReq} params
 * @url: /api/Menu/UpdateState
 */
export const menuUpdateState = (params: MenuModelStateReq) => {
  return requestClient.post<any>('/Menu/UpdateState', params);
};

/**
 * @description: 获取当前用户的菜单树 (Auth)
 * @url: /api/Menu/GetMenuTreeByCurrentSysUser
 */
export const getMenuTreeByCurrentSysUser = () => {
  return requestClient.post<MenuTreeBaseRspIEnumerableApiResponse>(
    '/Menu/GetMenuTreeByCurrentSysUser',
  );
};

/**
 * @description: 获取菜单树 (Auth)
 * @param {MenuTreeGetReq} params
 * @url: /api/Menu/GetMenuTree
 */
export const getMenuTree = (params: MenuTreeGetReq) => {
  return requestClient.post<MenuTreeBaseRspIEnumerableApiResponse>(
    '/Menu/GetMenuTree',
    params,
  );
};

/**
 * @description: 按 RoleId 获取菜单、按钮树 (Auth)
 * @param {MenuTreeByRoleIdReq} params
 * @url: /api/Menu/GetMenuTreeByRoleId
 */
export const getMenuTreeByRoleId = (params: MenuTreeByRoleIdReq) => {
  return requestClient.post<MenuTreeBaseRspIEnumerableApiResponse>(
    '/Menu/GetMenuTreeByRoleId',
    params,
  );
};

/**
 * @description: 总控给角色分配权限时可以选择的菜单树 (Auth)
 * @param {MenuTreeGetReq} params
 * @url: /api/Menu/GetAdminMenuTree
 */
export const getAdminMenuTree = (params: MenuTreeGetReq) => {
  return requestClient.post<MenuTreeBaseRspIEnumerableApiResponse>(
    '/Menu/GetAdminMenuTree',
    params,
  );
};

/**
 * @description: 集团菜单树 (Auth)
 * @param {MenuTreeGetReq} params
 * @url: /api/Menu/GetOrgMenuTree
 */
export const getOrgMenuTree = (params: MenuTreeGetReq) => {
  return requestClient.post<MenuTreeBaseRspIEnumerableApiResponse>(
    '/Menu/GetOrgMenuTree',
    params,
  );
};

/**
 * @description: 按集团Id 获取菜单、按钮树 (Auth)
 * @param {OrgMenuTreeGetReq} params
 * @url: /api/Menu/GetMenuTreeByOrgId
 */
export const getMenuTreeByOrgId = (params: OrgMenuTreeGetReq) => {
  return requestClient.post<MenuTreeBaseRspIEnumerableApiResponse>(
    '/Menu/GetMenuTreeByOrgId',
    params,
  );
};

// ==================== Role ====================

/**
 * @description: 获取角色列表（带分页） (Auth)
 * @param {RolePageReq} params
 * @url: /api/Role/GetPageList
 */
export const roleGetPageList = (params: RolePageReq) => {
  return requestClient.post<RolePageRspListPageBaseResponse>(
    '/Role/GetPageList',
    params,
  );
};
/**
 * @description: 获取角色列表（带分页） (Auth)（导出，返回原生 blob 响应）
 * @param {RolePageReq} params
 * @url: /api/Role/GetPageList
 */
export const roleGetPageListExport = (params: RolePageReq) => {
  return requestClient.post<Blob>('/Role/GetPageList', params, {
    responseType: 'blob',
  });
};

/**
 * @description: 新增 (Auth)
 * @param {AddRoleReq} params
 * @url: /api/Role/Add
 */
export const roleAdd = (params: AddRoleReq) => {
  return requestClient.post<any>('/Role/Add', params);
};

/**
 * @description: 编辑 (Auth)
 * @param {UpdateRoleReq} params
 * @url: /api/Role/Update
 */
export const roleUpdate = (params: UpdateRoleReq) => {
  return requestClient.post<any>('/Role/Update', params);
};

/**
 * @description: 删除角色 (Auth)
 * @param {RoleDeleteReq} params
 * @url: /api/Role/DeleteMark
 */
export const deleteMark = (params: RoleDeleteReq) => {
  return requestClient.post<any>('/Role/DeleteMark', params);
};

/**
 * @description: 批量删除角色 (Auth)
 * @param {RoleDeletListReq} params
 * @url: /api/Role/DeleteMarkList
 */
export const deleteMarkList = (params: RoleDeletListReq) => {
  return requestClient.post<any>('/Role/DeleteMarkList', params);
};

/**
 * @description: 获取角色下拉框数据 (Auth)
 * @param {RoleListReq} params
 * @url: /api/Role/GetSelectList
 */
export const getSelectList = (params: RoleListReq) => {
  return requestClient.post<RoleInfoRspListApiResponse>(
    '/Role/GetSelectList',
    params,
  );
};

// ==================== RoleAuthorize ====================

/**
 * @description: 编辑角色权限信息 (Auth)
 * @param {AddOrDeleteRoleAuthorizeReq} params
 * @url: /api/RoleAuthorize/UpdateList
 */
export const updateList = (params: AddOrDeleteRoleAuthorizeReq) => {
  return requestClient.post<any>('/RoleAuthorize/UpdateList', params);
};

/**
 * @description: 编辑集团权限信息(集团管理员) (Auth)
 * @param {UpdateOrgAuthorizeReq} params
 * @url: /api/RoleAuthorize/UpdateOrgList
 */
export const updateOrgList = (params: UpdateOrgAuthorizeReq) => {
  return requestClient.post<any>('/RoleAuthorize/UpdateOrgList', params);
};

// ==================== SysDictionary ====================

/**
 * @description: 分页查询 (Auth)
 * @param {SysDictionaryListReq} params
 * @url: /api/SysDictionary/GetPageList
 */
export const sysDictionaryGetPageList = (params: SysDictionaryListReq) => {
  return requestClient.post<SysDictionaryModelRspListPageBaseResponse>(
    '/SysDictionary/GetPageList',
    params,
  );
};
/**
 * @description: 分页查询 (Auth)（导出，返回原生 blob 响应）
 * @param {SysDictionaryListReq} params
 * @url: /api/SysDictionary/GetPageList
 */
export const sysDictionaryGetPageListExport = (
  params: SysDictionaryListReq,
) => {
  return requestClient.post<Blob>('/SysDictionary/GetPageList', params, {
    responseType: 'blob',
  });
};

/**
 * @description: 获取指定类型的字典列表(字典类型(币种：1,时区：2,语言：3,国家：4)) (Auth)
 * @param {SysDictionaryTypeListReq} params
 * @url: /api/SysDictionary/GetCategoryList
 */
export const getCategoryList = (params: SysDictionaryTypeListReq) => {
  return requestClient.post<SysDictionaryListRspListApiResponse>(
    '/SysDictionary/GetCategoryList',
    params,
  );
};

/**
 * @description: 获取指定类型的字典列表(判断code是否选中) (Auth)
 * @param {SysDictionaryCodeList} params
 * @url: /api/SysDictionary/GetCategoryCodeList
 */
export const getCategoryCodeList = (params: SysDictionaryCodeList) => {
  return requestClient.post<SysDictionaryCodeListRspListApiResponse>(
    '/SysDictionary/GetCategoryCodeList',
    params,
  );
};

/**
 * @description: 获取全量字典信息(国家、币种、语言、时区) (Auth)
 * @url: /api/SysDictionary/GetGroupData
 */
export const getGroupData = () => {
  return requestClient.post<SysGropDictionaryRsp>(
    '/SysDictionary/GetGroupData',
  );
};

/**
 * @description: 新增 (Auth)
 * @param {AddDictionaryReq} params
 * @url: /api/SysDictionary/Add
 */
export const sysDictionaryAdd = (params: AddDictionaryReq) => {
  return requestClient.post<any>('/SysDictionary/Add', params);
};

/**
 * @description: 编辑 (Auth)
 * @param {UpdateDictionaryReq} params
 * @url: /api/SysDictionary/Update
 */
export const sysDictionaryUpdate = (params: UpdateDictionaryReq) => {
  return requestClient.post<any>('/SysDictionary/Update', params);
};

/**
 * @description: 查询单个 (Auth)
 * @param {SysDictionaryGetReq} params
 * @url: /api/SysDictionary/Get
 */
export const sysDictionaryGet = (params: SysDictionaryGetReq) => {
  return requestClient.post<SysDictionaryModelRsp>(
    '/SysDictionary/Get',
    params,
  );
};

/**
 * @description: 删除 (Auth)
 * @param {SysDictionaryGetReq} params
 * @url: /api/SysDictionary/Delete
 */
export const sysDictionaryDelete = (params: SysDictionaryGetReq) => {
  return requestClient.post<any>('/SysDictionary/Delete', params);
};

// ==================== SysLog ====================

/**
 * @description: 分页查询-系统日志 (Auth)
 * @param {SysLogPageListReq} params
 * @url: /api/SysLog/GetPageList
 */
export const sysLogGetPageList = (params: SysLogPageListReq) => {
  return requestClient.post<SysLogPageListItemRspListPageBaseResponse>(
    '/SysLog/GetPageList',
    params,
  );
};
/**
 * @description: 分页查询-系统日志 (Auth)（导出，返回原生 blob 响应）
 * @param {SysLogPageListReq} params
 * @url: /api/SysLog/GetPageList
 */
export const sysLogGetPageListExport = (params: SysLogPageListReq) => {
  return requestClient.post<Blob>('/SysLog/GetPageList', params, {
    responseType: 'blob',
  });
};

// ==================== SysUserNotify ====================

/**
 * @description: 查询未读数量 (Auth)
 * @url: /api/SysUserNotify/GetUnreadCount
 */
export const getUnreadCount = () => {
  return requestClient.post<SysUserNotifyCountRsp>(
    '/SysUserNotify/GetUnreadCount',
  );
};

/**
 * @description: 查询已读数量 (Auth)
 * @url: /api/SysUserNotify/GetReadCount
 */
export const getReadCount = () => {
  return requestClient.post<SysUserNotifyCountRsp>(
    '/SysUserNotify/GetReadCount',
  );
};

/**
 * @description: 滚动查询 (Auth)
 * @param {SysUserNotifyScrollListReq} params
 * @url: /api/SysUserNotify/GetScrollList
 */
export const getScrollList = (params: SysUserNotifyScrollListReq) => {
  return requestClient.post<SysUserNotifyScrollListRsp>(
    '/SysUserNotify/GetScrollList',
    params,
  );
};

/**
 * @description: 查询详情 (Auth)
 * @param {SysUserNotifyGetReq} params
 * @url: /api/SysUserNotify/Get
 */
export const sysUserNotifyGet = (params: SysUserNotifyGetReq) => {
  return requestClient.post<SysUserNotifyDetailRsp>(
    '/SysUserNotify/Get',
    params,
  );
};

/**
 * @description: 标记已读 (Auth)
 * @param {SysUserNotifyMarkReadReq} params
 * @url: /api/SysUserNotify/MarkRead
 */
export const markRead = (params: SysUserNotifyMarkReadReq) => {
  return requestClient.post<any>('/SysUserNotify/MarkRead', params);
};

// ==================== SysUsers ====================

/**
 * @description: 修改当前登录用户的偏好语言（用 ApiRequest.Language 字段作为新语言） (Auth)
 * @url: /api/SysUsers/ChangeLanguage
 */
export const changeLanguage = () => {
  return requestClient.post<any>('/SysUsers/ChangeLanguage');
};

/**
 * @description: 获取出款职位枚举列表 (Auth)
 * @url: /api/SysUsers/GetWithdrawUserRankEnumList
 */
export const getWithdrawUserRankEnumList = () => {
  return requestClient.post<CodeNameRspListApiResponse>(
    '/SysUsers/GetWithdrawUserRankEnumList',
  );
};

/**
 * @description: 获取审批操作权限枚举列表 (Auth)
 * @param {SysUsersApprovalAuthorizeEnumReq} params
 * @url: /api/SysUsers/GetApprovalAuthorizeEnumList
 */
export const getApprovalAuthorizeEnumList = (
  params: SysUsersApprovalAuthorizeEnumReq,
) => {
  return requestClient.post<SysUsersApprovalAuthorizeEnumRsp>(
    '/SysUsers/GetApprovalAuthorizeEnumList',
    params,
  );
};

/**
 * @description: 获取上级信息列表 (Auth)
 * @param {SysUsersSuperiorReq} params
 * @url: /api/SysUsers/GetSuperiorList
 */
export const getSuperiorList = (params: SysUsersSuperiorReq) => {
  return requestClient.post<SysUsersSuperiorRspListApiResponse>(
    '/SysUsers/GetSuperiorList',
    params,
  );
};

/**
 * @description: 获取超级权限用户 (Auth)
 * @param {OrganizationIdReq} params
 * @url: /api/SysUsers/GetSuperAuthUser
 */
export const getSuperAuthUser = (params: OrganizationIdReq) => {
  return requestClient.post<any>('/SysUsers/GetSuperAuthUser', params);
};

/**
 * @description: 分页获取集团系统管理员列表 (Auth)
 * @param {SysUserPageListReq} params
 * @url: /api/SysUsers/GetAdminPageList
 */
export const getAdminPageList = (params: SysUserPageListReq) => {
  return requestClient.post<SysUsersPageListRspListPageBaseResponse>(
    '/SysUsers/GetAdminPageList',
    params,
  );
};
/**
 * @description: 分页获取集团系统管理员列表 (Auth)（导出，返回原生 blob 响应）
 * @param {SysUserPageListReq} params
 * @url: /api/SysUsers/GetAdminPageList
 */
export const getAdminPageListExport = (params: SysUserPageListReq) => {
  return requestClient.post<Blob>('/SysUsers/GetAdminPageList', params, {
    responseType: 'blob',
  });
};

/**
 * @description: 分页查询-系统用户--总控使用 (Auth)
 * @param {SysUserPageListReq} params
 * @url: /api/SysUsers/GetPageList
 */
export const sysUsersGetPageList = (params: SysUserPageListReq) => {
  return requestClient.post<SysUsersPageListRspListPageBaseResponse>(
    '/SysUsers/GetPageList',
    params,
  );
};
/**
 * @description: 分页查询-系统用户--总控使用 (Auth)（导出，返回原生 blob 响应）
 * @param {SysUserPageListReq} params
 * @url: /api/SysUsers/GetPageList
 */
export const sysUsersGetPageListExport = (params: SysUserPageListReq) => {
  return requestClient.post<Blob>('/SysUsers/GetPageList', params, {
    responseType: 'blob',
  });
};

/**
 * @description: 分页查询-系统用户--商户使用 (Auth)
 * @param {SysUserPageListReq} params
 * @url: /api/SysUsers/GetTenantPageList
 */
export const getTenantPageList = (params: SysUserPageListReq) => {
  return requestClient.post<SysUsersPageListRspListPageBaseResponse>(
    '/SysUsers/GetTenantPageList',
    params,
  );
};
/**
 * @description: 分页查询-系统用户--商户使用 (Auth)（导出，返回原生 blob 响应）
 * @param {SysUserPageListReq} params
 * @url: /api/SysUsers/GetTenantPageList
 */
export const getTenantPageListExport = (params: SysUserPageListReq) => {
  return requestClient.post<Blob>('/SysUsers/GetTenantPageList', params, {
    responseType: 'blob',
  });
};

/**
 * @description: 获取商户系统用户下拉列表 (Auth)
 * @param {TenantSysUserSelectReq} params
 * @url: /api/SysUsers/GetTenantUserSelectList
 */
export const getTenantUserSelectList = (params: TenantSysUserSelectReq) => {
  return requestClient.post<TenantSysUserSelectRspListApiResponse>(
    '/SysUsers/GetTenantUserSelectList',
    params,
  );
};

/**
 * @description: 获取商户系统用户出款配置下拉数据 (Auth)
 * @url: /api/SysUsers/GetTenantWithdrawConfigSelectData
 */
export const getTenantWithdrawConfigSelectData = () => {
  return requestClient.post<TenantSysUserWithdrawConfigSelectRsp>(
    '/SysUsers/GetTenantWithdrawConfigSelectData',
  );
};

/**
 * @description: 获取用户详情 --商户使用 (Auth)
 * @param {SysUsersInfoReq} params
 * @url: /api/SysUsers/GetTenantUserDetail
 */
export const getTenantUserDetail = (params: SysUsersInfoReq) => {
  return requestClient.post<SysUsersDetailRsp>(
    '/SysUsers/GetTenantUserDetail',
    params,
  );
};

/**
 * @description: 用户重置密码 (Auth)
 * @param {UpdateTenantAdminResetPwdReq} params
 * @url: /api/SysUsers/ReviseUserPassword
 */
export const reviseUserPassword = (params: UpdateTenantAdminResetPwdReq) => {
  return requestClient.post<TenantAdminRevisePasswordRsp>(
    '/SysUsers/ReviseUserPassword',
    params,
  );
};

/**
 * @description: 删除-系统用户 (Auth)
 * @param {SysUsersDeleteReq} params
 * @url: /api/SysUsers/Delete
 */
export const sysUsersDelete = (params: SysUsersDeleteReq) => {
  return requestClient.post<any>('/SysUsers/Delete', params);
};

/**
 * @description: 启用禁用-系统用户 (Auth)
 * @param {SysUsersUpdateStateReq} params
 * @url: /api/SysUsers/UpdateUsersState
 */
export const updateUsersState = (params: SysUsersUpdateStateReq) => {
  return requestClient.post<any>('/SysUsers/UpdateUsersState', params);
};

/**
 * @description: 设置超级权限用户 (Auth)
 * @param {UpdateSuperAuthUserReq} params
 * @url: /api/SysUsers/UpdateSuperAuthUser
 */
export const updateSuperAuthUser = (params: UpdateSuperAuthUserReq) => {
  return requestClient.post<any>('/SysUsers/UpdateSuperAuthUser', params);
};

/**
 * @description: 系统用户密码重置 (Auth)
 * @param {SysUsersRevisePasswordReq} params
 * @url: /api/SysUsers/RevisePassword
 */
export const revisePassword = (params: SysUsersRevisePasswordReq) => {
  return requestClient.post<any>('/SysUsers/RevisePassword', params);
};

/**
 * @description: 总控调用 - 重置集团管理员密码 (Auth)
 * @param {SysUsersRevisePasswordReq} params
 * @url: /api/SysUsers/ReviseOrgPassword
 */
export const reviseOrgPassword = (params: SysUsersRevisePasswordReq) => {
  return requestClient.post<any>('/SysUsers/ReviseOrgPassword', params);
};

/**
 * @description: 修改自己的密码 (Auth)
 * @param {SysUsersResetPasswordReq} params
 * @url: /api/SysUsers/ResetPassword
 */
export const resetPassword = (params: SysUsersResetPasswordReq) => {
  return requestClient.post<any>('/SysUsers/ResetPassword', params);
};

/**
 * @description: 谷歌验证码重置-系统用户 (Auth)
 * @param {SysUsersGoogleAccountReq} params
 * @url: /api/SysUsers/UpdateGoogleAccount
 */
export const updateGoogleAccount = (params: SysUsersGoogleAccountReq) => {
  return requestClient.post<any>('/SysUsers/UpdateGoogleAccount', params);
};

/**
 * @description: 谷歌验证码重置(商户管理员) (Auth)
 * @param {SysUsersGoogleAccountReq} params
 * @url: /api/SysUsers/UpdateAdminGoogleAccount
 */
export const updateAdminGoogleAccount = (params: SysUsersGoogleAccountReq) => {
  return requestClient.post<any>('/SysUsers/UpdateAdminGoogleAccount', params);
};

/**
 * @description: 修改系统用户谷歌验证开关(商户管理员) (Auth)
 * @param {SysUsersUpdateIsOpenGoogleReq} params
 * @url: /api/SysUsers/UpdateAdminIsOpenGoogle
 */
export const updateAdminIsOpenGoogle = (
  params: SysUsersUpdateIsOpenGoogleReq,
) => {
  return requestClient.post<any>('/SysUsers/UpdateAdminIsOpenGoogle', params);
};

/**
 * @description: 新增-系统用户 (Auth)
 * @param {AddSysUsersReq} params
 * @url: /api/SysUsers/Add
 */
export const sysUsersAdd = (params: AddSysUsersReq) => {
  return requestClient.post<any>('/SysUsers/Add', params);
};

/**
 * @description: 编辑-系统用户 --总控 (Auth)
 * @param {SysUsersAdminUpdateReq} params
 * @url: /api/SysUsers/Update
 */
export const sysUsersUpdate = (params: SysUsersAdminUpdateReq) => {
  return requestClient.post<any>('/SysUsers/Update', params);
};

/**
 * @description: 批量新增-系统用户--商户 (Auth)
 * @param {BatchAddSysUsersReq} params
 * @url: /api/SysUsers/BatchAdd
 */
export const batchAdd = (params: BatchAddSysUsersReq) => {
  return requestClient.post<BatchAddSysUsersRsp>('/SysUsers/BatchAdd', params);
};

/**
 * @description: 批量删除系统用户--商户使用 (Auth)
 * @param {BatchDeleteSysUsersReq} params
 * @url: /api/SysUsers/BatchDeleteSysUser
 */
export const batchDeleteSysUser = (params: BatchDeleteSysUsersReq) => {
  return requestClient.post<any>('/SysUsers/BatchDeleteSysUser', params);
};

/**
 * @description: 批量赋权系统用户 (Auth)
 * @param {BatchUpdateTenantSysUserPermissionReq} params
 * @url: /api/SysUsers/BatchUpdateTenantSysUserPermission
 */
export const batchUpdateTenantSysUserPermission = (
  params: BatchUpdateTenantSysUserPermissionReq,
) => {
  return requestClient.post<any>(
    '/SysUsers/BatchUpdateTenantSysUserPermission',
    params,
  );
};

/**
 * @description: 编辑-系统用户--商户使用 (Auth)
 * @param {SysUsersUpdateReq} params
 * @url: /api/SysUsers/UpdateTenantSysUser
 */
export const updateTenantSysUser = (params: SysUsersUpdateReq) => {
  return requestClient.post<any>('/SysUsers/UpdateTenantSysUser', params);
};

/**
 * @description: 批量修改系统用户状态  --商户使用支持单个 (Auth)
 * @param {UpdateSysUserStateReq} params
 * @url: /api/SysUsers/UpdateTenantSysUserState
 */
export const updateTenantSysUserState = (params: UpdateSysUserStateReq) => {
  return requestClient.post<any>('/SysUsers/UpdateTenantSysUserState', params);
};

/**
 * @description: 批量调整系统用户出款审核金额区间 (Auth)
 * @param {BatchUpdateSysUserWithdrawAuditAmountRangeReq} params
 * @url: /api/SysUsers/BatchUpdateTenantSysUserWithdrawAuditAmountRange
 */
export const batchUpdateTenantSysUserWithdrawAuditAmountRange = (
  params: BatchUpdateSysUserWithdrawAuditAmountRangeReq,
) => {
  return requestClient.post<any>(
    '/SysUsers/BatchUpdateTenantSysUserWithdrawAuditAmountRange',
    params,
  );
};

/**
 * @description: 批量调整系统用户可同时处理订单上限 (Auth)
 * @param {BatchUpdateSysUserCurrentProcessingOrderLimitReq} params
 * @url: /api/SysUsers/BatchUpdateTenantSysUserCurrentProcessingOrderLimit
 */
export const batchUpdateTenantSysUserCurrentProcessingOrderLimit = (
  params: BatchUpdateSysUserCurrentProcessingOrderLimitReq,
) => {
  return requestClient.post<any>(
    '/SysUsers/BatchUpdateTenantSysUserCurrentProcessingOrderLimit',
    params,
  );
};
