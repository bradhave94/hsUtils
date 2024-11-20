import type { APIRoute } from 'astro';
import { z } from 'zod';

const passwordSchema = z.object({
    password: z.string(),
});

export const POST: APIRoute = async ({ request }) => {
    const SITE_PASSWORD = import.meta.env.SITE_PASSWORD;

    if (!SITE_PASSWORD) {
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
        });
    }

    try {
        const body = await request.json();
        const { password } = passwordSchema.parse(body);

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
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), {
            status: 400
        });
    }
};