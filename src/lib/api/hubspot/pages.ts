import type { HubSpotPage } from '../../types/hubspot';
import type { ApiResponse } from './types';
import { ApiClient } from './client';
import { API_ENDPOINTS } from './constants';

export async function getSitePages(accessToken: string, archived = false): Promise<HubSpotPage[]> {
  const client = new ApiClient(accessToken);
  let allPages: HubSpotPage[] = [];
  let nextPageUrl = `${API_ENDPOINTS.pages.list}?limit=100${archived ? "&archived=true" : ""}`;

  try {
    while (nextPageUrl) {
      const data = await client.get<ApiResponse<HubSpotPage>>(nextPageUrl);
      allPages = allPages.concat(data.results.map(mapHubSpotPage));
      nextPageUrl = data.paging?.next?.link || null;
    }

    return allPages;
  } catch (error) {
    console.error('Error fetching site pages:', error);
    throw error;
  }
}

export async function updatePage(accessToken: string, pageId: string, updates: Partial<HubSpotPage>): Promise<HubSpotPage> {
  const client = new ApiClient(accessToken);
  return client.patch<HubSpotPage>(API_ENDPOINTS.pages.update(pageId), updates);
}

export async function restorePage(accessToken: string, pageId: string): Promise<HubSpotPage> {
  const client = new ApiClient(accessToken);
  return client.patch<HubSpotPage>(`${API_ENDPOINTS.pages.update(pageId)}?archived=true`, {
    archived: false,
  });
}

export async function updatePagesBatch(accessToken: string, batchInput: { inputs: Array<{ id: string; templatePath: string }> }) {
  const client = new ApiClient(accessToken);
  return client.post(API_ENDPOINTS.pages.batchUpdate, batchInput);
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