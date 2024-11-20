import type { APIRoute } from 'astro';
import { z } from 'zod';
import { updatePageTemplate } from '../../../lib/api/hubspot';

const requestSchema = z.object({
    pageId: z.string(),
    templatePath: z.string(),
});

export const POST: APIRoute = async ({ request, cookies }) => {
    const accessToken = cookies.get('hubspot_access_token')?.value;
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'No access token found' }), { status: 401 });
    }

    try {
        const body = await request.json();
        const { pageId, templatePath } = requestSchema.parse(body);

        await updatePageTemplate(pageId, templatePath, accessToken);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        }), {
            status: 500
        });
    }
};