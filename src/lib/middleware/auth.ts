import type { AstroCookies } from 'astro';
import { z } from 'zod';

const authSchema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresAt: z.number().optional(),
  portalId: z.string().optional(),
});

export function checkAuth(cookies: AstroCookies) {
  const auth = authSchema.parse({
    accessToken: cookies.get('hubspot_access_token')?.value,
    refreshToken: cookies.get('hubspot_refresh_token')?.value,
    expiresAt: cookies.get('hubspot_expires_at')?.value ? 
      parseInt(cookies.get('hubspot_expires_at')?.value || '0') : undefined,
    portalId: cookies.get('hubspot_portal_id')?.value,
  });

  const isAuthenticated = !!(auth.accessToken && auth.portalId);
  const needsRefresh = auth.expiresAt ? Date.now() >= auth.expiresAt : false;

  return {
    ...auth,
    isAuthenticated,
    needsRefresh,
  };
}

export function checkPassword(request: Request): boolean {
  const SITE_PASSWORD = import.meta.env.SITE_PASSWORD;

  if (!SITE_PASSWORD) {
    return true;
  }

  const cookies = request.headers.get('cookie') || '';
  return cookies.includes(`site-password=${SITE_PASSWORD}`);
}