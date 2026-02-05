const fs = require('fs-extra');
const path = require('path');
const { githubRequest } = require('./githubApi');

function encodePathParts(p) {
  return p.split('/').map(encodeURIComponent).join('/');
}

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

async function putFileToRepo({ token, owner, repo, branch, repoPath, contentBase64 }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodePathParts(repoPath)}`;
  return githubRequest({
    token,
    method: 'PUT',
    url,
    body: {
      message: `Add ${repoPath}`,
      content: contentBase64,
      branch,
    },
  });
}

async function getExistingFileSha({ token, owner, repo, branch, repoPath }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodePathParts(repoPath)}?ref=${encodeURIComponent(branch)}`;
  const data = await githubRequest({ token, method: 'GET', url });
  return data?.sha || null;
}

async function upsertFileToRepo({ token, owner, repo, branch, repoPath, contentBase64 }) {
  try {
    await putFileToRepo({ token, owner, repo, branch, repoPath, contentBase64 });
    return;
  } catch (err) {
    // If file exists, GitHub requires sha to update.
    const message = String(err.message || '').toLowerCase();
    const canRetry = err.status === 422 && (message.includes('sha') || message.includes('already exists'));
    if (!canRetry) throw err;

    const sha = await getExistingFileSha({ token, owner, repo, branch, repoPath });
    if (!sha) throw err;

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${encodePathParts(repoPath)}`;
    await githubRequest({
      token,
      method: 'PUT',
      url,
      body: {
        message: `Update ${repoPath}`,
        content: contentBase64,
        branch,
        sha,
      },
    });
  }
}

async function deleteRepoFileIfExists({ token, owner, repo, branch, repoPath }) {
  const getUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodePathParts(repoPath)}?ref=${encodeURIComponent(branch)}`;
  let existing;
  try {
    existing = await githubRequest({ token, method: 'GET', url: getUrl });
  } catch (err) {
    if (err.status === 404) return false;
    throw err;
  }

  if (!existing?.sha) return false;

  const delUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${encodePathParts(repoPath)}`;
  await githubRequest({
    token,
    method: 'DELETE',
    url: delUrl,
    body: {
      message: `Remove ${repoPath}`,
      sha: existing.sha,
      branch,
    },
  });
  return true;
}

async function uploadFolderToGithub({ token, owner, repo, branch, localRootPath }) {
  const files = await listFilesRecursive(localRootPath);
  const limit = createLimiter(Number(process.env.GITHUB_UPLOAD_CONCURRENCY) || 4);

  // GitHub Contents API has a practical per-file size limit (~1MB). Provide a clear error.
  const maxBytes = Number(process.env.GITHUB_CONTENTS_MAX_BYTES) || 950_000;

  if (files.length === 0) {
    return { fileCount: 0 };
  }

  // IMPORTANT:
  // For a brand new repo with no commits, GitHub will create the default branch/ref
  // on the first successful Contents API PUT. If we fire many uploads concurrently,
  // GitHub can respond with 409 "reference already exists" due to a race.
  // Fix: upload one file serially first to initialize the ref, then upload the rest in parallel.
  const [firstFile, ...restFiles] = files;

  const uploadOne = async (absPath) => {
    const rel = path.relative(localRootPath, absPath).split(path.sep).join('/');
    const stat = await fs.promises.stat(absPath);
    if (stat.size > maxBytes) {
      const err = new Error(
        `File too large for GitHub Contents API: ${rel} (${stat.size} bytes). Increase GITHUB_CONTENTS_MAX_BYTES or switch to Git Data API.`
      );
      err.code = 'FILE_TOO_LARGE';
      throw err;
    }

    const buf = await fs.promises.readFile(absPath);
    const base64 = buf.toString('base64');
    await upsertFileToRepo({ token, owner, repo, branch, repoPath: rel, contentBase64: base64 });
  };

  await uploadOne(firstFile);

  await Promise.all(restFiles.map((absPath) => limit(() => uploadOne(absPath))));

  return { fileCount: files.length };
}

module.exports = {
  uploadFolderToGithub,
  deleteRepoFileIfExists,
};
