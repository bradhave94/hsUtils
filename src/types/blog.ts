import type { HubSpotBlogPost, BlogTag } from './hubspot';

export interface BlogTreeStructure {
  [blogUrl: string]: {
    published?: BlogTemplates;
    draft?: BlogTemplates;
    archived?: BlogTemplates;
    all?: BlogTemplates;
  };
}

export interface BlogTemplates {
  [templatePath: string]: HubSpotBlogPost[];
}

export type BlogSectionKey = 'published' | 'draft' | 'archived' | 'all';

export interface BlogStatus {
  label: string;
  className: string;
}

export interface BlogInfo {
  url: string;
  template_path: string;
}