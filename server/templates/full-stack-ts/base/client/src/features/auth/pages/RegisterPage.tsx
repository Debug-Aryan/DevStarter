import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/common/Button';
import { TextInput } from '../../../components/common/TextInput';
import { useAuth } from '../hooks/useAuth';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, status } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const emailError = useMemo(() => {
    if (!email) return undefined;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? undefined : 'Enter a valid email';
  }, [email]);

  const passwordError = useMemo(() => {
    if (!password) return undefined;
    return password.length >= 8 ? undefined : 'Password must be at least 8 characters';
  }, [password]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (passwordError) {
      setError(passwordError);
      return;
    }

    setSubmitting(true);
    const result = await register({ email, password });
    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    navigate('/dashboard');
  }

  const disabled = submitting || status === 'loading' || Boolean(emailError) || Boolean(passwordError);

  return (
    <div className="min-h-screen px-4 py-10">
      <div className="mx-auto w-full max-w-md">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-sm">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-slate-300">Register and get a JWT in seconds.</p>

          {error ? (
            <div className="mt-4 rounded-lg border border-rose-900/60 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              error={emailError}
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              error={passwordError}
            />

            <Button type="submit" disabled={disabled} className="w-full">
              {submitting ? 'Creating…' : 'Create account'}
            </Button>
          </form>

          <p className="mt-5 text-sm text-slate-300">
            Already have an account?{' '}
            <Link className="font-semibold text-indigo-300 hover:text-indigo-200" to="/login">
              Login
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          DevStarter Full-Stack TS template
        </p>
      </div>
    </div>
  );
}
