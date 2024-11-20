export const API_ENDPOINTS = {
  auth: {
    refresh: '/api/auth/refresh',
    verifyPassword: '/api/auth/verify-password',
  },
  pages: {
    restore: '/api/pages/restore',
    updateBatch: '/api/pages/update-batch',
    updateSlug: '/api/pages/update-slug',
  },
  templates: {
    change: '/api/templates/change',
    changeBlog: '/api/templates/change-blog',
  },
  domains: {
    change: '/api/domains/change',
  },
  blogPosts: {
    restore: '/api/blog-posts/restore',
    updateBatch: '/api/blog-posts/update-batch',
    updateSlug: '/api/blog-posts/update-slug',
  },
} as const;