import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

import vercel from '@astrojs/vercel/serverless';

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
  ],

  adapter: vercel(),
});