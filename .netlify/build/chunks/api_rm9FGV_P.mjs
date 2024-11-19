const CLIENT_ID = "ae8c5855-8073-44da-a912-8c360a7f3d20";
const CLIENT_SECRET = "e31bf414-e8bb-4432-9894-9e1a835557cc";
const REDIRECT_URI = "http://localhost:4321/callback";
const SCOPES = "content";
const AUTH_URL = "https://app.hubspot.com/oauth/authorize";
const TOKEN_URL = "https://api.hubapi.com/oauth/v1/token";
const SITE_PAGES_URL = "https://api.hubapi.com/cms/v3/pages/site-pages?limit=100&archived=true";
const TEMPLATES_URL = "https://api.hubapi.com/content/api/v2/templates?is_available_for_new_content=true&limit=1000";
const DOMAIN_URL = "https://api.hubapi.com/cms/v3/domains/";
function getAuthUrl() {
  return `${AUTH_URL}?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;
}
async function getAccessTokenFromCode(code) {
  const tokenResponse = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code
    })
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error(`Failed to get access token: ${tokenData.error}`);
  }
  const accessToken = tokenData.access_token;
  const portalResponse = await fetch("https://api.hubapi.com/oauth/v1/access-tokens/" + accessToken, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });
  const portalData = await portalResponse.json();
  if (!portalResponse.ok) {
    throw new Error(`Failed to get portal ID: ${portalData.error}`);
  }
  const portalId = portalData.hub_id.toString();
  console.log("Access token:", accessToken);
  console.log("Portal ID:", portalId);
  return { accessToken, portalId };
}
function getAccessTokenFromRequest(request) {
  return request.headers.get("Cookie")?.split(";").find((c) => c.trim().startsWith("hubspot_access_token="))?.split("=")[1] || null;
}
async function getSitePages(accessToken) {
  let allPages = [];
  let nextPageUrl = SITE_PAGES_URL;
  try {
    while (nextPageUrl) {
      const response = await fetch(nextPageUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.results || !Array.isArray(data.results)) {
        throw new Error("Unexpected API response structure");
      }
      const pages = data.results.map((page) => ({
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
        template_path: page.templatePath
      }));
      allPages = allPages.concat(pages);
      nextPageUrl = data.paging?.next?.link || null;
    }
    return allPages;
  } catch (error) {
    console.error("Error fetching site pages:", error);
    throw new Error(`Failed to fetch site pages: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
async function getDomains(accessToken) {
  const response = await fetch(DOMAIN_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  const data = await response.json();
  return data.results;
}
async function getTemplates(accessToken) {
  try {
    const response = await fetch(TEMPLATES_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      }
    });
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }
    const data = await response.json();
    return data.objects;
  } catch (error) {
    console.error("Error fetching templates:", error);
    throw error;
  }
}
async function updatePagesBatch(accessToken, batchInputJsonNode) {
  const response = await fetch("https://api.hubapi.com/cms/v3/pages/site-pages/batch/update", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(batchInputJsonNode)
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}
async function handleApiError(error) {
  console.error("API Error:", error);
  return new Response(JSON.stringify({ error: "An error occurred" }), { status: 500 });
}
async function restorePage(accessToken, pageId) {
  const response = await fetch(`https://api.hubapi.com/cms/v3/pages/site-pages/${pageId}?archived=true`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      archived: false
    })
  });
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to restore page: ${response.status} ${response.statusText}. Body: ${errorBody}`);
  }
  const result = await response.json();
  console.log("Restore page result:", result);
}
async function updatePageDomain(accessToken, pageId, domain) {
  const response = await fetch(
    `https://api.hubapi.com/cms/v3/pages/site-pages/${pageId}`,
    {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        domain
      })
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update page domain");
  }
  return response.json();
}
async function updatePage(pageId, updates, accessToken) {
  const response = await fetch(
    `https://api.hubapi.com/cms/v3/pages/site-pages/${pageId}`,
    {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updates)
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update page");
  }
  return response.json();
}
async function getBlogPosts(accessToken) {
  const response = await fetch("https://api.hubapi.com/cms/v3/blogs/posts?archived=true", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
  }
  const data = await response.json();
  return data.results.map((post) => ({
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
}
async function getBlogInfo(accessToken) {
  const response = await fetch("https://api.hubapi.com/content/api/v2/blogs?property=absolute_url,item_template_path", {
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch blog info: ${response.statusText}`);
  }
  const data = await response.json();
  return data.objects.map((blog) => ({
    url: blog.absolute_url,
    template_path: blog.item_template_path
  }));
}

export { updatePagesBatch as a, updatePage as b, getBlogPosts as c, getBlogInfo as d, getDomains as e, getAccessTokenFromCode as f, getAccessTokenFromRequest as g, handleApiError as h, getSitePages as i, getTemplates as j, getAuthUrl as k, restorePage as r, updatePageDomain as u };
