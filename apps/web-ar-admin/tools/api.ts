import type { SharedApiSourceConfig } from './shared/api-source-config';

import * as fs from 'node:fs';
import * as path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import {
  createPrimaryApiSources,
  DEFAULT_ADMIN_API_DOC_BASE,
} from './shared/api-source-config';
import {
  cleanPath,
  extractPathParams,
  extractTypeFromRef,
  generateUniqueFuncName,
  getShortName,
  loadOpenApiDocument,
  resolveApiSource,
  toUpperCaseFirst,
} from './shared/openapi-core';

// ES modules 中获取当前文件目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置常量
const CONFIG = {
  // 使用相对于当前脚本文件的路径，确保始终生成到 src/api 目录
  BASE_PATH: path.resolve(__dirname, '../src/api'),
  DEFAULT_IMPORTS: ['ApiResponse'],
  IMPORT: `import { requestClient, uploadFile } from '#/api/request';`,
};

// 类型定义
interface ApiGroup {
  apis: string[];
  imports: string[];
}
interface ApiSource {
  url: string;
  prefix?: string;
  module: string;
  baseUrl?: string;
  fullUrl?: boolean;
}
interface ProcessedApi {
  url: string;
  method: string;
  funcName: string;
  reqName: string;
  reqOptional: boolean;
  rspName: string;
  summary: string;
  tags: string;
  sourcePrefix: string;
  /** multipart/form-data 且含 binary 字段时为 true */
  isUpload?: boolean;
  /** 上传文件的字段名（如 "File"） */
  uploadFieldName?: string;
}

interface OpenApiSchema {
  type?: string;
  format?: string;
  items?: any;
  $ref?: string;
  properties?: Record<string, any>;
  additionalProperties?: any;
  enum?: any[];
  description?: string;
  required?: string[];
  allOf?: OpenApiSchema[];
  oneOf?: OpenApiSchema[];
  anyOf?: OpenApiSchema[];
}

interface OpenApiPath {
  [method: string]: {
    operationId?: string;
    parameters?: Array<{
      description?: string;
      in?: 'cookie' | 'header' | 'path' | 'query';
      name: string;
      required?: boolean;
      schema?: OpenApiSchema;
    }>;
    requestBody?: {
      content: {
        'application/json'?: {
          schema: { $ref: string };
        };
        'multipart/form-data'?: any;
      };
    };
    responses: {
      [code: string]: {
        content?: {
          'application/json'?: {
            schema?: { $ref?: string };
          };
        };
      };
    };
    summary: string;
    tags: string[];
  };
}

// API 处理器类
class ApiProcessor {
  private apiGroups: Map<string, ApiGroup> = new Map();
  private conflictingShortNames: Set<string> = new Set(); // 存储有冲突的短名称
  private functionNameMap: Map<string, string> = new Map(); // 存储 URL 到函数名的映射
  private functionNames: Set<string> = new Set();
  private pendingApis: Array<{
    method: string;
    methodSchema: any;
    sourcePrefix: string;
    url: string;
  }> = [];
  private processedApis: ProcessedApi[] = [];
  private schemas: Record<string, OpenApiSchema> = {}; // 存储 schemas 用于解析响应类型

  /**
   * 第一遍：收集所有 API，检测短名称冲突
   */
  collectApiPath(
    url: string,
    pathSchema: OpenApiPath,
    sourcePrefix: string,
  ): void {
    for (const [method, methodSchema] of Object.entries(pathSchema)) {
      if (!methodSchema.tags?.length) {
        console.warn(`接口缺少tags字段: ${url}`);
        continue;
      }
      this.pendingApis.push({ url, method, methodSchema, sourcePrefix });
    }
  }

  /**
   * 获取处理结果
   */
  getGroups(): Map<string, ApiGroup> {
    return this.apiGroups;
  }

  /**
   * 获取所有处理过的 API
   */
  getProcessedApis(): ProcessedApi[] {
    return this.processedApis;
  }

  /**
   * 检测冲突并处理所有收集的 API
   */
  processCollectedApis(): void {
    // 统计短名称出现次数
    const shortNameCount = new Map<string, number>();
    for (const api of this.pendingApis) {
      const shortName = getShortName(api.url);
      shortNameCount.set(shortName, (shortNameCount.get(shortName) || 0) + 1);
    }

    // 找出有冲突的短名称（出现次数 > 1）
    for (const [name, count] of shortNameCount) {
      if (count > 1) {
        this.conflictingShortNames.add(name);
      }
    }

    // 第二遍：生成最终函数名
    for (const api of this.pendingApis) {
      this.processApiPath(
        api.url,
        api.method,
        api.methodSchema,
        api.sourcePrefix,
      );
    }
  }

  /**
   * 设置 schemas 引用
   */
  setSchemas(schemas: Record<string, OpenApiSchema>): void {
    this.schemas = schemas;
  }

  /**
   * 添加到分组
   */
  private addToGroup(api: ProcessedApi): void {
    if (!this.apiGroups.has(api.tags)) {
      this.apiGroups.set(api.tags, { apis: [], imports: [] });
    }

    const group = this.apiGroups.get(api.tags)!;

    // 生成 API 代码
    const apiCode = this.generateApiCode(api);
    group.apis.push(apiCode);

    // 收集导入
    if (api.reqName) {
      group.imports.push(api.reqName);
    }
    if (api.rspName && api.rspName !== 'ApiResponse') {
      group.imports.push(api.rspName);
    }
  }

  /**
   * 提取请求类型
   * 支持 application/json（$ref）和 multipart/form-data（内联 schema）
   */
  private extractRequestType(
    methodSchema: any,
    funcName: string,
    method: string,
  ): { name: string; optional: boolean } {
    // 1. 优先检查 application/json
    const jsonRef =
      methodSchema.requestBody?.content?.['application/json']?.schema?.$ref;
    if (jsonRef) {
      const reqName = extractTypeFromRef(jsonRef);
      return {
        name: ['ApiRequest'].includes(reqName) ? '' : reqName,
        optional: false,
      };
    }

    // 2. 检查 multipart/form-data
    const multipartSchema =
      methodSchema.requestBody?.content?.['multipart/form-data']?.schema;
    if (multipartSchema) {
      if (multipartSchema.$ref) {
        const reqName = extractTypeFromRef(multipartSchema.$ref);
        return {
          name: ['ApiRequest'].includes(reqName) ? '' : reqName,
          optional: false,
        };
      }

      // 内联 object schema：基于 operationId 或 funcName 生成类型名，注入到 schemas 中
      if (multipartSchema.type === 'object' && multipartSchema.properties) {
        const operationId = methodSchema.operationId || funcName || '';
        const typeName = this.generateInlineTypeName(operationId);
        if (typeName && this.schemas) {
          this.schemas[typeName] = multipartSchema;
        }
        return { name: typeName, optional: false };
      }
    }

    // 3. GET query parameters: 生成内联 DTO，确保前端函数签名可带 params
    const queryParameters =
      method.toLowerCase() === 'get'
        ? (methodSchema.parameters || []).filter(
            (parameter: any) => parameter?.in === 'query' && parameter?.name,
          )
        : [];
    if (queryParameters.length > 0) {
      const typeName = `${toUpperCaseFirst(funcName)}QueryDto`;
      const properties: Record<string, OpenApiSchema> = {};
      for (const parameter of queryParameters) {
        properties[parameter.name] = {
          ...parameter.schema,
          description: parameter.description || parameter.schema?.description,
        };
      }
      const required = queryParameters
        .filter((parameter: any) => parameter.required)
        .map((parameter: any) => parameter.name);

      if (this.schemas) {
        this.schemas[typeName] = {
          type: 'object',
          properties,
          required,
        };
      }

      return { name: typeName, optional: required.length === 0 };
    }

    return { name: '', optional: false };
  }

  /**
   * 提取响应类型
   * 如果响应类型是包装类型（如 xxxResponseVO），则自动提取内部 data 字段的类型
   */
  private extractResponseType(methodSchema: any): string {
    const rsp200 =
      methodSchema.responses['200']?.content?.['application/json']?.schema
        ?.$ref;
    const rsp0 =
      methodSchema.responses['0']?.content?.['application/json']?.schema?.$ref;

    const typeName = extractTypeFromRef(rsp200 || rsp0);

    if (!typeName || !this.schemas) {
      return typeName;
    }

    // 检查是否是响应包装类型，如果是则提取内部 data 类型
    return this.unwrapResponseType(typeName);
  }

  /**
   * 生成 API 函数代码
   * 若请求类型含 isExport 字段，额外生成 ${funcName}Export blob 下载版本
   */
  private generateApiCode(api: ProcessedApi): string {
    const { funcName, method, url, reqName, reqOptional, rspName, summary } =
      api;
    const cleanUrl = cleanPath(url);
    const pathParams = extractPathParams(url);
    const hasPathParams = pathParams.length > 0;
    const responseType = rspName === 'ApiResponse' ? 'any' : rspName || 'any';

    // 构建参数列表
    const paramsList: string[] = [];
    const paramComments: string[] = [];

    // 添加路径参数
    for (const param of pathParams) {
      paramsList.push(`${param}: string`);
      paramComments.push(` * @param ${param} 路径参数`);
    }

    // multipart/form-data 上传接口：生成 http.uploadFile 调用
    if (api.isUpload) {
      paramsList.push('file: File');
      paramComments.push(` * @param file 上传文件`);
      if (reqName) {
        paramsList.push(
          `params${reqOptional ? '?' : ''}: Omit<${reqName}, '${api.uploadFieldName || 'File'}'>`,
        );
        paramComments.push(` * @param {${reqName}} params`);
      }
      const params = paramsList.join(', ');
      const paramComment =
        paramComments.length > 0 ? `${paramComments.join('\n')}\n` : '';
      const fieldName = api.uploadFieldName || 'File';
      const extraParams = reqName ? ', ...params' : '';

      return `/**
 * @description: ${summary}
${paramComment} * @url: ${url}
 */
export const ${funcName} = (${params}) => {
  return uploadFile<${responseType}>({ url: '${cleanUrl}' }, { files: [file]${extraParams} }, '${fieldName}');
}`;
    }

    // 添加请求体参数
    if (reqName) {
      paramsList.push(`params${reqOptional ? '?' : ''}: ${reqName}`);
      paramComments.push(` * @param {${reqName}} params`);
    }

    const params = paramsList.join(', ');
    const paramComment =
      paramComments.length > 0 ? `${paramComments.join('\n')}\n` : '';
    // 使用模板字符串还是普通字符串
    const urlQuote = hasPathParams ? '`' : "'";

    // patch 走 requestClient.request，其余走具名方法
    let mainFunc: string;
    if (method === 'patch') {
      const dataArg = reqName ? ', params' : '';
      mainFunc = `/**
 * @description: ${summary}
${paramComment} * @url: ${url}
 */
export const ${funcName} = (${params}) => {
  return requestClient.request<${responseType}>(${urlQuote}${cleanUrl}${urlQuote}, { method: 'PATCH'${dataArg ? ', data: params' : ''} });
}`;
    } else {
      // GET/DELETE 的 query 参数包裹成 { params }，POST/PUT 直接传 data
      const requestParam = reqName
        ? (method === 'get' || method === 'delete'
          ? ', { params }'
          : ', params')
        : '';
      mainFunc = `/**
 * @description: ${summary}
${paramComment} * @url: ${url}
 */
export const ${funcName} = (${params}) => {
  return requestClient.${method}<${responseType}>(${urlQuote}${cleanUrl}${urlQuote}${requestParam});
}`;
    }

    // 若请求类型含 isExport 字段，额外生成 blob 导出版本（供 downloadApiResponse 使用）
    if (method === 'post' && reqName && this.hasIsExportField(reqName)) {
      const exportFunc = `/**
 * @description: ${summary}（导出，返回原生 blob 响应）
${paramComment} * @url: ${url}
 */
export const ${funcName}Export = (${params}) => {
  return requestClient.post<Blob>('${cleanUrl}', params, { responseType: 'blob' });
}`;
      return `${mainFunc}\n${exportFunc}`;
    }

    return mainFunc;
  }

  /**
   * 根据 operationId 生成内联类型名，避免与已有 schema 冲突
   */
  private generateInlineTypeName(operationId: string): string {
    if (!operationId) return '';
    const parts = operationId.split('_');
    const methodName = parts.length > 1 ? parts[parts.length - 1] : parts[0];
    let typeName = `${toUpperCaseFirst(methodName)}FormDto`;

    if (this.schemas && this.schemas[typeName]) {
      let counter = 2;
      while (this.schemas[`${typeName}${counter}`]) {
        counter++;
      }
      typeName = `${typeName}${counter}`;
    }

    return typeName;
  }

  /**
   * 检测请求类型是否含 isExport 字段（用于决定是否生成 blob 导出版本）
   */
  private hasIsExportField(reqName: string): boolean {
    if (!reqName || !this.schemas) return false;
    const schema = this.schemas[reqName];
    return !!(schema?.properties && 'isExport' in schema.properties);
  }

  /**
   * 处理单个 API 路径
   */
  private processApiPath(
    url: string,
    method: string,
    methodSchema: any,
    sourcePrefix: string,
  ): void {
    const tags = methodSchema.tags[0];
    const funcName = generateUniqueFuncName(
      url,
      method,
      this.functionNames,
      this.conflictingShortNames,
    );

    this.functionNames.add(funcName);
    this.functionNameMap.set(`${url}_${method}`, funcName);

    const requestType = this.extractRequestType(methodSchema, funcName, method);

    // 检测 multipart/form-data 上传（含 binary 字段）
    const multipartProps =
      methodSchema.requestBody?.content?.['multipart/form-data']?.schema
        ?.properties;
    let isUpload = false;
    let uploadFieldName: string | undefined;
    if (multipartProps) {
      for (const [key, prop] of Object.entries<any>(multipartProps)) {
        if (prop?.format === 'binary') {
          isUpload = true;
          uploadFieldName = key;
          break;
        }
      }
    }

    const processedApi: ProcessedApi = {
      url,
      method,
      funcName,
      reqName: requestType.name,
      reqOptional: requestType.optional,
      rspName: this.extractResponseType(methodSchema),
      summary: methodSchema.summary || '暂无描述',
      tags,
      sourcePrefix,
      isUpload,
      uploadFieldName,
    };

    this.processedApis.push(processedApi);
    this.addToGroup(processedApi);
  }

  /**
   * 解包响应类型
   * 如果类型是包装类型（包含 data, msg/code 字段），返回 data 字段的类型
   */
  private unwrapResponseType(typeName: string): string {
    const schema = this.schemas[typeName];

    if (!schema || !schema.properties) {
      return typeName;
    }

    // 检查是否是响应包装类型（包含 data 和 msg/code/msgCode 字段）
    const hasData = 'data' in schema.properties;
    const hasWrapper =
      'msg' in schema.properties ||
      'code' in schema.properties ||
      'msgCode' in schema.properties;

    if (!hasData || !hasWrapper) {
      return typeName;
    }

    // 获取 data 字段的类型
    const dataSchema = schema.properties.data as OpenApiSchema;

    if (!dataSchema) {
      return typeName;
    }

    // 如果 data 是引用类型，返回引用的类型名
    if (dataSchema.$ref) {
      return extractTypeFromRef(dataSchema.$ref);
    }

    // 如果 data 是 allOf，尝试提取第一个引用
    if (dataSchema.allOf && dataSchema.allOf.length > 0) {
      for (const item of dataSchema.allOf) {
        if (item.$ref) {
          return extractTypeFromRef(item.$ref);
        }
      }
    }

    // 其他情况返回原类型名
    return typeName;
  }
}

// 类型生成器类
class TypeGenerator {
  /**
   * 生成 TypeScript 类型定义
   */
  generateTypes(openApiObject: any, processedApis: ProcessedApi[]): string {
    const components = openApiObject.components;
    let typeDefinitions = '';

    if (!components?.schemas) {
      return typeDefinitions;
    }

    const schemas = components.schemas;
    const processedTypes = new Set<string>();

    for (const [name, schema] of Object.entries(schemas)) {
      if (this.shouldSkipType(name)) {
        continue;
      }

      // 避免重复处理
      if (processedTypes.has(name)) {
        continue;
      }

      const definition = this.processSchema(
        name,
        schema as OpenApiSchema,
        schemas,
        processedApis,
      );

      if (definition) {
        typeDefinitions += definition;
        processedTypes.add(name);
      }
    }

    return typeDefinitions;
  }

  /**
   * 生成类型描述注释
   */
  private generateDescription(
    name: string,
    processedApis: ProcessedApi[],
  ): string {
    for (const api of processedApis) {
      if (api.reqName === name) {
        return `/**
 * @description: ${api.summary} 请求
 * @url: ${api.url}
 * @name: ${name}
 */
`;
      }
      if (api.rspName === name) {
        return `/**
 * @description: ${api.summary} 响应
 * @url: ${api.url}
 * @name: ${name}
 */
`;
      }
    }
    return '';
  }

  /**
   * 生成枚举类型
   */
  private generateEnumType(
    name: string,
    schema: OpenApiSchema,
    description: string,
  ): string {
    const types = this.getEnumTypeLiterals(schema);

    const enumComment = `/**
 * @description: ${schema.enum!.join(' ')}
 */
`;

    return `${enumComment}${description}export type ${name} = ${types.join(' | ')};\n\n`;
  }

  /**
   * 生成接口类型
   */
  private generateInterfaceType(
    name: string,
    schema: OpenApiSchema,
    schemas: Record<string, OpenApiSchema>,
    description: string,
  ): string {
    let fields = '';
    let processedSchema = schema;

    // 特殊处理 ApiResponse
    if (name === 'ApiResponse') {
      fields += `  data: T;\n`;
      fields += `  code: number;\n`;
      return `${description}export interface ${name}<T = any> {
${fields}}\n\n`;
    }

    // 检查是否是响应包装类型（包含 data, code 等字段）
    const isResponseWrapper =
      schema.properties &&
      'data' in schema.properties &&
      ('code' in schema.properties || 'msg' in schema.properties);

    // 如果是响应包装类型，但不是 ApiResponse，则提取 data 字段的内容
    if (isResponseWrapper && name !== 'ApiResponse') {
      // @ts-expect-error
      const dataSchema = schema.properties.data as OpenApiSchema;

      // 如果 data 是引用类型，直接返回类型别名
      if (dataSchema.$ref) {
        const refType = extractTypeFromRef(dataSchema.$ref);
        return `${description}export type ${name} = ${refType};\n\n`;
      }

      // 如果 data 使用 allOf，提取引用类型
      if (dataSchema.allOf && dataSchema.allOf.length > 0) {
        for (const item of dataSchema.allOf) {
          if (item.$ref) {
            const refType = extractTypeFromRef(item.$ref);
            return `${description}export type ${name} = ${refType};\n\n`;
          }
        }
        // 如果 allOf 中没有直接引用，使用交叉类型
        const types = dataSchema.allOf
          .map((s) => this.mapTypeToTypescript(s, schemas))
          .filter((t) => t !== 'any');
        if (types.length > 0) {
          return `${description}export type ${name} = ${types.join(' & ')};\n\n`;
        }
      }

      // 如果 data 是数组类型
      if (dataSchema.type === 'array' && dataSchema.items) {
        const itemType = this.mapTypeToTypescript(dataSchema.items, schemas);
        return `${description}export type ${name} = ${itemType}[];\n\n`;
      }

      // 如果 data 有属性，使用 data 的属性
      if (dataSchema.properties) {
        processedSchema = dataSchema;
      }
      // 如果 data 是基本类型
      else if (dataSchema.type) {
        const basicType = this.mapTypeToTypescript(dataSchema, schemas);
        return `${description}export type ${name} = ${basicType};\n\n`;
      }
    }

    // 判断是否是响应类型（响应类型的字段都不加可选标记）
    const isResponseType =
      isResponseWrapper ||
      name.endsWith('Rsp') ||
      name.endsWith('Response') ||
      name.endsWith('Vo');

    // 获取必填字段列表（排除被跳过的属性）
    const requiredFields = new Set(
      (processedSchema.required || []).filter(
        (field) => !this.shouldSkipProperty(field, name, isResponseWrapper),
      ),
    );

    // 处理属性
    if (processedSchema.properties) {
      for (const [propName, propSchema] of Object.entries(
        processedSchema.properties,
      )) {
        if (this.shouldSkipProperty(propName, name, isResponseWrapper)) {
          continue;
        }

        const propType = this.mapTypeToTypescript(propSchema, schemas);
        const propDescription = propSchema.description || '';
        // 响应类型所有字段都不加可选标记，请求类型根据 required 判断
        const isRequired = isResponseType || requiredFields.has(propName);
        const optionalMark = isRequired ? '' : '?';

        fields += `  /**\n   * ${propDescription}\n   */\n`;
        fields += `  ${propName}${optionalMark}: ${propType};\n`;
      }
    }

    // 处理附加属性
    if (processedSchema.additionalProperties) {
      const additionalType = this.mapTypeToTypescript(
        processedSchema.additionalProperties,
        schemas,
      );
      fields += `  /**\n   * 附加属性\n   */\n`;
      fields += `  [key: string]: ${additionalType};\n`;
    }

    // 如果没有字段，生成 Record 类型避免空接口 lint 报错
    if (!fields.trim()) {
      return `${description}export type ${name} = Record<string, unknown>;\n\n`;
    }

    return `${description}export interface ${name} {
${fields}}\n\n`;
  }

  /**
   * 根据 schema.type 生成枚举字面量
   */
  private getEnumTypeLiterals(schema: OpenApiSchema): string[] {
    return (schema.enum || []).map((enumValue) => {
      const parsedValue = this.parseEnumValue(enumValue, schema.type);
      return typeof parsedValue === 'number'
        ? String(parsedValue)
        : JSON.stringify(parsedValue);
    });
  }

  /**
   * 映射 OpenAPI 类型到 TypeScript
   * 支持无限层级递归解析
   */
  private mapTypeToTypescript(
    schema: OpenApiSchema,
    schemas: Record<string, OpenApiSchema>,
    depth: number = 0,
  ): string {
    // 防止无限递归
    if (depth > 10) {
      return 'any';
    }

    if (schema.$ref) {
      return extractTypeFromRef(schema.$ref) || 'any';
    }

    // 处理 allOf - 合并类型（取第一个引用类型或合并所有属性）
    if (schema.allOf && schema.allOf.length > 0) {
      // 如果只有一个元素且是引用，直接返回引用类型
      if (schema.allOf.length === 1 && schema.allOf[0].$ref) {
        return extractTypeFromRef(schema.allOf[0].$ref) || 'any';
      }
      // 多个类型时用交叉类型
      const types = schema.allOf
        .map((s) => this.mapTypeToTypescript(s, schemas, depth + 1))
        .filter((t) => t !== 'any');
      return types.length > 0 ? types.join(' & ') : 'any';
    }

    // 处理 oneOf - 联合类型
    if (schema.oneOf && schema.oneOf.length > 0) {
      const types = schema.oneOf
        .map((s) => this.mapTypeToTypescript(s, schemas, depth + 1))
        .filter((t) => t !== 'any');
      return types.length > 0 ? types.join(' | ') : 'any';
    }

    // 处理 anyOf - 联合类型
    if (schema.anyOf && schema.anyOf.length > 0) {
      const types = schema.anyOf
        .map((s) => this.mapTypeToTypescript(s, schemas, depth + 1))
        .filter((t) => t !== 'any');
      return types.length > 0 ? types.join(' | ') : 'any';
    }

    if (schema.enum && schema.enum.length > 0) {
      return this.getEnumTypeLiterals(schema).join(' | ');
    }

    switch (schema.type) {
      case 'array': {
        const itemType = this.mapTypeToTypescript(
          schema.items || {},
          schemas,
          depth + 1,
        );
        return `${itemType}[]`;
      }
      case 'boolean': {
        return 'boolean';
      }
      case 'integer':
      case 'number': {
        return 'number';
      }
      case 'object': {
        // 递归处理 inline object
        if (schema.properties) {
          const props = Object.entries(schema.properties)
            .map(([key, propSchema]) => {
              const propType = this.mapTypeToTypescript(
                propSchema,
                schemas,
                depth + 1,
              );
              return `${key}: ${propType}`;
            })
            .join('; ');
          return `{ ${props} }`;
        }
        if (schema.additionalProperties) {
          const valueType = this.mapTypeToTypescript(
            schema.additionalProperties,
            schemas,
            depth + 1,
          );
          return `Record<string, ${valueType}>`;
        }
        return 'Record<string, any>';
      }
      case 'string': {
        return schema.format === 'date-time' ? 'Date' : 'string';
      }
      default: {
        // 没有 type 但有 properties 的情况
        if (schema.properties) {
          const props = Object.entries(schema.properties)
            .map(([key, propSchema]) => {
              const propType = this.mapTypeToTypescript(
                propSchema,
                schemas,
                depth + 1,
              );
              return `${key}: ${propType}`;
            })
            .join('; ');
          return `{ ${props} }`;
        }
        return 'any';
      }
    }
  }

  /**
   * 根据 schema.type 解析枚举值
   */
  private parseEnumValue(
    enumValue: number | string,
    type?: string,
  ): number | string {
    if (type === 'string') {
      return this.parseStringEnumValue(enumValue);
    }

    if (type === 'integer' || type === 'number') {
      return this.parseNumericEnumValue(enumValue, type);
    }

    return this.parseLegacyEnumValue(enumValue);
  }

  /**
   * 兼容未声明 type 的旧逻辑
   */
  private parseLegacyEnumValue(enumValue: number | string): number | string {
    if (typeof enumValue === 'number') {
      return enumValue;
    }

    const { valuePart } = this.splitEnumValue(enumValue);
    return /^-?\d+$/.test(valuePart) ? Number(valuePart) : valuePart;
  }

  /**
   * number/integer 枚举优先取编码，例如 "1 - 菜单" => 1
   */
  private parseNumericEnumValue(
    enumValue: number | string,
    type: string,
  ): number | string {
    if (typeof enumValue === 'number') {
      return enumValue;
    }

    const { valuePart } = this.splitEnumValue(enumValue);
    const numericPattern = type === 'integer' ? /^-?\d+$/ : /^-?\d+(\.\d+)?$/;

    if (numericPattern.test(valuePart)) {
      return Number(valuePart);
    }

    return enumValue.trim();
  }

  /**
   * string 枚举优先取展示文案，例如 "1 - Desc" => "Desc"
   */
  private parseStringEnumValue(enumValue: number | string): string {
    if (typeof enumValue === 'number') {
      return String(enumValue);
    }

    const { valuePart, labelPart } = this.splitEnumValue(enumValue);
    return labelPart || valuePart;
  }

  /**
   * 处理单个 Schema
   */
  private processSchema(
    name: string,
    schema: OpenApiSchema,
    schemas: Record<string, OpenApiSchema>,
    processedApis: ProcessedApi[],
  ): string {
    const description = this.generateDescription(name, processedApis);

    // 处理引用类型
    if (schema.$ref) {
      const refType = extractTypeFromRef(schema.$ref);
      return `${description}export type ${name} = ${refType};\n\n`;
    }

    // 处理枚举类型
    if (schema.enum) {
      return this.generateEnumType(name, schema, description);
    }

    // 处理数组类型
    if (schema.type === 'array' && schema.items) {
      const itemType = this.mapTypeToTypescript(schema.items, schemas);
      return `${description}export type ${name} = ${itemType}[];\n\n`;
    }

    // 处理基本类型
    if (schema.type && !schema.properties && !schema.additionalProperties) {
      const basicType = this.mapTypeToTypescript(schema, schemas);
      return `${description}export type ${name} = ${basicType};\n\n`;
    }

    // 处理对象类型
    if (
      schema.properties ||
      schema.additionalProperties ||
      schema.type === 'object'
    ) {
      return this.generateInterfaceType(name, schema, schemas, description);
    }

    // 如果没有任何类型信息，生成 any 类型
    return `${description}export type ${name} = any;\n\n`;
  }

  /**
   * 判断是否应跳过该属性
   */
  private shouldSkipProperty(
    propName: string,
    typeName: string,
    isResponseWrapper = false,
  ): boolean {
    if (typeName === 'ApiResponse') {
      return false;
    }
    // code 只在响应包装类型中跳过（避免误删业务字段如 CodeNameRsp.code）
    const alwaysSkip = ['timestamp', 'random', 'language', 'signature'];
    if (alwaysSkip.includes(propName)) return true;
    if (propName === 'code' && isResponseWrapper) return true;
    return false;
  }

  /**
   * 判断是否应跳过该类型
   */
  private shouldSkipType(name: string): boolean {
    const skipTypes = [
      'timestamp',
      'random',
      'language',
      'signature',
      'msg',
      'code',
      'msgCode',
    ];
    return skipTypes.includes(name);
  }

  /**
   * 解析 "1 - 文案" 形式的枚举定义
   */
  private splitEnumValue(enumValue: string): {
    labelPart: string;
    valuePart: string;
  } {
    const separator = ' - ';
    const separatorIndex = enumValue.indexOf(separator);

    if (separatorIndex === -1) {
      return {
        valuePart: enumValue.trim(),
        labelPart: '',
      };
    }

    return {
      valuePart: enumValue.slice(0, separatorIndex).trim(),
      labelPart: enumValue.slice(separatorIndex + separator.length).trim(),
    };
  }
}

// 文件写入器类
class FileWriter {
  private basePath: string;

  constructor(basePath: string) {
    this.basePath = basePath;
  }

  /**
   * 写入 API 文件 (扁平结构，所有 API 合并到模块 index.ts)
   */
  writeApiFiles(groups: Map<string, ApiGroup>, module: string): void {
    // 确保目录存在
    const dirPath = path.join(this.basePath, module);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // 合并所有 group 的 APIs 和 imports
    const allApis: string[] = [];
    const allImports: string[] = [];

    for (const [tag, group] of groups) {
      // 添加分组注释
      allApis.push(
        `// ==================== ${tag} ====================`,
        ...group.apis,
      );
      allImports.push(...group.imports);
    }

    // 生成导入语句
    const imports = this.generateImports(allImports);

    // 生成完整代码 (同时导出 types)
    const joined = allApis.join('\n\n');
    const hasUpload = joined.includes('uploadFile');
    const importLine = hasUpload
      ? `import { requestClient, uploadFile } from '#/api/request';`
      : `import { requestClient } from '#/api/request';`;
    const code = `${importLine}
${imports}

// 导出类型
export * from './types';

${joined}
`;

    // 写入文件
    const filePath = path.join(dirPath, 'index.ts');
    fs.writeFileSync(filePath, code);
    console.log(`✅ API 文件已写入: ${filePath}`);
  }

  /**
   * 写入主 API 入口文件 (聚合所有模块)
   */
  writeMainIndex(modules: string[]): void {
    if (modules.length === 0) return;

    const imports = modules
      .map((mod) => `import * as ${mod} from './${mod}';`)
      .join('\n');

    const exports = modules.join(',\n  ');

    const code = `${imports}

export * from './core';

export const api = {
  ${exports}
};

export default api;
`;

    const filePath = path.join(this.basePath, 'index.ts');
    fs.writeFileSync(filePath, code);
    console.log(`✅ 主入口已写入: ${filePath}`);
  }

  /**
   * 写入类型定义文件
   */
  writeTypeFile(typeDefinitions: string, module: string): void {
    // 确保目录存在
    const dirPath = path.join(this.basePath, module);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    const outputPath = path.join(this.basePath, module, 'types.ts');
    fs.writeFileSync(outputPath, typeDefinitions);
    console.log(`✅ 类型定义已写入: ${outputPath}`);
  }

  /**
   * 生成导入语句
   */
  private generateImports(imports: string[]): string {
    const uniqueImports = [...new Set(imports)].filter(
      (item) => !CONFIG.DEFAULT_IMPORTS.includes(item),
    );

    if (uniqueImports.length === 0) {
      return '';
    }

    return `import type {
${uniqueImports.map((item) => `  ${item}`).join(',\n')}
} from './types';`;
  }
}

// API 获取器类
class ApiFetcher {
  /**
   * 获取 OpenAPI 定义
   */
  async fetchOpenApiDefinition(source: ApiSource): Promise<any> {
    const resolvedSource = resolveApiSource(
      source as any,
      source.baseUrl,
      process.cwd(),
    );
    try {
      console.log(`📡 正在获取 API 定义: ${resolvedSource.resolvedUrl}`);
      return await loadOpenApiDocument(resolvedSource, {
        timeout: 200_000,
        maxRetries: 1,
        retryDelay: 1000,
      });
    } catch (error: any) {
      console.error(
        `❌ 获取 API 定义失败: ${resolvedSource.resolvedUrl}`,
        error.message,
      );
      return null;
    }
  }
}

// 主生成器类
class OpenApiGenerator {
  private fetcher: ApiFetcher;
  private fileWriter: FileWriter;
  private processedModules: string[] = []; // 记录已处理的模块
  private sources: ApiSource[];
  private totalApis: number = 0;
  private totalModules: number = 0;
  private typeGenerator: TypeGenerator;

  constructor(sources: ApiSource[]) {
    this.typeGenerator = new TypeGenerator();
    this.fileWriter = new FileWriter(CONFIG.BASE_PATH);
    this.fetcher = new ApiFetcher();
    this.sources = sources;
  }

  /**
   * 生成类型定义和 API 代码
   */
  async generate(): Promise<void> {
    try {
      console.log('🚀 开始生成 TypeScript 定义和 API 代码...\n');

      // 受控并发处理 (每批最多 5 个)
      const CONCURRENCY = 5;
      const results: (null | { apiCount: number; module: string })[] = [];

      for (let i = 0; i < this.sources.length; i += CONCURRENCY) {
        const batch = this.sources.slice(i, i + CONCURRENCY);
        console.log(
          `\n📦 处理批次 ${Math.floor(i / CONCURRENCY) + 1}/${Math.ceil(this.sources.length / CONCURRENCY)}`,
        );

        const batchResults = await Promise.all(
          batch.map((source) => this.processSource(source)),
        );
        results.push(...batchResults);
      }

      // 收集处理结果
      for (const result of results) {
        if (result) {
          this.processedModules.push(result.module);
          this.totalApis += result.apiCount;
          this.totalModules++;
        }
      }

      // Only include modules that have an actual directory + index.ts on disk
      this.processedModules = this.processedModules.filter((mod) =>
        fs.existsSync(path.join(CONFIG.BASE_PATH, mod, 'index.ts')),
      );

      // 生成主入口文件
      this.fileWriter.writeMainIndex(this.processedModules);

      console.log('\n✨ 生成完成!');
      this.printStatistics();
    } catch (error) {
      console.error('❌ 生成过程中发生错误:', error);
      throw error;
    }
  }

  /**
   * 打印统计信息
   */
  private printStatistics(): void {
    console.log('\n📊 统计信息:');
    console.log(`  - 生成的 API 总数: ${this.totalApis}`);
    console.log(`  - 生成的模块数: ${this.totalModules}`);
  }

  /**
   * 处理单个 API 源
   */
  private async processSource(
    source: ApiSource,
  ): Promise<null | { apiCount: number; module: string }> {
    console.log(`📦 处理模块: ${source.module}`);

    const apiObject = await this.fetcher.fetchOpenApiDefinition(source);
    if (!apiObject) {
      console.warn(`⚠️ 跳过模块 ${source.module}: 无法获取 API 定义`);
      return null;
    }

    // 为每个源创建新的处理器实例
    const processor = new ApiProcessor();

    // 设置 schemas 引用，用于解析响应包装类型
    apiObject.components ??= {};
    apiObject.components.schemas ??= {};
    processor.setSchemas(apiObject.components.schemas);

    // 第一遍：收集所有 API 路径
    if (apiObject.paths) {
      for (const [path, pathSchema] of Object.entries(apiObject.paths)) {
        processor.collectApiPath(
          path,
          pathSchema as OpenApiPath,
          source.prefix || '',
        );
      }
    }

    // 第二遍：检测冲突并处理
    processor.processCollectedApis();

    // 生成类型定义
    const typeDefinitions = this.typeGenerator.generateTypes(
      apiObject,
      processor.getProcessedApis(),
    );

    // 写入文件到对应的 module 目录
    this.fileWriter.writeTypeFile(typeDefinitions, source.module);
    this.fileWriter.writeApiFiles(processor.getGroups(), source.module);

    console.log(`✅ 模块 ${source.module} 处理完成`);

    return {
      module: source.module,
      apiCount: processor.getProcessedApis().length,
    };
  }
}

// Interactive prompt for hub source selection
async function selectHubSource(): Promise<string> {
  const LOCAL_HUB = 'http://127.0.0.1:6543/api/hub/doc/swagger.json';
  const REMOTE_HUB =
    'https://dev-nestjs-hub.lottotest6688.com/api/hub/doc/swagger.json';

  // Skip prompt with CLI flags
  if (process.argv.includes('--local')) return LOCAL_HUB;
  if (process.argv.includes('--remote')) return REMOTE_HUB;

  const { createInterface } = await import('node:readline');
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve) => {
    console.log('📡 选择 Hub API 源:');
    console.log('  1) 线上 dev (默认)');
    console.log('  2) 本地 http://127.0.0.1:6543');

    const timeout = setTimeout(() => {
      rl.close();
      console.log('\n⏱️  超时，自动使用线上 Hub 服务\n');
      resolve(REMOTE_HUB);
    }, 10_000);

    rl.question('\n请选择 [1] (10秒后自动选择线上): ', (answer) => {
      clearTimeout(timeout);
      rl.close();
      const choice = answer.trim();
      if (choice === '2') {
        console.log('\n🔧 使用本地 Hub 服务\n');
        resolve(LOCAL_HUB);
      } else {
        console.log('\n☁️  使用线上 Hub 服务\n');
        resolve(REMOTE_HUB);
      }
    });
  });
}

// 执行生成
async function main() {
  const hubSwaggerUrl = await selectHubSource();
  const urls: SharedApiSourceConfig[] = createPrimaryApiSources({
    adminApiDocBase: DEFAULT_ADMIN_API_DOC_BASE,
    hubSwaggerUrl,
  });
  const generator = new OpenApiGenerator(
    urls.map((item) => ({
      url: item.url,
      module: item.module,
      prefix: item.prefix || '',
      fullUrl: item.fullUrl,
      baseUrl: item.baseUrl,
    })),
  );
  await generator.generate();
}

// 启动生成器
main().catch((error) => {
  console.error('❌ 执行失败:', error);
  process.exit(1);
});
