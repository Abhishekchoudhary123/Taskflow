import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdDashboard, MdFolder, MdCheckBox, MdPeople, MdLogout, MdAdminPanelSettings
} from 'react-icons/md';

const navItems = [
  { to: '/dashboard',  label: 'Dashboard', icon: MdDashboard },
  { to: '/projects',   label: 'Projects',  icon: MdFolder },
  { to: '/tasks',      label: 'Tasks',     icon: MdCheckBox },
];

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden ${
      isActive
        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30'
        : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
    }`;

  return (
    <aside className="w-64 shrink-0 bg-gradient-to-b from-slate-800 to-slate-900 border-r border-slate-700/50 min-h-screen flex flex-col backdrop-blur-xl">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-500 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-indigo-500/30">
            ✅
          </div>
          <div>
            <span className="text-xl font-bold text-white">TaskFlow</span>
            <p className="text-xs text-slate-400">Project Manager</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClass}>
            <Icon className="text-xl shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink to="/users" className={linkClass}>
            <MdPeople className="text-xl shrink-0" />
            <span>Users</span>
          </NavLink>
        )}
      </nav>

      {/* User footer */}
      <div className="px-4 py-5 border-t border-slate-700/50 bg-slate-900/50">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-sm font-bold uppercase shadow-lg">
            {user?.name?.[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              {isAdmin && <MdAdminPanelSettings className="text-indigo-400" />}
              <span className="capitalize">{user?.role}</span>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full btn-secondary text-sm justify-center hover:bg-red-600/20 hover:text-red-400 hover:border-red-500/30">
          <MdLogout className="text-base" /> Logout
        </button>
      </div>
    </aside>
  );
}
