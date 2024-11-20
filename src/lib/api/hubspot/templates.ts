import type { HubSpotTemplate } from '../../../types/hubspot';
import { ApiClient } from './client';
import { API_ENDPOINTS } from './constants';

export async function getTemplates(accessToken: string): Promise<HubSpotTemplate[]> {
  const client = new ApiClient(accessToken);
  const data = await client.get<{ objects: HubSpotTemplate[] }>(
    `${API_ENDPOINTS.templates.list}?is_available_for_new_content=true&limit=1000`
  );
  return data.objects;
}

export async function updatePageTemplate(pageId: string, templatePath: string, accessToken: string) {
  const client = new ApiClient(accessToken);
  return client.patch(API_ENDPOINTS.pages.update(pageId), { templatePath });
}