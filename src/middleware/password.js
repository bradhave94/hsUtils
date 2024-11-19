export function checkPassword(request) {
    const SITE_PASSWORD = import.meta.env.SITE_PASSWORD;

    // Skip password check if no password is set
    if (!SITE_PASSWORD) return true;

    // Check for password in cookie
    const cookies = request.headers.get('cookie') || '';
    const hasPassword = cookies.includes(`site-password=${SITE_PASSWORD}`);

    return hasPassword || false;
}

