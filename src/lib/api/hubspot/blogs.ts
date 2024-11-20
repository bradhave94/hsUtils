import type { HubSpotBlogPost } from '../../types/hubspot';
import type { ApiResponse } from './types';
import { ApiClient } from './client';
import { API_ENDPOINTS } from './constants';

export async function getBlogPosts(accessToken: string, archived = false): Promise<HubSpotBlogPost[]> {
  const client = new ApiClient(accessToken);
  let allPosts: HubSpotBlogPost[] = [];
  let nextPageUrl = `${API_ENDPOINTS.blogs.list}?limit=100${archived ? "&archived=true" : ""}`;

  try {
    while (nextPageUrl) {
      const data = await client.get<ApiResponse<HubSpotBlogPost>>(nextPageUrl);
      allPosts = allPosts.concat(data.results.map(mapHubSpotBlogPost));
      nextPageUrl = data.paging?.next?.link || null;
    }

    return allPosts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function getBlogInfo(accessToken: string) {
  const client = new ApiClient(accessToken);
  const data = await client.get(API_ENDPOINTS.blogs.info);
  return data.objects.map((blog: any) => ({
    url: blog.absolute_url,
    template_path: blog.item_template_path
  }));
}

export async function updateBlogPost(accessToken: string, postId: string, updates: Partial<HubSpotBlogPost>) {
  const client = new ApiClient(accessToken);
  return client.patch(API_ENDPOINTS.blogs.update(postId), updates);
}

export async function updateBlogPostsBatch(accessToken: string, updates: Array<{ id: string; templatePath: string }>) {
  const client = new ApiClient(accessToken);
  return client.post(API_ENDPOINTS.blogs.batchUpdate, { inputs: updates });
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