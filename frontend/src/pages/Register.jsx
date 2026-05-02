import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MdPerson, MdEmail, MdLock, MdPersonAdd } from 'react-icons/md';

export default function Register() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'member' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const { user } = await register(form.name, form.email, form.password, form.role);
      toast.success(`Account created! Welcome, ${user.name}!`);
      nav('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✅</div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-slate-400 text-sm mt-1">Join TaskFlow and start managing projects</p>
        </div>

        <div className="card">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-3 text-slate-400" />
                <input name="name" required value={form.name} onChange={handle}
                  placeholder="John Doe" className="input pl-9" />
              </div>
            </div>
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <MdEmail className="absolute left-3 top-3 text-slate-400" />
                <input name="email" type="email" required value={form.email} onChange={handle}
                  placeholder="you@example.com" className="input pl-9" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <MdLock className="absolute left-3 top-3 text-slate-400" />
                <input name="password" type="password" required value={form.password} onChange={handle}
                  placeholder="Min. 6 characters" className="input pl-9" />
              </div>
            </div>
            <div>
              <label className="label">Role</label>
              <select name="role" value={form.role} onChange={handle} className="input">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-2.5">
              <MdPersonAdd /> {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
