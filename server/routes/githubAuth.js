const express = require('express');
const { createSession } = require('../utils/githubSessionStore');
const { parseCookies, serializeCookie } = require('../utils/cookie');
const { randomUUID } = require('crypto');

const router = express.Router();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function getClientAppUrl() {
  return process.env.CLIENT_APP_URL || process.env.CLIENT_ORIGIN || 'http://localhost:5173';
}

function isHttps(req) {
  // Prefer Express' req.secure (requires app.set('trust proxy', 1) behind proxies).
  // Also support platforms that always send X-Forwarded-Proto even if trust proxy is mis-set.
  const forwardedProto = (req.headers['x-forwarded-proto'] || '').toString().split(',')[0].trim();
  const forwardedSsl = (req.headers['x-forwarded-ssl'] || '').toString().toLowerCase();
  if (forwardedProto) return forwardedProto === 'https';
  if (forwardedSsl) return forwardedSsl === 'on';
  return Boolean(req.secure || req.protocol === 'https');
}

function getBrowserIdCookieName() {
  return process.env.BROWSER_SESSION_COOKIE_NAME || 'ds_browser';
}

function getOauthStateCookieName() {
  return process.env.GITHUB_OAUTH_STATE_COOKIE_NAME || 'gh_oauth_state';
}

function getSameSite() {
  // Defaults: Lax for localhost dev; for cross-site prod SPA use None + Secure.
  const explicit = process.env.GITHUB_COOKIE_SAMESITE;
  if (explicit) return explicit;

  const clientAppUrl = getClientAppUrl();
  const isLocalClient = /^(http:\/\/localhost|http:\/\/127\.0\.0\.1|https:\/\/localhost|https:\/\/127\.0\.0\.1)/i.test(clientAppUrl);
  const isHttpsClient = /^https:\/\//i.test(clientAppUrl);

  // If the client is hosted on HTTPS and not localhost, assume cross-site cookie usage.
  // This avoids production breakage when NODE_ENV is unset/mis-set.
  if (isHttpsClient && !isLocalClient) return 'None';

  return process.env.NODE_ENV === 'production' ? 'None' : 'Lax';
}

function shouldUsePartitionedCookies({ sameSite } = {}) {
  // Default on when SameSite=None (cross-site). Can be disabled explicitly.
  const explicit = process.env.GITHUB_COOKIE_PARTITIONED;
  if (explicit === 'false') return false;
  if (explicit === 'true') return true;
  return String(sameSite || '').toLowerCase() === 'none';
}

function getSessionTtlSeconds() {
  const raw = process.env.GITHUB_SESSION_TTL_MS;
  const parsed = raw ? Number(raw) : NaN;
  const ttlMs = Number.isFinite(parsed) && parsed > 0 ? parsed : 60 * 60 * 1000;
  return Math.max(60, Math.floor(ttlMs / 1000));
}

function getOauthStateTtlSeconds() {
  const raw = process.env.GITHUB_OAUTH_STATE_TTL_SECONDS;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 10 * 60; // 10 minutes
}

function getServerBaseUrl(req) {
  // Prefer explicit public URL in production deployments.
  const explicit = process.env.SERVER_PUBLIC_URL;
  if (explicit) {
    const trimmed = String(explicit).trim().replace(/\/$/, '');
    // Normalize to origin only (strip any accidental path like "/api").
    // OAuth redirect_uri must match the actual request path; we compute that from req.baseUrl.
    try {
      return new URL(trimmed).origin;
    } catch {
      return trimmed;
    }
  }
  const proto = isHttps(req) ? 'https' : 'http';
  return `${proto}://${req.get('host')}`;
}

function buildAuthorizeUrl({ state, redirectUri }) {
  const clientId = requireEnv('GITHUB_CLIENT_ID');
  // Minimum scope for creating + uploading to private repos via OAuth Apps is typically 'repo'.
  // Keep configurable, but default to repo to preserve current publish behavior.
  const scope = process.env.GITHUB_SCOPE || 'repo';

  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('scope', scope);
  url.searchParams.set('redirect_uri', redirectUri);
  if (state) url.searchParams.set('state', state);
  return url.toString();
}

async function exchangeCodeForToken({ code, redirectUri }) {
  const client_id = requireEnv('GITHUB_CLIENT_ID');
  const client_secret = requireEnv('GITHUB_CLIENT_SECRET');

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'User-Agent': 'DevStarter',
    },
    body: JSON.stringify({
      client_id,
      client_secret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const msg = data?.error_description || data?.error || `Token exchange failed (${response.status})`;
    const err = new Error(msg);
    err.status = response.status;
    err.details = data;
    throw err;
  }

  if (!data?.access_token) {
    const err = new Error('Token exchange succeeded but no access_token returned');
    err.details = data;
    throw err;
  }

  return data.access_token;
}

// Optional convenience endpoint: server-side redirect to GitHub authorize.
router.get('/login', (req, res) => {
  // Works for both mounts: `/auth/github` and `/api/auth/github`.
  const redirectUri = `${getServerBaseUrl(req)}${req.baseUrl}/callback`;

  // Security hardening: generate state server-side and store in an HttpOnly cookie.
  // This prevents OAuth CSRF/login-binding attacks.
  const state = randomUUID();

  const cookies = parseCookies(req.headers.cookie);
  const browserCookieName = getBrowserIdCookieName();
  let browserId = cookies[browserCookieName] || null;
  if (!browserId) browserId = randomUUID();

  const secure = process.env.GITHUB_COOKIE_SECURE === 'true' ? true : isHttps(req);
  const sameSite = getSameSite();
  const partitioned = shouldUsePartitionedCookies({ sameSite }) && secure;
  const stateCookieName = getOauthStateCookieName();

  try {
    const url = buildAuthorizeUrl({ state, redirectUri });

    // Set/refresh browser id and OAuth state cookies.
    res.setHeader('Set-Cookie', [
      serializeCookie(browserCookieName, encodeURIComponent(browserId), {
        path: '/',
        httpOnly: true,
        sameSite,
        secure,
        partitioned,
        maxAge: 7 * 24 * 60 * 60,
      }),
      serializeCookie(stateCookieName, encodeURIComponent(state), {
        path: '/',
        httpOnly: true,
        sameSite,
        secure,
        partitioned,
        maxAge: getOauthStateTtlSeconds(),
      }),
    ]);

    res.redirect(url);
  } catch (err) {
    // Do not leak internal misconfig details.
    res.status(500).json({ error: 'GitHub OAuth misconfigured' });
  }
});

// OAuth callback: exchange code -> access token.
// Per frontend requirement, redirects back to the client with the token in query params.
router.get('/callback', async (req, res) => {
  const code = req.query.code ? String(req.query.code) : null;
  const returnedState = req.query.state ? String(req.query.state) : null;
  const clientAppUrl = getClientAppUrl();
  // Must match the redirect_uri used in /login.
  const redirectUri = `${getServerBaseUrl(req)}${req.baseUrl}/callback`;

  // Verify OAuth state (CSRF protection).
  const cookies = parseCookies(req.headers.cookie);
  const stateCookieName = getOauthStateCookieName();
  const expectedState = cookies[stateCookieName] || null;
  const sameSite = getSameSite();
  const secure = process.env.GITHUB_COOKIE_SECURE === 'true' ? true : isHttps(req);
  const partitioned = shouldUsePartitionedCookies({ sameSite }) && secure;

  // Always clear the state cookie after callback (one-time use).
  const clearStateCookie = serializeCookie(stateCookieName, '', {
    path: '/',
    httpOnly: true,
    sameSite,
    secure,
    partitioned,
    maxAge: 0,
  });

  if (!returnedState || !expectedState || returnedState !== expectedState) {
    const url = new URL('/success', clientAppUrl);
    url.searchParams.set('github_error', 'state_mismatch');
    res.setHeader('Set-Cookie', clearStateCookie);
    return res.redirect(url.toString());
  }

  if (!code) {
    const url = new URL('/success', clientAppUrl);
    url.searchParams.set('github_error', 'missing_code');
    res.setHeader('Set-Cookie', clearStateCookie);
    return res.redirect(url.toString());
  }

  try {
    const token = await exchangeCodeForToken({ code, redirectUri });

    // Bind the GitHub session to the browser id used during generation.
    const browserCookieName = getBrowserIdCookieName();
    const browserId = cookies[browserCookieName] || null;

    const sessionId = createSession({ token, browserId });
    const cookieName = process.env.GITHUB_SESSION_COOKIE_NAME || 'gh_session';

    // SameSite=Lax works on localhost (same-site across ports). For production cross-site,
    // you may need SameSite=None + Secure behind HTTPS.
    // Align cookie lifetime with server-side session TTL.
    const maxAge = getSessionTtlSeconds();
    res.setHeader('Set-Cookie', [
      clearStateCookie,
      serializeCookie(cookieName, encodeURIComponent(sessionId), {
        path: '/',
        httpOnly: true,
        sameSite,
        secure,
        partitioned,
        maxAge,
      }),
    ]);

    const url = new URL('/success', clientAppUrl);
    url.searchParams.set('github_connected', '1');
    return res.redirect(url.toString());
  } catch (err) {
    const url = new URL('/success', clientAppUrl);
    url.searchParams.set('github_error', 'token_exchange_failed');
    // Do not leak internal error details into the URL.
    res.setHeader('Set-Cookie', clearStateCookie);
    return res.redirect(url.toString());
  }
});

module.exports = router;
