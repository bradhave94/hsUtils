import { b as updatePage } from '../../../chunks/api_D5lN87jw.mjs';
export { renderers } from '../../../renderers.mjs';

const POST = async ({ request, cookies }) => {
    try {
        const { pageId, newSlug } = await request.json();
        if (!pageId || !newSlug) {
            return new Response(JSON.stringify({ message: 'Missing required fields' }), {
                status: 400,
            });
        }
        const accessToken = cookies.get('hubspot_access_token')?.value;
        if (!accessToken) {
            return new Response(JSON.stringify({ message: 'Not authenticated' }), {
                status: 401,
            });
        }

        // Update the page with the new slug
        await updatePage(pageId, { slug: newSlug }, accessToken);
        return new Response(JSON.stringify({ message: 'Slug updated successfully' }), {
            status: 200,
        });
    } catch (error) {
        console.error('Error updating slug:', error);
        return new Response(
            JSON.stringify({
                message: error instanceof Error ? error.message : 'Failed to update slug'
            }),
            { status: 500 }
        );
    }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
