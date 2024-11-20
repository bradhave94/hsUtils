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
  templatePath: string;
  template_path: string;
}

export interface HubSpotBlogPost extends HubSpotPage {
  created: string;
  updated: string;
  url: string;
}

export interface HubSpotBlogInfo {
  absolute_url: string;
  item_template_path: string;
  objects: Array<{
    absolute_url: string;
    item_template_path: string;
  }>;
}