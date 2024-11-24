export interface ApiResponse<T> {
  results: T[];
  paging?: {
    next?: {
      link: string;
    };
  };
}

export interface ApiError {
  status: number;
  message: string;
  correlationId?: string;
  requestId?: string;
}

export interface RequestOptions {
  method?: string;
  headers: Record<string, string>;
  body?: string;
}

export interface ModuleField {
  id: string;
  name: string;
  label: string;
  type: string;
  required: boolean;
  default?: string;
  help_text?: string;
  allow_new_line?: boolean;
  show_emoji_picker?: boolean;
  validation_regex?: string;
}

export interface HubSpotModule {
  id: number;
  name: string;
  path: string;
  folderPath: string;
  folderId: number;
  fields: ModuleField[];
  created: number;
  updated: number;
  authorAt: number;
  contentTypes: string[];
  isAvailableForNewContent: boolean;
  deleted: boolean;
  deletedAt: number;
  global: boolean;
  source: string;
  css?: string;
}