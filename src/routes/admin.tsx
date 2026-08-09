import { createFileRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export const Route = createFileRoute('/admin')({
  component: AdminRoot,
});

function AdminRoot() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const pathname = window.location.pathname;

  useEffect(() => {
    // If trying to access protected routes without auth, redirect to login
    if (!isAuthenticated && pathname !== '/admin/login') {
      navigate({ to: '/admin/login', replace: true });
    }
  }, [isAuthenticated, pathname, navigate]);

  return <Outlet />;
}
