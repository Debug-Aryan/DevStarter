const { randomUUID } = require('crypto');

const sessions = new Map();

function nowMs() {
  return Date.now();
}

function getTtlMs() {
  const raw = process.env.GITHUB_SESSION_TTL_MS;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60 * 60 * 1000; // 1h
}

function getMaxSessions() {
  const raw = process.env.GITHUB_SESSION_MAX_ENTRIES;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 5000;
}

function pruneExpired() {
  const ttlMs = getTtlMs();
  const cutoff = nowMs() - ttlMs;
  for (const [id, entry] of sessions.entries()) {
    if (entry.createdAtMs < cutoff) sessions.delete(id);
  }
}

function pruneToMaxSize() {
  const max = getMaxSessions();
  if (sessions.size <= max) return;
  // Evict oldest entries first.
  const entries = Array.from(sessions.entries());
  entries.sort((a, b) => a[1].createdAtMs - b[1].createdAtMs);
  const toRemove = sessions.size - max;
  for (let i = 0; i < toRemove; i++) {
    sessions.delete(entries[i][0]);
  }
}

function createSession({ token, browserId }) {
  // Best-effort pruning to reduce memory pressure under abuse.
  pruneExpired();

  const sessionId = randomUUID();
  sessions.set(sessionId, {
    token,
    browserId: browserId || null,
    createdAtMs: nowMs(),
  });

  pruneToMaxSize();
  return sessionId;
}

function getSession(sessionId) {
  if (!sessionId) return null;
  const entry = sessions.get(sessionId);
  if (!entry) return null;

  const ttlMs = getTtlMs();
  if (entry.createdAtMs < nowMs() - ttlMs) {
    sessions.delete(sessionId);
    return null;
  }
  return entry;
}

function getToken(sessionId) {
  const entry = getSession(sessionId);
  return entry ? entry.token : null;
}

function deleteSession(sessionId) {
  if (!sessionId) return false;
  return sessions.delete(sessionId);
}

function startCleanupInterval() {
  const ttlMs = getTtlMs();
  const interval = setInterval(() => {
    pruneExpired();
    pruneToMaxSize();
  }, Math.min(ttlMs / 2, 10 * 60 * 1000));

  interval.unref?.();
  return interval;
}

module.exports = {
  createSession,
  getSession,
  getToken,
  deleteSession,
  startCleanupInterval,
};
