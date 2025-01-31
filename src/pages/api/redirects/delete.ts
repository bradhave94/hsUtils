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
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one redirect ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Delete redirects in parallel
    const deletePromises = ids.map(id =>
      fetch(
        `${config.hubspot.urls.api}/cms/v3/url-redirects/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${auth.accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      )
    );

    const results = await Promise.allSettled(deletePromises);

    // Check if any deletions failed
    const failures = results.filter(result => result.status === 'rejected');
    if (failures.length > 0) {
      console.error('Some redirects failed to delete:', failures);
      return new Response(
        JSON.stringify({
          error: 'Some redirects failed to delete',
          failedCount: failures.length,
          totalCount: ids.length
        }),
        {
          status: 207,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({ message: 'All redirects deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error deleting redirects:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to delete redirects' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};