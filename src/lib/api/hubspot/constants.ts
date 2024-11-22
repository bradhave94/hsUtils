export const API_ENDPOINTS = {
  pages: {
    list: 'https://api.hubapi.com/cms/v3/pages/site-pages',
    update: (id: string) => `https://api.hubapi.com/cms/v3/pages/site-pages/${id}`,
    batchUpdate: 'https://api.hubapi.com/cms/v3/pages/site-pages/batch/update',
  },
  blogs: {
    list: 'https://api.hubapi.com/cms/v3/blogs/posts',
    update: (id: string) => `https://api.hubapi.com/cms/v3/blogs/posts/${id}`,
    info: 'https://api.hubapi.com/content/api/v2/blogs',
    batchUpdate: 'https://api.hubapi.com/cms/v3/blogs/posts/batch/update',
    tags: 'https://api.hubapi.com/cms/v3/blogs/tags?limit=100',
  },
  templates: {
    list: 'https://api.hubapi.com/content/api/v2/templates',
  },
  domains: {
    list: 'https://api.hubapi.com/cms/v3/domains',
  },
} as const;