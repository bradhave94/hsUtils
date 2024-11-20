import type { AstroCookies } from 'astro';
import { z } from 'zod';
import { refreshAccessToken, setAuthCookies } from '../auth';

const authSchema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
  expiresAt: z.number().optional(),
  portalId: z.string().optional(),
});

export async function checkAuth(cookies: AstroCookies) {
  const auth = authSchema.parse({
    accessToken: cookies.get('hubspot_access_token')?.value,
    refreshToken: cookies.get('hubspot_refresh_token')?.value,
    expiresAt: cookies.get('hubspot_expires_at')?.value ? 
      parseInt(cookies.get('hubspot_expires_at')?.value || '0') : undefined,
    portalId: cookies.get('hubspot_portal_id')?.value,
  });

  const isAuthenticated = !!(auth.accessToken && auth.portalId);
  const needsRefresh = auth.expiresAt ? Date.now() >= auth.expiresAt : false;

  // Automatically refresh token if needed
  if (isAuthenticated && needsRefresh && auth.refreshToken) {
    try {
      const newAuth = await refreshAccessToken(auth.refreshToken);
      setAuthCookies(cookies, newAuth);
      return {
        ...newAuth,
        isAuthenticated: true,
        needsRefresh: false,
      };
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return {
        ...auth,
        isAuthenticated: false,
        needsRefresh: true,
      };
    }
  }

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