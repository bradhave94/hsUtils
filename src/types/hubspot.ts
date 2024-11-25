export interface Domain {
  domain: string;
  id: string;
  isDefault: boolean;
  isPrimary: boolean;
  isInternal: boolean;
}

export interface HubSpotTemplate {
  id: string;
  path: string;
  label?: string;
  filename: string;
}

export interface HubSpotPage {
  id: string;
  name: string;
  slug: string;
  state: string;
  currentState: string;
  createdAt: string;
  updatedAt: string;
  publishDate: string;
  archived: boolean;
  archivedAt: string;
  absolute_url: string;
  url?: string;
  templatePath: string;
  template_path: string;
}

export interface HubSpotBlogPost extends HubSpotPage {
  created: string;
  updated: string;
  url: string;
  tagIds: string[];
}

export interface HubSpotBlogInfo {
  absolute_url: string;
  item_template_path: string;
  objects: Array<{
    absolute_url: string;
    item_template_path: string;
  }>;
}

export interface HubSpotBlogTags {
  id: string;
  name: string;
}

export interface BlogTag {
  id: string;
  name: string;
  created: string;
  updated: string;
  deletedAt?: string;
}

export interface TagsResponse {
  total: number;
  results: BlogTag[];
  paging?: {
    next?: {
      link: string;
      after: string;
    };
  };
}
