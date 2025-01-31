import type { HubSpotBlogPost, HubSpotBlogInfo, HubSpotBlogTags } from '../../../types/hubspot';
import type { ApiResponse } from './types';
import { ApiClient } from './client';
import { API_ENDPOINTS } from './constants';

interface BlogTag {
  id: string;
  name: string;
  language: string;
  created: string;
  updated: string;
  deletedAt?: string;
}

interface TagsResponse {
  total: number;
  results: BlogTag[];
  paging?: {
    next?: {
      link: string;
      after: string;
    };
  };
}

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

export async function getBlogTags(accessToken: string, refreshToken?: string): Promise<BlogTag[]> {
  const client = new ApiClient(accessToken);
  const allTags: BlogTag[] = [];
  let nextPageUrl: string | null = API_ENDPOINTS.blogs.tags;

  try {
    while (nextPageUrl !== null) {
      const response: TagsResponse = await client.get(nextPageUrl, refreshToken);
      allTags.push(...response.results);
      nextPageUrl = response.paging?.next?.link ?? null;
    }

    return allTags;
  } catch (error) {
    console.error('Error fetching blog tags:', error);
    throw error;
  }
}

export async function restoreBlogPost(accessToken: string, postId: string, refreshToken?: string) {
  const client = new ApiClient(accessToken);
  return client.patch(`${API_ENDPOINTS.blogs.update(postId)}?archived=true`, {
    archived: false,
  }, refreshToken);
}

export async function updateBlogPost(accessToken: string, postId: string, updates: Partial<HubSpotBlogPost>, refreshToken?: string) {
  const client = new ApiClient(accessToken);
  return client.patch(API_ENDPOINTS.blogs.update(postId), updates, refreshToken);
}

export async function updateBlogPostsBatch(accessToken: string, updates: Array<{ id: string; templatePath: string }>, refreshToken?: string) {
  const client = new ApiClient(accessToken);
  return client.post(API_ENDPOINTS.blogs.batchUpdate, { inputs: updates }, refreshToken);
}

function mapHubSpotBlogPost(post: Omit<HubSpotBlogPost, 'template_path'>): HubSpotBlogPost {
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
    url: post.url,
    tagIds: post.tagIds
  };
}
