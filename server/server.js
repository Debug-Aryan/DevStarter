const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require('dotenv');
const generateRoutes = require("./routes/generate");

const githubAuthRoutes = require('./routes/githubAuth');
const { publishGithub } = require('./controllers/githubPublish');
const { startCleanupInterval } = require('./utils/projectRegistry');
const { startCleanupInterval: startGithubSessionCleanup } = require('./utils/githubSessionStore');

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Security hardening:
// - Avoid trusting X-Forwarded-* unless explicitly configured (for Secure cookies/req.secure).
// - Disable x-powered-by to reduce fingerprinting.
// In production (Render/Vercel/etc.), requests typically arrive via a proxy.
// Trusting the first proxy allows Express to correctly detect HTTPS via X-Forwarded-Proto
// (important for Secure cookies and redirect URLs).
const trustProxy = process.env.TRUST_PROXY;
const clientAppUrl = process.env.CLIENT_APP_URL || process.env.CLIENT_ORIGIN || '';
const serverPublicUrl = process.env.SERVER_PUBLIC_URL || '';
const looksLikeHttpsDeployment = /^https:\/\//i.test(clientAppUrl) || /^https:\/\//i.test(serverPublicUrl);

app.set(
  'trust proxy',
  trustProxy === 'false'
    ? false
    : (trustProxy === 'true' || process.env.NODE_ENV === 'production' || looksLikeHttpsDeployment)
      ? 1
      : false
);
app.disable('x-powered-by');

function getAllowedOrigins() {
  // Lock CORS to configured origins only. Never use wildcard/reflection with credentials.
  const raw = process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGINS;
  const clientAppUrl = process.env.CLIENT_APP_URL;
  const baseList = raw ? String(raw).split(',') : [];

  function normalizeToOrigin(value) {
    if (!value) return '';
    const trimmed = String(value).trim();
    if (!trimmed) return '';
    // If someone provides a full URL (including path/query), normalize to its origin.
    // This prevents mismatches like "https://app.vercel.app/" vs Origin "https://app.vercel.app".
    if (trimmed.includes('://')) {
      try {
        return new URL(trimmed).origin;
      } catch {
        // Fall through to best-effort normalization.
      }
    }
    // Best-effort: remove trailing slashes.
    return trimmed.replace(/\/+$/, '');
  }

  const list = [...baseList, clientAppUrl]
    .map(normalizeToOrigin)
    .filter(Boolean);
  // Sensible defaults for local dev if nothing was configured.
  if (list.length === 0) {
    list.push('http://localhost:5173');
  }
  return Array.from(new Set(list));
}

const allowedOrigins = getAllowedOrigins();

function corsOriginValidator(origin, callback) {
  // Allow same-origin or non-browser requests (no Origin header) by default.
  // For browser requests with Origin, enforce allowlist.
  if (!origin) return callback(null, true);
  if (allowedOrigins.includes(origin)) return callback(null, true);
  return callback(new Error('CORS origin not allowed'), false);
}

app.use(cors({
  origin: corsOriginValidator,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-DevStarter-Session',
    'X-DevStarter-Github-Session',
    'X-DevStarter-Project-Token',
    'X-Project-Token',
  ],
}));
// Ensure preflight requests are answered for all routes.
app.options(/.*/, cors({ origin: corsOriginValidator, credentials: true }));
app.use(bodyParser.json());

// API routes
// For backwards compatibility we support both unprefixed routes and `/api/*`.
// This allows Vercel clients to use a stable `/api` prefix while keeping local/dev usage unchanged.
app.post("/generate", generateRoutes);
app.post("/api/generate", generateRoutes);

app.use('/auth/github', githubAuthRoutes);
app.use('/api/auth/github', githubAuthRoutes);

app.post('/publish-github', publishGithub);
app.post('/api/publish-github', publishGithub);

startCleanupInterval();
startGithubSessionCleanup();

app.listen(PORT, () => {
  console.log(`Server is running at Port ${PORT}`);
});

