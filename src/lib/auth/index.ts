import type { AstroCookies } from 'astro';
import { config } from '../config/env';

interface CookieOptions {
  path: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  maxAge: number;
  domain: string;
  expires: Date;
  encode: (value: string) => string;
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

interface PortalResponse {
  hub_id: number;
}

export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  portalId: string;
  expiresAt: number;
}

export function getAuthUrl(): string {
  const { clientId, redirectUri, scopes, urls } = config.hubspot;
  return `${urls.auth}?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;
}

export function getAccessTokenFromRequest(request: Request): string | null {
  return request.headers.get('Cookie')
    ?.split(';')
    .find(c => c.trim().startsWith('hubspot_access_token='))
    ?.split('=')[1] || null;
}

export async function getAccessTokenFromCode(code: string): Promise<AuthResult> {
  const tokenData = await exchangeToken({
    grant_type: 'authorization_code',
    code,
  });

  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const expiresAt = Date.now() + (tokenData.expires_in * 1000);

  const portalResponse = await fetch(
    `${config.hubspot.urls.api}/oauth/v1/access-tokens/${accessToken}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` }
    }
  );

  if (!portalResponse.ok) {
    throw new Error('Failed to get portal information');
  }

  const portalData = await portalResponse.json() as PortalResponse;
  const portalId = portalData.hub_id.toString();

  return {
    accessToken,
    refreshToken,
    portalId,
    expiresAt
  };
}

export async function refreshAccessToken(refreshToken: string): Promise<AuthResult> {
  const tokenData = await exchangeToken({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const portalResponse = await fetch(
    `${config.hubspot.urls.api}/oauth/v1/access-tokens/${tokenData.access_token}`,
    {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    }
  );

  if (!portalResponse.ok) {
    throw new Error('Failed to get portal information');
  }

  const portalData = await portalResponse.json() as PortalResponse;

  return {
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
    portalId: portalData.hub_id.toString(),
    expiresAt: Date.now() + (tokenData.expires_in * 1000)
  };
}

async function exchangeToken(params: Record<string, string>): Promise<TokenResponse> {
  const { clientId, clientSecret, redirectUri, urls } = config.hubspot;

  const response = await fetch(urls.token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      ...params
    })
  });

  if (!response.ok) {
    throw new Error('Failed to exchange token');
  }

  return response.json();
}

export function setAuthCookies(cookies: AstroCookies, auth: AuthResult): void {
  console.log(auth)
  const cookieOptions: CookieOptions = {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    domain: '',
    maxAge: auth.expiresAt,
    expires: new Date(auth.expiresAt),
    encode: (value: string) => value
  };

  const shortTerm = {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 // 24 hours in seconds
  };

  const longTerm = {
    ...cookieOptions,
    maxAge: 30 * 24 * 60 * 60 // 30 days in seconds
  };

  cookies.set('hubspot_access_token', auth.accessToken, shortTerm);
  cookies.set('hubspot_refresh_token', auth.refreshToken, longTerm);
  cookies.set('hubspot_expires_at', auth.expiresAt.toString(), shortTerm);
  cookies.set('hubspot_portal_id', auth.portalId, shortTerm);
}

export function clearAuthCookies(cookies: AstroCookies): void {
  const cookieOptions = {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'strict' as const,
    domain: ''
  };

  cookies.delete('hubspot_access_token', cookieOptions);
  cookies.delete('hubspot_refresh_token', cookieOptions);
  cookies.delete('hubspot_expires_at', cookieOptions);
  cookies.delete('hubspot_portal_id', cookieOptions);
}

export function getAuthFromCookies(cookies: AstroCookies): Partial<AuthResult> & { needsRefresh: boolean } {
  const accessToken = cookies.get('hubspot_access_token')?.value;
  const refreshToken = cookies.get('hubspot_refresh_token')?.value;
  const expiresAt = cookies.get('hubspot_expires_at')?.value;
  const portalId = cookies.get('hubspot_portal_id')?.value;

  const needsRefresh = expiresAt ? Date.now() >= Number.parseInt(expiresAt) : false;

  return {
    accessToken,
    refreshToken,
    portalId,
    expiresAt: expiresAt ? Number.parseInt(expiresAt) : undefined,
    needsRefresh
  };
}