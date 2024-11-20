import type { HubSpotPage } from '../../../types/hubspot';
import type { ApiResponse } from './types';
import { ApiClient } from './client';
import { API_ENDPOINTS } from './constants';

const PAGE_LIMIT = 100;

export async function getSitePages(accessToken: string, archived = false, refreshToken?: string): Promise<HubSpotPage[]> {
  const client = new ApiClient(accessToken);
  const allPages: HubSpotPage[] = [];
  let nextPageUrl: string | null = `${API_ENDPOINTS.pages.list}?limit=${PAGE_LIMIT}${archived ? "&archived=true" : ""}`;

  try {
    while (nextPageUrl) {
      const response: ApiResponse<HubSpotPage> = await client.get(nextPageUrl, refreshToken);
      allPages.push(...response.results.map(mapHubSpotPage));
      nextPageUrl = response.paging?.next?.link ?? null;
    }

    return allPages;
  } catch (error) {
    console.error('Error fetching site pages:', error);
    throw error;
  }
}

export async function updatePage(accessToken: string, pageId: string, updates: Partial<HubSpotPage>, refreshToken?: string): Promise<HubSpotPage> {
  const client = new ApiClient(accessToken);
  return client.patch<HubSpotPage>(API_ENDPOINTS.pages.update(pageId), updates, refreshToken);
}

export async function restorePage(accessToken: string, pageId: string, refreshToken?: string): Promise<HubSpotPage> {
  const client = new ApiClient(accessToken);
  return client.patch<HubSpotPage>(`${API_ENDPOINTS.pages.update(pageId)}?archived=true`, {
    archived: false,
  }, refreshToken);
}

export async function updatePagesBatch(accessToken: string, batchInput: { inputs: Array<{ id: string; templatePath: string }> }, refreshToken?: string) {
  const client = new ApiClient(accessToken);
  return client.post(API_ENDPOINTS.pages.batchUpdate, batchInput, refreshToken);
}

function mapHubSpotPage(page: any): HubSpotPage {
  return {
    id: page.id,
    name: page.name,
    slug: page.slug,
    state: page.state,
    currentState: page.currentState,
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
    publishDate: page.publishDate,
    archived: page.archivedAt !== "1970-01-01T00:00:00Z",
    archivedAt: page.archivedAt,
    absolute_url: page.url,
    templatePath: page.templatePath,
    template_path: page.templatePath,
  };
}