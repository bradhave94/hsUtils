export const prerender = false;
import { updatePageDomain } from '../../../lib/hubspot/api';


export const POST = async ({ request, cookies }) => {
    try {
        console.log('Request headers:', Object.fromEntries(request.headers));

        const hasBody = request.body !== null && request.body !== undefined;
        console.log('Has body:', hasBody);

        let body;
        try {
            body = await request.json();
            console.log('Parsed body:', body);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return new Response(JSON.stringify({
                success: false,
                message: 'Invalid JSON in request body',
                debug: parseError.message
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        if (!body) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Request body is empty'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const pageId = body.pageId;
        const domain = body.domain;

        if (!pageId || !domain) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Missing required fields: pageId and domain'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        const accessToken = cookies.get('hubspot_access_token')?.value;

        if (!accessToken) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Authentication required'
            }), {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }

        await updatePageDomain(accessToken, pageId, domain);

        return new Response(JSON.stringify({
            success: true,
            message: 'Domain updated successfully'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error changing domain:', error);
        return new Response(JSON.stringify({
            success: false,
            message: error instanceof Error ? error.message : 'Failed to update domain'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};