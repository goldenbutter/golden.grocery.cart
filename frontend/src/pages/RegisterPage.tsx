import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { useAuthStore } from '../store/authStore';
import { useT } from '../hooks/useT';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const { t } = useT();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError(t.register_password_error); return; }
    setError('');
    setLoading(true);
    try {
      const data = await authApi.register(name, email, password);
      setUser({ name: data.name, email: data.email, role: data.role as 'Customer' | 'Admin', token: data.token });
      navigate('/shop');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <span className="text-4xl">🌿</span>
            <h1 className="font-display text-3xl font-bold text-forest-800 mt-2">{t.register_title}</h1>
            <p className="text-forest-500 mt-1">{t.register_sub}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">{t.register_name}</label>
              <input className="input" placeholder={t.register_name_placeholder} value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">{t.register_email}</label>
              <input className="input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 mb-1.5">{t.register_password}</label>
              <input className="input" type="password" placeholder={t.register_password_placeholder} value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? t.register_submitting : t.register_submit}
            </button>
          </form>

          <p className="text-center text-forest-500 text-sm mt-6">
            {t.register_has_account}{' '}
            <Link to="/login" className="text-forest-600 font-medium hover:underline">{t.register_sign_in}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
