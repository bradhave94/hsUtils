import type { APIRoute } from 'astro';
import { z } from 'zod';
import { updatePageDomain } from '../../../lib/api/hubspot';

const requestSchema = z.object({
    pageId: z.string(),
    domain: z.string(),
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
        const { pageId, domain } = requestSchema.parse(body);

        await updatePageDomain(accessToken, pageId, domain);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating page domain:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Failed to update domain'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 