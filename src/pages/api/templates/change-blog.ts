import type { APIRoute } from 'astro';
import { z } from 'zod';
import { ApiClient } from '../../../lib/api/hubspot/client';
import { API_ENDPOINTS } from '../../../lib/api/hubspot/constants';

const requestSchema = z.object({
    pageId: z.string(),
    templatePath: z.string(),
});

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const accessToken = cookies.get('hubspot_access_token')?.value;
        if (!accessToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const body = await request.json();
        const { pageId, templatePath } = requestSchema.parse(body);

        const client = new ApiClient(accessToken);
        await client.patch(
            API_ENDPOINTS.blogs.update(pageId),
            { templatePath }
        );

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }), {
            status: 500
        });
    }
};