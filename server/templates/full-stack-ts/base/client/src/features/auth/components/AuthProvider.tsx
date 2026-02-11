import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { AuthUser, LoginRequest, RegisterRequest } from '../../../types/auth';
import {
  getStoredToken,
  login as loginRequest,
  me as meRequest,
  register as registerRequest,
  setStoredToken,
} from '../services/authService';

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

export interface AuthContextValue {
  status: AuthStatus;
  token: string | null;
  user: AuthUser | null;
  login: (input: LoginRequest) => Promise<{ ok: true } | { ok: false; message: string }>;
  register: (input: RegisterRequest) => Promise<{ ok: true } | { ok: false; message: string }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);

  const loadMe = useCallback(async (nextToken: string) => {
    const response = await meRequest(nextToken);
    if (!response.success || !response.data) {
      setStoredToken(null);
      setToken(null);
      setUser(null);
      setStatus('anonymous');
      return;
    }

    setUser(response.data);
    setStatus('authenticated');
  }, []);

  useEffect(() => {
    if (!token) {
      setStatus('anonymous');
      return;
    }

    void loadMe(token);
  }, [loadMe, token]);

  const login = useCallback(async (input: LoginRequest) => {
    const response = await loginRequest(input);
    if (!response.success || !response.data) {
      return { ok: false as const, message: response.message };
    }

    setStoredToken(response.data.auth.token);
    setToken(response.data.auth.token);
    setUser(response.data.user);
    setStatus('authenticated');

    return { ok: true as const };
  }, []);

  const register = useCallback(async (input: RegisterRequest) => {
    const response = await registerRequest(input);
    if (!response.success || !response.data) {
      return { ok: false as const, message: response.message };
    }

    setStoredToken(response.data.auth.token);
    setToken(response.data.auth.token);
    setUser(response.data.user);
    setStatus('authenticated');

    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    setStatus('anonymous');
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, token, user, login, register, logout }),
    [status, token, user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
