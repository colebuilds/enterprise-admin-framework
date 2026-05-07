import { requestClient, uploadFile } from '#/api/request';
import {
  AssetQueryDto,
  AssetListResponse,
  IdDto,
  AssetResponse,
  UpdateAssetDto,
  BooleanResponseVO,
  UploadAssetDto,
  AssetResolveDto,
  AssetResolveResult,
  CreateDomainDto,
  DomainQueryDto,
  DomainListResponse,
  DomainResponse,
  DomainSeoDetailDto,
  SeoResponse,
  UpdateDomainDto,
  DomainSeoSaveDto,
  DomainOptionsDto,
  DomainOptionsResponseVO,
  DomainResolveDto,
  DomainResolveResponse,
  CreateLayoutDto,
  LayoutQueryDto,
  LayoutListResponse,
  LayoutResponse,
  UpdateLayoutDto,
  LayoutCopyDto,
  LayoutTabBarsResponseVO,
  CreateTabBarDto,
  TabBarQueryDto,
  TabBarListResponse,
  TabBarSelectQueryDto,
  TabBarSelectListResponseVO,
  TabBarResponse,
  UpdateTabBarDto,
  CreateThemeDto,
  ThemeQueryDto,
  ThemeListResponse,
  ThemeResponse,
  UpdateThemeDto,
  ThemeAssetsResponseVO,
  CreateAppRouteDto,
  AppRouteQueryDto,
  AppRouteListResponse,
  AppRouteResponse,
  UpdateAppRouteDto,
  AppRouteStateDto,
  AppRouteAvailableDto,
  AppRouteAvailableResponseVO,
  HealthCheckResultVO,
  ConfigOptionsDto,
  ConfigOptionsResponse,
  AgreementDetailDto,
  AgreementListResponseVO,
  SaveAgreementDto,
  RunnerRegisterDto,
  RunnerHeartbeatDto,
  RunnerQueryDto,
  RunnerListResponse,
  CreateJobDto,
  JobVO,
  JobQueryDto,
  JobListResponse,
  JobCancelResponseVO,
  JobStatsQueryDto,
  JobStatsVO,
  JobLogQueryDto,
  JobLogListResponse,
  CreateAppVersionDto,
  AppVersionVO,
  AppVersionQueryDto,
  AppVersionListDataVO,
  CheckUpdateDto,
  CheckUpdateVO,
  UpdateAppVersionDto,
  CreateAppPackageDto,
  AppPackageVO,
  AppPackageQueryDto,
  AppPackageListDataVO,
  UpdateAppPackageDto,
  AppPackageBuildDto,
  AppPackageJobsQueryDto,
  UploadImageDto,
  UploadResultVO,
  UploadFileFormDto,
  UploadFileResultVO,
  MerchantSiteListResponseVO,
  MerchantDetailDto,
  MerchantDetailResponse,
  MerchantTabBarDto,
  MerchantTabBarResponse,
  MerchantTabBarSaveDto,
  MerchantGameNavDetailDto,
  MerchantGameNavDetailResponse,
  MerchantGameNavSaveDto,
  MerchantGameNavPublishDto,
  MerchantSaveDto,
  WebConfigDto,
  WebConfigResponse,
  WebGameDto,
  WebGameResponse
} from './types';

// 导出类型
export * from './types';

// ==================== Asset - 统一资源管理 ====================

/**
 * @description: 资源列表
 * @param {AssetQueryDto} params
 * @url: /api/hub/assets/list
 */
export const assetsList = (params: AssetQueryDto) => {
  return requestClient.post<AssetListResponse>('/hub/assets/list', params);
}

/**
 * @description: 资源详情
 * @param {IdDto} params
 * @url: /api/hub/assets/detail
 */
export const assetsDetail = (params: IdDto) => {
  return requestClient.post<AssetResponse>('/hub/assets/detail', params);
}

/**
 * @description: 更新资源
 * @param {UpdateAssetDto} params
 * @url: /api/hub/assets/update
 */
export const assetsUpdate = (params: UpdateAssetDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/assets/update', params);
}

/**
 * @description: 删除资源
 * @param {IdDto} params
 * @url: /api/hub/assets/delete
 */
export const assetsDelete = (params: IdDto) => {
  return requestClient.post<AssetResponse>('/hub/assets/delete', params);
}

/**
 * @description: 创建资源（幂等）
 * @param {UploadAssetDto} params
 * @url: /api/hub/assets/create
 */
export const assetsCreate = (params: UploadAssetDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/assets/create', params);
}

/**
 * @description: 解析资源
 * @param {AssetResolveDto} params
 * @url: /api/hub/assets/resolve
 */
export const assetsResolve = (params: AssetResolveDto) => {
  return requestClient.post<AssetResolveResult>('/hub/assets/resolve', params);
}

// ==================== Domains - 域名管理 ====================

/**
 * @description: 创建域名
 * @param {CreateDomainDto} params
 * @url: /api/hub/domains/create
 */
export const domainsCreate = (params: CreateDomainDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/domains/create', params);
}

/**
 * @description: 域名列表
 * @param {DomainQueryDto} params
 * @url: /api/hub/domains/list
 */
export const domainsList = (params: DomainQueryDto) => {
  return requestClient.post<DomainListResponse>('/hub/domains/list', params);
}

/**
 * @description: 域名详情
 * @param {IdDto} params
 * @url: /api/hub/domains/detail
 */
export const domainsDetail = (params: IdDto) => {
  return requestClient.post<DomainResponse>('/hub/domains/detail', params);
}

/**
 * @description: 域名 SEO 详情
 * @param {DomainSeoDetailDto} params
 * @url: /api/hub/domains/seo/detail
 */
export const seoDetail = (params: DomainSeoDetailDto) => {
  return requestClient.post<SeoResponse>('/hub/domains/seo/detail', params);
}

/**
 * @description: 更新域名
 * @param {UpdateDomainDto} params
 * @url: /api/hub/domains/update
 */
export const domainsUpdate = (params: UpdateDomainDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/domains/update', params);
}

/**
 * @description: 保存域名 SEO
 * @param {DomainSeoSaveDto} params
 * @url: /api/hub/domains/seo/save
 */
export const seoSave = (params: DomainSeoSaveDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/domains/seo/save', params);
}

/**
 * @description: 删除域名
 * @param {IdDto} params
 * @url: /api/hub/domains/delete
 */
export const domainsDelete = (params: IdDto) => {
  return requestClient.post<DomainResponse>('/hub/domains/delete', params);
}

/**
 * @description: 域名下拉列表
 * @param {DomainOptionsDto} params
 * @url: /api/hub/domains/options
 */
export const domainsOptions = (params: DomainOptionsDto) => {
  return requestClient.post<DomainOptionsResponseVO>('/hub/domains/options', params);
}

/**
 * @description: 根据域名解析配置
 * @param {DomainResolveDto} params
 * @url: /api/hub/domains/resolve
 */
export const domainsResolve = (params: DomainResolveDto) => {
  return requestClient.post<DomainResolveResponse>('/hub/domains/resolve', params);
}

// ==================== Layouts - 版型管理 ====================

/**
 * @description: 创建版型
 * @param {CreateLayoutDto} params
 * @url: /api/hub/layouts/create
 */
export const layoutsCreate = (params: CreateLayoutDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/layouts/create', params);
}

/**
 * @description: 版型列表
 * @param {LayoutQueryDto} params
 * @url: /api/hub/layouts/list
 */
export const layoutsList = (params: LayoutQueryDto) => {
  return requestClient.post<LayoutListResponse>('/hub/layouts/list', params);
}

/**
 * @description: 版型详情
 * @param {IdDto} params
 * @url: /api/hub/layouts/detail
 */
export const layoutsDetail = (params: IdDto) => {
  return requestClient.post<LayoutResponse>('/hub/layouts/detail', params);
}

/**
 * @description: 更新版型
 * @param {UpdateLayoutDto} params
 * @url: /api/hub/layouts/update
 */
export const layoutsUpdate = (params: UpdateLayoutDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/layouts/update', params);
}

/**
 * @description: 删除版型
 * @param {IdDto} params
 * @url: /api/hub/layouts/delete
 */
export const layoutsDelete = (params: IdDto) => {
  return requestClient.post<LayoutResponse>('/hub/layouts/delete', params);
}

/**
 * @description: 复制版型
 * @param {LayoutCopyDto} params
 * @url: /api/hub/layouts/copy
 */
export const copy = (params: LayoutCopyDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/layouts/copy', params);
}

/**
 * @description: 关联TabBar列表
 * @param {IdDto} params
 * @url: /api/hub/layouts/tabbars
 */
export const tabbars = (params: IdDto) => {
  return requestClient.post<LayoutTabBarsResponseVO>('/hub/layouts/tabbars', params);
}

// ==================== TabBar - 标签栏管理 ====================

/**
 * @description: 创建 TabBar
 * @param {CreateTabBarDto} params
 * @url: /api/hub/tabbars/create
 */
export const tabbarsCreate = (params: CreateTabBarDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/tabbars/create', params);
}

/**
 * @description: TabBar 列表
 * @param {TabBarQueryDto} params
 * @url: /api/hub/tabbars/list
 */
export const tabbarsList = (params: TabBarQueryDto) => {
  return requestClient.post<TabBarListResponse>('/hub/tabbars/list', params);
}

/**
 * @description: TabBar 下拉列表
 * @param {TabBarSelectQueryDto} params
 * @url: /api/hub/tabbars/select
 */
export const select = (params: TabBarSelectQueryDto) => {
  return requestClient.post<TabBarSelectListResponseVO>('/hub/tabbars/select', params);
}

/**
 * @description: TabBar 详情
 * @param {IdDto} params
 * @url: /api/hub/tabbars/detail
 */
export const tabbarsDetail = (params: IdDto) => {
  return requestClient.post<TabBarResponse>('/hub/tabbars/detail', params);
}

/**
 * @description: 更新 TabBar
 * @param {UpdateTabBarDto} params
 * @url: /api/hub/tabbars/update
 */
export const tabbarsUpdate = (params: UpdateTabBarDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/tabbars/update', params);
}

/**
 * @description: 删除 TabBar
 * @param {IdDto} params
 * @url: /api/hub/tabbars/delete
 */
export const tabbarsDelete = (params: IdDto) => {
  return requestClient.post<TabBarResponse>('/hub/tabbars/delete', params);
}

// ==================== Theme - 主题管理 ====================

/**
 * @description: 创建主题
 * @param {CreateThemeDto} params
 * @url: /api/hub/themes/create
 */
export const themesCreate = (params: CreateThemeDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/themes/create', params);
}

/**
 * @description: 主题列表
 * @param {ThemeQueryDto} params
 * @url: /api/hub/themes/list
 */
export const themesList = (params: ThemeQueryDto) => {
  return requestClient.post<ThemeListResponse>('/hub/themes/list', params);
}

/**
 * @description: 主题详情
 * @param {IdDto} params
 * @url: /api/hub/themes/detail
 */
export const themesDetail = (params: IdDto) => {
  return requestClient.post<ThemeResponse>('/hub/themes/detail', params);
}

/**
 * @description: 更新主题
 * @param {UpdateThemeDto} params
 * @url: /api/hub/themes/update
 */
export const themesUpdate = (params: UpdateThemeDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/themes/update', params);
}

/**
 * @description: 删除主题
 * @param {IdDto} params
 * @url: /api/hub/themes/delete
 */
export const themesDelete = (params: IdDto) => {
  return requestClient.post<ThemeResponse>('/hub/themes/delete', params);
}

/**
 * @description: 获取主题资源
 * @param {IdDto} params
 * @url: /api/hub/themes/assets
 */
export const assets = (params: IdDto) => {
  return requestClient.post<ThemeAssetsResponseVO>('/hub/themes/assets', params);
}

// ==================== AppRoute - APP线路管理 ====================

/**
 * @description: 创建线路
 * @param {CreateAppRouteDto} params
 * @url: /api/hub/app-routes/create
 */
export const appRoutesCreate = (params: CreateAppRouteDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/app-routes/create', params);
}

/**
 * @description: 线路列表
 * @param {AppRouteQueryDto} params
 * @url: /api/hub/app-routes/list
 */
export const appRoutesList = (params: AppRouteQueryDto) => {
  return requestClient.post<AppRouteListResponse>('/hub/app-routes/list', params);
}

/**
 * @description: 线路详情
 * @param {IdDto} params
 * @url: /api/hub/app-routes/detail
 */
export const appRoutesDetail = (params: IdDto) => {
  return requestClient.post<AppRouteResponse>('/hub/app-routes/detail', params);
}

/**
 * @description: 更新线路
 * @param {UpdateAppRouteDto} params
 * @url: /api/hub/app-routes/update
 */
export const appRoutesUpdate = (params: UpdateAppRouteDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/app-routes/update', params);
}

/**
 * @description: 删除线路
 * @param {IdDto} params
 * @url: /api/hub/app-routes/delete
 */
export const appRoutesDelete = (params: IdDto) => {
  return requestClient.post<AppRouteResponse>('/hub/app-routes/delete', params);
}

/**
 * @description: 启用/禁用线路
 * @param {AppRouteStateDto} params
 * @url: /api/hub/app-routes/state
 */
export const state = (params: AppRouteStateDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/app-routes/state', params);
}

/**
 * @description: 获取可用线路
 * @param {AppRouteAvailableDto} params
 * @url: /api/hub/app-routes/available
 */
export const available = (params: AppRouteAvailableDto) => {
  return requestClient.post<AppRouteAvailableResponseVO>('/hub/app-routes/available', params);
}

/**
 * @description: 手动健康检查
 * @param {AppRouteAvailableDto} params
 * @url: /api/hub/app-routes/health-check
 */
export const healthCheck = (params: AppRouteAvailableDto) => {
  return requestClient.post<HealthCheckResultVO>('/hub/app-routes/health-check', params);
}

// ==================== Config - 配置聚合 ====================

/**
 * @description: 配置选项聚合
 * @param {ConfigOptionsDto} params
 * @url: /api/hub/config/options
 */
export const configOptions = (params: ConfigOptionsDto) => {
  return requestClient.post<ConfigOptionsResponse>('/hub/config/options', params);
}

// ==================== Agreement - 协议手册管理 ====================

/**
 * @description: 协议详情
 * @param {AgreementDetailDto} params
 * @url: /api/hub/agreement/detail
 */
export const agreementDetail = (params: AgreementDetailDto) => {
  return requestClient.post<AgreementListResponseVO>('/hub/agreement/detail', params);
}

/**
 * @description: 保存协议
 * @param {SaveAgreementDto} params
 * @url: /api/hub/agreement/save
 */
export const agreementSave = (params: SaveAgreementDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/agreement/save', params);
}

// ==================== Runners - 执行器管理 ====================

/**
 * @description: Runner 自动注册
 * @param {RunnerRegisterDto} params
 * @url: /api/hub/runners/register
 */
export const register = (params: RunnerRegisterDto) => {
  return requestClient.post<any>('/hub/runners/register', params);
}

/**
 * @description: 心跳上报
 * @param {RunnerHeartbeatDto} params
 * @url: /api/hub/runners/heartbeat
 */
export const heartbeat = (params: RunnerHeartbeatDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/runners/heartbeat', params);
}

/**
 * @description: Runner 列表
 * @param {RunnerQueryDto} params
 * @url: /api/hub/runners/list
 */
export const runnersList = (params: RunnerQueryDto) => {
  return requestClient.post<RunnerListResponse>('/hub/runners/list', params);
}

// ==================== Jobs - 任务管理 ====================

/**
 * @description: 创建任务
 * @param {CreateJobDto} params
 * @url: /api/hub/jobs/create
 */
export const jobsCreate = (params: CreateJobDto) => {
  return requestClient.post<JobVO>('/hub/jobs/create', params);
}

/**
 * @description: 任务列表
 * @param {JobQueryDto} params
 * @url: /api/hub/jobs/list
 */
export const jobsList = (params: JobQueryDto) => {
  return requestClient.post<JobListResponse>('/hub/jobs/list', params);
}

/**
 * @description: 任务详情
 * @param {IdDto} params
 * @url: /api/hub/jobs/detail
 */
export const jobsDetail = (params: IdDto) => {
  return requestClient.post<JobVO>('/hub/jobs/detail', params);
}

/**
 * @description: 取消任务
 * @param {IdDto} params
 * @url: /api/hub/jobs/cancel
 */
export const cancel = (params: IdDto) => {
  return requestClient.post<JobCancelResponseVO>('/hub/jobs/cancel', params);
}

/**
 * @description: 重试任务
 * @param {IdDto} params
 * @url: /api/hub/jobs/retry
 */
export const retry = (params: IdDto) => {
  return requestClient.post<JobVO>('/hub/jobs/retry', params);
}

/**
 * @description: 任务状态统计
 * @param {JobStatsQueryDto} params
 * @url: /api/hub/jobs/stats
 */
export const stats = (params: JobStatsQueryDto) => {
  return requestClient.post<JobStatsVO>('/hub/jobs/stats', params);
}

// ==================== Job Logs - 任务日志 ====================

/**
 * @description: 任务日志列表
 * @param {JobLogQueryDto} params
 * @url: /api/hub/job-logs/list
 */
export const jobLogsList = (params: JobLogQueryDto) => {
  return requestClient.post<JobLogListResponse>('/hub/job-logs/list', params);
}

// ==================== App Versions - 应用版本管理 ====================

/**
 * @description: 创建版本
 * @param {CreateAppVersionDto} params
 * @url: /api/hub/app-versions/create
 */
export const appVersionsCreate = (params: CreateAppVersionDto) => {
  return requestClient.post<AppVersionVO>('/hub/app-versions/create', params);
}

/**
 * @description: 版本列表
 * @param {AppVersionQueryDto} params
 * @url: /api/hub/app-versions/list
 */
export const appVersionsList = (params: AppVersionQueryDto) => {
  return requestClient.post<AppVersionListDataVO>('/hub/app-versions/list', params);
}

/**
 * @description: 检查更新
 * @param {CheckUpdateDto} params
 * @url: /api/hub/app-versions/check-update
 */
export const checkUpdate = (params: CheckUpdateDto) => {
  return requestClient.post<CheckUpdateVO>('/hub/app-versions/check-update', params);
}

/**
 * @description: 版本详情
 * @param {IdDto} params
 * @url: /api/hub/app-versions/detail
 */
export const appVersionsDetail = (params: IdDto) => {
  return requestClient.post<AppVersionVO>('/hub/app-versions/detail', params);
}

/**
 * @description: 更新版本
 * @param {UpdateAppVersionDto} params
 * @url: /api/hub/app-versions/update
 */
export const appVersionsUpdate = (params: UpdateAppVersionDto) => {
  return requestClient.post<AppVersionVO>('/hub/app-versions/update', params);
}

/**
 * @description: 删除版本
 * @param {IdDto} params
 * @url: /api/hub/app-versions/delete
 */
export const appVersionsDelete = (params: IdDto) => {
  return requestClient.post<AppVersionVO>('/hub/app-versions/delete', params);
}

/**
 * @description: 发布版本
 * @param {IdDto} params
 * @url: /api/hub/app-versions/publish
 */
export const publish = (params: IdDto) => {
  return requestClient.post<AppVersionVO>('/hub/app-versions/publish', params);
}

/**
 * @description: 下架版本
 * @param {IdDto} params
 * @url: /api/hub/app-versions/unpublish
 */
export const unpublish = (params: IdDto) => {
  return requestClient.post<AppVersionVO>('/hub/app-versions/unpublish', params);
}

/**
 * @description: 下载版本文件
 * @param {IdDto} params
 * @url: /api/hub/app-versions/download
 */
export const download = (params: IdDto) => {
  return requestClient.post<any>('/hub/app-versions/download', params);
}

// ==================== App Packages - 打包配置管理 ====================

/**
 * @description: 创建打包配置
 * @param {CreateAppPackageDto} params
 * @url: /api/hub/app-packages/create
 */
export const appPackagesCreate = (params: CreateAppPackageDto) => {
  return requestClient.post<AppPackageVO>('/hub/app-packages/create', params);
}

/**
 * @description: 打包配置列表
 * @param {AppPackageQueryDto} params
 * @url: /api/hub/app-packages/list
 */
export const appPackagesList = (params: AppPackageQueryDto) => {
  return requestClient.post<AppPackageListDataVO>('/hub/app-packages/list', params);
}

/**
 * @description: 打包配置详情
 * @param {IdDto} params
 * @url: /api/hub/app-packages/detail
 */
export const appPackagesDetail = (params: IdDto) => {
  return requestClient.post<AppPackageVO>('/hub/app-packages/detail', params);
}

/**
 * @description: 更新打包配置
 * @param {UpdateAppPackageDto} params
 * @url: /api/hub/app-packages/update
 */
export const appPackagesUpdate = (params: UpdateAppPackageDto) => {
  return requestClient.post<AppPackageVO>('/hub/app-packages/update', params);
}

/**
 * @description: 删除打包配置
 * @param {IdDto} params
 * @url: /api/hub/app-packages/delete
 */
export const appPackagesDelete = (params: IdDto) => {
  return requestClient.post<AppPackageVO>('/hub/app-packages/delete', params);
}

/**
 * @description: 触发打包任务
 * @param {AppPackageBuildDto} params
 * @url: /api/hub/app-packages/build
 */
export const build = (params: AppPackageBuildDto) => {
  return requestClient.post<JobVO>('/hub/app-packages/build', params);
}

/**
 * @description: 打包配置任务列表
 * @param {AppPackageJobsQueryDto} params
 * @url: /api/hub/app-packages/jobs
 */
export const jobs = (params: AppPackageJobsQueryDto) => {
  return requestClient.post<JobListResponse>('/hub/app-packages/jobs', params);
}

// ==================== Upload - 文件上传 ====================

/**
 * @description: 上传图片 (Base64/URL)
 * @param {UploadImageDto} params
 * @url: /api/hub/upload/image
 */
export const image = (params: UploadImageDto) => {
  return requestClient.post<UploadResultVO>('/hub/upload/image', params);
}

/**
 * @description: 上传文件 (Multipart)
 * @param file 上传文件
 * @param {UploadFileFormDto} params
 * @url: /api/hub/upload/file
 */
export const file = (file: File, params: Omit<UploadFileFormDto, 'file'>) => {
  return uploadFile<UploadFileResultVO>({ url: '/hub/upload/file' }, { files: [file], ...params }, 'file');
}

// ==================== Merchant - 商户端配置 ====================

/**
 * @description: 站点列表
 * @url: /api/hub/merchant/sites
 */
export const sites = () => {
  return requestClient.post<MerchantSiteListResponseVO>('/hub/merchant/sites');
}

/**
 * @description: 商户配置详情
 * @param {MerchantDetailDto} params
 * @url: /api/hub/merchant/detail
 */
export const merchantDetail = (params: MerchantDetailDto) => {
  return requestClient.post<MerchantDetailResponse>('/hub/merchant/detail', params);
}

/**
 * @description: 获取 TabBar 配置
 * @param {MerchantTabBarDto} params
 * @url: /api/hub/merchant/tabbar
 */
export const tabbar = (params: MerchantTabBarDto) => {
  return requestClient.post<MerchantTabBarResponse>('/hub/merchant/tabbar', params);
}

/**
 * @description: 保存 TabBar 覆盖配置
 * @param {MerchantTabBarSaveDto} params
 * @url: /api/hub/merchant/tabbar-save
 */
export const tabbarSave = (params: MerchantTabBarSaveDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/merchant/tabbar-save', params);
}

/**
 * @description: 获取游戏导航聚合配置
 * @param {MerchantGameNavDetailDto} params
 * @url: /api/hub/merchant/game-nav-detail
 */
export const gameNavDetail = (params: MerchantGameNavDetailDto) => {
  return requestClient.post<MerchantGameNavDetailResponse>('/hub/merchant/game-nav-detail', params);
}

/**
 * @description: 保存游戏导航草稿
 * @param {MerchantGameNavSaveDto} params
 * @url: /api/hub/merchant/game-nav-save
 */
export const gameNavSave = (params: MerchantGameNavSaveDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/merchant/game-nav-save', params);
}

/**
 * @description: 发布游戏导航版本
 * @param {MerchantGameNavPublishDto} params
 * @url: /api/hub/merchant/game-nav-publish
 */
export const gameNavPublish = (params: MerchantGameNavPublishDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/merchant/game-nav-publish', params);
}

/**
 * @description: 保存商户配置
 * @param {MerchantSaveDto} params
 * @url: /api/hub/merchant/save
 */
export const merchantSave = (params: MerchantSaveDto) => {
  return requestClient.post<BooleanResponseVO>('/hub/merchant/save', params);
}

// ==================== Web - 前端配置 ====================

/**
 * @description: 前端初始化配置
 * @param {WebConfigDto} params
 * @url: /api/hub/web/config
 */
export const config = (params: WebConfigDto) => {
  return requestClient.post<WebConfigResponse>('/hub/web/config', params);
}

/**
 * @description: 获取租户游戏导航
 * @param {WebGameDto} params
 * @url: /api/hub/web/game
 */
export const game = (params: WebGameDto) => {
  return requestClient.post<WebGameResponse>('/hub/web/game', params);
}

// ==================== Debug - 调度调试 ====================

/**
 * @description: 查看平台商户列表原始数据
 * @url: /api/hub/debug/scheduler/org-tenant-list
 */
export const orgTenantList = () => {
  return requestClient.post<any>('/hub/debug/scheduler/org-tenant-list');
}
