import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import toast from 'react-hot-toast';
import { MdArrowBack, MdAdd, MdClose, MdPeople, MdPersonAdd, MdPersonRemove } from 'react-icons/md';

// ── Task Modal (Admin only) ───────────────────────────────────────────────────
function TaskModal({ onClose, onSaved, projectId, members, task }) {
  const [form, setForm] = useState({
    title:       task?.title || '',
    description: task?.description || '',
    assignedTo:  task?.assignedTo?._id || '',
    priority:    task?.priority || 'medium',
    dueDate:     task?.dueDate ? task.dueDate.slice(0, 10) : '',
  });
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (task) {
        await api.put(`/tasks/${task._id}`, form);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', { ...form, project: projectId });
        toast.success('Task created');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">{task ? 'Edit Task' : 'New Task'}</h2>
          <button onClick={onClose}><MdClose className="text-xl text-slate-400 hover:text-white" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Title *</label>
            <input required value={form.title}
              onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
              placeholder="Task title" className="input" />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea rows={2} value={form.description}
              onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              placeholder="Details…" className="input resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Priority</label>
              <select value={form.priority}
                onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} className="input">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input type="date" value={form.dueDate}
                onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Assign To</label>
            <select value={form.assignedTo}
              onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))} className="input">
              <option value="">— Unassigned —</option>
              {members.map(u => (
                <option key={u._id} value={u._id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? 'Saving…' : task ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Add Member Modal (Admin only) ─────────────────────────────────────────────
function AddMemberModal({ onClose, onSaved, projectId, existingMemberIds }) {
  const [allUsers, setAllUsers]   = useState([]);
  const [selected, setSelected]   = useState('');
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    api.get('/users/all').then(({ data }) => {
      setAllUsers(data.filter(u => !existingMemberIds.includes(u._id)));
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!selected) return toast.error('Select a user');
    setSaving(true);
    try {
      await api.post(`/projects/${projectId}/members`, { userId: selected });
      toast.success('Member added');
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-sm p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">Add Member</h2>
          <button onClick={onClose}><MdClose className="text-xl text-slate-400 hover:text-white" /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="label">Select User</label>
            <select value={selected} onChange={e => setSelected(e.target.value)} className="input">
              <option value="">— Choose a user —</option>
              {allUsers.map(u => (
                <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancel</button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
              {saving ? 'Adding…' : 'Add Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ProjectDetail() {
  const { id }   = useParams();
  const nav      = useNavigate();
  const { user, isAdmin } = useAuth();

  const [project, setProject]       = useState(null);
  const [taskModal, setTaskModal]   = useState(null);   // null | 'new' | task-obj
  const [memberModal, setMemberModal] = useState(false);
  const [loading, setLoading]       = useState(true);

  const fetchProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data);
    } catch {
      toast.error('Failed to load project');
      nav('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id]);

  const deleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${taskId}`); toast.success('Task deleted'); fetchProject(); }
    catch { toast.error('Failed to delete'); }
  };

  const statusChange = async (taskId, status) => {
    try { await api.put(`/tasks/${taskId}`, { status }); fetchProject(); }
    catch { toast.error('Failed to update status'); }
  };

  const removeMember = async (userId) => {
    if (!confirm('Remove this member from the project?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      toast.success('Member removed');
      fetchProject();
    } catch { toast.error('Failed to remove member'); }
  };

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  if (!project) return null;

  return (
    <>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-6xl mx-auto">

          {/* Back */}
          <button onClick={() => nav('/projects')}
            className="flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-4 transition-colors">
            <MdArrowBack /> Back to Projects
          </button>

          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full" style={{ background: project.color }} />
                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
              </div>
              {project.description && <p className="text-slate-400 text-sm">{project.description}</p>}
            </div>
            {/* Admin only: create task */}
            {isAdmin && (
              <button onClick={() => setTaskModal('new')} className="btn-primary">
                <MdAdd /> New Task
              </button>
            )}
          </div>

          {/* Members Panel */}
          <div className="card mb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <MdPeople className="text-base" />
                Team Members ({project.members?.length ?? 0})
              </div>
              {/* Admin only: add member button */}
              {isAdmin && (
                <button onClick={() => setMemberModal(true)}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  <MdPersonAdd /> Add Member
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.members?.length === 0 && (
                <span className="text-slate-500 text-sm italic">No members yet</span>
              )}
              {project.members?.map(m => (
                <div key={m._id}
                  className="flex items-center gap-2 bg-slate-700 pl-2 pr-1 py-1 rounded-full text-sm group">
                  <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold uppercase">
                    {m.name[0]}
                  </div>
                  <span className="text-slate-300">{m.name}</span>
                  <span className="text-xs text-slate-500 capitalize">({m.role})</span>
                  {/* Admin: remove member */}
                  {isAdmin && (
                    <button onClick={() => removeMember(m._id)}
                      className="ml-1 p-0.5 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <MdPersonRemove className="text-sm" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Tasks ({project.tasks?.length ?? 0})
            </h2>
          </div>

          {project.tasks?.length === 0 ? (
            <div className="card text-center py-12 text-slate-400">
              <p>No tasks yet.</p>
              {isAdmin && <p className="text-sm mt-1">Click "New Task" to create one.</p>}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.tasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  currentUser={user}
                  onEdit={isAdmin ? (t) => setTaskModal(t) : () => {}}
                  onDelete={isAdmin ? deleteTask : () => {}}
                  onStatusChange={statusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      {taskModal && (
        <TaskModal
          projectId={project._id}
          members={project.members ?? []}
          task={taskModal === 'new' ? null : taskModal}
          onClose={() => setTaskModal(null)}
          onSaved={() => { setTaskModal(null); fetchProject(); }}
        />
      )}

      {/* Add Member Modal */}
      {memberModal && (
        <AddMemberModal
          projectId={project._id}
          existingMemberIds={project.members?.map(m => m._id) ?? []}
          onClose={() => setMemberModal(false)}
          onSaved={() => { setMemberModal(false); fetchProject(); }}
        />
      )}
    </>
  );
}
