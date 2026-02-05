const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export function buildGithubAuthorizeUrl({ state } = {}) {
  // Security hardening:
  // Start OAuth via backend so it can generate/store/verify the `state` parameter.
  // The `state` argument is intentionally ignored to prevent client-controlled state.
  void state;
  return `${API_BASE_URL}/auth/github/login`;
}

export async function publishToGithub({ repoName, projectId }) {
  const response = await fetch(`${API_BASE_URL}/publish-github`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ repoName, projectId }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.github?.message || data?.details || data?.error || 'Publish failed';
    throw new Error(message);
  }

  if (!data?.repoUrl) {
    throw new Error('Publish succeeded but no repoUrl returned');
  }

  return data;
}
