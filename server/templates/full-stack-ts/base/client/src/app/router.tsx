import { Navigate, Outlet, createBrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../features/auth/components/AuthProvider';
import { DashboardPage } from '../features/auth/pages/DashboardPage';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { useAuth } from '../features/auth/hooks/useAuth';

function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

function Protected() {
  const { status } = useAuth();

  if (status === 'loading') {
    return (
      <div className="min-h-screen px-4 py-10">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/40 p-6 text-sm text-slate-300">
          Loading…
        </div>
      </div>
    );
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <Root />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      {
        element: <Protected />,
        children: [{ path: '/dashboard', element: <DashboardPage /> }],
      },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
