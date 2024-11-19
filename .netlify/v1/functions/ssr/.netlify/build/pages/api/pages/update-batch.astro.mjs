import { a as updatePagesBatch } from '../../../chunks/api_rm9FGV_P.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;

const POST = async ({ request, cookies }) => {
    const accessToken = cookies.get('hubspot_access_token')?.value;

    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    try {
        const batchInputJsonNode = await request.json();
        const result = await updatePagesBatch(accessToken, batchInputJsonNode);

        return new Response(JSON.stringify(result), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error updating pages batch:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
    __proto__: null,
    POST,
    prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
