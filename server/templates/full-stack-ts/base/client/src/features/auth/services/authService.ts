import { api } from '../../../services/api';
import type {
  ApiResponse,
  AuthPayload,
  AuthUser,
  LoginRequest,
  RegisterRequest,
} from '../../../types/auth';

const TOKEN_KEY = 'devstarter_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null) {
  if (!token) {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }

  localStorage.setItem(TOKEN_KEY, token);
}

export async function register(input: RegisterRequest): Promise<ApiResponse<AuthPayload>> {
  return api.post<AuthPayload, RegisterRequest>('/auth/register', input);
}

export async function login(input: LoginRequest): Promise<ApiResponse<AuthPayload>> {
  return api.post<AuthPayload, LoginRequest>('/auth/login', input);
}

export async function me(token: string): Promise<ApiResponse<AuthUser>> {
  return api.get<AuthUser>('/auth/me', token);
}
