import type { HubSpotBlogPost, HubSpotBlogInfo } from '../../../types/hubspot';
import type { ApiResponse } from './types';
import { ApiClient } from './client';
import { API_ENDPOINTS } from './constants';

export async function getBlogPosts(accessToken: string, archived = false, refreshToken?: string): Promise<HubSpotBlogPost[]> {
  const client = new ApiClient(accessToken);
  const allPosts: HubSpotBlogPost[] = [];
  let nextPageUrl: string | null = `${API_ENDPOINTS.blogs.list}?limit=100${archived ? "&archived=true" : ""}`;

  try {
    while (nextPageUrl !== null) {
      const response: ApiResponse<HubSpotBlogPost> = await client.get(nextPageUrl, refreshToken);
      allPosts.push(...response.results.map(mapHubSpotBlogPost));
      nextPageUrl = response.paging?.next?.link ?? null;
    }

    return allPosts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function getBlogInfo(accessToken: string, refreshToken?: string): Promise<Array<{ url: string; template_path: string }>> {
  const client = new ApiClient(accessToken);
  const response: HubSpotBlogInfo = await client.get(API_ENDPOINTS.blogs.info, refreshToken);
  return response.objects.map(blog => ({
    url: blog.absolute_url,
    template_path: blog.item_template_path
  }));
}

export async function updateBlogPost(accessToken: string, postId: string, updates: Partial<HubSpotBlogPost>, refreshToken?: string) {
  const client = new ApiClient(accessToken);
  return client.patch(API_ENDPOINTS.blogs.update(postId), updates, refreshToken);
}

export async function updateBlogPostsBatch(accessToken: string, updates: Array<{ id: string; templatePath: string }>, refreshToken?: string) {
  const client = new ApiClient(accessToken);
  return client.post(API_ENDPOINTS.blogs.batchUpdate, { inputs: updates }, refreshToken);
}

function mapHubSpotBlogPost(post: any): HubSpotBlogPost {
  return {
    id: post.id,
    name: post.name,
    slug: post.slug,
    state: post.state,
    currentState: post.currentState,
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
    publishDate: post.publishDate,
    archived: post.archived,
    archivedAt: post.archivedAt,
    absolute_url: post.url,
    templatePath: post.templatePath,
    template_path: post.templatePath,
    created: post.created,
    updated: post.updated,
    url: post.url
  };
}