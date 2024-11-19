import { checkAuth } from '../lib/hubspot/auth';

export function requireAuth(cookies) {
    const { isAuthenticated, needsRefresh } = checkAuth(cookies);

    if (!isAuthenticated) {
        return {
            redirect: true,
            url: '/'
        };
    }

    return {
        redirect: false
    };
}