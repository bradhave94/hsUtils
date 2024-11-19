import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import netlify from '@astrojs/netlify';

export default defineConfig({
  output: 'server',
  integrations: [tailwind()],

  routes: [
    {
      path: '/api/templates/change',
      method: 'POST',
      handler: 'src/pages/api/templates/change.js',
    },
    {
      path: '/api/pages/restore',
      method: 'POST',
      handler: 'src/pages/api/pages/restore.js',
    },
    {
      path: '/api/pages/update-batch',
      method: 'POST',
      handler: 'src/pages/api/pages/update-batch.js',
    },
    {
      path: '/api/pages/update-slug',
      method: 'POST',
      handler: 'src/pages/api/pages/update-slug.js',
    },
    {
      path: '/api/domains/change',
      method: 'POST',
      handler: 'src/pages/api/domains/change.js',
    }
  ],

  adapter: netlify()
});