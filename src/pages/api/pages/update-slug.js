export const prerender = false;
import { updatePage } from '../../../lib/hubspot/api';

export const POST = async ({ request, cookies }) => {
    try {
        // Ensure the request has a body before trying to parse it
        if (!request.body) {
            return new Response(JSON.stringify({ error: 'No request body provided' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const body = await request.json();

        // Validate the required fields
        if (!body.oldSlug || !body.newSlug) {
            return new Response(JSON.stringify({ error: 'Missing required fields: oldSlug or newSlug' }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const { pageId } = body;
        const accessToken = cookies.get('hubspot_access_token')?.value;
        if (!accessToken) {
            return new Response(JSON.stringify({ message: 'Not authenticated' }), {
                status: 401,
            });
        }

        // Update the page with the new slug
        await updatePage(pageId, { slug: body.newSlug }, accessToken);
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error in update-slug endpoint:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
