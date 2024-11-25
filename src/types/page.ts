import type { HubSpotPage } from './hubspot';

export interface PageTreeStructure {
  published?: PageFolders;
  draft?: PageFolders;
  archived?: PageFolders;
  all?: PageFolders;
}

export interface PageFolders {
  [key: string]: PageTemplates;
}

export interface PageTemplates {
  [key: string]: HubSpotPage[];
}

export type SectionKey = keyof PageTreeStructure;

export interface PageStatus {
  label: string;
  className: string;
}