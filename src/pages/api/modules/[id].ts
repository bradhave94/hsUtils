import type { APIRoute } from 'astro';
import { getModule } from '@/lib/api/hubspot/modules';
import { ApiClient } from '@/lib/api/hubspot/client';
import { API_ENDPOINTS } from '@/lib/api/hubspot/constants';
import type { HubSpotModule } from '@/lib/api/hubspot/types';

export const GET: APIRoute = async ({ params, request }) => {
    try {
        const moduleId = params.id;
        if (!moduleId) {
            return new Response('Module ID is required', { status: 400 });
        }

        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return new Response('Unauthorized', { status: 401 });
        }

        const accessToken = authHeader.split(' ')[1];
        const moduleData = await getModule(accessToken, moduleId);

        return new Response(JSON.stringify(moduleData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching module:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
};

export const PUT: APIRoute = async ({ params, request }) => {
    try {
        const moduleId = params.id;
        if (!moduleId) {
            return new Response('Module ID is required', { status: 400 });
        }

        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return new Response('Unauthorized', { status: 401 });
        }

        const accessToken = authHeader.split(' ')[1];
        const client = new ApiClient(accessToken);
        const updates = await request.json();

        // Make the PUT request to HubSpot's API
        const response = await client.put<HubSpotModule>(
            API_ENDPOINTS.modules.get(moduleId),
            updates
        );

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error updating module:', error);
        const message = error instanceof Error ? error.message : 'Internal Server Error';
        return new Response(JSON.stringify({ error: message }), { 
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}; 