import type { ApiError, RequestOptions } from './types';

export class ApiClient {
  constructor(private accessToken: string) {}

  private async fetch<T>(url: string, options: Partial<RequestOptions> = {}): Promise<T> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json() as ApiError;
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async get<T>(url: string): Promise<T> {
    return this.fetch<T>(url);
  }

  async post<T>(url: string, data: unknown): Promise<T> {
    return this.fetch<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(url: string, data: unknown): Promise<T> {
    return this.fetch<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}