export const prerender = false;
import { handleApiError } from '../../../lib/hubspot/api';
import { getAccessTokenFromRequest } from '../../../lib/hubspot/auth';

export const POST = async ({ request }) => {
    try {
        if (!request.body) {
            return new Response(JSON.stringify({ error: 'No request body provided' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const body = await request.json();

        if (!body.newSlug) {
            return new Response(JSON.stringify({ error: 'Missing required fields: newSlug' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { pageId, newSlug } = body;

        const accessToken = getAccessTokenFromRequest(request);
        if (!accessToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const response = await fetch(`https://api.hubapi.com/cms/v3/blogs/posts/${pageId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ slug: newSlug })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update blog post slug');
        }

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return handleApiError(error);
    }
};