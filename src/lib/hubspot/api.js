const SITE_PAGES_URL = 'https://api.hubapi.com/cms/v3/pages/site-pages?limit=100';
const BLOG_POSTS_URL = 'https://api.hubapi.com/cms/v3/blogs/posts?limit=100';
const TEMPLATES_URL = 'https://api.hubapi.com/content/api/v2/templates?is_available_for_new_content=true&limit=1000';
const DOMAIN_URL = 'https://api.hubapi.com/cms/v3/domains/';

export async function getSitePages(accessToken, archived = false) {
    let allPages = [];
    let nextPageUrl = SITE_PAGES_URL + (archived ? "&archived=true" : "");

    try {
        while (nextPageUrl) {
            const response = await fetch(nextPageUrl, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.results || !Array.isArray(data.results)) {
                throw new Error('Unexpected API response structure');
            }

            const pages = data.results.map(page => ({
                id: page.id,
                name: page.name,
                slug: page.slug,
                state: page.state,
                currentState: page.currentState,
                createdAt: page.createdAt,
                updatedAt: page.updatedAt,
                publishDate: page.publishDate,
                archived: page.archivedAt !== "1970-01-01T00:00:00Z",
                archivedAt: page.archivedAt,
                absolute_url: page.url,
                templatePath: page.templatePath,
                template_path: page.templatePath,
            }));

            allPages = allPages.concat(pages);
            nextPageUrl = data.paging?.next?.link || null;
        }

        return allPages;
    } catch (error) {
        console.error('Error fetching site pages:', error);
        throw new Error(`Failed to fetch site pages: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function getDomains(accessToken) {
    const response = await fetch(DOMAIN_URL, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data.results;
}

export async function getArchivedSitePages(accessToken) {
    try {
        const response = await fetch(ARCHIVED_PAGES_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        if (!data.results || !Array.isArray(data.results)) {
            console.error('Unexpected API response structure for archived pages:', data);
            return [];
        }

        return data.results.map(page => ({
            id: page.id,
            name: page.name,
            slug: page.slug,
            state: page.state,
            currentState: page.currentState,
            createdAt: page.createdAt,
            updatedAt: page.updatedAt,
            publishDate: page.publishDate,
            archived: true,
            archivedAt: page.archivedAt,
            absolute_url: page.url,
            templatePath: page.templatePath,
            template_path: page.templatePath,
        }));
    } catch (error) {
        console.error('Error fetching archived site pages:', error);
        throw error;
    }
}

function formatDate(dateString) {
    if (!dateString || dateString === "1970-01-01T00:00:00Z") {
        return '';
    }
    const date = new Date(dateString);
    return date.toLocaleString();
}

export async function getTemplates(accessToken) {
    try {
        const response = await fetch(TEMPLATES_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }

        const data = await response.json();
        return data.objects;
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw error;
    }
}

export async function updatePagesBatch(accessToken, batchInputJsonNode) {
    const response = await fetch('https://api.hubapi.com/cms/v3/pages/site-pages/batch/update', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(batchInputJsonNode)
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
}

export async function updatePageTemplate(pageId, templatePath, accessToken) {
    const response = await fetch(`https://api.hubapi.com/cms/v3/pages/site-pages/${pageId}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ templatePath })
    });

    if (!response.ok) {
        throw new Error(`HubSpot API responded with status ${response.status}`);
    }

    return response.json();
}

export async function handleApiError(error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), { status: 500 });
}

export async function restorePage(accessToken, pageId) {
    const response = await fetch(`https://api.hubapi.com/cms/v3/pages/site-pages/${pageId}?archived=true`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            archived: false
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Failed to restore page: ${response.status} ${response.statusText}. Body: ${errorBody}`);
    }

    const result = await response.json();
    console.log('Restore page result:', result);
}

export async function updatePageDomain(accessToken, pageId, domain) {
    const response = await fetch(
        `https://api.hubapi.com/cms/v3/pages/site-pages/${pageId}`,
        {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                domain: domain
            })
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update page domain');
    }

    return response.json();
}

export async function updatePage(pageId, updates, accessToken) {
    const response = await fetch(
        `https://api.hubapi.com/cms/v3/pages/site-pages/${pageId}`,
        {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update page');
    }

    return response.json();
}

export async function getBlogPosts(accessToken, archived = false) {
    let allPosts = [];
    let nextPageUrl = BLOG_POSTS_URL + (archived ? "&archived=true" : "");

    try {
        while (nextPageUrl) {
            const response = await fetch(nextPageUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
            }

            const data = await response.json();

            if (!data.results || !Array.isArray(data.results)) {
                throw new Error('Unexpected API response structure');
            }

            const posts = data.results.map(post => ({
                id: post.id,
                name: post.name,
                state: post.state,
                templatePath: post.templatePath,
                archived: post.archived,
                archivedAt: post.archivedAt,
                url: post.url,
                slug: post.slug,
                publishDate: post.publishDate,
                createdAt: post.created,
                updatedAt: post.updated,
                created: post.created,
                updated: post.updated
            }));

            allPosts = allPosts.concat(posts);
            nextPageUrl = data.paging?.next?.link || null;
        }

        return allPosts;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw new Error(`Failed to fetch blog posts: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function getBlogInfo(accessToken) {
    const response = await fetch('https://api.hubapi.com/content/api/v2/blogs?property=absolute_url,item_template_path', {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch blog info: ${response.statusText}`);
    }

    const data = await response.json();
    return data.objects.map(blog => ({
        url: blog.absolute_url,
        template_path: blog.item_template_path
    }));
}