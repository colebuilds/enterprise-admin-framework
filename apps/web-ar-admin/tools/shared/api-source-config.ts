export interface SharedApiSourceConfig {
  url: string;
  module: string;
  prefix?: string;
  baseUrl?: string;
  fullUrl?: boolean;
  enabled?: boolean;
  optional?: boolean;
}

export interface SharedApiSourceOptions {
  adminApiDocBase: string;
  assistantSwaggerUrl?: string;
  eventSwaggerUrl?: string;
  hubSwaggerUrl?: string;
}

export const DEFAULT_ADMIN_API_DOC_BASE =
  'https://dev-adminapi.lottotest6688.com/api-doc/';
export const DEFAULT_ASSISTANT_SWAGGER_URL =
  'https://dev-nestjs-ai.lottotest6688.com/api/ai/doc/swagger.json';
export const DEFAULT_EVENT_SWAGGER_URL =
  'https://dev-nestjs-admin.lottotest6688.com/api/event/doc/swagger.json';
export const DEFAULT_HUB_SWAGGER_URL =
  'https://dev-nestjs-hub.lottotest6688.com/api/hub/doc/swagger.json';

const KNOWLEDGE_ADMIN_MODULE_SOURCES: SharedApiSourceConfig[] = [
  { url: 'ThirdGame/swagger.json', module: 'thirdgame' },
];

export function createPrimaryApiSources(
  options: SharedApiSourceOptions,
): SharedApiSourceConfig[] {
  const {
    adminApiDocBase,
    assistantSwaggerUrl = DEFAULT_ASSISTANT_SWAGGER_URL,
    eventSwaggerUrl = DEFAULT_EVENT_SWAGGER_URL,
    hubSwaggerUrl = DEFAULT_HUB_SWAGGER_URL,
  } = options;

  return [
    {
      url: assistantSwaggerUrl,
      module: 'assistant',
      fullUrl: true,
      optional: true,
    },
    {
      url: eventSwaggerUrl,
      module: 'event',
      fullUrl: true,
      optional: true,
    },
    {
      url: hubSwaggerUrl,
      module: 'hub',
      fullUrl: true,
      optional: true,
    },
    {
      url: 'system/swagger.json',
      module: 'system',
      baseUrl: adminApiDocBase,
    },
    {
      url: 'Common/swagger.json',
      module: 'common',
      baseUrl: adminApiDocBase,
    },
    {
      url: 'Admin/swagger.json',
      module: 'admin',
      baseUrl: adminApiDocBase,
    },
    {
      url: 'Tenant/swagger.json',
      module: 'tenant',
      baseUrl: adminApiDocBase,
    },
    {
      url: 'V1Platform/swagger.json',
      module: 'v1platform',
      baseUrl: adminApiDocBase,
      optional: true,
    },
    {
      url: 'Recharge/swagger.json',
      module: 'recharge',
      baseUrl: adminApiDocBase,
      optional: true,
    },
    {
      url: 'Withdraw/swagger.json',
      module: 'withdraw',
      baseUrl: adminApiDocBase,
      optional: true,
    },
    {
      url: 'PlatformTools/swagger.json',
      module: 'platformtools',
      baseUrl: adminApiDocBase,
      optional: true,
    },
    {
      url: 'Report/swagger.json',
      module: 'report',
      baseUrl: adminApiDocBase,
      optional: true,
    },
  ];
}

export function createKnowledgeApiSources(
  options: SharedApiSourceOptions,
): SharedApiSourceConfig[] {
  return [
    ...createPrimaryApiSources(options),
    ...KNOWLEDGE_ADMIN_MODULE_SOURCES.map((source) => ({
      ...source,
      baseUrl: options.adminApiDocBase,
    })),
  ];
}
