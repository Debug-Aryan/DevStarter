import { useEffect, useState } from 'react';
import { Button } from '../../../components/common/Button';
import { api } from '../../../services/api';
import { useAuth } from '../hooks/useAuth';

interface HealthData {
  status: 'ok';
  timestamp: string;
}

export function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [protectedMessage, setProtectedMessage] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setError(null);
      const response = await api.get<HealthData>('/health');
      if (!response.success || !response.data) {
        setError(response.message);
        return;
      }
      setHealth(response.data);
    }

    void load();
  }, []);

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <p className="mt-1 text-sm text-slate-300">
                Signed in as <span className="font-semibold text-slate-100">{user?.email}</span>
              </p>
            </div>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <h2 className="text-sm font-semibold text-slate-200">Protected API example</h2>
              <p className="mt-1 text-sm text-slate-300">
                The server exposes <span className="font-mono text-slate-200">GET /api/auth/me</span>.
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Your token is stored in <span className="font-mono text-slate-200">localStorage</span>.
              </p>
              <div className="mt-3 break-words rounded-lg border border-slate-800 bg-slate-900/50 p-3 text-xs text-slate-300">
                {token ? `Bearer ${token}` : 'No token'}
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <h2 className="text-sm font-semibold text-slate-200">Health</h2>
              {error ? (
                <p className="mt-2 text-sm text-rose-200">{error}</p>
              ) : health ? (
                <div className="mt-2 text-sm text-slate-300">
                  <p>
                    Status: <span className="font-semibold text-slate-100">{health.status}</span>
                  </p>
                  <p className="mt-1">Timestamp: {new Date(health.timestamp).toLocaleString()}</p>
                </div>
              ) : (
                <p className="mt-2 text-sm text-slate-300">Loading…</p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <h2 className="text-sm font-semibold text-slate-200">Try a protected call</h2>
            <p className="mt-1 text-sm text-slate-300">
              This button calls <span className="font-mono text-slate-200">GET /api/auth/me</span>.
            </p>
            {protectedMessage ? (
              <p className="mt-2 text-sm text-emerald-200">{protectedMessage}</p>
            ) : null}
            <Button
              className="mt-3"
              onClick={async () => {
                if (!token) return;
                const response = await api.get<{ id: string; email: string; createdAt: string }>('/auth/me', token);
                if (!response.success || !response.data) {
                  setError(response.message);
                  setProtectedMessage(null);
                  return;
                }

                setError(null);
                setProtectedMessage(`Protected route OK for ${response.data.email}`);
              }}
            >
              Call protected endpoint
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
