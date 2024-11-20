import type { APIRoute } from 'astro';
import { checkAuth } from '../../../lib/middleware/auth';
import { refreshAccessToken, setAuthCookies } from '../../../lib/auth';

export const get: APIRoute = async ({ cookies, redirect }) => {
    try {
        const auth = await checkAuth(cookies);
        if (!auth.refreshToken) {
            return redirect('/login', 302);
        }

        const newAuth = await refreshAccessToken(auth.refreshToken);
        if (newAuth) {
            setAuthCookies(cookies, newAuth);
            return redirect('/', 302);
        }

        return redirect('/login', 302);
    } catch (error) {
        console.error('Failed to refresh token:', error);
        return redirect('/login', 302);
    }
};