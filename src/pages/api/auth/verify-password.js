export const POST = async ({ request }) => {
    const SITE_PASSWORD = import.meta.env.SITE_PASSWORD;

    // If no password is set, always allow access
    if (!SITE_PASSWORD) {
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
        });
    }

    const { password } = await request.json();

    if (password === SITE_PASSWORD) {
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Set-Cookie': `site-password=${SITE_PASSWORD}; Path=/; SameSite=Strict; HttpOnly`
            }
        });
    }

    return new Response(JSON.stringify({ error: 'Invalid password' }), {
        status: 401
    });
};