const fs = require('fs-extra');
const path = require('path');
const os = require('os');
const { githubRequest } = require('../utils/githubApi');
const { uploadFolderAsSingleCommit } = require('../utils/uploadFolderGitData');
const { getProject, cleanupProject } = require('../utils/projectRegistry');
const { parseCookies, serializeCookie } = require('../utils/cookie');
const { getSession: getGithubSession, deleteSession } = require('../utils/githubSessionStore');

// Prevent duplicate publishes (e.g., React StrictMode remounts, mobile double-tap, retry races).
// Keyed by (sessionId, projectId) so the same browser/session can't create two repos for one project.
const inFlightPublishes = new Map();

function getTempProjectsBase() {
  const explicit = process.env.TEMP_PROJECTS_DIR || process.env.TEMP_PROJECTS_ROOT;
  if (explicit) return path.resolve(String(explicit));

  if (process.env.TEMP_PROJECTS_IN_REPO === 'true') {
    return path.resolve(__dirname, '..', '..', 'temp_projects');
  }

  return path.join(os.tmpdir(), 'devstarter', 'temp_projects');
}

function isSubPath(parent, child) {
  const rel = path.relative(parent, child);
  return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
}

function normalizeRepoName(name) {
  const raw = String(name || '').trim();
  // GitHub repo names cannot contain spaces and have a limited charset.
  // Convert user/project names to a safe slug.
  const slug = raw
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^[-.]+|[-.]+$/g, '');
  return slug;
}

function isHttps(req) {
  return Boolean(req.secure || req.protocol === 'https');
}

function getSameSite() {
  return process.env.GITHUB_COOKIE_SAMESITE || 'Lax';
}

function shortSuffix() {
  return Math.random().toString(36).slice(2, 6);
}

function isRepoNameAlreadyExistsError(err) {
  const details = err?.details;
  if (!details || typeof details !== 'object') return false;
  const errors = Array.isArray(details.errors) ? details.errors : [];
  return errors.some((e) => {
    const code = String(e?.code || '').toLowerCase();
    const message = String(e?.message || '').toLowerCase();
    return code.includes('already_exists') || message.includes('name already exists');
  });
}

async function createRepo({ token, repoName }) {
  const url = 'https://api.github.com/user/repos';
  const body = {
    name: repoName,
    // Default to private repositories.
    private: true,
    // Ensure git database/refs exist immediately; Git Data API endpoints can return
    // 409 "Git Repository is empty." on brand-new empty repos.
    auto_init: true,
  };
  return githubRequest({ token, method: 'POST', url, body });
}

async function createRepoWithRetry({ token, desiredName }) {
  const base = normalizeRepoName(desiredName);
  if (!base) {
    const err = new Error('Invalid repoName after normalization');
    err.status = 422;
    throw err;
  }

  const candidates = [base];
  // If a repo with the same name already exists, auto-suffix to make it unique.
  candidates.push(`${base}-${shortSuffix()}`);
  candidates.push(`${base}-${shortSuffix()}`);

  let lastErr;
  for (const name of candidates) {
    try {
      return await createRepo({ token, repoName: name });
    } catch (err) {
      lastErr = err;
      if (err.status === 422 && isRepoNameAlreadyExistsError(err)) {
        continue;
      }
      throw err;
    }
  }

  throw lastErr || new Error('Repository creation failed');
}

async function publishGithub(req, res) {
  const { repoName, projectId, projectPath } = req.body || {};

  const cookieName = process.env.GITHUB_SESSION_COOKIE_NAME || 'gh_session';
  const cookies = parseCookies(req.headers.cookie);
  const sessionId = cookies[cookieName];
  const session = getGithubSession(sessionId);
  const token = session?.token || null;

  // Security hardening: do not accept GitHub tokens from request bodies.
  // Tokens must come only from server-side session storage.
  if (req.body && Object.prototype.hasOwnProperty.call(req.body, 'token')) {
    // Ignore silently to preserve API contract while closing the override path.
  }

  if (!token) {
    return res.status(401).json({
      error: 'Missing GitHub token',
      details: 'Authenticate with GitHub first (OAuth session missing/expired).',
    });
  }
  if (!repoName) return res.status(400).json({ error: 'Missing repoName' });

  const finalRepoName = String(repoName || '').trim();
  if (!finalRepoName) return res.status(400).json({ error: 'Invalid repoName' });

  let localRootPath = null;
  let cleanupId = null;

  // Security/abuse hardening: dedupe publish attempts for the same project.
  const publishKey = projectId ? `${sessionId || 'no-session'}:${String(projectId)}` : null;
  if (publishKey && inFlightPublishes.has(publishKey)) {
    try {
      const repoUrl = await inFlightPublishes.get(publishKey);

      // Match normal success behavior: clear cookie even on deduped response.
      const secure = process.env.GITHUB_COOKIE_SECURE === 'true' ? true : isHttps(req);
      const sameSite = getSameSite();
      res.setHeader('Set-Cookie', serializeCookie(cookieName, '', {
        path: '/',
        httpOnly: true,
        sameSite,
        secure,
        maxAge: 0,
      }));

      return res.json({ repoUrl });
    } catch (err) {
      // If the in-flight publish failed, allow the caller to retry normally.
      inFlightPublishes.delete(publishKey);
    }
  }

  if (projectId) {
    const entry = getProject(String(projectId));
    if (!entry) return res.status(404).json({ error: 'Unknown or expired projectId' });

    // Security hardening: bind project publishing to the same browser that generated it.
    // Prevents cross-user publishing when projectId leaks.
    const expectedBrowserId = entry.browserId;
    const actualBrowserId = session?.browserId || null;
    if (expectedBrowserId && actualBrowserId && expectedBrowserId !== actualBrowserId) {
      return res.status(403).json({ error: 'Not authorized to publish this projectId' });
    }
    if (expectedBrowserId && !actualBrowserId) {
      return res.status(401).json({ error: 'GitHub session is not bound to this browser' });
    }

    localRootPath = entry.projectRootPath;
    cleanupId = entry.projectId;
  } else if (projectPath) {
    const base = getTempProjectsBase();
    const resolved = path.resolve(String(projectPath));
    if (!isSubPath(base, resolved)) {
      return res.status(400).json({ error: 'projectPath is not allowed' });
    }
    localRootPath = resolved;
  } else {
    return res.status(400).json({ error: 'Missing projectId (preferred) or projectPath' });
  }

  try {
    const doPublish = async () => {
      const exists = await fs.pathExists(localRootPath);
      if (!exists) {
        const err = new Error('Project folder not found on server');
        err.status = 404;
        throw err;
      }

      const repo = await createRepoWithRetry({ token, desiredName: finalRepoName });
      const owner = repo?.owner?.login;
      const repoSlug = repo?.name;
      const branch = repo?.default_branch || process.env.GITHUB_DEFAULT_BRANCH || 'main';
      const repoUrl = repo?.html_url;

      if (!owner || !repoSlug || !repoUrl) {
        const err = new Error('GitHub repo creation returned incomplete data');
        err.status = 502;
        throw err;
      }

      await uploadFolderAsSingleCommit({ token, owner, repo: repoSlug, branch, localRootPath });

      // Best-effort cleanup after successful publish
      if (cleanupId) await cleanupProject(cleanupId);

      // Best-effort: remove the one-time OAuth session
      if (sessionId) deleteSession(sessionId);

      // Clear the cookie using the same flags to improve deletion reliability.
      const secure = process.env.GITHUB_COOKIE_SECURE === 'true' ? true : isHttps(req);
      const sameSite = getSameSite();
      res.setHeader('Set-Cookie', serializeCookie(cookieName, '', {
        path: '/',
        httpOnly: true,
        sameSite,
        secure,
        maxAge: 0,
      }));

      return repoUrl;
    };

    const promise = doPublish();
    if (publishKey) inFlightPublishes.set(publishKey, promise);

    try {
      const repoUrl = await promise;
      return res.json({ repoUrl });
    } finally {
      if (publishKey) inFlightPublishes.delete(publishKey);
    }
  } catch (err) {
    const status = err.status && Number.isInteger(err.status) ? err.status : 500;
    return res.status(status).json({
      error: 'Failed to publish to GitHub',
      // Do not return raw upstream error objects (may contain sensitive metadata).
      details: err.message,
    });
  }
}

module.exports = {
  publishGithub,
};
