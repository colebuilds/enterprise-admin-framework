/**
 * OpenAPI 公共核心
 *
 * 提供多数据源解析、加载、函数名生成和知识抽取所需的共享能力。
 */

import type {
  ApiDefinition,
  ApiFieldInfo,
  ApiSourceConfig,
  ApiTypeInfo,
  EnumValue,
} from '../knowledge-extract/core';

import * as fs from 'node:fs/promises';
import * as path from 'node:path';

import axios from 'axios';

type OpenApiSchema = {
  $ref?: string;
  additionalProperties?: boolean | OpenApiSchema;
  allOf?: OpenApiSchema[];
  anyOf?: OpenApiSchema[];
  description?: string;
  enum?: Array<number | string>;
  format?: string;
  items?: OpenApiSchema;
  oneOf?: OpenApiSchema[];
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  type?: string;
};

type OpenApiParameter = {
  description?: string;
  in?: 'cookie' | 'header' | 'path' | 'query';
  name: string;
  required?: boolean;
  schema?: OpenApiSchema;
};

type OpenApiMethodSchema = {
  parameters?: OpenApiParameter[];
  requestBody?: {
    content?: {
      'application/json'?: { schema?: OpenApiSchema };
      'multipart/form-data'?: { schema?: OpenApiSchema };
    };
  };
  responses?: Record<
    string,
    {
      content?: {
        'application/json'?: { schema?: OpenApiSchema };
      };
    }
  >;
  summary?: string;
  tags?: string[];
};

export type OpenApiDocument = {
  components?: {
    schemas?: Record<string, OpenApiSchema>;
  };
  paths?: Record<string, Record<string, OpenApiMethodSchema>>;
};

interface OpenApiOperationCandidate {
  pathUrl: string;
  method: ApiDefinition['method'];
  methodSchema: OpenApiMethodSchema;
}

export interface ResolvedApiSource {
  module: string;
  prefix?: string;
  originalUrl: string;
  resolvedUrl: string;
  kind: 'file' | 'http';
  optional?: boolean;
}

export interface ParsedOpenApiModuleResult {
  apis: ApiDefinition[];
  types: Record<string, ApiTypeInfo>;
}

const EXCLUDED_FIELDS = new Set([
  'exportFileName',
  'exportTimeZone',
  'exportTitle',
  'fieldTranslate',
  'isExport',
  'orderBy',
  'pageNo',
  'pageSize',
  'sortField',
]);

const RESERVED_WORDS = new Set([
  'async',
  'await',
  'break',
  'case',
  'catch',
  'class',
  'const',
  'continue',
  'debugger',
  'default',
  'delete',
  'do',
  'else',
  'enum',
  'export',
  'extends',
  'finally',
  'for',
  'function',
  'if',
  'implements',
  'import',
  'in',
  'instanceof',
  'interface',
  'let',
  'new',
  'package',
  'private',
  'protected',
  'public',
  'return',
  'static',
  'super',
  'switch',
  'this',
  'throw',
  'try',
  'typeof',
  'var',
  'void',
  'while',
  'with',
  'yield',
]);

const HTTP_METHODS = new Set<ApiDefinition['method']>([
  'delete',
  'get',
  'patch',
  'post',
  'put',
]);

const SYSTEM_TYPES = new Set([
  'code',
  'language',
  'msg',
  'msgCode',
  'random',
  'signature',
  'timestamp',
]);

export function toLowerCaseFirst(str: string): string {
  return str.charAt(0).toLowerCase() + str.slice(1);
}

export function toUpperCaseFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function extractTypeFromRef(ref?: string): string {
  return ref?.split('/').pop() || '';
}

export function isPathParam(part: string): boolean {
  return part.startsWith('{') && part.endsWith('}');
}

export function extractPathParamName(part: string): string {
  return part.slice(1, -1);
}

export function extractPathParams(url: string): string[] {
  return url
    .split('/')
    .filter((part) => isPathParam(part))
    .map((part) => extractPathParamName(part));
}

export function sanitizeName(name: string): string {
  const parts = name
    .trim()
    .split(/[^a-zA-Z0-9]+/g)
    .filter(Boolean);

  if (parts.length === 0) return '';

  const [first, ...rest] = parts;
  const camel =
    toLowerCaseFirst(first) +
    rest.map((part) => toUpperCaseFirst(part)).join('');
  return camel.replaceAll(/[^a-zA-Z0-9_$]/g, '');
}

export function escapeReservedWord(name: string, urlParts: string[]): string {
  if (!RESERVED_WORDS.has(name.toLowerCase())) {
    return name;
  }

  const cleanParts = urlParts.filter((part) => !isPathParam(part));
  if (cleanParts.length >= 2) {
    const moduleName = sanitizeName(cleanParts[cleanParts.length - 2]) || 'api';
    const safeName = sanitizeName(name) || name;
    return `${toLowerCaseFirst(moduleName)}${toUpperCaseFirst(safeName)}`;
  }

  const safeName = sanitizeName(name) || name;
  return `do${toUpperCaseFirst(safeName)}`;
}

export function getShortName(baseUrl: string): string {
  const urlParts = baseUrl
    .split('/')
    .filter((part) => part && part !== 'api' && !isPathParam(part));
  const actionName = urlParts[urlParts.length - 1] || 'unknownApi';
  return toLowerCaseFirst(sanitizeName(actionName));
}

export function getFullName(baseUrl: string): string {
  const urlParts = baseUrl
    .split('/')
    .filter((part) => part && part !== 'api' && !isPathParam(part));
  const actionName = urlParts[urlParts.length - 1] || 'unknownApi';

  if (urlParts.length >= 2) {
    const controllerName = urlParts[urlParts.length - 2];
    return `${toLowerCaseFirst(sanitizeName(controllerName))}${toUpperCaseFirst(sanitizeName(actionName))}`;
  }

  return toLowerCaseFirst(sanitizeName(actionName));
}

export function generateUniqueFuncName(
  baseUrl: string,
  method: string,
  existingNames: Set<string>,
  conflictingShortNames: Set<string>,
): string {
  const urlParts = baseUrl
    .split('/')
    .filter((part) => part && part !== 'api' && !isPathParam(part));
  const shortName = getShortName(baseUrl);

  let funcName = conflictingShortNames.has(shortName)
    ? getFullName(baseUrl)
    : shortName;
  funcName = escapeReservedWord(funcName, urlParts);

  if (existingNames.has(funcName)) {
    funcName = `${funcName}${toUpperCaseFirst(method)}`;
    let counter = 2;
    let uniqueName = funcName;
    while (existingNames.has(uniqueName)) {
      uniqueName = `${funcName}${counter}`;
      counter++;
    }
    funcName = uniqueName;
  }

  return funcName;
}

export function cleanPath(url: string): string {
  return url.replace('/api', '').replaceAll(/\{(\w+)\}/g, '${$1}');
}

function joinUrl(baseUrl: string, urlPath: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return normalizedBase + encodeURI(urlPath.replace(/^\/+/, ''));
}

function isExplicitRemote(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

function isLocalPath(url: string): boolean {
  return (
    url.startsWith('./') ||
    url.startsWith('../') ||
    url.startsWith('/') ||
    url.startsWith('file://')
  );
}

export function resolveApiSource(
  source: ApiSourceConfig,
  defaultBaseUrl: string | undefined,
  projectRoot: string,
): ResolvedApiSource {
  const url = source.url.trim();

  if (source.fullUrl || isExplicitRemote(url)) {
    return {
      module: source.module,
      prefix: source.prefix,
      originalUrl: source.url,
      resolvedUrl: url,
      kind: 'http',
      optional: source.optional,
    };
  }

  if (isLocalPath(url) || path.isAbsolute(url)) {
    const absolutePath = url.startsWith('file://')
      ? new URL(url).pathname
      : path.resolve(projectRoot, url);
    return {
      module: source.module,
      prefix: source.prefix,
      originalUrl: source.url,
      resolvedUrl: absolutePath,
      kind: 'file',
      optional: source.optional,
    };
  }

  const baseUrl = source.baseUrl || defaultBaseUrl;
  if (!baseUrl) {
    throw new Error(
      `Missing api.baseUrl for source ${source.module}:${source.url}`,
    );
  }

  return {
    module: source.module,
    prefix: source.prefix,
    originalUrl: source.url,
    resolvedUrl: joinUrl(baseUrl, url),
    kind: 'http',
    optional: source.optional,
  };
}

export async function loadOpenApiDocument(
  source: ResolvedApiSource,
  options: {
    maxRetries: number;
    retryDelay: number;
    timeout: number;
  },
): Promise<OpenApiDocument> {
  if (source.kind === 'file') {
    const content = await fs.readFile(source.resolvedUrl, 'utf8');
    return JSON.parse(content) as OpenApiDocument;
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= options.maxRetries; attempt++) {
    try {
      const response = await axios.get(source.resolvedUrl, {
        timeout: options.timeout,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'KnowledgeExtractor/3.0',
        },
      });
      return response.data as OpenApiDocument;
    } catch (error) {
      lastError = error as Error;
      if (attempt < options.maxRetries) {
        await new Promise((resolve) =>
          setTimeout(resolve, options.retryDelay * attempt),
        );
      }
    }
  }

  throw (
    lastError ||
    new Error(`Failed to load OpenAPI document: ${source.resolvedUrl}`)
  );
}

export class OpenApiKnowledgeCollector {
  private readonly operationKeys = new Set<string>();
  private readonly operations: OpenApiOperationCandidate[] = [];
  private readonly schemas: Record<string, OpenApiSchema> = {};

  addDocument(document: OpenApiDocument): void {
    if (document.components?.schemas) {
      Object.assign(this.schemas, document.components.schemas);
    }

    if (!document.paths) {
      return;
    }

    for (const [pathUrl, pathSchema] of Object.entries(document.paths)) {
      for (const [method, methodSchema] of Object.entries(pathSchema)) {
        const normalizedMethod =
          method.toLowerCase() as ApiDefinition['method'];
        if (!HTTP_METHODS.has(normalizedMethod)) {
          continue;
        }

        if (!methodSchema?.tags?.length) {
          continue;
        }

        const operationKey = `${normalizedMethod}:${pathUrl}`;
        if (this.operationKeys.has(operationKey)) {
          continue;
        }

        this.operationKeys.add(operationKey);
        this.operations.push({
          pathUrl,
          method: normalizedMethod,
          methodSchema,
        });
      }
    }
  }

  build(module: string): ParsedOpenApiModuleResult {
    const types = this.buildTypes();
    const apis = this.buildApis(module, types);

    return {
      apis,
      types,
    };
  }

  private buildApis(
    module: string,
    types: Record<string, ApiTypeInfo>,
  ): ApiDefinition[] {
    const operations = [...this.operations].toSorted((a, b) => {
      const pathCompare = a.pathUrl.localeCompare(b.pathUrl);
      return pathCompare === 0 ? a.method.localeCompare(b.method) : pathCompare;
    });

    const shortNameCount = new Map<string, number>();
    for (const operation of operations) {
      const shortName = getShortName(operation.pathUrl);
      shortNameCount.set(shortName, (shortNameCount.get(shortName) || 0) + 1);
    }

    const conflictingShortNames = new Set<string>();
    for (const [name, count] of shortNameCount) {
      if (count > 1) {
        conflictingShortNames.add(name);
      }
    }

    const existingNames = new Set<string>();
    const apis: ApiDefinition[] = [];

    for (const operation of operations) {
      const funcName = generateUniqueFuncName(
        operation.pathUrl,
        operation.method,
        existingNames,
        conflictingShortNames,
      );
      existingNames.add(funcName);

      const requestBodySchema = this.extractRequestBodySchema(
        operation.methodSchema,
      );
      const requestParameterFields = this.extractParameterFields(
        operation.methodSchema,
      );
      const requestBodyFields = this.extractFieldsFromSchema(requestBodySchema);
      const responseSchema = this.unwrapResponseSchema(
        this.extractResponseSchema(operation.methodSchema),
      );
      const reqType = this.extractPrimaryTypeName(requestBodySchema);
      const rspType = this.extractPrimaryTypeName(responseSchema);
      const reqFields = this.mergeFields(
        requestParameterFields,
        requestBodyFields,
        types,
      );
      const rspFields = this.enrichFieldsWithEnums(
        this.extractFieldsFromSchema(responseSchema),
        types,
      );

      apis.push({
        module,
        funcName,
        url: operation.pathUrl,
        method: operation.method,
        reqType: reqType || undefined,
        rspType: rspType || undefined,
        description: operation.methodSchema.summary || '',
        reqFields: reqFields.length > 0 ? reqFields : undefined,
        rspFields: rspFields.length > 0 ? rspFields : undefined,
      });
    }

    return apis;
  }

  private buildTypes(): Record<string, ApiTypeInfo> {
    const types: Record<string, ApiTypeInfo> = {};

    for (const [name, schema] of Object.entries(this.schemas)) {
      const typeInfo = this.parseSchemaDefinition(name, schema);
      if (typeInfo) {
        types[name] = typeInfo;
      }
    }

    return types;
  }

  private dedupeFields(fields: ApiFieldInfo[]): ApiFieldInfo[] {
    const fieldMap = new Map<string, ApiFieldInfo>();

    for (const field of fields) {
      const existing = fieldMap.get(field.name);
      if (!existing) {
        fieldMap.set(field.name, field);
        continue;
      }

      fieldMap.set(field.name, {
        ...existing,
        ...field,
        required: existing.required || field.required,
        enumValues: existing.enumValues || field.enumValues,
      });
    }

    return [...fieldMap.values()];
  }

  private dereferenceSchema(
    schema?: OpenApiSchema,
    depth: number = 0,
  ): OpenApiSchema | undefined {
    if (!schema || depth > 10) {
      return schema;
    }

    if (schema.$ref) {
      const refName = extractTypeFromRef(schema.$ref);
      const referenced = this.schemas[refName];
      if (!referenced) {
        return schema;
      }
      return this.dereferenceSchema(referenced, depth + 1);
    }

    return schema;
  }

  private enrichFieldsWithEnums(
    fields: ApiFieldInfo[],
    types: Record<string, ApiTypeInfo>,
  ): ApiFieldInfo[] {
    return fields.map((field) => {
      let typeName = field.type;
      if (typeName.endsWith('[]')) {
        typeName = typeName.slice(0, -2);
      }

      const typeInfo = types[typeName];
      if (typeInfo?.isEnum && typeInfo.enumValues) {
        return {
          ...field,
          description: field.description || typeInfo.description,
          enumValues: field.enumValues || typeInfo.enumValues,
        };
      }

      return field;
    });
  }

  private extractFieldsFromSchema(schema?: OpenApiSchema): ApiFieldInfo[] {
    const dereferenced = this.dereferenceSchema(schema);
    if (!dereferenced) {
      return [];
    }

    if (dereferenced.type === 'array' && dereferenced.items) {
      return this.extractFieldsFromSchema(dereferenced.items);
    }

    if (dereferenced.allOf?.length) {
      const fields: ApiFieldInfo[] = [];
      for (const entry of dereferenced.allOf) {
        fields.push(...this.extractFieldsFromSchema(entry));
      }
      return this.dedupeFields(fields);
    }

    if (!dereferenced.properties) {
      return [];
    }

    const requiredFields = new Set(dereferenced.required || []);
    return Object.entries(dereferenced.properties)
      .filter(([propName]) => !this.shouldSkipProperty(propName))
      .map(([propName, propSchema]) =>
        this.parseField(propName, propSchema, requiredFields.has(propName)),
      )
      .filter(Boolean);
  }

  private extractParameterFields(
    methodSchema: OpenApiMethodSchema,
  ): ApiFieldInfo[] {
    const fields: ApiFieldInfo[] = [];
    const mergedParameters = [...(methodSchema.parameters || [])];

    for (const parameter of mergedParameters) {
      if (!parameter?.name || EXCLUDED_FIELDS.has(parameter.name)) {
        continue;
      }

      const schema = parameter.schema || {};
      fields.push({
        name: parameter.name,
        type: this.getSchemaTypeString(schema),
        description: parameter.description,
        required: parameter.required || parameter.in === 'path',
        enumValues: schema.enum ? this.parseEnumValues(schema.enum) : undefined,
      });
    }

    return fields;
  }

  private extractPrimaryTypeName(schema?: OpenApiSchema): string {
    if (!schema) {
      return '';
    }

    if (schema.$ref) {
      return extractTypeFromRef(schema.$ref);
    }

    if (schema.allOf?.length) {
      const refEntry = schema.allOf.find((entry) => entry.$ref);
      if (refEntry?.$ref) {
        return extractTypeFromRef(refEntry.$ref);
      }
    }

    if (schema.type === 'array' && schema.items) {
      const itemType =
        this.extractPrimaryTypeName(schema.items) ||
        this.getSchemaTypeString(schema.items);
      return itemType ? `${itemType}[]` : 'any[]';
    }

    const dereferenced = this.dereferenceSchema(schema) || schema;
    return this.getSchemaTypeString(dereferenced);
  }

  private extractRequestBodySchema(
    methodSchema: OpenApiMethodSchema,
  ): OpenApiSchema | undefined {
    return (
      methodSchema.requestBody?.content?.['application/json']?.schema ||
      methodSchema.requestBody?.content?.['multipart/form-data']?.schema
    );
  }

  private extractResponseSchema(
    methodSchema: OpenApiMethodSchema,
  ): OpenApiSchema | undefined {
    const preferredCodes = ['200', '201', '0'];
    for (const code of preferredCodes) {
      const schema =
        methodSchema.responses?.[code]?.content?.['application/json']?.schema;
      if (schema) {
        return schema;
      }
    }

    for (const response of Object.values(methodSchema.responses || {})) {
      const schema = response.content?.['application/json']?.schema;
      if (schema) {
        return schema;
      }
    }

    return undefined;
  }

  private getSchemaTypeString(
    schema: OpenApiSchema,
    depth: number = 0,
  ): string {
    if (depth > 10) {
      return 'any';
    }

    if (schema.$ref) {
      return extractTypeFromRef(schema.$ref) || 'any';
    }

    if (schema.allOf?.length) {
      const types = schema.allOf
        .map((entry) => this.getSchemaTypeString(entry, depth + 1))
        .filter((type) => type && type !== 'any');
      return types.length > 0 ? types.join(' & ') : 'any';
    }

    if (schema.oneOf?.length) {
      const types = schema.oneOf
        .map((entry) => this.getSchemaTypeString(entry, depth + 1))
        .filter((type) => type && type !== 'any');
      return types.length > 0 ? types.join(' | ') : 'any';
    }

    if (schema.anyOf?.length) {
      const types = schema.anyOf
        .map((entry) => this.getSchemaTypeString(entry, depth + 1))
        .filter((type) => type && type !== 'any');
      return types.length > 0 ? types.join(' | ') : 'any';
    }

    switch (schema.type) {
      case 'array': {
        const itemType = schema.items
          ? this.getSchemaTypeString(schema.items, depth + 1)
          : 'any';
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
        if (schema.properties) {
          const props = Object.entries(schema.properties)
            .filter(([name]) => !this.shouldSkipProperty(name))
            .map(
              ([name, propSchema]) =>
                `${name}: ${this.getSchemaTypeString(propSchema, depth + 1)}`,
            )
            .join('; ');
          return props ? `{ ${props} }` : 'object';
        }
        if (
          schema.additionalProperties &&
          typeof schema.additionalProperties !== 'boolean'
        ) {
          const valueType = this.getSchemaTypeString(
            schema.additionalProperties,
            depth + 1,
          );
          return `Record<string, ${valueType}>`;
        }
        return 'object';
      }
      case 'string': {
        return schema.format === 'date-time' ? 'Date' : 'string';
      }
      default: {
        if (schema.properties) {
          const props = Object.entries(schema.properties)
            .filter(([name]) => !this.shouldSkipProperty(name))
            .map(
              ([name, propSchema]) =>
                `${name}: ${this.getSchemaTypeString(propSchema, depth + 1)}`,
            )
            .join('; ');
          return props ? `{ ${props} }` : 'object';
        }
        return 'any';
      }
    }
  }

  private mergeFields(
    parameterFields: ApiFieldInfo[],
    bodyFields: ApiFieldInfo[],
    types: Record<string, ApiTypeInfo>,
  ): ApiFieldInfo[] {
    return this.enrichFieldsWithEnums(
      this.dedupeFields([...parameterFields, ...bodyFields]),
      types,
    );
  }

  private parseEnumValues(enumArray: Array<number | string>): EnumValue[] {
    const values: EnumValue[] = [];

    for (const item of enumArray) {
      if (typeof item === 'number') {
        values.push({ value: item, label: String(item) });
        continue;
      }

      const parts = item.split(' - ');
      if (parts.length >= 2) {
        const firstPart = parts[0].trim();
        const label = parts.slice(1).join(' - ').trim();
        values.push({
          value: /^\d+$/.test(firstPart) ? Number(firstPart) : firstPart,
          label,
        });
        continue;
      }

      values.push({
        value: /^\d+$/.test(item) ? Number(item) : item,
        label: item,
      });
    }

    return values;
  }

  private parseField(
    name: string,
    schema: OpenApiSchema,
    required: boolean,
  ): ApiFieldInfo | null {
    if (EXCLUDED_FIELDS.has(name) || SYSTEM_TYPES.has(name)) {
      return null;
    }

    const dereferenced = this.dereferenceSchema(schema) || schema;

    return {
      name,
      type: this.getSchemaTypeString(schema),
      description: dereferenced.description,
      required,
      enumValues: dereferenced.enum
        ? this.parseEnumValues(dereferenced.enum)
        : undefined,
    };
  }

  private parseSchemaDefinition(
    name: string,
    schema: OpenApiSchema,
  ): ApiTypeInfo | null {
    if (SYSTEM_TYPES.has(name)) {
      return null;
    }

    if (schema.enum) {
      return {
        name,
        description: schema.description || schema.enum.join(' '),
        fields: [],
        isEnum: true,
        enumValues: this.parseEnumValues(schema.enum),
      };
    }

    const dereferenced = this.dereferenceSchema(schema);
    if (!dereferenced) {
      return {
        name,
        description: schema.description,
        fields: [],
      };
    }

    if (dereferenced.$ref) {
      const refType = extractTypeFromRef(dereferenced.$ref);
      return { name, description: `Reference to ${refType}`, fields: [] };
    }

    if (dereferenced.properties || dereferenced.type === 'object') {
      const requiredFields = new Set(dereferenced.required || []);
      const fields = Object.entries(dereferenced.properties || {})
        .filter(([propName]) => !this.shouldSkipProperty(propName))
        .map(([propName, propSchema]) =>
          this.parseField(propName, propSchema, requiredFields.has(propName)),
        )
        .filter(Boolean);

      return {
        name,
        description: dereferenced.description,
        fields,
      };
    }

    return {
      name,
      description: dereferenced.description,
      fields: [],
    };
  }

  private shouldSkipProperty(propName: string): boolean {
    return SYSTEM_TYPES.has(propName) || EXCLUDED_FIELDS.has(propName);
  }

  private unwrapResponseSchema(
    schema?: OpenApiSchema,
  ): OpenApiSchema | undefined {
    if (!schema) {
      return undefined;
    }

    const visited = new Set<string>();
    let current: OpenApiSchema | undefined = schema;

    while (current) {
      if (current.$ref) {
        const refName = extractTypeFromRef(current.$ref);
        if (!refName || visited.has(refName)) {
          break;
        }
        visited.add(refName);
        const referenced = this.schemas[refName];
        if (!referenced) {
          break;
        }
        current = referenced;
      }

      const properties = current.properties || {};
      const hasData = Boolean(properties.data);
      const hasWrapperSignals =
        'code' in properties || 'msg' in properties || 'msgCode' in properties;

      if (!hasData || !hasWrapperSignals) {
        return current;
      }

      current = properties.data;
    }

    return schema;
  }
}
