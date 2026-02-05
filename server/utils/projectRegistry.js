const fs = require('fs-extra');

// In-memory registry of generated projects.
// NOTE: This is process-local. If the server restarts, entries are lost.

const projects = new Map();

function nowMs() {
  return Date.now();
}

function getTtlMs() {
  const raw = process.env.TEMP_PROJECT_TTL_MS;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 60 * 60 * 1000; // 1h default
}

function registerProject({ projectId, projectContainerPath, projectRootPath, projectName, browserId }) {
  if (!projectId) throw new Error('projectId is required');
  if (!projectContainerPath) throw new Error('projectContainerPath is required');
  if (!projectRootPath) throw new Error('projectRootPath is required');

  projects.set(projectId, {
    projectId,
    projectContainerPath,
    projectRootPath,
    projectName,
    // Security hardening: bind project to a browser id (set via HttpOnly cookie).
    browserId: browserId || null,
    createdAtMs: nowMs(),
  });

  return projects.get(projectId);
}

function getProject(projectId) {
  return projects.get(projectId) || null;
}

async function cleanupProject(projectId) {
  const entry = projects.get(projectId);
  if (!entry) return false;
  projects.delete(projectId);

  try {
    await fs.promises.rm(entry.projectContainerPath, { recursive: true, force: true });
  } catch (err) {
    // Best-effort cleanup.
    console.warn('Temp project cleanup warning:', err);
  }

  return true;
}

function startCleanupInterval() {
  const ttlMs = getTtlMs();

  const interval = setInterval(async () => {
    const cutoff = nowMs() - ttlMs;
    const expired = [];
    for (const [projectId, entry] of projects.entries()) {
      if (entry.createdAtMs < cutoff) expired.push(projectId);
    }

    for (const projectId of expired) {
      await cleanupProject(projectId);
    }
  }, Math.min(ttlMs / 2, 5 * 60 * 1000));

  // Do not keep the process alive just for cleanup.
  interval.unref?.();
  return interval;
}

module.exports = {
  registerProject,
  getProject,
  cleanupProject,
  startCleanupInterval,
};
