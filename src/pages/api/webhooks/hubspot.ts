import type { APIRoute } from 'astro';
import { config } from '../../../lib/config/env';
import crypto from 'node:crypto';

// Validate that the webhook request came from HubSpot
function isValidHubSpotRequest(request: Request, rawBody: string): boolean {
  const signature = request.headers.get('X-HubSpot-Signature');
  if (!signature) return false;

  const sourceString = config.hubspot.clientSecret + rawBody;
  const hash = crypto
    .createHash('sha256')
    .update(sourceString)
    .digest('hex');

  return hash === signature;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get the raw body for signature validation
    const rawBody = await request.text();

    // Validate the request is from HubSpot
    if (!isValidHubSpotRequest(request, rawBody)) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Parse the webhook payload
    const events = JSON.parse(rawBody);

    // Process each event in the batch
    for (const event of events) {
      // Handle app installation events
      if (event.subscriptionType === 'app.subscription.installed') {
        console.log('App installed in portal:', event.portalId);
        // Add your custom logic here for when the app is installed
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};