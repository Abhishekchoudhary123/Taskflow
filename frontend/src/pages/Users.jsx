import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { MdPeople, MdAdminPanelSettings, MdPersonOutline, MdDelete } from 'react-icons/md';
import { format } from 'date-fns';
import { useAuth } from '../context/AuthContext';

export default function Users() {
  const { user: me } = useAuth();
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try { const { data } = await api.get('/users'); setUsers(data); }
    catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const changeRole = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try { await api.delete(`/users/${id}`); toast.success('User deleted'); fetchUsers(); }
    catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="page-title flex items-center gap-2"><MdPeople /> Users</h1>
          <p className="text-slate-400 text-sm mt-1">{users.length} registered users</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="card overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-xs text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Joined</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-700/50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-sm font-bold uppercase shrink-0">
                          {u.name[0]}
                        </div>
                        <div>
                          <p className="font-medium text-white">{u.name} {u._id === me._id && <span className="text-xs text-indigo-400">(you)</span>}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1.5">
                        {u.role === 'admin'
                          ? <MdAdminPanelSettings className="text-indigo-400" />
                          : <MdPersonOutline className="text-slate-400" />}
                        <span className={u.role === 'admin' ? 'text-indigo-400' : 'text-slate-300'}>
                          {u.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{format(new Date(u.createdAt), 'MMM d, yyyy')}</td>
                    <td className="px-5 py-3">
                      {u._id !== me._id && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => changeRole(u._id, u.role === 'admin' ? 'member' : 'admin')}
                            className="text-xs bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded-lg text-slate-300 transition-colors"
                          >
                            Make {u.role === 'admin' ? 'Member' : 'Admin'}
                          </button>
                          <button onClick={() => deleteUser(u._id)}
                            className="p-1 text-slate-400 hover:text-red-400 transition-colors">
                            <MdDelete />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
