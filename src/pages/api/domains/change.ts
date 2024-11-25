import type { APIRoute } from 'astro';
import { z } from 'zod';
import { updatePageDomain } from '../../../lib/api/hubspot';

const requestSchema = z.object({
    pageId: z.string(),
    domain: z.string(),
});

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const accessToken = cookies.get('hubspot_access_token')?.value;
        if (!accessToken) {
            return new Response(JSON.stringify({
                error: 'Unauthorized'
            }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Log the raw request body for debugging
        const rawBody = await request.text();
        console.log('Raw request body:', rawBody);

        // Parse the body only if it's not empty
        if (!rawBody) {
            return new Response(JSON.stringify({
                error: 'Empty request body'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        let body;
        try {
            body = JSON.parse(rawBody);
        } catch (e) {
            return new Response(JSON.stringify({
                error: 'Invalid JSON in request body',
                rawBody
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate the parsed body
        const validatedData = requestSchema.safeParse(body);
        if (!validatedData.success) {
            return new Response(JSON.stringify({
                error: 'Invalid request data',
                details: validatedData.error.errors
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { pageId, domain } = validatedData.data;

        // Log the parsed data
        console.log('Processing domain change:', { pageId, domain });

        await updatePageDomain(accessToken, pageId, domain);

        return new Response(JSON.stringify({
            success: true,
            message: 'Domain updated successfully'
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error changing domain:', error);
        return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : 'Failed to update domain',
            details: error instanceof Error ? error.stack : undefined
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};