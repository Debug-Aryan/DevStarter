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
const PORT = 4000;

// Security hardening:
// - Avoid trusting X-Forwarded-* unless explicitly configured (for Secure cookies/req.secure).
// - Disable x-powered-by to reduce fingerprinting.
app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? 1 : false);
app.disable('x-powered-by');

function getAllowedOrigins() {
  // Lock CORS to configured origins only. Never use wildcard/reflection with credentials.
  const raw = process.env.CLIENT_ORIGIN || process.env.CLIENT_ORIGINS;
  const list = (raw ? String(raw).split(',') : ['http://localhost:5173'])
    .map((s) => s.trim())
    .filter(Boolean);
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
}));
app.use(bodyParser.json());

app.post("/generate", generateRoutes);

app.use('/auth/github', githubAuthRoutes);
app.post('/publish-github', publishGithub);

startCleanupInterval();
startGithubSessionCleanup();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

