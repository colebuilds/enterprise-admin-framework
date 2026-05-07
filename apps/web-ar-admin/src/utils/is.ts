export const isBoolean = (val: unknown): val is boolean =>
  typeof val === 'boolean';
export const isFunction = (val: unknown): val is (...args: any[]) => any =>
  typeof val === 'function';
export const isString = (val: unknown): val is string =>
  typeof val === 'string';
export const isNumber = (val: unknown): val is number =>
  typeof val === 'number';
export const isObject = (val: unknown): val is Record<string, unknown> =>
  val !== null && typeof val === 'object';
export const isArray = Array.isArray;
export const isNullOrUnDef = (val: unknown): val is null | undefined =>
  val === null || val === undefined;
