import type { APIRoute } from 'astro';
import { z } from 'zod';
import { ApiClient } from '../../../lib/api/hubspot/client';
import { API_ENDPOINTS } from '../../../lib/api/hubspot/constants';

const requestSchema = z.object({
    name: z.string().min(1),
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
        const { name } = requestSchema.parse(body);

        const client = new ApiClient(accessToken);
        const response = await client.post(
            API_ENDPOINTS.blogs.tags,
            { name }
        );

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error creating blog tag:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Failed to create blog tag'
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}; 