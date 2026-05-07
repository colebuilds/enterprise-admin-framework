/**
 * @description: 资源列表 请求
 * @url: /api/hub/assets/list
 * @name: AssetQueryDto
 */
export interface AssetQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 资源层级
   */
  scope?: "system" | "theme" | "layout" | "theme_layout" | "tenant";
  /**
   * 客户端类型
   */
  clientType?: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 资源Key（模糊搜索）
   */
  key?: string;
  /**
   * 商户ID
   */
  tenantId?: number;
  /**
   * 主题ID
   */
  themeId?: number;
  /**
   * 版型ID
   */
  layoutId?: number;
}

export interface AssetMetaDto {
  /**
   * 图片宽度 (px)
   */
  width: number;
  /**
   * 图片高度 (px)
   */
  height: number;
  /**
   * 文件大小 (bytes)
   */
  size: number;
  /**
   * 图片格式（简写）
   */
  format: string;
  /**
   * MIME 类型
   */
  mimeType: string;
  /**
   * 原始文件名
   */
  originalName: string;
}

export interface AssetThemeInfo {
  /**
   * 主题ID
   */
  id: number;
  /**
   * 主题名称
   */
  name: string;
  /**
   * 主题代码
   */
  themeCode: string;
}

export interface AssetLayoutInfo {
  /**
   * 版型ID
   */
  id: number;
  /**
   * 版型名称
   */
  name: string;
}

/**
 * @description: 资源详情 响应
 * @url: /api/hub/assets/detail
 * @name: AssetResponse
 */
export interface AssetResponse {
  /**
   * 记录ID
   */
  id: number;
  /**
   * 资源层级: system-全局 / theme-主题级 / layout-版型级 / theme_layout-定制级 / tenant-商户资源
   */
  scope: "system" | "theme" | "layout" | "theme_layout" | "tenant";
  /**
   * 商户ID（0=公共资源）
   */
  tenantId: number;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 主题ID
   */
  themeId: Record<string, any>;
  /**
   * 版型ID
   */
  layoutId: Record<string, any>;
  /**
   * 资源键
   */
  key: string;
  /**
   * 资源名称
   */
  name: Record<string, any>;
  /**
   * 资源地址
   */
  url: string;
  /**
   * 图片元数据
   */
  meta: AssetMetaDto;
  /**
   * 关联主题信息
   */
  theme: AssetThemeInfo;
  /**
   * 关联版型信息
   */
  layout: AssetLayoutInfo;
  /**
   * 创建人
   */
  createdBy: Record<string, any>;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

/**
 * @description: 资源列表 响应
 * @url: /api/hub/assets/list
 * @name: AssetListResponse
 */
export interface AssetListResponse {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 资源列表
   */
  list: AssetResponse[];
}

export type AssetListResponseVO = AssetListResponse;

/**
 * @description: 资源详情 请求
 * @url: /api/hub/assets/detail
 * @name: IdDto
 */
export interface IdDto {
  /**
   * ID
   */
  id: number;
}

export type AssetResponseVO = AssetResponse;

/**
 * @description: 更新资源 请求
 * @url: /api/hub/assets/update
 * @name: UpdateAssetDto
 */
export interface UpdateAssetDto {
  /**
   * 商户ID（0=公共资源, >0=商户资源）
   */
  tenantId?: number;
  /**
   * 客户端类型: web / h5 / ios / android / app / public
   */
  clientType?: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 主题ID（主题级资源）
   */
  themeId?: number;
  /**
   * 版型ID（版型级资源）
   */
  layoutId?: number;
  /**
   * 资源键，如: logo.main, icon.home.active
   */
  key?: string;
  /**
   * 资源名称
   */
  name?: string;
  /**
   * 资源地址（OSS/S3/CDN）
   */
  url?: string;
  /**
   * 图片元数据（宽高、大小、格式等）
   */
  meta?: AssetMetaDto;
  /**
   * ID
   */
  id: number;
}

/**
 * @description: 更新资源 响应
 * @url: /api/hub/assets/update
 * @name: BooleanResponseVO
 */
export type BooleanResponseVO = boolean;

/**
 * @description: 创建资源（幂等） 请求
 * @url: /api/hub/assets/create
 * @name: UploadAssetDto
 */
export interface UploadAssetDto {
  /**
   * 商户ID（0=公共资源, >0=商户资源）
   */
  tenantId: number;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 主题ID
   */
  themeId?: number;
  /**
   * 版型ID
   */
  layoutId?: number;
  /**
   * 资源键
   */
  key: string;
  /**
   * 资源名称
   */
  name?: string;
  /**
   * 资源URL
   */
  url: string;
  /**
   * 图片元数据（宽高、大小、格式等）
   */
  meta?: AssetMetaDto;
}

/**
 * @description: 解析资源 请求
 * @url: /api/hub/assets/resolve
 * @name: AssetResolveDto
 */
export interface AssetResolveDto {
  /**
   * 资源Key
   */
  key: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 租户ID
   */
  tenantId?: number;
  /**
   * 版型ID
   */
  layoutId?: number;
  /**
   * 主题ID
   */
  themeId?: number;
}

/**
 * @description: 解析资源 响应
 * @url: /api/hub/assets/resolve
 * @name: AssetResolveResult
 */
export interface AssetResolveResult {
  /**
   * 资源Key
   */
  key: string;
  /**
   * 资源URL
   */
  url: string;
  /**
   * 匹配来源: tenant / theme_layout / layout / theme / system
   */
  source: string;
  /**
   * 图片元数据
   */
  meta?: AssetMetaDto;
}

export type AssetResolveResponseVO = AssetResolveResult;

/**
 * @description: 创建域名 请求
 * @url: /api/hub/domains/create
 * @name: CreateDomainDto
 */
export interface CreateDomainDto {
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 域名地址（唯一）
   */
  domain: string;
  /**
   * 渠道标识
   */
  channel?: string;
  /**
   * 版面ID
   */
  editionId?: Record<string, any>;
}

/**
 * @description: 域名列表 请求
 * @url: /api/hub/domains/list
 * @name: DomainQueryDto
 */
export interface DomainQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 租户ID
   */
  tenantId?: number;
}

/**
 * @description: 域名详情 响应
 * @url: /api/hub/domains/detail
 * @name: DomainResponse
 */
export interface DomainResponse {
  /**
   * 记录ID
   */
  id: number;
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 域名地址
   */
  domain: string;
  /**
   * 渠道标识
   */
  channel: Record<string, any>;
  /**
   * Web 版型标识
   */
  webLayoutKey: Record<string, any>;
  /**
   * 移动端版型标识
   */
  mobileLayoutKey: Record<string, any>;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

/**
 * @description: 域名列表 响应
 * @url: /api/hub/domains/list
 * @name: DomainListResponse
 */
export interface DomainListResponse {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 域名列表
   */
  list: DomainResponse[];
}

export type DomainListResponseVO = DomainListResponse;

export type DomainResponseVO = DomainResponse;

/**
 * @description: 域名 SEO 详情 请求
 * @url: /api/hub/domains/seo/detail
 * @name: DomainSeoDetailDto
 */
export interface DomainSeoDetailDto {
  /**
   * 域名ID
   */
  domainId: number;
}

/**
 * @description: 域名 SEO 详情 响应
 * @url: /api/hub/domains/seo/detail
 * @name: SeoResponse
 */
export interface SeoResponse {
  /**
   * 记录ID
   */
  id: number;
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 域名ID
   */
  domainId: number;
  /**
   * 页面标题
   */
  title: string;
  /**
   * 关键词
   */
  keywords: string;
  /**
   * 描述信息
   */
  description: string;
  /**
   * 自定义脚本
   */
  scripts: string;
  /**
   * 网站图标URL
   */
  favicon: string;
  /**
   * 宣传图URL
   */
  promoImage: string;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

export type SeoResponseVO = SeoResponse;

/**
 * @description: 更新域名 请求
 * @url: /api/hub/domains/update
 * @name: UpdateDomainDto
 */
export interface UpdateDomainDto {
  /**
   * 租户ID
   */
  tenantId?: number;
  /**
   * 域名地址（唯一）
   */
  domain?: string;
  /**
   * 渠道标识
   */
  channel?: string;
  /**
   * 版面ID
   */
  editionId?: Record<string, any>;
  /**
   * ID
   */
  id: number;
}

/**
 * @description: 保存域名 SEO 请求
 * @url: /api/hub/domains/seo/save
 * @name: DomainSeoSaveDto
 */
export interface DomainSeoSaveDto {
  /**
   * 域名ID
   */
  domainId: number;
  /**
   * 页面标题
   */
  title?: string;
  /**
   * 关键词
   */
  keywords?: string;
  /**
   * 描述信息
   */
  description?: string;
  /**
   * 自定义脚本
   */
  scripts?: string;
  /**
   * 网站图标URL
   */
  favicon?: string;
  /**
   * 宣传图URL
   */
  promoImage?: string;
}

/**
 * @description: 域名下拉列表 请求
 * @url: /api/hub/domains/options
 * @name: DomainOptionsDto
 */
export interface DomainOptionsDto {
  /**
   * 商户ID（业务租户ID）
   */
  tenantId: number;
}

export interface DomainOptionItem {
  /**
   * 域名ID
   */
  id: number;
  /**
   * 域名
   */
  domain: string;
}

/**
 * @description: 域名下拉列表 响应
 * @url: /api/hub/domains/options
 * @name: DomainOptionsResponseVO
 */
export type DomainOptionsResponseVO = DomainOptionItem[];

/**
 * @description: 根据域名解析配置 请求
 * @url: /api/hub/domains/resolve
 * @name: DomainResolveDto
 */
export interface DomainResolveDto {
  /**
   * 域名
   */
  domain: string;
}

export interface DomainResolveTenantInfo {
  /**
   * 商户ID
   */
  id: number;
  /**
   * 租户名称
   */
  name: Record<string, any>;
}

export interface DomainResolveLayoutInfo {
  /**
   * 版型ID
   */
  id: number;
  /**
   * 版型名称
   */
  name: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
}

export interface DomainResolveThemeInfo {
  /**
   * 主题ID
   */
  id: number;
  /**
   * 主题名称
   */
  name: string;
  /**
   * 主题编码
   */
  themeCode: string;
}

export interface DomainResolveStyleInfo {
  /**
   * 风格ID
   */
  id: number;
  /**
   * 风格名称
   */
  name: string;
  /**
   * 风格编码
   */
  styleCode: string;
}

/**
 * @description: 根据域名解析配置 响应
 * @url: /api/hub/domains/resolve
 * @name: DomainResolveResponse
 */
export interface DomainResolveResponse {
  /**
   * 域名ID
   */
  id: number;
  /**
   * 域名
   */
  domain: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 渠道
   */
  channel: Record<string, any>;
  /**
   * 租户信息
   */
  tenant: DomainResolveTenantInfo;
  /**
   * 版型信息
   */
  layout: DomainResolveLayoutInfo;
  /**
   * 主题信息
   */
  theme: DomainResolveThemeInfo;
  /**
   * 风格信息
   */
  style: DomainResolveStyleInfo;
}

export type DomainResolveResponseVO = DomainResolveResponse;

/**
 * @description: 创建版型 请求
 * @url: /api/hub/layouts/create
 * @name: CreateLayoutDto
 */
export interface CreateLayoutDto {
  /**
   * 版型唯一标识
   */
  key: string;
  /**
   * 版型名称
   */
  name: string;
  /**
   * 版型描述
   */
  description?: string;
  /**
   * 版型图片URL
   */
  layoutImage: string;
  /**
   * 客户端类型: web-PC端, h5-移动端H5, ios-iOS客户端, android-Android客户端, app-通用APP, public-公共
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 关联TabBar ID
   */
  tabBarId?: number;
}

/**
 * @description: 版型列表 请求
 * @url: /api/hub/layouts/list
 * @name: LayoutQueryDto
 */
export interface LayoutQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 客户端类型
   */
  clientType?: "web" | "h5" | "ios" | "android" | "app" | "public";
}

export interface LayoutCountInfo {
  /**
   * TabBar数量
   */
  tabBars: number;
}

export interface TabBarSimpleItem {
  /**
   * TabBar ID
   */
  id: number;
  /**
   * TabBar Key
   */
  key: string;
  /**
   * TabBar名称
   */
  name: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
}

/**
 * @description: 版型详情 响应
 * @url: /api/hub/layouts/detail
 * @name: LayoutResponse
 */
export interface LayoutResponse {
  /**
   * 记录ID
   */
  id: number;
  /**
   * 版型唯一标识
   */
  key: string;
  /**
   * 版型名称
   */
  name: string;
  /**
   * 版型描述
   */
  description: Record<string, any>;
  /**
   * 版型图片URL
   */
  layoutImage: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 关联数量统计
   */
  _count: LayoutCountInfo;
  /**
   * TabBar
   */
  tabBar: TabBarSimpleItem;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

/**
 * @description: 版型列表 响应
 * @url: /api/hub/layouts/list
 * @name: LayoutListResponse
 */
export interface LayoutListResponse {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 版型列表
   */
  list: LayoutResponse[];
}

export type LayoutListResponseVO = LayoutListResponse;

export type LayoutResponseVO = LayoutResponse;

/**
 * @description: 更新版型 请求
 * @url: /api/hub/layouts/update
 * @name: UpdateLayoutDto
 */
export interface UpdateLayoutDto {
  /**
   * 版型唯一标识
   */
  key?: string;
  /**
   * 版型名称
   */
  name?: string;
  /**
   * 版型描述
   */
  description?: string;
  /**
   * 版型图片URL
   */
  layoutImage?: string;
  /**
   * 客户端类型: web-PC端, h5-移动端H5, ios-iOS客户端, android-Android客户端, app-通用APP, public-公共
   */
  clientType?: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 关联TabBar ID
   */
  tabBarId?: number;
  /**
   * ID
   */
  id: number;
}

/**
 * @description: 复制版型 请求
 * @url: /api/hub/layouts/copy
 * @name: LayoutCopyDto
 */
export interface LayoutCopyDto {
  /**
   * 源版型ID
   */
  id: number;
  /**
   * 新版型唯一标识
   */
  key: string;
  /**
   * 新版型名称
   */
  name: string;
}

export interface TabBarOptionItem {
  /**
   * TabBar ID
   */
  id: number;
  /**
   * TabBar Key
   */
  key: string;
  /**
   * TabBar名称
   */
  name: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
}

/**
 * @description: 关联TabBar列表 响应
 * @url: /api/hub/layouts/tabbars
 * @name: LayoutTabBarsResponseVO
 */
export type LayoutTabBarsResponseVO = TabBarOptionItem[];

export interface CreateTabBarItemInputDto {
  /**
   * 多语言名称，如: { "en": "Home", "zh": "首页" }
   */
  name: Record<string, any>;
  /**
   * 唯一标识
   */
  key?: string;
  /**
   * 默认图标皮肤资源key，如: tab.home
   */
  iconKey?: string;
  /**
   * 激活状态图标皮肤资源key，如: tab.home.active
   */
  iconActiveKey?: string;
  /**
   * 跳转类型: route-前端路由, url-外链, game-游戏ID
   */
  targetType: "route" | "url" | "game";
  /**
   * 跳转目标：路由名/游戏ID/外链URL
   */
  target?: string;
  /**
   * 特殊类型：0-普通, 1-凸起按钮
   */
  special: number;
  /**
   * 排序权重
   */
  sortOrder: number;
  /**
   * 是否可见
   */
  visible: boolean;
}

/**
 * @description: 创建 TabBar 请求
 * @url: /api/hub/tabbars/create
 * @name: CreateTabBarDto
 */
export interface CreateTabBarDto {
  /**
   * TabBar唯一标识
   */
  key?: string;
  /**
   * 客户端类型: web-PC端, h5-移动端H5, ios-iOS客户端, android-Android客户端, app-通用APP, public-公共
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * TabBar名称
   */
  name?: string;
  /**
   * 预览效果图URL
   */
  preview?: string;
  /**
   * 背景颜色或图片URL
   */
  background?: string;
  /**
   * TabBar 子项列表（可选，创建时同时创建子项）
   */
  items?: CreateTabBarItemInputDto[];
}

/**
 * @description: TabBar 列表 请求
 * @url: /api/hub/tabbars/list
 * @name: TabBarQueryDto
 */
export interface TabBarQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * TabBar 名称（模糊搜索）
   */
  name?: string;
  /**
   * TabBar 标识（模糊搜索）
   */
  key?: string;
  /**
   * 客户端类型
   */
  clientType?: "web" | "h5" | "ios" | "android" | "app" | "public";
}

export interface TabBarLayoutInfo {
  /**
   * 版型ID
   */
  id: number;
  /**
   * 版型名称
   */
  name: string;
}

export interface TabBarItemResponse {
  /**
   * 记录ID
   */
  id: number;
  /**
   * 所属TabBar ID
   */
  tabBarId: number;
  /**
   * 多语言名称
   */
  name: Record<string, any>;
  /**
   * 唯一标识
   */
  key: Record<string, any>;
  /**
   * 默认图标皮肤资源key
   */
  iconKey: Record<string, any>;
  /**
   * 激活状态图标皮肤资源key
   */
  iconActiveKey: Record<string, any>;
  /**
   * 跳转类型
   */
  targetType: "route" | "url" | "game";
  /**
   * 跳转目标
   */
  target: Record<string, any>;
  /**
   * 特殊类型
   */
  special: number;
  /**
   * 排序权重
   */
  sortOrder: number;
  /**
   * 是否可见
   */
  visible: boolean;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

/**
 * @description: TabBar 详情 响应
 * @url: /api/hub/tabbars/detail
 * @name: TabBarResponse
 */
export interface TabBarResponse {
  /**
   * 记录ID
   */
  id: number;
  /**
   * TabBar唯一标识
   */
  key: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * TabBar名称
   */
  name: string;
  /**
   * 预览效果图URL
   */
  preview: string;
  /**
   * 背景颜色或图片URL
   */
  background: string;
  /**
   * 关联版型列表
   */
  layouts: TabBarLayoutInfo[];
  /**
   * TabBar项列表
   */
  items: TabBarItemResponse[];
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

/**
 * @description: TabBar 列表 响应
 * @url: /api/hub/tabbars/list
 * @name: TabBarListResponse
 */
export interface TabBarListResponse {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * TabBar列表
   */
  list: TabBarResponse[];
}

export type TabBarListResponseVO = TabBarListResponse;

/**
 * @description: TabBar 下拉列表 请求
 * @url: /api/hub/tabbars/select
 * @name: TabBarSelectQueryDto
 */
export interface TabBarSelectQueryDto {
  /**
   * 客户端类型
   */
  clientType?: "web" | "h5" | "ios" | "android" | "app" | "public";
}

export interface TabBarSelectItem {
  /**
   * ID
   */
  id: number;
  /**
   * 名称
   */
  name: string;
  /**
   * 唯一标识
   */
  key: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
}

/**
 * @description: TabBar 下拉列表 响应
 * @url: /api/hub/tabbars/select
 * @name: TabBarSelectListResponseVO
 */
export type TabBarSelectListResponseVO = TabBarSelectItem[];

export type TabBarResponseVO = TabBarResponse;

export interface UpdateTabBarItemInputDto {
  /**
   * 多语言名称，如: { "en": "Home", "zh": "首页" }
   */
  name?: Record<string, any>;
  /**
   * 唯一标识
   */
  key?: string;
  /**
   * 默认图标皮肤资源key，如: tab.home
   */
  iconKey?: string;
  /**
   * 激活状态图标皮肤资源key，如: tab.home.active
   */
  iconActiveKey?: string;
  /**
   * 跳转类型: route-前端路由, url-外链, game-游戏ID
   */
  targetType?: "route" | "url" | "game";
  /**
   * 跳转目标：路由名/游戏ID/外链URL
   */
  target?: string;
  /**
   * 特殊类型：0-普通, 1-凸起按钮
   */
  special?: number;
  /**
   * 排序权重
   */
  sortOrder?: number;
  /**
   * 是否可见
   */
  visible?: boolean;
  /**
   * TabBarItem ID（有值表示更新，无值表示新增）
   */
  id?: number;
}

/**
 * @description: 更新 TabBar 请求
 * @url: /api/hub/tabbars/update
 * @name: UpdateTabBarDto
 */
export interface UpdateTabBarDto {
  /**
   * ID
   */
  id: number;
  /**
   * 客户端类型: web-PC端, h5-移动端H5, ios-iOS客户端, android-Android客户端, app-通用APP, public-公共
   */
  clientType?: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * TabBar唯一标识
   */
  key?: string;
  /**
   * TabBar名称
   */
  name?: string;
  /**
   * 预览效果图URL
   */
  preview?: string;
  /**
   * 背景颜色或图片URL
   */
  background?: string;
  /**
   * TabBar 子项列表（可选）。语义：undefined-不修改子项，[]-删除所有子项，[...]-全量替换
   */
  items?: UpdateTabBarItemInputDto[];
}

/**
 * @description: 创建主题 请求
 * @url: /api/hub/themes/create
 * @name: CreateThemeDto
 */
export interface CreateThemeDto {
  /**
   * 主题名称
   */
  name: string;
  /**
   * 主题themeCode（唯一）
   */
  themeCode: string;
  /**
   * 主题描述
   */
  description?: string;
  /**
   * 主题主色值
   */
  colorValue?: string;
}

/**
 * @description: 主题列表 请求
 * @url: /api/hub/themes/list
 * @name: ThemeQueryDto
 */
export interface ThemeQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 主题名称（模糊搜索）
   */
  name?: string;
  /**
   * 主题编码（模糊搜索）
   */
  themeCode?: string;
}

/**
 * @description: 主题详情 响应
 * @url: /api/hub/themes/detail
 * @name: ThemeResponse
 */
export interface ThemeResponse {
  /**
   * 记录ID
   */
  id: number;
  /**
   * 主题名称
   */
  name: string;
  /**
   * 主题themeCode
   */
  themeCode: string;
  /**
   * 主题描述
   */
  description: Record<string, any>;
  /**
   * 主题主色值
   */
  colorValue: Record<string, any>;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

/**
 * @description: 主题列表 响应
 * @url: /api/hub/themes/list
 * @name: ThemeListResponse
 */
export interface ThemeListResponse {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 主题列表
   */
  list: ThemeResponse[];
}

export type ThemeListResponseVO = ThemeListResponse;

export type ThemeResponseVO = ThemeResponse;

/**
 * @description: 更新主题 请求
 * @url: /api/hub/themes/update
 * @name: UpdateThemeDto
 */
export interface UpdateThemeDto {
  /**
   * 主题名称
   */
  name?: string;
  /**
   * 主题themeCode（唯一）
   */
  themeCode?: string;
  /**
   * 主题描述
   */
  description?: string;
  /**
   * 主题主色值
   */
  colorValue?: string;
  /**
   * ID
   */
  id: number;
}

export interface ThemeAssetInfo {
  /**
   * 资源ID
   */
  id: number;
  /**
   * 资源名称
   */
  name?: Record<string, any>;
  /**
   * 资源Key
   */
  key: string;
  /**
   * 资源URL
   */
  url: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 版型ID
   */
  layoutId?: Record<string, any>;
  /**
   * 元数据
   */
  meta?: Record<string, any>;
}

/**
 * @description: 获取主题资源 响应
 * @url: /api/hub/themes/assets
 * @name: ThemeAssetsResponseVO
 */
export type ThemeAssetsResponseVO = ThemeAssetInfo[];

/**
 * @description: 创建线路 请求
 * @url: /api/hub/app-routes/create
 * @name: CreateAppRouteDto
 */
export interface CreateAppRouteDto {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 线路名称
   */
  routeName: string;
  /**
   * 线路类型：1主线路 2备用线路
   */
  routeType: number;
  /**
   * 平台：all/ios/android
   */
  platform?: string;
  /**
   * API域名
   */
  apiDomain: string;
  /**
   * WebSocket域名
   */
  wsDomain?: string;
  /**
   * CDN域名
   */
  cdnDomain?: string;
  /**
   * H5域名
   */
  h5Domain?: string;
  /**
   * 地区
   */
  region?: string;
  /**
   * 运营商
   */
  isp?: string;
  /**
   * 优先级
   */
  priority?: number;
  /**
   * 权重（负载均衡）
   */
  weight?: number;
  /**
   * 是否开启健康检查
   */
  healthCheck?: boolean;
  /**
   * 健康检查URL
   */
  checkUrl?: string;
  /**
   * 检查间隔（秒）
   */
  checkInterval?: number;
  /**
   * 超时时间（毫秒）
   */
  timeout?: number;
  /**
   * 失败阈值
   */
  failThreshold?: number;
}

/**
 * @description: 线路列表 请求
 * @url: /api/hub/app-routes/list
 * @name: AppRouteQueryDto
 */
export interface AppRouteQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 商户ID
   */
  tenantId?: number;
  /**
   * 线路类型：1主线路 2备用线路
   */
  routeType?: number;
  /**
   * 平台
   */
  platform?: string;
  /**
   * 状态：1启用 0禁用
   */
  state?: number;
  /**
   * 是否健康
   */
  isHealthy?: boolean;
}

/**
 * @description: 线路详情 响应
 * @url: /api/hub/app-routes/detail
 * @name: AppRouteResponse
 */
export interface AppRouteResponse {
  /**
   * 记录ID
   */
  id: number;
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 线路名称
   */
  routeName: string;
  /**
   * 线路类型：1主线路 2备用线路
   */
  routeType: number;
  /**
   * 平台
   */
  platform: string;
  /**
   * API域名
   */
  apiDomain: string;
  /**
   * WebSocket域名
   */
  wsDomain: Record<string, any>;
  /**
   * CDN域名
   */
  cdnDomain: Record<string, any>;
  /**
   * H5域名
   */
  h5Domain: Record<string, any>;
  /**
   * 地区
   */
  region: Record<string, any>;
  /**
   * 运营商
   */
  isp: Record<string, any>;
  /**
   * 优先级
   */
  priority: number;
  /**
   * 权重
   */
  weight: number;
  /**
   * 是否开启健康检查
   */
  healthCheck: boolean;
  /**
   * 健康检查URL
   */
  checkUrl: Record<string, any>;
  /**
   * 检查间隔（秒）
   */
  checkInterval: number;
  /**
   * 超时时间（毫秒）
   */
  timeout: number;
  /**
   * 失败阈值
   */
  failThreshold: number;
  /**
   * 是否健康
   */
  isHealthy: boolean;
  /**
   * 最后检查时间
   */
  lastCheckAt: Record<string, any>;
  /**
   * 状态：1启用 0禁用
   */
  state: number;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

/**
 * @description: 线路列表 响应
 * @url: /api/hub/app-routes/list
 * @name: AppRouteListResponse
 */
export interface AppRouteListResponse {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * APP线路列表
   */
  list: AppRouteResponse[];
}

export type AppRouteListResponseVO = AppRouteListResponse;

export type AppRouteResponseVO = AppRouteResponse;

/**
 * @description: 更新线路 请求
 * @url: /api/hub/app-routes/update
 * @name: UpdateAppRouteDto
 */
export interface UpdateAppRouteDto {
  /**
   * 商户ID
   */
  tenantId?: number;
  /**
   * 线路名称
   */
  routeName?: string;
  /**
   * 线路类型：1主线路 2备用线路
   */
  routeType?: number;
  /**
   * 平台：all/ios/android
   */
  platform?: string;
  /**
   * API域名
   */
  apiDomain?: string;
  /**
   * WebSocket域名
   */
  wsDomain?: string;
  /**
   * CDN域名
   */
  cdnDomain?: string;
  /**
   * H5域名
   */
  h5Domain?: string;
  /**
   * 地区
   */
  region?: string;
  /**
   * 运营商
   */
  isp?: string;
  /**
   * 优先级
   */
  priority?: number;
  /**
   * 权重（负载均衡）
   */
  weight?: number;
  /**
   * 是否开启健康检查
   */
  healthCheck?: boolean;
  /**
   * 健康检查URL
   */
  checkUrl?: string;
  /**
   * 检查间隔（秒）
   */
  checkInterval?: number;
  /**
   * 超时时间（毫秒）
   */
  timeout?: number;
  /**
   * 失败阈值
   */
  failThreshold?: number;
  /**
   * ID
   */
  id: number;
}

/**
 * @description: 启用/禁用线路 请求
 * @url: /api/hub/app-routes/state
 * @name: AppRouteStateDto
 */
export interface AppRouteStateDto {
  /**
   * ID
   */
  id: number;
  /**
   * 状态：1启用 0禁用
   */
  state: number;
}

/**
 * @description: 获取可用线路 请求
 * @url: /api/hub/app-routes/available
 * @name: AppRouteAvailableDto
 */
export interface AppRouteAvailableDto {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 平台：all/ios/android
   */
  platform?: string;
}

export interface AppRouteAvailableResponse {
  /**
   * 记录ID
   */
  id: number;
  /**
   * 线路名称
   */
  routeName: string;
  /**
   * 线路类型
   */
  routeType: number;
  /**
   * API域名
   */
  apiDomain: string;
  /**
   * WebSocket域名
   */
  wsDomain: Record<string, any>;
  /**
   * CDN域名
   */
  cdnDomain: Record<string, any>;
  /**
   * H5域名
   */
  h5Domain: Record<string, any>;
  /**
   * 优先级
   */
  priority: number;
  /**
   * 权重
   */
  weight: number;
}

/**
 * @description: 获取可用线路 响应
 * @url: /api/hub/app-routes/available
 * @name: AppRouteAvailableResponseVO
 */
export type AppRouteAvailableResponseVO = AppRouteAvailableResponse[];

export interface HealthCheckResult {
  /**
   * 线路ID
   */
  id: number;
  /**
   * 线路名称
   */
  routeName: string;
  /**
   * 是否健康
   */
  isHealthy: boolean;
  /**
   * 响应时间（毫秒）
   */
  responseTime?: Record<string, any>;
  /**
   * 错误信息
   */
  error?: Record<string, any>;
}

/**
 * @description: 手动健康检查 响应
 * @url: /api/hub/app-routes/health-check
 * @name: HealthCheckResultVO
 */
export type HealthCheckResultVO = HealthCheckResult[];

/**
 * @description: 配置选项聚合 请求
 * @url: /api/hub/config/options
 * @name: ConfigOptionsDto
 */
export type ConfigOptionsDto = Record<string, unknown>;

export interface ConfigLayoutOptionInfo {
  /**
   * 版型ID
   */
  id: number;
  /**
   * 版型标识
   */
  key: string;
  /**
   * 版型名称
   */
  name: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 版型预览图
   */
  layoutImage?: Record<string, any>;
}

export interface ConfigThemeOptionInfo {
  /**
   * 主题ID
   */
  id: number;
  /**
   * 主题名称
   */
  name: string;
  /**
   * 主题编码
   */
  themeCode: string;
  /**
   * 主题主色值
   */
  colorValue?: Record<string, any>;
}

export interface ConfigTabBarOptionInfo {
  /**
   * TabBar ID
   */
  id: number;
  /**
   * TabBar唯一标识
   */
  key: string;
  /**
   * 名称
   */
  name?: Record<string, any>;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 预览图
   */
  preview?: Record<string, any>;
  /**
   * 背景
   */
  background?: Record<string, any>;
  /**
   * 可见项数量
   */
  itemCount: number;
}

/**
 * @description: 配置选项聚合 响应
 * @url: /api/hub/config/options
 * @name: ConfigOptionsResponse
 */
export interface ConfigOptionsResponse {
  /**
   * 版型选项
   */
  layouts: ConfigLayoutOptionInfo[];
  /**
   * 主题选项
   */
  themes: ConfigThemeOptionInfo[];
  /**
   * TabBar 选项
   */
  tabBars: ConfigTabBarOptionInfo[];
}

export type ConfigOptionsResponseVO = ConfigOptionsResponse;

/**
 * @description: 协议详情 请求
 * @url: /api/hub/agreement/detail
 * @name: AgreementDetailDto
 */
export interface AgreementDetailDto {
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 协议类型
   */
  type: "privacy" | "risk" | "guide";
}

export interface AgreementResponse {
  /**
   * 记录ID
   */
  id: number;
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 协议类型
   */
  type: string;
  /**
   * 协议标题
   */
  title: string;
  /**
   * 富文本 HTML 内容
   */
  content: string;
  /**
   * 状态 0=禁用 1=启用
   */
  status: number;
  /**
   * 操作人
   */
  updatedBy: string;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

/**
 * @description: 协议详情 响应
 * @url: /api/hub/agreement/detail
 * @name: AgreementListResponseVO
 */
export type AgreementListResponseVO = AgreementResponse[];

/**
 * @description: 保存协议 请求
 * @url: /api/hub/agreement/save
 * @name: SaveAgreementDto
 */
export interface SaveAgreementDto {
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 协议类型
   */
  type: "privacy" | "risk" | "guide";
  /**
   * 协议标题
   */
  title?: string;
  /**
   * 富文本 HTML 内容
   */
  content?: string;
  /**
   * 状态 0=禁用 1=启用
   */
  status?: number;
}

/**
 * @description: Runner 自动注册 请求
 * @url: /api/hub/runners/register
 * @name: RunnerRegisterDto
 */
export interface RunnerRegisterDto {
  /**
   * Runner名称
   */
  runnerName: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 平台
   */
  platform: "ios" | "android";
  /**
   * 标签
   */
  tags?: string[];
  /**
   * 最大并发数
   */
  maxConcurrent?: number;
  /**
   * 版本号
   */
  version?: string;
  /**
   * IP地址
   */
  ipAddress?: string;
}

/**
 * @description: 心跳上报 请求
 * @url: /api/hub/runners/heartbeat
 * @name: RunnerHeartbeatDto
 */
export interface RunnerHeartbeatDto {
  /**
   * Runner Token
   */
  token: string;
  /**
   * IP地址
   */
  ipAddress?: string;
  /**
   * 版本号
   */
  version?: string;
}

/**
 * @description: Runner 列表 请求
 * @url: /api/hub/runners/list
 * @name: RunnerQueryDto
 */
export interface RunnerQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 平台
   */
  platform?: "ios" | "android";
  /**
   * 状态 1启用 2禁用
   */
  state?: number;
  /**
   * 运行状态
   */
  runnerStatus?: "offline" | "online" | "running";
}

export interface RunnerVO {
  /**
   * Runner ID
   */
  id: number;
  /**
   * Runner 名称
   */
  runnerName: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 平台
   */
  platform: string;
  /**
   * 标签
   */
  tags?: string[];
  /**
   * 最大并发数
   */
  maxConcurrent: number;
  /**
   * 是否在线
   */
  isOnline: boolean;
  /**
   * 最后心跳时间
   */
  lastHeartbeat?: string;
  /**
   * IP 地址
   */
  ipAddress?: string;
  /**
   * 版本号
   */
  version?: string;
  /**
   * 状态 1启用 2禁用
   */
  state: number;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;
}

/**
 * @description: Runner 列表 响应
 * @url: /api/hub/runners/list
 * @name: RunnerListResponse
 */
export interface RunnerListResponse {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 
   */
  list: RunnerVO[];
}

export type RunnerListResponseVO = RunnerListResponse;

/**
 * @description: 创建任务 请求
 * @url: /api/hub/jobs/create
 * @name: CreateJobDto
 */
export interface CreateJobDto {
  /**
   * 打包配置ID
   */
  packageId: number;
  /**
   * 任务类型
   */
  jobType: "build" | "sign" | "upload";
  /**
   * 优先级 (数值越大越优先)
   */
  priority?: number;
  /**
   * 任务参数（JSON）
   */
  params?: Record<string, any>;
}

/**
 * @description: 创建任务 响应
 * @url: /api/hub/jobs/create
 * @name: JobVO
 */
export interface JobVO {
  /**
   * 任务ID
   */
  id: number;
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 打包配置ID
   */
  packageId: number;
  /**
   * 任务类型
   */
  jobType: string;
  /**
   * 状态
   */
  status: string;
  /**
   * 进度
   */
  progress: number;
  /**
   * 优先级
   */
  priority?: number;
  /**
   * Runner ID
   */
  runnerId?: number;
  /**
   * 产物地址
   */
  artifactUrl?: string;
  /**
   * 错误信息
   */
  errorMessage?: string;
  /**
   * 创建人
   */
  createdBy?: string;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 开始时间
   */
  startedAt?: string;
  /**
   * 完成时间
   */
  finishedAt?: string;
}

export type JobResponseVO = JobVO;

/**
 * @description: 任务列表 请求
 * @url: /api/hub/jobs/list
 * @name: JobQueryDto
 */
export interface JobQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 商户ID
   */
  tenantId?: number;
  /**
   * 打包配置ID
   */
  packageId?: number;
  /**
   * Runner ID
   */
  runnerId?: number;
  /**
   * 状态
   */
  status?: "pending" | "running" | "success" | "failed" | "cancelled";
  /**
   * 任务类型
   */
  jobType?: "build" | "sign" | "upload";
}

/**
 * @description: 任务列表 响应
 * @url: /api/hub/jobs/list
 * @name: JobListResponse
 */
export interface JobListResponse {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 
   */
  list: JobVO[];
}

export type JobListResponseVO = JobListResponse;

/**
 * @description: 取消任务 响应
 * @url: /api/hub/jobs/cancel
 * @name: JobCancelResponseVO
 */
export type JobCancelResponseVO = Record<string, any>;

/**
 * @description: 任务状态统计 请求
 * @url: /api/hub/jobs/stats
 * @name: JobStatsQueryDto
 */
export interface JobStatsQueryDto {
  /**
   * 商户ID
   */
  tenantId?: number;
  /**
   * 打包配置ID
   */
  packageId?: number;
}

/**
 * @description: 任务状态统计 响应
 * @url: /api/hub/jobs/stats
 * @name: JobStatsVO
 */
export interface JobStatsVO {
  /**
   * 待处理数量
   */
  pending: number;
  /**
   * 运行中数量
   */
  running: number;
  /**
   * 成功数量
   */
  success: number;
  /**
   * 失败数量
   */
  failed: number;
  /**
   * 已取消数量
   */
  cancelled: number;
  /**
   * 总数量
   */
  total: number;
}

export type JobStatsResponseVO = JobStatsVO;

/**
 * @description: 任务日志列表 请求
 * @url: /api/hub/job-logs/list
 * @name: JobLogQueryDto
 */
export interface JobLogQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 任务ID
   */
  jobId: number;
  /**
   * 日志级别
   */
  logLevel?: "info" | "warn" | "error";
}

export interface JobLogVO {
  /**
   * 日志ID
   */
  id: number;
  /**
   * 任务ID
   */
  jobId: number;
  /**
   * 日志级别
   */
  logLevel: string;
  /**
   * 日志内容
   */
  message: string;
}

/**
 * @description: 任务日志列表 响应
 * @url: /api/hub/job-logs/list
 * @name: JobLogListResponse
 */
export interface JobLogListResponse {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 
   */
  list: JobLogVO[];
}

export type JobLogListResponseVO = JobLogListResponse;

/**
 * @description: 创建版本 请求
 * @url: /api/hub/app-versions/create
 * @name: CreateAppVersionDto
 */
export interface CreateAppVersionDto {
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 平台
   */
  platform: "ios" | "android";
  /**
   * 版本号
   */
  versionCode: string;
  /**
   * 下载地址
   */
  downloadUrl: string;
  /**
   * 包类型
   */
  packageType?: "native" | "shell" | "master" | "derived";
  /**
   * 母包ID（派生包必填）
   */
  parentId?: number;
  /**
   * 更新类型 1可选 2强制 3静默
   */
  updateType?: number;
  /**
   * 最低兼容版本
   */
  minVersionCode?: string;
  /**
   * 更新说明
   */
  releaseNotes?: string;
  /**
   * 文件大小（字节）
   */
  fileSize?: number;
  /**
   * MD5校验码
   */
  md5?: string;
}

/**
 * @description: 创建版本 响应
 * @url: /api/hub/app-versions/create
 * @name: AppVersionVO
 */
export interface AppVersionVO {
  /**
   * ID
   */
  id: number;
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 平台
   */
  platform: string;
  /**
   * 版本号
   */
  versionCode: string;
  /**
   * 下载地址
   */
  downloadUrl: string;
  /**
   * 包类型
   */
  packageType: "native" | "shell" | "master" | "derived";
  /**
   * 母包ID（派生包关联）
   */
  parentId?: Record<string, any>;
  /**
   * 更新类型 1可选 2强制 3静默
   */
  updateType: number;
  /**
   * 最低兼容版本
   */
  minVersionCode?: Record<string, any>;
  /**
   * 更新说明
   */
  releaseNotes?: Record<string, any>;
  /**
   * 文件大小（字节）
   */
  fileSize?: Record<string, any>;
  /**
   * MD5校验码
   */
  md5?: Record<string, any>;
  /**
   * 发布时间
   */
  publishedAt?: Record<string, any>;
  /**
   * 状态 1草稿 2已发布 3已下架
   */
  state: number;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;
  /**
   * 创建人
   */
  createdBy?: Record<string, any>;
  /**
   * 修改人
   */
  updatedBy?: Record<string, any>;
}

export type AppVersionResponseVO = AppVersionVO;

/**
 * @description: 版本列表 请求
 * @url: /api/hub/app-versions/list
 * @name: AppVersionQueryDto
 */
export interface AppVersionQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 租户ID
   */
  tenantId?: number;
  /**
   * 平台
   */
  platform?: "ios" | "android";
  /**
   * 状态 1草稿 2已发布 3已下架
   */
  state?: number;
  /**
   * 包类型
   */
  packageType?: "native" | "shell" | "master" | "derived";
}

/**
 * @description: 版本列表 响应
 * @url: /api/hub/app-versions/list
 * @name: AppVersionListDataVO
 */
export interface AppVersionListDataVO {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 应用版本列表
   */
  list: AppVersionVO[];
}

export type AppVersionListResponseVO = AppVersionListDataVO;

/**
 * @description: 检查更新 请求
 * @url: /api/hub/app-versions/check-update
 * @name: CheckUpdateDto
 */
export interface CheckUpdateDto {
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 平台
   */
  platform: "ios" | "android";
  /**
   * 当前版本号
   */
  currentVersionCode: string;
  /**
   * 包类型（检查更新只支持 native/shell）
   */
  packageType?: "native" | "shell";
}

/**
 * @description: 检查更新 响应
 * @url: /api/hub/app-versions/check-update
 * @name: CheckUpdateVO
 */
export interface CheckUpdateVO {
  /**
   * 是否有更新
   */
  hasUpdate: boolean;
  /**
   * 版本信息
   */
  version?: Record<string, any>;
}

export type CheckUpdateResponseVO = CheckUpdateVO;

/**
 * @description: 更新版本 请求
 * @url: /api/hub/app-versions/update
 * @name: UpdateAppVersionDto
 */
export interface UpdateAppVersionDto {
  /**
   * 租户ID
   */
  tenantId?: number;
  /**
   * 平台
   */
  platform?: "ios" | "android";
  /**
   * 版本号
   */
  versionCode?: string;
  /**
   * 下载地址
   */
  downloadUrl?: string;
  /**
   * 包类型
   */
  packageType?: "native" | "shell" | "master" | "derived";
  /**
   * 母包ID（派生包必填）
   */
  parentId?: number;
  /**
   * 更新类型 1可选 2强制 3静默
   */
  updateType?: number;
  /**
   * 最低兼容版本
   */
  minVersionCode?: string;
  /**
   * 更新说明
   */
  releaseNotes?: string;
  /**
   * 文件大小（字节）
   */
  fileSize?: number;
  /**
   * MD5校验码
   */
  md5?: string;
  /**
   * ID
   */
  id: number;
}

/**
 * @description: 创建打包配置 请求
 * @url: /api/hub/app-packages/create
 * @name: CreateAppPackageDto
 */
export interface CreateAppPackageDto {
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 平台
   */
  platform: "ios" | "android";
  /**
   * 渠道标识
   */
  channelCode: string;
  /**
   * 包名
   */
  packageName: string;
  /**
   * 应用名称
   */
  appName: string;
  /**
   * 应用图标URL
   */
  appIcon?: string;
  /**
   * 启动图URL
   */
  splashImage?: string;
  /**
   * 引导图URL
   */
  launchImage?: string;
  /**
   * 签名配置（JSON）
   */
  signConfig?: Record<string, any>;
  /**
   * 打包配置（JSON）
   */
  buildConfig?: Record<string, any>;
}

/**
 * @description: 创建打包配置 响应
 * @url: /api/hub/app-packages/create
 * @name: AppPackageVO
 */
export interface AppPackageVO {
  /**
   * ID
   */
  id: number;
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 平台
   */
  platform: string;
  /**
   * 渠道标识
   */
  channelCode: string;
  /**
   * 包名
   */
  packageName: string;
  /**
   * 应用名称
   */
  appName: string;
  /**
   * 应用图标URL
   */
  appIcon?: Record<string, any>;
  /**
   * 启动图URL
   */
  splashImage?: Record<string, any>;
  /**
   * 引导图URL
   */
  launchImage?: Record<string, any>;
  /**
   * 签名配置
   */
  signConfig?: Record<string, any>;
  /**
   * 打包配置
   */
  buildConfig?: Record<string, any>;
  /**
   * 状态 1启用 2禁用
   */
  state: number;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;
  /**
   * 创建人
   */
  createdBy?: Record<string, any>;
  /**
   * 修改人
   */
  updatedBy?: Record<string, any>;
}

export type AppPackageResponseVO = AppPackageVO;

/**
 * @description: 打包配置列表 请求
 * @url: /api/hub/app-packages/list
 * @name: AppPackageQueryDto
 */
export interface AppPackageQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 租户ID
   */
  tenantId?: number;
  /**
   * 平台
   */
  platform?: "ios" | "android";
  /**
   * 渠道标识
   */
  channelCode?: string;
  /**
   * 状态
   */
  state?: number;
}

export interface LatestJobVO {
  /**
   * 任务ID
   */
  id: number;
  /**
   * 任务状态
   */
  status: string;
  /**
   * 创建时间
   */
  createdAt: string;
}

export interface AppPackageListItemVO {
  /**
   * ID
   */
  id: number;
  /**
   * 租户ID
   */
  tenantId: number;
  /**
   * 平台
   */
  platform: string;
  /**
   * 渠道标识
   */
  channelCode: string;
  /**
   * 包名
   */
  packageName: string;
  /**
   * 应用名称
   */
  appName: string;
  /**
   * 应用图标URL
   */
  appIcon?: Record<string, any>;
  /**
   * 启动图URL
   */
  splashImage?: Record<string, any>;
  /**
   * 引导图URL
   */
  launchImage?: Record<string, any>;
  /**
   * 签名配置
   */
  signConfig?: Record<string, any>;
  /**
   * 打包配置
   */
  buildConfig?: Record<string, any>;
  /**
   * 状态 1启用 2禁用
   */
  state: number;
  /**
   * 创建时间
   */
  createdAt: string;
  /**
   * 更新时间
   */
  updatedAt: string;
  /**
   * 创建人
   */
  createdBy?: Record<string, any>;
  /**
   * 修改人
   */
  updatedBy?: Record<string, any>;
  /**
   * 关联任务数量
   */
  jobCount: number;
  /**
   * 最新任务
   */
  latestJob?: LatestJobVO;
}

/**
 * @description: 打包配置列表 响应
 * @url: /api/hub/app-packages/list
 * @name: AppPackageListDataVO
 */
export interface AppPackageListDataVO {
  /**
   * 当前页
   */
  pageNo: number;
  /**
   * 总页数
   */
  totalPage: number;
  /**
   * 总数
   */
  totalCount: number;
  /**
   * 打包配置列表
   */
  list: AppPackageListItemVO[];
}

export type AppPackageListResponseVO = AppPackageListDataVO;

/**
 * @description: 更新打包配置 请求
 * @url: /api/hub/app-packages/update
 * @name: UpdateAppPackageDto
 */
export interface UpdateAppPackageDto {
  /**
   * 租户ID
   */
  tenantId?: number;
  /**
   * 平台
   */
  platform?: "ios" | "android";
  /**
   * 渠道标识
   */
  channelCode?: string;
  /**
   * 包名
   */
  packageName?: string;
  /**
   * 应用名称
   */
  appName?: string;
  /**
   * 应用图标URL
   */
  appIcon?: string;
  /**
   * 启动图URL
   */
  splashImage?: string;
  /**
   * 引导图URL
   */
  launchImage?: string;
  /**
   * 签名配置（JSON）
   */
  signConfig?: Record<string, any>;
  /**
   * 打包配置（JSON）
   */
  buildConfig?: Record<string, any>;
  /**
   * ID
   */
  id: number;
}

/**
 * @description: 触发打包任务 请求
 * @url: /api/hub/app-packages/build
 * @name: AppPackageBuildDto
 */
export interface AppPackageBuildDto {
  /**
   * 打包配置ID
   */
  id: number;
  /**
   * 任务类型
   */
  jobType?: string;
  /**
   * 任务优先级
   */
  priority?: number;
  /**
   * 任务参数
   */
  params?: Record<string, any>;
}

/**
 * @description: 打包配置任务列表 请求
 * @url: /api/hub/app-packages/jobs
 * @name: AppPackageJobsQueryDto
 */
export interface AppPackageJobsQueryDto {
  /**
   * 页码
   */
  page?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 打包配置ID
   */
  id: number;
  /**
   * 任务状态
   */
  status?: "pending" | "running" | "success" | "failed" | "cancelled";
  /**
   * 任务类型
   */
  jobType?: "build" | "sign" | "upload";
}

/**
 * @description: 上传图片 (Base64/URL) 请求
 * @url: /api/hub/upload/image
 * @name: UploadImageDto
 */
export interface UploadImageDto {
  /**
   * Base64 图片数据 (与 url 二选一)
   */
  base64?: string;
  /**
   * 远程图片 URL (与 base64 二选一)
   */
  url?: string;
  /**
   * 文件名 (可选，不传则自动生成)
   */
  filename?: string;
  /**
   * 目录类型: 1=common, 2=apk, 3=skin, 4=icon, 5=appPackage, 6=banner
   */
  folder: 1 | 2 | 3 | 4 | 5 | 6;
}

/**
 * @description: 上传图片 (Base64/URL) 响应
 * @url: /api/hub/upload/image
 * @name: UploadResultVO
 */
export interface UploadResultVO {
  /**
   * 文件访问 URL
   */
  url: string;
}

export type UploadResponseVO = UploadResultVO;

/**
 * @description: 上传文件 (Multipart) 响应
 * @url: /api/hub/upload/file
 * @name: UploadFileResultVO
 */
export interface UploadFileResultVO {
  /**
   * 文件访问 URL
   */
  url: string;
  /**
   * 原始文件名
   */
  filename?: string;
  /**
   * 文件大小 (bytes)
   */
  size?: number;
  /**
   * MIME 类型
   */
  mimeType?: string;
}

export type UploadFileResponseVO = UploadFileResultVO;

export interface MerchantSiteLayoutInfo {
  /**
   * ID
   */
  id: number;
  /**
   * 标识
   */
  key: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 客户端类型
   */
  clientType: string;
  /**
   * 预览图
   */
  layoutImage?: string;
}

export interface MerchantSiteThemeInfo {
  /**
   * ID
   */
  id: number;
  /**
   * 名称
   */
  name: string;
  /**
   * 主题编码
   */
  themeCode: string;
}

export interface MerchantSiteEditionInfo {
  /**
   * 版面ID
   */
  id: number;
  /**
   * 版面编码
   */
  code: string;
  /**
   * 版面名称
   */
  name: Record<string, any>;
  /**
   * 是否默认版面
   */
  isDefault: boolean;
  /**
   * 是否启用
   */
  enabled: boolean;
  /**
   * Web 版型
   */
  webLayout: MerchantSiteLayoutInfo;
  /**
   * 移动端版型
   */
  mobileLayout: MerchantSiteLayoutInfo;
  /**
   * 主题
   */
  theme: MerchantSiteThemeInfo;
}

export interface MerchantSiteItem {
  /**
   * 站点ID（tenantId）
   */
  id: number;
  /**
   * 集团ID
   */
  orgId: Record<string, any>;
  /**
   * 站点名称
   */
  name: Record<string, any>;
  /**
   * APP 名称
   */
  appName: Record<string, any>;
  /**
   * APP 图标
   */
  appIcon: Record<string, any>;
  /**
   * 版面列表（默认版面排第一）
   */
  editions: MerchantSiteEditionInfo[];
  /**
   * 域名数量
   */
  domainCount: number;
  /**
   * 创建人
   */
  createdBy: Record<string, any>;
  /**
   * 创建时间
   */
  createdAt: Date;
  /**
   * 更新时间
   */
  updatedAt: Date;
}

/**
 * @description: 站点列表 响应
 * @url: /api/hub/merchant/sites
 * @name: MerchantSiteListResponseVO
 */
export type MerchantSiteListResponseVO = MerchantSiteItem[];

/**
 * @description: 商户配置详情 请求
 * @url: /api/hub/merchant/detail
 * @name: MerchantDetailDto
 */
export interface MerchantDetailDto {
  /**
   * 租户ID（平台总控必传，商户端忽略）
   */
  tenantId?: number;
}

export interface AppInfo {
  /**
   * APP名称
   */
  appName?: Record<string, any>;
  /**
   * APP图标
   */
  appIcon?: Record<string, any>;
  /**
   * APP Logo
   */
  appLogo?: Record<string, any>;
  /**
   * 启动页图片
   */
  splashImage?: Record<string, any>;
}

export interface SiteInfo {
  /**
   * 站点名称（多语言）
   */
  siteName?: Record<string, any>;
  /**
   * 默认语言
   */
  defaultLanguage?: Record<string, any>;
  /**
   * 标题栏Logo
   */
  titleBarLogo?: Record<string, any>;
  /**
   * 站点Logo
   */
  siteLogo?: Record<string, any>;
  /**
   * 登录页Logo
   */
  loginLogo?: Record<string, any>;
  /**
   * PWA大图标 512×512
   */
  pwaLargeIcon?: Record<string, any>;
  /**
   * PWA中图标 384×384
   */
  pwaMediumIcon?: Record<string, any>;
  /**
   * PWA小图标 192×192
   */
  pwaSmallIcon?: Record<string, any>;
  /**
   * favicon 32×32
   */
  favicon?: Record<string, any>;
  /**
   * 登录页背景图
   */
  loginBgImage?: Record<string, any>;
  /**
   * 注册页背景图
   */
  registerBgImage?: Record<string, any>;
}

export interface SeoInfo {
  /**
   * 标题
   */
  title?: Record<string, any>;
  /**
   * 关键词
   */
  keywords?: Record<string, any>;
  /**
   * 描述
   */
  description?: Record<string, any>;
  /**
   * favicon
   */
  favicon?: Record<string, any>;
  /**
   * 自定义脚本
   */
  scripts?: Record<string, any>;
  /**
   * 宣传图
   */
  promoImage?: Record<string, any>;
}

export interface MerchantDomainInfo {
  /**
   * 域名ID
   */
  id: number;
  /**
   * 域名
   */
  domain: string;
  /**
   * 域名级SEO
   */
  seo?: SeoInfo;
}

/**
 * @description: 商户配置详情 响应
 * @url: /api/hub/merchant/detail
 * @name: MerchantDetailResponse
 */
export interface MerchantDetailResponse {
  /**
   * Web 版型标识
   */
  webLayoutKey: Record<string, any>;
  /**
   * 移动端版型标识
   */
  mobileLayoutKey: Record<string, any>;
  /**
   * 主题编码
   */
  themeCode: Record<string, any>;
  /**
   * 风格编码
   */
  styleCode: Record<string, any>;
  /**
   * APP配置
   */
  app: AppInfo;
  /**
   * 站点素材配置
   */
  site: SiteInfo;
  /**
   * 商户级SEO
   */
  seo: SeoInfo;
  /**
   * 域名列表
   */
  domains: MerchantDomainInfo[];
}

export type MerchantDetailResponseVO = MerchantDetailResponse;

/**
 * @description: 获取 TabBar 配置 请求
 * @url: /api/hub/merchant/tabbar
 * @name: MerchantTabBarDto
 */
export interface MerchantTabBarDto {
  /**
   * 租户ID（平台总控必传，商户端忽略）
   */
  tenantId?: number;
  /**
   * 版型ID
   */
  layoutId: number;
}

export interface TabBarOverrideItem {
  /**
   * 唯一标识
   */
  key: string;
  /**
   * 多语言名称
   */
  name?: Record<string, any>;
  /**
   * 是否启用
   */
  enabled?: boolean;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 图标资源键
   */
  iconKey?: string;
  /**
   * 激活图标资源键
   */
  iconActiveKey?: string;
  /**
   * 跳转类型
   */
  type?: string;
  /**
   * 跳转目标
   */
  target?: string;
  /**
   * 特殊类型
   */
  special?: number;
}

/**
 * @description: 获取 TabBar 配置 响应
 * @url: /api/hub/merchant/tabbar
 * @name: MerchantTabBarResponse
 */
export interface MerchantTabBarResponse {
  /**
   * 背景
   */
  background: Record<string, any>;
  /**
   * 子项列表
   */
  items: TabBarOverrideItem[];
}

export type MerchantTabBarResponseVO = MerchantTabBarResponse;

/**
 * @description: 保存 TabBar 覆盖配置 请求
 * @url: /api/hub/merchant/tabbar-save
 * @name: MerchantTabBarSaveDto
 */
export interface MerchantTabBarSaveDto {
  /**
   * 租户ID（平台总控必传，商户端忽略）
   */
  tenantId?: number;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 背景色
   */
  background?: string;
  /**
   * 覆盖子项列表
   */
  items?: TabBarOverrideItem[];
}

/**
 * @description: 获取游戏导航聚合配置 请求
 * @url: /api/hub/merchant/game-nav-detail
 * @name: MerchantGameNavDetailDto
 */
export interface MerchantGameNavDetailDto {
  /**
   * 租户ID（平台总控必传，商户端忽略）
   */
  tenantId?: number;
}

/**
 * @description: draft published
 */
export type GameNavStatus = "draft" | "published";

export interface MerchantGameNavGroupItem {
  /**
   * 分组业务键
   */
  groupKey: string;
  /**
   * 多语言标题（键为语言码，值为字符串）
   */
  title: Record<string, string>;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 默认展开
   */
  defaultOpen?: boolean;
  /**
   * 排序
   */
  sortNo?: number;
}

/**
 * @description: header sidebar quickLink footerAction
 */
export type GameNavItemScope = "header" | "sidebar" | "quickLink" | "footerAction";

/**
 * @description: route gameTab action
 */
export type GameNavTargetType = "route" | "gameTab" | "action";

/**
 * @description: service language download
 */
export type GameNavActionType = "service" | "language" | "download";

export interface MerchantGameNavItem {
  /**
   * 导航业务键
   */
  itemKey: string;
  /**
   * 作用域：header=顶部导航, sidebar=侧边栏, quickLink=快捷入口, footerAction=底部动作
   */
  scope: GameNavItemScope;
  /**
   * 所属分组键（sidebar 项必填）
   */
  groupKey?: string;
  /**
   * 多语言名称
   */
  name: Record<string, string>;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 角标
   */
  badge?: string;
  /**
   * 目标类型：route=前端路由, gameTab=跳转游戏分类, action=触发动作
   */
  targetType?: GameNavTargetType;
  /**
   * 目标值（route 为路径；gameTab 为 tabKey；action 为动作标识）
   */
  targetValue?: string;
  /**
   * 动作类型（scope=footerAction 时使用）
   */
  actionType?: GameNavActionType;
  /**
   * 排序
   */
  sortNo?: number;
  /**
   * 是否展示
   */
  visible?: boolean;
}

export interface MerchantGameTabItem {
  /**
   * 分类键
   */
  tabKey: string;
  /**
   * 多语言名称
   */
  name: Record<string, string>;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 选中图标
   */
  activeIcon?: string;
  /**
   * 分类图片 URL（Mobile 菜单图标）
   */
  image?: string;
  /**
   * 排序
   */
  sortNo?: number;
  /**
   * 是否展示
   */
  visible?: boolean;
}

/**
 * @description: manual auto hybrid
 */
export type GameSectionSourceMode = "manual" | "auto" | "hybrid";

/**
 * @description: hot recommend new rtp vendor category game_type custom_category vendor_group event_list
 */
export type MerchantGameSectionRuleType = "hot" | "recommend" | "new" | "rtp" | "vendor" | "category" | "game_type" | "custom_category" | "vendor_group" | "event_list";

/**
 * @description: clickCount sort createTime rtp
 */
export type MerchantGameSectionRuleSortBy = "clickCount" | "sort" | "createTime" | "rtp";

/**
 * @description: asc desc
 */
export type MerchantGameSectionRuleSortOrder = "asc" | "desc";

/**
 * @description: sport_match lottery_draw chess_room live_table
 */
export type MerchantGameSectionEventType = "sport_match" | "lottery_draw" | "chess_room" | "live_table";

export interface MerchantGameSectionRule {
  /**
   * 规则类型：hot/recommend/new/rtp 为通用排序；vendor/category/game_type/custom_category 按维度筛选；vendor_group 按厂商分组（配合 displayMode=vendor_group）；event_list 赛事/彩票/桌台列表（配合 displayMode=event_list）
   */
  ruleType: MerchantGameSectionRuleType;
  /**
   * 排序字段（不传由后端按 ruleType 推断默认值）：clickCount/sort/createTime/rtp
   */
  sortBy?: MerchantGameSectionRuleSortBy;
  /**
   * 排序方向（不传由后端按 ruleType 推断默认值）
   */
  sortOrder?: MerchantGameSectionRuleSortOrder;
  /**
   * 取数上限（event_list 模式下必填，其他模式可选）。event_list 表示前端拉赛事条数
   */
  limit?: number;
  /**
   * 厂商编码（ruleType=vendor 时必填）
   */
  vendorCode?: string;
  /**
   * 游戏大类编码（ruleType=category 时必填）
   */
  categoryType?: string;
  /**
   * 游戏类型编码（ruleType=game_type 时必填）
   */
  gameType?: string;
  /**
   * 自定义分类编码（ruleType=custom_category 时必填）
   */
  customCategoryCode?: string;
  /**
   * 排除的外部游戏ID 列表
   */
  excludeGameIds?: number[];
  /**
   * 厂商编码列表（ruleType=vendor_group 时必填、非空；展示顺序即数组顺序）
   */
  vendorCodes?: string[];
  /**
   * 每厂商展示游戏数（ruleType=vendor_group 时必填、正整数）
   */
  perVendorLimit?: number;
  /**
   * 是否展示厂商 Logo 头部（vendor_group 规则专属）
   */
  showVendorHeader?: boolean;
  /**
   * 事件类型（ruleType=event_list 时必填）。决定前端调哪个主平台 API、用哪个卡片组件：sport_match 体育赛事 / lottery_draw 彩票开奖 / chess_room 棋牌房间 / live_table 真人桌台
   */
  eventType?: MerchantGameSectionEventType;
  /**
   * 事件列表子筛选（event_list 规则专属）。按 eventType 不同语义不同：sport_match {sportType, league, status}；lottery_draw {lotteryTypes, showSubGames}；chess_room {gameTypes, stakeRange}；live_table {vendorCodes, showOnlineCount}
   */
  filter?: Record<string, any>;
}

/**
 * @description: grid scroll showcase featured vendor_group event_list
 */
export type DisplayMode = "grid" | "scroll" | "showcase" | "featured" | "vendor_group" | "event_list";

export interface MerchantGameSectionItem {
  /**
   * 楼层键
   */
  sectionKey: string;
  /**
   * 所属分类键
   */
  tabKey: string;
  /**
   * 多语言标题
   */
  title: Record<string, string>;
  /**
   * 多语言提示
   */
  tip?: Record<string, string>;
  /**
   * 厂商编码（手动模式下由所选游戏自动归一；自动模式下由规则决定）
   */
  vendorCode?: string;
  /**
   * 数据来源模式
   */
  sourceMode?: GameSectionSourceMode;
  /**
   * 自动取数规则（sourceMode=auto/hybrid 时使用）
   */
  rule?: MerchantGameSectionRule;
  /**
   * 展示数量
   */
  totalCount?: number;
  /**
   * 更多跳转路径
   */
  moreRoute?: string;
  /**
   * 楼层展示模式（数据层默认）：grid 标准网格 / scroll 横向滚动 / showcase 大卡片货架 / featured 推荐位 / vendor_group 厂商分组（需 rule.ruleType=vendor_group） / event_list 赛事列表（需 rule.ruleType=event_list）
   */
  displayMode?: DisplayMode;
  /**
   * grid 模式下每行列数
   */
  columns?: number;
  /**
   * 排序
   */
  sortNo?: number;
  /**
   * 是否展示
   */
  visible?: boolean;
}

export interface MerchantGameSectionGameItem {
  /**
   * 所属楼层键
   */
  sectionKey: string;
  /**
   * 外部游戏ID
   */
  externalGameId: number;
  /**
   * 厂商编码
   */
  vendorCode?: string;
  /**
   * 游戏编码
   */
  gameCode?: string;
  /**
   * 排序
   */
  sortNo?: number;
}

export interface MerchantGameNavConfig {
  /**
   * 侧边栏分组
   */
  groups: MerchantGameNavGroupItem[];
  /**
   * 导航项
   */
  items: MerchantGameNavItem[];
  /**
   * 分类 Tab
   */
  tabs: MerchantGameTabItem[];
  /**
   * 楼层
   */
  sections: MerchantGameSectionItem[];
  /**
   * 楼层游戏绑定
   */
  sectionGames: MerchantGameSectionGameItem[];
}

/**
 * @description: 获取游戏导航聚合配置 响应
 * @url: /api/hub/merchant/game-nav-detail
 * @name: MerchantGameNavDetailResponse
 */
export interface MerchantGameNavDetailResponse {
  /**
   * GameNav 主表 ID（null 表示尚未保存过）
   */
  versionId: number;
  /**
   * 发布状态
   */
  status: GameNavStatus;
  /**
   * Web 版型标识（来自租户默认 Edition）
   */
  webLayoutKey: string;
  /**
   * 移动端版型标识（来自租户默认 Edition）
   */
  mobileLayoutKey: string;
  /**
   * 主题编码（来自租户默认 Edition）
   */
  themeCode: string;
  /**
   * 游戏导航配置
   */
  config: MerchantGameNavConfig;
}

export type MerchantGameNavDetailResponseVO = MerchantGameNavDetailResponse;

/**
 * @description: 保存游戏导航草稿 请求
 * @url: /api/hub/merchant/game-nav-save
 * @name: MerchantGameNavSaveDto
 */
export interface MerchantGameNavSaveDto {
  /**
   * 租户ID（平台总控必传，商户端忽略）
   */
  tenantId?: number;
  /**
   * 游戏导航配置
   */
  config: MerchantGameNavConfig;
}

/**
 * @description: 发布游戏导航版本 请求
 * @url: /api/hub/merchant/game-nav-publish
 * @name: MerchantGameNavPublishDto
 */
export interface MerchantGameNavPublishDto {
  /**
   * 租户ID（平台总控必传，商户端忽略）
   */
  tenantId?: number;
}

export interface MerchantAppDto {
  /**
   * APP名称
   */
  appName?: string;
  /**
   * APP图标
   */
  appIcon?: string;
  /**
   * APP Logo
   */
  appLogo?: string;
  /**
   * 启动页图片
   */
  splashImage?: string;
}

export interface MerchantSiteDto {
  /**
   * 站点名称（多语言 { zh, en }）
   */
  siteName?: Record<string, any>;
  /**
   * 默认语言
   */
  defaultLanguage?: string;
  /**
   * 标题栏Logo
   */
  titleBarLogo?: string;
  /**
   * 站点Logo
   */
  siteLogo?: string;
  /**
   * 登录页Logo
   */
  loginLogo?: string;
  /**
   * PWA大图标 512×512
   */
  pwaLargeIcon?: string;
  /**
   * PWA中图标 384×384
   */
  pwaMediumIcon?: string;
  /**
   * PWA小图标 192×192
   */
  pwaSmallIcon?: string;
  /**
   * favicon 32×32
   */
  favicon?: string;
  /**
   * 登录页背景图
   */
  loginBgImage?: string;
  /**
   * 注册页背景图
   */
  registerBgImage?: string;
}

export interface MerchantSeoDto {
  /**
   * 标题
   */
  title?: string;
  /**
   * 关键词
   */
  keywords?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * favicon
   */
  favicon?: string;
  /**
   * 自定义脚本
   */
  scripts?: string;
  /**
   * 宣传图
   */
  promoImage?: string;
}

export interface DomainSeoItem {
  /**
   * 域名ID
   */
  domainId: number;
  /**
   * 标题
   */
  title?: string;
  /**
   * 关键词
   */
  keywords?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * favicon
   */
  favicon?: string;
  /**
   * 自定义脚本
   */
  scripts?: string;
  /**
   * 宣传图
   */
  promoImage?: string;
}

/**
 * @description: 保存商户配置 请求
 * @url: /api/hub/merchant/save
 * @name: MerchantSaveDto
 */
export interface MerchantSaveDto {
  /**
   * 租户ID（平台总控必传，商户端忽略）
   */
  tenantId?: number;
  /**
   * Web 版型标识
   */
  webLayoutKey?: Record<string, any>;
  /**
   * 移动端版型标识
   */
  mobileLayoutKey?: Record<string, any>;
  /**
   * 主题编码
   */
  themeCode?: Record<string, any>;
  /**
   * 风格编码
   */
  styleCode?: Record<string, any>;
  /**
   * APP配置
   */
  app?: MerchantAppDto;
  /**
   * 站点素材配置
   */
  site?: MerchantSiteDto;
  /**
   * 商户级SEO配置
   */
  seo?: MerchantSeoDto;
  /**
   * 域名级SEO配置列表
   */
  domainSeo?: DomainSeoItem[];
}

/**
 * @description: 前端初始化配置 请求
 * @url: /api/hub/web/config
 * @name: WebConfigDto
 */
export interface WebConfigDto {
  /**
   * 商户ID
   */
  tenantId: number;
}

export interface WebLayoutInfo {
  /**
   * 版型ID
   */
  id: number;
  /**
   * 版型名称
   */
  name: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
}

export interface WebThemeInfo {
  /**
   * 主题ID
   */
  id: number;
  /**
   * 主题名称
   */
  name: string;
  /**
   * 主题编码
   */
  themeCode: string;
  /**
   * 主题主色值
   */
  colorValue?: Record<string, any>;
}

export interface WebStyleInfo {
  /**
   * 风格ID
   */
  id: number;
  /**
   * 风格名称
   */
  name: string;
  /**
   * 风格编码
   */
  styleCode: string;
}

export interface WebSeoInfo {
  /**
   * 标题
   */
  title?: Record<string, any>;
  /**
   * 关键词
   */
  keywords?: Record<string, any>;
  /**
   * 描述
   */
  description?: Record<string, any>;
  /**
   * 自定义脚本
   */
  scripts?: Record<string, any>;
  /**
   * favicon
   */
  favicon?: Record<string, any>;
  /**
   * 宣传图
   */
  promoImage?: Record<string, any>;
}

export interface WebTabBarItemInfo {
  /**
   * TabBarItem ID
   */
  id: number;
  /**
   * 多语言名称
   */
  name: Record<string, any>;
  /**
   * 唯一标识
   */
  key?: Record<string, any>;
  /**
   * 图标Key
   */
  iconKey?: Record<string, any>;
  /**
   * 激活状态图标Key
   */
  iconActiveKey?: Record<string, any>;
  /**
   * 跳转类型
   */
  targetType: "route" | "url" | "game";
  /**
   * 跳转目标
   */
  target?: Record<string, any>;
  /**
   * 特殊类型
   */
  special: number;
  /**
   * 排序
   */
  sortOrder: number;
  /**
   * 是否可见
   */
  visible: boolean;
}

export interface WebTabBarInfo {
  /**
   * TabBar ID
   */
  id: number;
  /**
   * TabBar唯一标识
   */
  key: string;
  /**
   * 客户端类型
   */
  clientType: "web" | "h5" | "ios" | "android" | "app" | "public";
  /**
   * 名称
   */
  name?: Record<string, any>;
  /**
   * 背景
   */
  background?: Record<string, any>;
  /**
   * TabBar项列表
   */
  items: WebTabBarItemInfo[];
}

/**
 * @description: 前端初始化配置 响应
 * @url: /api/hub/web/config
 * @name: WebConfigResponse
 */
export interface WebConfigResponse {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 商户名称
   */
  tenantName: Record<string, any>;
  /**
   * APP 配置（appName / appIcon / appLogo / splashImage）
   */
  appConfig: Record<string, any>;
  /**
   * 站点配置（站点素材 + Footer）
   */
  siteConfig: Record<string, any>;
  /**
   * PC 版型
   */
  webLayout: WebLayoutInfo;
  /**
   * H5/APP 版型
   */
  mobileLayout: WebLayoutInfo;
  /**
   * 主题信息
   */
  theme: WebThemeInfo;
  /**
   * 风格信息
   */
  style: WebStyleInfo;
  /**
   * SEO信息
   */
  seo: WebSeoInfo;
  /**
   * H5/APP TabBar
   */
  tabBar: WebTabBarInfo;
}

export type WebConfigResponseVO = WebConfigResponse;

/**
 * @description: 获取租户游戏导航 请求
 * @url: /api/hub/web/game
 * @name: WebGameDto
 */
export interface WebGameDto {
  /**
   * 商户ID
   */
  tenantId: number;
  /**
   * 客户端类型
   */
  clientType?: "web" | "h5" | "ios" | "android" | "app" | "public";
}

export interface WebGameNavItemInfo {
  /**
   * 导航项标识
   */
  itemKey: string;
  /**
   * 作用域
   */
  scope: "header" | "sidebar" | "quickLink" | "footerAction";
  /**
   * 所属分组Key
   */
  groupKey?: Record<string, any>;
  /**
   * 多语言名称
   */
  name: Record<string, any>;
  /**
   * 图标
   */
  icon?: Record<string, any>;
  /**
   * 角标
   */
  badge?: Record<string, any>;
  /**
   * 跳转类型
   */
  targetType?: "route" | "gameTab" | "action";
  /**
   * 跳转目标
   */
  targetValue?: Record<string, any>;
  /**
   * 动作类型
   */
  actionType?: "service" | "language" | "download";
  /**
   * 排序
   */
  sortOrder: number;
  /**
   * 是否可见
   */
  visible: boolean;
}

export interface WebSidebarGroupInfo {
  /**
   * 分组标识
   */
  groupKey: string;
  /**
   * 多语言标题
   */
  title: Record<string, any>;
  /**
   * 图标
   */
  icon?: Record<string, any>;
  /**
   * 默认展开
   */
  defaultOpen: boolean;
  /**
   * 排序
   */
  sortOrder: number;
  /**
   * 属于该分组的侧边栏项（scope=sidebar）
   */
  items: WebGameNavItemInfo[];
}

export interface WebGameSectionGameInfo {
  /**
   * 外部游戏ID
   */
  externalGameId: number;
  /**
   * 厂商编码
   */
  vendorCode?: Record<string, any>;
  /**
   * 游戏编码
   */
  gameCode?: Record<string, any>;
  /**
   * 排序
   */
  sortOrder: number;
}

export interface WebGameSectionInfo {
  /**
   * 分区标识
   */
  sectionKey: string;
  /**
   * 多语言标题
   */
  title: Record<string, string>;
  /**
   * 多语言提示
   */
  tip?: Record<string, string>;
  /**
   * 厂商编码
   */
  vendorCode?: string;
  /**
   * 数据来源模式
   */
  sourceMode: "manual" | "auto" | "hybrid";
  /**
   * 自动模式规则（sourceMode=auto/hybrid 时前端按此拉数据；manual 为 null）
   */
  rule?: Record<string, any>;
  /**
   * 展示数量
   */
  totalCount?: number;
  /**
   * 更多路由
   */
  moreRoute?: string;
  /**
   * 楼层展示模式：grid 标准网格 / scroll 横向滚动 / showcase 大卡片货架 / featured 推荐位 / vendor_group 厂商分组 / event_list 赛事列表
   */
  displayMode: DisplayMode;
  /**
   * grid 模式下每行列数
   */
  columns?: number;
  /**
   * 排序
   */
  sortOrder: number;
  /**
   * 是否可见
   */
  visible: boolean;
  /**
   * 游戏列表
   */
  games: WebGameSectionGameInfo[];
}

export interface WebGameTabWithSectionsInfo {
  /**
   * 标签标识
   */
  tabKey: string;
  /**
   * 多语言名称
   */
  name: Record<string, string>;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 激活图标
   */
  activeIcon?: string;
  /**
   * 分类图片 URL（Mobile 菜单图标）
   */
  image?: string;
  /**
   * 排序
   */
  sortOrder: number;
  /**
   * 是否可见
   */
  visible: boolean;
  /**
   * 嵌套的楼层列表
   */
  sections: WebGameSectionInfo[];
}

/**
 * @description: 获取租户游戏导航 响应
 * @url: /api/hub/web/game
 * @name: WebGameResponse
 */
export interface WebGameResponse {
  /**
   * 游戏导航ID
   */
  gameNavId: number;
  /**
   * 侧边栏分组（含嵌套的 sidebar 导航项）
   */
  sidebarGroups: WebSidebarGroupInfo[];
  /**
   * 顶部导航项（scope=header）
   */
  headerItems: WebGameNavItemInfo[];
  /**
   * 快捷入口（scope=quick_link）
   */
  quickLinks: WebGameNavItemInfo[];
  /**
   * 底部动作（scope=footer_action）
   */
  footerActions: WebGameNavItemInfo[];
  /**
   * 游戏分类 Tab 列表（每个 Tab 内嵌对应楼层）
   */
  tabs: WebGameTabWithSectionsInfo[];
}

export type WebGameResponseVO = WebGameResponse;

/**
 * @description: 上传文件 (Multipart) 请求
 * @url: /api/hub/upload/file
 * @name: UploadFileFormDto
 */
export interface UploadFileFormDto {
  /**
   * 上传的文件
   */
  file: string;
}

