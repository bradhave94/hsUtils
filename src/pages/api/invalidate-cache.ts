import type { APIRoute } from 'astro';
import { z } from 'zod';
import cache, { CacheType } from '../../lib/utils/cache';

const requestSchema = z.object({
    accessToken: z.string(),
    type: z.enum([CacheType.BLOGS, CacheType.PAGES, CacheType.BLOG_INFO, CacheType.PAGE_INFO]).nullable()
});

export const POST: APIRoute = async ({ request, cookies }) => {
    const accessToken = cookies.get('hubspot_access_token')?.value;
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'No access token found' }), { status: 401 });
    }

    try {
        const body = await request.json();
        const { type } = requestSchema.parse(body);
        
        if (type === null) {
            cache.invalidateAll(accessToken);
        } else {
            cache.invalidateType(type, accessToken);
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }), {
            status: 500
        });
    }
}; 