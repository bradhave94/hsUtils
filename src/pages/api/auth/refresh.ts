import type { APIRoute } from 'astro';
import { checkAuth } from '../../../lib/middleware/auth';
import { refreshAccessToken, setAuthCookies } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies, request }) => {
    try {
        const auth = await checkAuth(cookies);
        if (!auth.refreshToken) {
            return new Response(JSON.stringify({ error: 'No refresh token found' }), {
                status: 401,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const newAuth = await refreshAccessToken(auth.refreshToken);
        if (newAuth) {
            setAuthCookies(cookies, newAuth);
            return new Response(JSON.stringify({ success: true }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        return new Response(JSON.stringify({ error: 'Failed to refresh token' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Failed to refresh token:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};