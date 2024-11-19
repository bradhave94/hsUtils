import { r as restorePage } from '../../../chunks/api_D5lN87jw.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
    const accessToken = cookies.get('hubspot_access_token')?.value;
    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    try {
        const { pageId } = await request.json();
        console.log('Attempting to restore page with ID:', pageId);
        await restorePage(accessToken, pageId);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Error restoring page:', error);
        return new Response(JSON.stringify({ error: error.message || 'Failed to restore page' }), { status: 500 });
    }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
