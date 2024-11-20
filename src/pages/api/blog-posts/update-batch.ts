import type { APIRoute } from 'astro';
import { z } from 'zod';
import { updateBlogPostsBatch } from '../../../lib/api/hubspot';

const requestSchema = z.object({
    inputs: z.array(z.object({
        id: z.string(),
        templatePath: z.string(),
    })),
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
        const batchInput = requestSchema.parse(body);

        await updateBlogPostsBatch(accessToken, batchInput.inputs);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating blog posts batch:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Failed to update blog posts'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};