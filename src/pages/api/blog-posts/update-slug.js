import { getAccessTokenFromRequest, handleApiError } from '../../../lib/hubspot/api';

export const POST = async ({ request }) => {
    try {
        const accessToken = getAccessTokenFromRequest(request);
        if (!accessToken) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
        }

        const { pageId, newSlug } = await request.json();

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