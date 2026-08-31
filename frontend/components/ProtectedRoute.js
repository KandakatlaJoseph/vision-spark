import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/auth';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth() || {};
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/login');
    else if (adminOnly && user.role !== 'admin') router.replace('/dashboard');
  }, [user, loading, adminOnly, router]);

  if (loading || !user || (adminOnly && user.role !== 'admin')) {
    return <div className="max-w-6xl mx-auto px-6 py-24 text-mist">Loading…</div>;
  }

  return children;
}
