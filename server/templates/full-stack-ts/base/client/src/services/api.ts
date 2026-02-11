import type { ApiResponse } from '../types/auth';

function normalizeBaseUrl(input: string) {
  if (!input) return '';
  return input.endsWith('/') ? input.slice(0, -1) : input;
}

// Works out-of-the-box for fresh clones:
// - In dev, Vite proxy forwards /api -> http://localhost:5000
// - In prod, set VITE_API_URL to your server base (including /api)
const API_URL = normalizeBaseUrl((import.meta.env.VITE_API_URL as string | undefined) ?? '/api');

type HttpMethod = 'GET' | 'POST';

interface RequestOptions<TBody> {
  method: HttpMethod;
  path: string;
  body?: TBody;
  token?: string;
}

async function request<TResponse, TBody = never>(
  options: RequestOptions<TBody>,
): Promise<ApiResponse<TResponse>> {
  const url = `${API_URL}${options.path}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  try {
    const response = await fetch(url, {
      method: options.method,
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    const json = (await response.json()) as ApiResponse<TResponse>;
    return json;
  } catch {
    return {
      success: false,
      message: 'Network error: could not reach server',
    };
  }
}

export const api = {
  get: <TResponse>(path: string, token?: string) =>
    request<TResponse>({ method: 'GET', path, token }),

  post: <TResponse, TBody>(path: string, body: TBody, token?: string) =>
    request<TResponse, TBody>({ method: 'POST', path, body, token }),
};
