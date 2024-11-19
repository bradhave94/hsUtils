export const POST = async ({ request }) => {
    const { pageId, templatePath } = await request.json();
    const accessToken = getAccessTokenFromRequest(request);

    if (!accessToken) {
        return new Response(JSON.stringify({ error: 'No access token found' }), { status: 401 });
    }

    try {
        await updatePageTemplate(pageId, templatePath, accessToken);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        return handleApiError(error);
    }
};