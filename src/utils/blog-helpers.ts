import type { HubSpotBlogPost } from '../types/hubspot';
import type { BlogTreeStructure, BlogStatus, BlogSectionKey, BlogInfo } from '../types/blog';

export function buildBlogTree(
  posts: HubSpotBlogPost[], 
  blogInfo: BlogInfo[],
  groupPosts: boolean
): BlogTreeStructure {
  const tree: BlogTreeStructure = {};

  // Initialize tree structure for each blog
  for (const blog of blogInfo) {
    tree[blog.url] = groupPosts
      ? { published: {}, draft: {}, archived: {} }
      : { all: {}, archived: {} };
  }

  // Add a catch-all blog for posts that don't match any known blog
  const defaultBlog = '/blog';
  if (!tree[defaultBlog]) {
    tree[defaultBlog] = groupPosts
      ? { published: {}, draft: {}, archived: {} }
      : { all: {}, archived: {} };
  }

  for (const post of posts) {
    // Find the matching blog URL
    const blogUrl = blogInfo.find(blog => post.absolute_url.includes(blog.url))?.url || defaultBlog;
    const templatePath = post.templatePath || 'No Template';

    let section: BlogSectionKey = 'all';
    if (groupPosts) {
      if (post.state === 'DRAFT' && !post.archived) {
        section = 'draft';
      } else if (post.archived) {
        section = 'archived';
      } else {
        section = 'published';
      }
    } else {
      section = post.archived ? 'archived' : 'all';
    }

    const sectionData = tree[blogUrl][section];
    if (sectionData) {
      if (!sectionData[templatePath]) {
        sectionData[templatePath] = [];
      }
      sectionData[templatePath].push(post);
    }
  }

  // Sort posts within each template
  for (const blog of Object.values(tree)) {
    for (const section of Object.values(blog)) {
      if (section) {
        for (const posts of Object.values(section)) {
          posts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
        }
      }
    }
  }

  return tree;
}

export function getBlogStatus(post: HubSpotBlogPost): BlogStatus {
  if (post.archivedAt && !post.archivedAt.includes('1970')) {
    return { label: 'Archived', className: 'text-red-500' };
  }

  switch (post.state) {
    case 'PUBLISHED':
      return { label: 'Published', className: 'text-green-500' };
    case 'DRAFT':
      return { label: 'Draft', className: 'text-yellow-500' };
    case 'SCHEDULED':
      return { label: 'Scheduled', className: 'text-blue-500' };
    case 'PUBLISHED_OR_SCHEDULED':
      return { label: 'Published', className: 'text-green-500' };
    default:
      return { label: post.state || 'Draft', className: 'text-gray-500' };
  }
}