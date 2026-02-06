const { randomUUID } = require('crypto');
const crypto = require('crypto');

const sessions = new Map();

function base64UrlEncode(buf) {
  return Buffer.from(buf)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function base64UrlDecode(str) {
  const normalized = String(str).replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(normalized + pad, 'base64');
}

function getSecretKey() {
  const raw = process.env.GITHUB_SESSION_SECRET;
  if (!raw) return null;
  // Derive a fixed 32-byte key from any length secret.
  return crypto.createHash('sha256').update(String(raw), 'utf8').digest();
}

function encryptSessionPayload(payload) {
  const key = getSecretKey();
  if (!key) return null;

  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), 'utf8');
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return `v2.${base64UrlEncode(iv)}.${base64UrlEncode(ciphertext)}.${base64UrlEncode(tag)}`;
}

function decryptSessionPayload(sessionId) {
  const key = getSecretKey();
  if (!key) return null;
  const raw = String(sessionId || '');
  if (!raw.startsWith('v2.')) return null;

  const parts = raw.split('.');
  if (parts.length !== 4) return null;

  try {
    const iv = base64UrlDecode(parts[1]);
    const ciphertext = base64UrlDecode(parts[2]);
    const tag = base64UrlDecode(parts[3]);

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    const payload = JSON.parse(plaintext.toString('utf8'));
    return payload && typeof payload === 'object' ? payload : null;
  } catch {
    return null;
  }
}

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
  // Production-grade mode: stateless, encrypted session stored in the cookie itself.
  // This survives server restarts and multi-instance deployments (Render).
  const ttlMs = getTtlMs();
  const encrypted = encryptSessionPayload({
    token,
    browserId: browserId || null,
    createdAtMs: nowMs(),
    expiresAtMs: nowMs() + ttlMs,
  });
  if (encrypted) return encrypted;

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
  // Stateless mode
  const decrypted = decryptSessionPayload(sessionId);
  if (decrypted) {
    const expiresAtMs = Number(decrypted.expiresAtMs);
    if (Number.isFinite(expiresAtMs) && expiresAtMs > 0 && expiresAtMs < nowMs()) return null;
    return {
      token: decrypted.token || null,
      browserId: decrypted.browserId || null,
      createdAtMs: Number(decrypted.createdAtMs) || nowMs(),
    };
  }

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
  // Stateless sessions cannot be revoked server-side; clearing the cookie on the client is enough.
  const decrypted = decryptSessionPayload(sessionId);
  if (decrypted) return true;
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
