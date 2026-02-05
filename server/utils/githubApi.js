function buildGithubHeaders(token) {
  return {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'DevStarter',
  };
}

async function githubRequest({ token, method, url, body }) {
  const response = await fetch(url, {
    method,
    headers: {
      ...buildGithubHeaders(token),
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await response.text();
  const data = text ? (() => {
    try { return JSON.parse(text); } catch { return text; }
  })() : null;

  if (!response.ok) {
    const message = (data && typeof data === 'object' && data.message) ? data.message : `GitHub API error (${response.status})`;
    const err = new Error(message);
    err.status = response.status;
    err.details = data;
    throw err;
  }

  return data;
}

module.exports = {
  githubRequest,
};
