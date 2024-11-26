import type { APIRoute } from 'astro';
import cache, { CacheType } from '../../../lib/utils/cache';
import type { HubSpotPage, HubSpotBlogPost } from '../../../types/hubspot';
import { checkAuth } from '../../../lib/middleware/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { accessToken } = await checkAuth(cookies);
    if (!accessToken) {
      console.error('Cache update: No access token');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const body = await request.json();
    console.log('Cache update: Received request body:', body);

    if (!body.type || !body.pageIds || !body.updates) {
      console.error('Cache update: Missing required fields', body);
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const { type, pageIds, updates, options } = body;

    // Get current cache data based on type
    const currentItems = cache.get<HubSpotPage[] | HubSpotBlogPost[]>(type, accessToken, options);
    console.log('Cache update: Current cache state:', {
      exists: !!currentItems,
      itemCount: currentItems?.length,
      cacheKey: `${type}_${options?.archived || false}_${accessToken}`
    });

    if (!currentItems) {
      console.log('Cache update: No existing cache data found');
      return new Response(JSON.stringify({ message: 'Cache empty, no update performed' }), { status: 200 });
    }

    const updatedItems = currentItems.map(item => {
      // For blog posts, check against item.id
      // For pages, check against item.id
      const itemId = type === CacheType.BLOGS ? item.id : (item as HubSpotPage).id;

      if (pageIds.includes(itemId)) {
        console.log('Cache update: Updating item:', {
          id: itemId,
          before: item,
          after: { ...item, ...updates }
        });
        return { ...item, ...updates };
      }
      return item;
    });

    // Set the updated data back to cache
    cache.set(type, accessToken, updatedItems, options);
    console.log('Cache update: Successfully updated cache');

    return new Response(JSON.stringify({
      success: true,
      updatedCount: pageIds.length,
      totalItems: updatedItems.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Cache update error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }),
      { status: 500 }
    );
  }
};