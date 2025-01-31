import type { APIRoute } from 'astro';
import { getAuthFromCookies } from '../../../lib/auth';
import { config } from '../../../lib/config/env';

export const GET: APIRoute = async ({ request, cookies }) => {
  const auth = getAuthFromCookies(cookies);
  if (!auth?.accessToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const url = new URL(request.url);
    const after = url.searchParams.get('after');
    const limit = url.searchParams.get('limit') || '10';

    // Construct HubSpot API URL with parameters
    let hubspotUrl = `${config.hubspot.urls.api}/cms/v3/url-redirects`;
    const params = new URLSearchParams();
    params.append('limit', limit);
    if (after) {
      params.append('after', after);
    }
    hubspotUrl += `?${params.toString()}`;

    const response = await fetch(hubspotUrl, {
      headers: {
        'Authorization': `Bearer ${auth.accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HubSpot API error: ${response.statusText}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error fetching redirects:', error);
    return new Response(JSON.stringify({
      error: 'Failed to fetch redirects',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};