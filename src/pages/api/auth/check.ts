import type { APIRoute } from 'astro';
import { getAuthFromCookies } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
    const auth = getAuthFromCookies(cookies);
    
    return new Response(
        JSON.stringify({
            needsRefresh: auth.needsRefresh
        }),
        {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
};
