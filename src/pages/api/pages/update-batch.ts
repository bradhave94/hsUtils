import type { APIRoute } from 'astro';
import { z } from 'zod';
import { updatePagesBatch } from '../../../lib/api/hubspot';

const batchInputSchema = z.object({
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
        const batchInput = batchInputSchema.parse(body);
        const result = await updatePagesBatch(accessToken, batchInput);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error updating pages batch:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Failed to update pages'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};