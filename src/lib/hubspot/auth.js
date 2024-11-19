const CLIENT_ID = import.meta.env.HUBSPOT_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.HUBSPOT_CLIENT_SECRET;
const REDIRECT_URI = import.meta.env.REDIRECT_URI;
const SCOPES = 'content';

const AUTH_URL = 'https://app.hubspot.com/oauth/authorize';
const TOKEN_URL = 'https://api.hubapi.com/oauth/v1/token';
const REFRESH_TOKEN_INFO_URL = 'https://api.hubapi.com/oauth/v1/refresh-tokens/';

const CSRF_COOKIE_NAME = 'hubspot_csrf_token';
const CSRF_HEADER_NAME = 'X-CSRF-Token';

export function getAuthUrl() {
    return `${AUTH_URL}?client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}`;
}

export async function getAccessTokenFromCode(code) {
    const tokenData = await exchangeToken({
        grant_type: 'authorization_code',
        code: code,
    });

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresAt = Date.now() + (tokenData.expires_in * 1000);

    const portalResponse = await fetch('https://api.hubapi.com/oauth/v1/access-tokens/' + accessToken, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    });
    const portalData = await portalResponse.json();
    if (!portalResponse.ok) {
        throw new Error(`Failed to get portal ID: ${portalData.error}`);
    }

    const portalId = portalData.hub_id.toString();

    return {
        accessToken,
        refreshToken,
        portalId,
        expiresAt
    };
}

export async function refreshAccessToken(refreshToken) {
    const now = Date.now();
    const attempts = refreshAttempts.get(refreshToken) || [];

    // Clean up old attempts
    const recentAttempts = attempts.filter(time => now - time < REFRESH_WINDOW_MS);

    if (recentAttempts.length >= MAX_REFRESH_ATTEMPTS) {
        throw new Error('Too many refresh attempts. Please try again later.');
    }

    recentAttempts.push(now);
    refreshAttempts.set(refreshToken, recentAttempts);

    try {
        return await exchangeToken({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        });
    } catch (error) {
        // Clear attempts on successful refresh
        refreshAttempts.delete(refreshToken);
        throw error;
    }
}

export async function getRefreshTokenInfo(refreshToken) {
    const response = await fetch(REFRESH_TOKEN_INFO_URL + refreshToken, {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || 'Failed to get refresh token info');
        error.status = data.status;
        error.correlationId = data.correlationId;
        error.requestId = data.requestId;
        throw error;
    }

    return data;
}

export function isTokenExpired(expiresAt, bufferSeconds = 300) {
    // Check if token is expired or will expire within bufferSeconds (default 5 minutes)
    return Date.now() >= (expiresAt - (bufferSeconds * 1000));
}

async function exchangeToken(params) {
    const response = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            ...params
        })
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || 'Failed to exchange token');
        error.status = data.status;
        error.correlationId = data.correlationId;
        error.requestId = data.requestId;
        throw error;
    }

    return data;
}

export function getAccessTokenFromRequest(request) {
    return request.headers.get('Cookie')
        ?.split(';')
        .find(c => c.trim().startsWith('hubspot_access_token='))
        ?.split('=')[1] || null;
}

export function checkAuth(cookies) {
    const accessTokenCookie = cookies.get('hubspot_access_token');
    const refreshTokenCookie = cookies.get('hubspot_refresh_token');
    const expiresAtCookie = cookies.get('hubspot_expires_at');
    const portalIdCookie = cookies.get('hubspot_portal_id');

    const accessToken = accessTokenCookie?.value;
    const refreshToken = refreshTokenCookie?.value;
    const expiresAt = expiresAtCookie?.value ? parseInt(expiresAtCookie.value) : null;
    const portalId = portalIdCookie?.value;

    // Validate tokens
    if (!validateToken(accessToken) || !validateToken(refreshToken)) {
        return {
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
            expiresAt: null,
            portalId: null,
            needsRefresh: false
        };
    }

    const isAuthenticated = !!(accessToken && portalId);

    return {
        isAuthenticated,
        accessToken,
        refreshToken,
        expiresAt,
        portalId,
        needsRefresh: expiresAt ? isTokenExpired(expiresAt) : false
    };
}

export function setAuthCookies(cookies, { accessToken, refreshToken, expiresAt, portalId }) {
    const csrfToken = generateCsrfToken();

    // Set CSRF cookie (accessible to JS for headers)
    cookies.set(CSRF_COOKIE_NAME, csrfToken, {
        path: '/',
        httpOnly: false, // Needs to be accessible to JS
        secure: true,
        sameSite: 'strict'
    });

    // Set auth cookies (no JS access)
    cookies.set('hubspot_access_token', accessToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict', // Changed from 'lax' to 'strict'
        maxAge: 60 * 60 * 24 // 24 hours
    });

    cookies.set('hubspot_refresh_token', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30 // 30 days
    });

    cookies.set('hubspot_expires_at', expiresAt.toString(), {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
    });

    cookies.set('hubspot_portal_id', portalId, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
    });

    return csrfToken;
}

export function clearAuthCookies(cookies) {
    const cookieOptions = { path: '/', secure: true, sameSite: 'strict' };
    cookies.delete('hubspot_access_token', cookieOptions);
    cookies.delete('hubspot_refresh_token', cookieOptions);
    cookies.delete('hubspot_expires_at', cookieOptions);
    cookies.delete('hubspot_portal_id', cookieOptions);
    cookies.delete(CSRF_COOKIE_NAME, cookieOptions);
}

function generateCsrfToken() {
    return crypto.randomUUID();
}

const refreshAttempts = new Map();
const MAX_REFRESH_ATTEMPTS = 5;
const REFRESH_WINDOW_MS = 60 * 1000; // 1 minute

function validateToken(token) {
    if (!token || typeof token !== 'string') return false;
    // Add additional validation as needed
    return token.length > 0 && token.length < 1000;
}

export function getPortalIdFromCookies(cookies) {
    return cookies.get('hubspot_portal_id')?.value || '';
}
