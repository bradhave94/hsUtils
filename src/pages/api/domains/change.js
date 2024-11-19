import { updatePageDomain } from '../../../lib/hubspot/api';

export const POST = async ({ request, cookies }) => {
    try {
        const { pageId, domain } = await request.json();
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