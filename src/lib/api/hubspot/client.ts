import type { ApiError, RequestOptions } from './types';
import { refreshAccessToken } from '../../auth';

export class ApiClient {
  private readonly baseHeaders: Record<string, string>;

  constructor(
    private accessToken: string,
    private readonly onTokenRefresh?: (newToken: string) => void
  ) {
    this.baseHeaders = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  private async handleTokenRefresh(refreshToken: string) {
    try {
      const newAuth = await refreshAccessToken(refreshToken);
      this.accessToken = newAuth.accessToken;
      this.baseHeaders.Authorization = `Bearer ${newAuth.accessToken}`;
      
      // Notify caller of token refresh
      if (this.onTokenRefresh) {
        this.onTokenRefresh(newAuth.accessToken);
      }

      return newAuth;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }

  private async fetch<T>(url: string, options: Partial<RequestOptions> = {}, refreshToken?: string): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.baseHeaders,
          ...options.headers,
        },
      });

      if (response.status === 401) {
        const errorData = await response.json() as ApiError;
        if (errorData.message?.includes('expired') && refreshToken) {
          // Token expired, attempt refresh and retry request
          await this.handleTokenRefresh(refreshToken);
          
          // Retry the request with new token
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...this.baseHeaders,
              ...options.headers,
            },
          });

          if (!retryResponse.ok) {
            throw new Error(`HTTP error! status: ${retryResponse.status}`);
          }

          return retryResponse.json();
        }
      }

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch data');
    }
  }

  async get<T>(url: string, refreshToken?: string): Promise<T> {
    return this.fetch<T>(url, {}, refreshToken);
  }

  async post<T>(url: string, data: unknown, refreshToken?: string): Promise<T> {
    return this.fetch<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }, refreshToken);
  }

  async patch<T>(url: string, data: unknown, refreshToken?: string): Promise<T> {
    return this.fetch<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }, refreshToken);
  }

  async put<T>(url: string, data: unknown, refreshToken?: string): Promise<T> {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      if (response.status === 401 && refreshToken) {
        // Handle token refresh if needed
        // ... your existing refresh token logic ...
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async delete<T>(url: string, refreshToken?: string): Promise<T> {
    return this.fetch<T>(url, {
      method: 'DELETE',
    }, refreshToken);
  }

  async uploadFile(url: string, file: File | Blob, refreshToken?: string): Promise<Response> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: formData
      });

      if (response.status === 401 && refreshToken) {
        await this.handleTokenRefresh(refreshToken);
        
        // Retry the request with new token
        return fetch(url, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
          },
          body: formData
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to upload file');
    }
  }
}