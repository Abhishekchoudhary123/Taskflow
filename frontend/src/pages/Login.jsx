import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MdEmail, MdLock, MdLogin } from 'react-icons/md';

export default function Login() {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { user } = await login(form.email, form.password);
      toast.success(`Welcome back, ${user.name}!`);
      nav('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✅</div>
          <h1 className="text-2xl font-bold text-white">Welcome back</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in to your TaskFlow account</p>
        </div>

        <div className="card">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-3 text-slate-400" />
                <input name="email" type="email" required value={form.email} onChange={handle}
                  placeholder="you@example.com"
                  className="input pl-9" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-3 text-slate-400" />
                <input name="password" type="password" required value={form.password} onChange={handle}
                  placeholder="••••••••"
                  className="input pl-9" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              <MdLogin /> {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-4">
            No account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
