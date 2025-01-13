import type { APIRoute } from 'astro';
import { getAuthFromCookies } from '../../../lib/auth';
import { config } from '../../../lib/config/env';

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = getAuthFromCookies(cookies);
  if (!auth?.accessToken) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { redirects } = await request.json();

    // Validate input
    if (!Array.isArray(redirects) || redirects.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Update each redirect
    const updatePromises = redirects.map(async (redirect) => {
      const response = await fetch(
        `${config.hubspot.urls.api}/cms/v3/url-redirects/${redirect.id}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${auth.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            routePrefix: redirect.routePrefix,
            destination: redirect.destination,
            redirectStyle: redirect.redirectStyle,
            isPattern: redirect.isPattern
          })
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update redirect ${redirect.id}: ${response.statusText}`);
      }

      return response.json();
    });

    // Wait for all updates to complete
    const results = await Promise.allSettled(updatePromises);

    // Check for any failures
    const failures = results.filter(r => r.status === 'rejected');
    if (failures.length > 0) {
      return new Response(JSON.stringify({
        error: 'Some updates failed',
        failures: failures.map(f => (f as PromiseRejectedResult).reason.message)
      }), {
        status: 207,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      message: 'All redirects updated successfully',
      results: results.map(r => (r as PromiseFulfilledResult<any>).value)
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error updating redirects:', error);
    return new Response(JSON.stringify({
      error: 'Failed to update redirects',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};