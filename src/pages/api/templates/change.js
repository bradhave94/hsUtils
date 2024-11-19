import { getAccessTokenFromRequest } from '../../../lib/hubspot/auth';
import { handleApiError } from '../../../lib/hubspot/api';
import { updatePageTemplate } from '../../../lib/hubspot/templates';

export const prerender = false;
export const POST = async ({ request }) => {
    const { pageId, templatePath } = await request.json();
    const accessToken = getAccessTokenFromRequest(request);

    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'No access token found' }), { status: 401 });
    }

    try {
        await updatePageTemplate(pageId, templatePath, accessToken);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
};

export const GET = async ({ request }) => {
    return new Response(JSON.stringify({ message: 'Hello, world!' }), { status: 200 });
};