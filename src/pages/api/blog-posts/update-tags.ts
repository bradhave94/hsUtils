import type { APIRoute } from 'astro';
import { z } from 'zod';
import { ApiClient } from '../../../lib/api/hubspot/client';
import { API_ENDPOINTS } from '../../../lib/api/hubspot/constants';

const requestSchema = z.object({
    postId: z.string(),
    tagIds: z.array(z.string()),
});

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const accessToken = cookies.get('hubspot_access_token')?.value;
        if (!accessToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await request.json();
        const { postId, tagIds } = requestSchema.parse(body);

        const client = new ApiClient(accessToken);
        await client.patch(
            API_ENDPOINTS.blogs.update(postId),
            { tagIds }
        );

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating blog post tags:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Failed to update blog post tags'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 