import type { APIRoute } from 'astro';
import cache from '../../../lib/utils/cache';

export const get: APIRoute = async () => {
  try {
    cache.debug();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500 }
    );
  }
};