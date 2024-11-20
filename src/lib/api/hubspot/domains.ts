import type { Domain } from '../../../types/hubspot';
import type { ApiResponse } from './types';
import { ApiClient } from './client';
import { API_ENDPOINTS } from './constants';

export async function getDomains(accessToken: string, refreshTokenCallback?: (newToken: string) => void): Promise<Domain[]> {
  const client = new ApiClient(accessToken, refreshTokenCallback);
  const data = await client.get<ApiResponse<Domain>>(API_ENDPOINTS.domains.list);
  return data.results;
}

export async function updatePageDomain(accessToken: string, pageId: string, domain: string) {
  const client = new ApiClient(accessToken);
  return client.patch(API_ENDPOINTS.pages.update(pageId), { domain });
}