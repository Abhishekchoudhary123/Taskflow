import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MdAdd, MdFolder, MdClose, MdDelete, MdEdit } from 'react-icons/md';

const STATUS_COLOR = { active: 'bg-green-500', completed: 'bg-blue-500', 'on-hold': 'bg-yellow-500' };

function ProjectModal({ onClose, onSaved, users, project }) {
  const [form, setForm] = useState({
    name: project?.name || '', description: project?.description || '',
    members: project?.members?.map(m => m._id) || [],
    deadline: project?.deadline ? project.deadline.slice(0, 10) : '',
    color: project?.color || '#6366f1',
    status: project?.status || 'active',
  });
  const [saving, setSaving] = useState(false);

  const toggleMember = (id) =>
    setForm(p => ({
      ...p,
      members: p.members.includes(id) ? p.members.filter(m => m !== id) : [...p.members, id],
    }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (project) {
        await api.put(`/projects/${project._id}`, form);
        toast.success('Project updated');
      } else {
        await api.post('/projects', form);
        toast.success('Project created');
      }
      onSaved();
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">{project ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><MdClose className="text-xl" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Project Name *</label>
            <input required value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))}
              placeholder="My awesome project" className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={2} value={form.description} onChange={e => setForm(p => ({...p, description: e.target.value}))}
              placeholder="What is this project about?" className="input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({...p, status: e.target.value}))} className="input">
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm(p => ({...p, deadline: e.target.value}))} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Members</label>
            <div className="max-h-36 overflow-y-auto space-y-1.5 bg-slate-900 rounded-lg p-2 border border-slate-700">
              {users.map(u => (
                <label key={u._id} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-700 cursor-pointer">
                  <input type="checkbox" checked={form.members.includes(u._id)}
                    onChange={() => toggleMember(u._id)}
                    className="accent-indigo-500" />
                  <span className="text-sm text-slate-300">{u.name}</span>
                  <span className="text-xs text-slate-500 ml-auto capitalize">{u.role}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? 'Saving…' : project ? 'Update' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Projects() {
  const { isAdmin } = useAuth();
  const nav = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers]       = useState([]);
  const [modal, setModal]       = useState(null); // null | 'new' | project object
  const [loading, setLoading]   = useState(true);

  const fetchAll = async () => {
    try {
      const [pRes, uRes] = await Promise.all([api.get('/projects'), api.get('/users/all')]);
      setProjects(pRes.data);
      setUsers(uRes.data);
    } catch { toast.error('Failed to load projects'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const deleteProject = async (id) => {
    if (!confirm('Delete this project and all its tasks?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchAll();
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="page-title">Projects</h1>
              <p className="text-slate-400 text-sm mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
            </div>
            {isAdmin && (
              <button onClick={() => setModal('new')} className="btn-primary">
                <MdAdd /> New Project
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="card text-center py-16 text-slate-400">
              <MdFolder className="text-5xl mx-auto mb-3 opacity-40" />
              <p className="font-medium">No projects yet</p>
              {isAdmin && <p className="text-sm mt-1">Click "New Project" to create one</p>}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map(p => {
                const pct = p.taskCount > 0 ? Math.round((p.completedCount / p.taskCount) * 100) : 0;
                return (
                  <div key={p._id} className="card-hover cursor-pointer group"
                    onClick={() => nav(`/projects/${p._id}`)}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ background: p.color }} />
                        <h2 className="font-semibold text-white group-hover:text-indigo-400 transition-colors">{p.name}</h2>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        {isAdmin && <>
                          <button onClick={() => setModal(p)} className="p-1 text-slate-400 hover:text-indigo-400"><MdEdit /></button>
                          <button onClick={() => deleteProject(p._id)} className="p-1 text-slate-400 hover:text-red-400"><MdDelete /></button>
                        </>}
                      </div>
                    </div>

                    {p.description && <p className="text-sm text-slate-400 mb-3 line-clamp-2">{p.description}</p>}

                    <div className="flex items-center gap-2 mb-4">
                      <span className={`w-2 h-2 rounded-full ${STATUS_COLOR[p.status]}`} />
                      <span className="text-xs text-slate-400 capitalize">{p.status}</span>
                      <span className="text-xs text-slate-500 ml-auto">{p.members?.length} member{p.members?.length !== 1 ? 's' : ''}</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                        <span>{p.completedCount}/{p.taskCount} tasks</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ProjectModal
          users={users}
          project={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
          onSaved={() => { setModal(null); fetchAll(); }}
        />
      )}
    </>
  );
}
