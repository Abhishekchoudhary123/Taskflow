import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import toast from 'react-hot-toast';
import { MdFilterList, MdCheckBox } from 'react-icons/md';

export default function Tasks() {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '' });
  const [editTask, setEditTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.status)   params.set('status',   filters.status);
      if (filters.priority) params.set('priority', filters.priority);
      const { data } = await api.get(`/tasks?${params}`);
      setTasks(data);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTasks(); }, [filters]);

  const handleStatusChange = async (id, status) => {
    try { await api.put(`/tasks/${id}`, { status }); toast.success('Updated'); fetchTasks(); }
    catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try { await api.delete(`/tasks/${id}`); toast.success('Deleted'); fetchTasks(); }
    catch { toast.error('Failed to delete'); }
  };

  const sel = 'input text-xs bg-slate-700 border border-slate-600 rounded-lg px-2 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500';

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="page-title">{isAdmin ? 'All Tasks' : 'My Tasks'}</h1>
            <p className="text-slate-400 text-sm mt-1">
              {isAdmin ? `${tasks.length} total tasks` : `${tasks.length} task${tasks.length !== 1 ? 's' : ''} assigned to you`}
            </p>
          </div>
          {/* Filters */}
          <div className="flex items-center gap-2">
            <MdFilterList className="text-slate-400" />
            <select value={filters.status} onChange={e => setFilters(p => ({...p, status: e.target.value}))} className={sel}>
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select value={filters.priority} onChange={e => setFilters(p => ({...p, priority: e.target.value}))} className={sel}>
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {(filters.status || filters.priority) && (
              <button onClick={() => setFilters({ status: '', priority: '' })}
                className="text-xs text-indigo-400 hover:text-indigo-300">Clear</button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="card text-center py-16 text-slate-400">
            <MdCheckBox className="text-5xl mx-auto mb-3 opacity-40" />
            <p>{isAdmin ? 'No tasks yet.' : 'No tasks assigned to you yet.'}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tasks.map(task => (
              <TaskCard key={task._id} task={task} currentUser={user}
                onEdit={isAdmin ? (t) => setEditTask(t) : () => {}}
                onDelete={isAdmin ? handleDelete : () => {}}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
