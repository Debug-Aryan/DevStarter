const fs = require('fs-extra');
const path = require('path');
const { githubRequest } = require('./githubApi');

function createLimiter(concurrency) {
  let active = 0;
  const queue = [];

  const runNext = () => {
    if (active >= concurrency) return;
    const next = queue.shift();
    if (!next) return;
    active++;
    next()
      .catch(() => {})
      .finally(() => {
        active--;
        runNext();
      });
  };

  return async (fn) => new Promise((resolve, reject) => {
    queue.push(async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
    runNext();
  });
}

async function listFilesRecursive(rootDir) {
  const out = [];

  async function walk(currentDir) {
    const entries = await fs.promises.readdir(currentDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === '.git') continue;
      const abs = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await walk(abs);
      } else if (entry.isFile()) {
        out.push(abs);
      }
    }
  }

  await walk(rootDir);
  out.sort((a, b) => a.localeCompare(b));
  return out;
}

async function getRefSha({ token, owner, repo, branch }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(branch)}`;
  try {
    const data = await githubRequest({ token, method: 'GET', url });
    return data?.object?.sha || null;
  } catch (err) {
    if (err.status === 404) return null;
    // GitHub returns 409 for empty repos on some git endpoints.
    if (err.status === 409 && String(err.message || '').toLowerCase().includes('repository is empty')) {
      return null;
    }
    throw err;
  }
}

async function createBlob({ token, owner, repo, contentBase64 }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/blobs`;
  const attempts = Number(process.env.GITHUB_GITDATA_RETRY_ATTEMPTS) || 6;
  const baseDelayMs = Number(process.env.GITHUB_GITDATA_RETRY_BASE_DELAY_MS) || 250;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const data = await githubRequest({
        token,
        method: 'POST',
        url,
        body: {
          content: contentBase64,
          encoding: 'base64',
        },
      });
      return data?.sha;
    } catch (err) {
      const isEmptyRepo409 = err.status === 409 && String(err.message || '').toLowerCase().includes('repository is empty');
      if (!isEmptyRepo409 || attempt === attempts) throw err;
      await new Promise((r) => setTimeout(r, baseDelayMs * attempt));
    }
  }

  return null;
}

async function createTree({ token, owner, repo, treeEntries }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/trees`;
  const data = await githubRequest({
    token,
    method: 'POST',
    url,
    body: {
      tree: treeEntries,
    },
  });
  return data?.sha;
}

async function createCommit({ token, owner, repo, message, treeSha, parentSha }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/git/commits`;
  const body = {
    message,
    tree: treeSha,
    parents: parentSha ? [parentSha] : [],
  };
  const data = await githubRequest({ token, method: 'POST', url, body });
  return data?.sha;
}

async function updateRef({ token, owner, repo, branch, commitSha }) {
  const existingRefSha = await getRefSha({ token, owner, repo, branch });

  if (!existingRefSha) {
    const url = `https://api.github.com/repos/${owner}/${repo}/git/refs`;
    await githubRequest({
      token,
      method: 'POST',
      url,
      body: {
        ref: `refs/heads/${branch}`,
        sha: commitSha,
      },
    });
    return;
  }

  const url = `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${encodeURIComponent(branch)}`;
  await githubRequest({
    token,
    method: 'PATCH',
    url,
    body: {
      sha: commitSha,
      force: true,
    },
  });
}

async function uploadFolderAsSingleCommit({ token, owner, repo, branch, localRootPath }) {
  const files = await listFilesRecursive(localRootPath);
  if (files.length === 0) return { fileCount: 0, commitSha: null };

  const concurrency = Number(process.env.GITHUB_UPLOAD_CONCURRENCY) || 6;
  const limit = createLimiter(concurrency);
  const maxBytes = Number(process.env.GITHUB_GITDATA_MAX_BYTES) || 25_000_000; // 25MB safety default

  // Pre-read file sizes and build relative paths.
  const fileItems = await Promise.all(
    files.map(async (absPath) => {
      const rel = path.relative(localRootPath, absPath).split(path.sep).join('/');
      const stat = await fs.promises.stat(absPath);
      return { absPath, rel, size: stat.size };
    })
  );

  for (const item of fileItems) {
    if (item.size > maxBytes) {
      const err = new Error(`File too large for Git Data API upload: ${item.rel} (${item.size} bytes).`);
      err.code = 'FILE_TOO_LARGE';
      throw err;
    }
  }

  // Create blobs concurrently.
  const relToBlobSha = new Map();
  await Promise.all(
    fileItems.map((item) =>
      limit(async () => {
        const buf = await fs.promises.readFile(item.absPath);
        const base64 = buf.toString('base64');
        const sha = await createBlob({ token, owner, repo, contentBase64: base64 });
        if (!sha) throw new Error(`Failed to create blob for ${item.rel}`);
        relToBlobSha.set(item.rel, sha);
      })
    )
  );

  // Build tree.
  const treeEntries = fileItems.map((item) => ({
    path: item.rel,
    mode: '100644',
    type: 'blob',
    sha: relToBlobSha.get(item.rel),
  }));

  const treeSha = await createTree({ token, owner, repo, treeEntries });
  if (!treeSha) throw new Error('Failed to create tree');

  const parentSha = await getRefSha({ token, owner, repo, branch });
  const commitSha = await createCommit({
    token,
    owner,
    repo,
    message: 'DevStarter publish',
    treeSha,
    parentSha,
  });
  if (!commitSha) throw new Error('Failed to create commit');

  await updateRef({ token, owner, repo, branch, commitSha });

  return { fileCount: files.length, commitSha };
}

module.exports = {
  uploadFolderAsSingleCommit,
};
