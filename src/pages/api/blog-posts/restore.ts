import type { APIRoute } from 'astro';
import { z } from 'zod';
import { restoreBlogPost } from '../../../lib/api/hubspot';

const requestSchema = z.object({
    pageId: z.string(),
});

export const POST: APIRoute = async ({ request, cookies }) => {
    console.log(request.body, "body");
    const accessToken = cookies.get('hubspot_access_token')?.value;
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const body = await request.json();
        if (!body || typeof body !== 'object') {
            return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
        }

        const { pageId } = requestSchema.parse(body);

        await restoreBlogPost(accessToken, pageId);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error restoring blog post:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Failed to restore blog post'
        }), {
            status: 500
        });
    }
};