import type { HubSpotPage } from '../types/hubspot';
import type { PageTreeStructure, PageStatus, SectionKey } from '../types/page';

export function buildPageTree(pages: HubSpotPage[], groupPages: boolean): PageTreeStructure {
  const tree: PageTreeStructure = groupPages
    ? { published: {}, draft: {}, archived: {} }
    : { all: {}, archived: {} };

  for (const page of pages) {
    const templatePath = page.templatePath || 'No Template';
    const [folder, ...templateParts] = templatePath.split('/');
    const template = templateParts.join('/') || 'No Template';

    let section: SectionKey = 'all';

    if (groupPages) {
      if (page.state === 'DRAFT' && !page.archived) {
        section = 'draft';
      } else if (page.archived) {
        section = 'archived';
      } else {
        section = 'published';
      }
    } else {
      section = page.archived ? 'archived' : 'all';
    }

    const sectionData = tree[section];
    if (sectionData) {
      if (!sectionData[folder]) {
        sectionData[folder] = {};
      }
      if (!sectionData[folder][template]) {
        sectionData[folder][template] = [];
      }
      sectionData[folder][template].push(page);
    }
  }

  // Sort folders alphabetically within each section
  for (const section of Object.keys(tree) as SectionKey[]) {
    const sectionData = tree[section];
    if (sectionData) {
      tree[section] = Object.fromEntries(
        Object.entries(sectionData).sort(([a], [b]) => a.localeCompare(b))
      );
    }
  }

  return tree;
}

export function getPageStatus(page: HubSpotPage): PageStatus {
  if (page.archivedAt && !page.archivedAt.includes('1970')) {
    return { label: 'Archived', className: 'text-red-500' };
  }

  switch (page.state) {
    case 'PUBLISHED':
      return { label: 'Published', className: 'text-green-500' };
    case 'DRAFT':
      return { label: 'Draft', className: 'text-yellow-500' };
    case 'SCHEDULED':
      return { label: 'Scheduled', className: 'text-blue-500' };
    case 'PUBLISHED_OR_SCHEDULED':
      return { label: 'Published', className: 'text-green-500' };
    default:
      return { label: page.state || 'Draft', className: 'text-gray-500' };
  }
}