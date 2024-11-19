import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '../lib/hubspot/auth';

export function verifyCsrf(request, cookies) {
    const csrfCookie = cookies.get(CSRF_COOKIE_NAME)?.value;
    const csrfHeader = request.headers.get(CSRF_HEADER_NAME);

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
        throw new Error('CSRF token validation failed');
    }
}