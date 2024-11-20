import { checkAuth, refreshAccessToken, setAuthCookies } from '../../../lib/hubspot/auth';

export async function get({ cookies, redirect }) {
    try {
        const auth = checkAuth(cookies);
        if (auth.refreshToken) {
            const newAuth = await refreshAccessToken(auth.refreshToken);
            if (newAuth) {
                setAuthCookies(cookies, newAuth);
                return redirect('/', 302); // Redirect back to homepage
            }
        }
        // If we couldn't refresh, redirect to login
        return redirect('/login', 302);
    } catch (error) {
        console.error('Failed to refresh token:', error);
        return redirect('/login', 302);
    }
}