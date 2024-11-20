import type { APIRoute } from 'astro';
import { z } from 'zod';
import { updatePage } from '../../../lib/api/hubspot';

const requestSchema = z.object({
    pageId: z.string(),
    newSlug: z.string(),
});

export const POST: APIRoute = async ({ request, cookies }) => {
    const accessToken = cookies.get('hubspot_access_token')?.value;
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await request.json();
        const { pageId, newSlug } = requestSchema.parse(body);

        await updatePage(accessToken, pageId, { slug: newSlug });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating page slug:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Failed to update slug'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};