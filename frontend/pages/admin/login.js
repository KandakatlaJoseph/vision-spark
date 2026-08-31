import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/auth';

export default function AdminLogin() {
  const { login } = useAuth() || {};
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      
      if (user && user.role === 'admin') {
        const token = localStorage.getItem('vs_token');
        if (token) {
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
        }
        router.push('/admin');
      } else {
        // If not admin, logout and show error
        localStorage.removeItem('vs_token');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setError('Access denied. Administrator privileges required.');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please verify email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col justify-center items-center py-16">
      <div className="max-w-md w-full mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-500 font-bold text-2xl flex items-center justify-center mx-auto border border-amber-200">
              ⚡
            </div>
            <h1 className="text-2xl font-extrabold text-[#01155C]">Admin Portal</h1>
            <p className="text-xs text-gray-500">Secure access for administrators</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Admin Email</label>
              <input
                type="email"
                placeholder="admin@example.com"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-900 text-xs focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-amber-500 text-white font-extrabold text-sm shadow-md shadow-amber-500/20 hover:bg-amber-600 transition-all"
            >
              {loading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
