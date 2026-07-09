import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export function ProtectedRoute() {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const { session } = useAuth();

  if (session?.user.role !== 'admin') {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}
