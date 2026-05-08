import { defineEventHandler, getHeader, getRequestURL, readBody } from 'h3';
import { dispatchArHandler } from '~/utils/ar-handlers/index';

export default defineEventHandler(async (event) => {
  const domainUrl = getHeader(event, 'domainUrl') ?? '';
  const apiPath = getRequestURL(event).pathname.replace(/^\/api/, '') || '/';
  const body = (await readBody(event).catch(() => ({}))) as Record<string, any>;

  return dispatchArHandler(domainUrl, apiPath, body ?? {});
});
