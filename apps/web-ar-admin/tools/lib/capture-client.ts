// apps/web-ar-admin/tools/lib/capture-client.ts
import { signBody } from './sign.js';

export interface CaptureClientOptions {
  baseUrl: string;
  domainUrl: string;
}

export class CaptureClient {
  private token = '';
  constructor(private opts: CaptureClientOptions) {}

  async get<T = unknown>(path: string): Promise<T> {
    const res = await fetch(`${this.opts.baseUrl}${path}`, {
      method: 'GET',
      headers: this.buildHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
    return res.json() as Promise<T>;
  }

  async post<T = unknown>(path: string, body: Record<string, unknown> = {}): Promise<T> {
    const signed = signBody(body);
    const res = await fetch(`${this.opts.baseUrl}${path}`, {
      method: 'POST',
      headers: this.buildHeaders(),
      body: JSON.stringify(signed),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
    return res.json() as Promise<T>;
  }

  setToken(token: string) { this.token = token; }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      domainUrl: this.opts.domainUrl,
    };
    if (this.token) headers.Authorization = `Bearer ${this.token}`;
    return headers;
  }
}
