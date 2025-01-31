import type { APIRoute } from 'astro';
import { getAuthFromCookies } from '../../../lib/auth';
import { config } from '../../../lib/config/env';

export const POST: APIRoute = async ({ cookies, request }) => {
  const auth = getAuthFromCookies(cookies);

  if (!auth.accessToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const data = await request.json();

    if (!data.id) {
      return new Response(
        JSON.stringify({ error: 'Redirect ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const response = await fetch(
      `${config.hubspot.urls.api}/cms/v3/url-redirects/${data.id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${auth.accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          routePrefix: data.routePrefix,
          destination: data.destination,
          redirectStyle: data.redirectStyle,
          precedence: data.precedence,
          isPattern: data.isPattern,
          isOnlyAfterNotFound: data.isOnlyAfterNotFound,
          isMatchFullUrl: data.isMatchFullUrl,
          isMatchQueryString: data.isMatchQueryString,
          isTrailingSlashOptional: data.isTrailingSlashOptional,
          isProtocolAgnostic: data.isProtocolAgnostic,
          isEnabled: true
        })
      }
    );

    if (!response.ok) {
      throw new Error('Failed to update redirect in HubSpot');
    }

    const result = await response.json();
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error updating redirect:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to update redirect' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};