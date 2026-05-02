import { useEffect, useState } from 'react';
import TaskCard from '../components/TaskCard';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import {
  MdFolder, MdCheckBox, MdWarning, MdTrendingUp,
  MdPlayArrow, MdPending, MdPeople
} from 'react-icons/md';

const StatCard = ({ icon: Icon, label, value, color, sub, trend }) => (
  <div className="stat-card group">
    <div className="flex items-start justify-between mb-3">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="text-2xl text-white" />
      </div>
      {trend && (
        <span className="text-xs text-green-400 font-semibold bg-green-600/20 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <p className="text-4xl font-bold text-white mb-1">{value}</p>
    <p className="text-sm text-slate-400 font-medium">{label}</p>
    {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
  </div>
);

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/tasks/dashboard/stats');
      setStats(data);
    } catch { toast.error('Failed to load dashboard'); }
    finally { setLoading(false); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/tasks/${id}`, { status });
      toast.success('Status updated');
      fetchStats();
    } catch { toast.error('Failed to update'); }
  };

  useEffect(() => { fetchStats(); }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }} />
      </div>
    </div>
  );

  const completionRate = stats?.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gradient-to-br from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-white mb-2">
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400 text-base">
            {isAdmin ? 'Full project overview — you control everything' : 'Your personal task overview'}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10 animate-slide-up">
          <StatCard 
            icon={MdFolder} 
            label="Projects" 
            value={stats?.projectCount ?? 0} 
            color="bg-gradient-to-br from-indigo-600 to-indigo-500" 
            trend="+12%"
          />
          <StatCard 
            icon={MdTrendingUp} 
            label="Total Tasks" 
            value={stats?.total ?? 0} 
            color="bg-gradient-to-br from-blue-600 to-blue-500" 
          />
          <StatCard 
            icon={MdPending} 
            label="To Do" 
            value={stats?.todo ?? 0} 
            color="bg-gradient-to-br from-slate-600 to-slate-500" 
          />
          <StatCard 
            icon={MdPlayArrow} 
            label="In Progress" 
            value={stats?.inProgress ?? 0} 
            color="bg-gradient-to-br from-yellow-600 to-yellow-500" 
          />
          <StatCard 
            icon={MdCheckBox} 
            label="Completed" 
            value={stats?.completed ?? 0} 
            color="bg-gradient-to-br from-green-600 to-green-500" 
            sub={`${completionRate}% completion`}
          />
          <StatCard 
            icon={MdWarning} 
            label="Overdue" 
            value={stats?.overdue ?? 0} 
            color="bg-gradient-to-br from-red-600 to-red-500" 
          />
        </div>

        {/* Admin: Team Workload */}
        {isAdmin && stats?.teamWorkload?.length > 0 && (
          <div className="mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <MdPeople className="text-indigo-400 text-3xl" /> Team Workload
              </h2>
              <span className="text-sm text-slate-400">{stats.teamWorkload.length} members</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {stats.teamWorkload.map((member) => {
                const pct = member.total > 0 ? Math.round((member.completed / member.total) * 100) : 0;
                const pending = member.total - member.completed;
                const isActive = pending > 0;
                return (
                  <div key={member._id} className="card-hover">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-base font-bold uppercase shrink-0 shadow-lg">
                        {member.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-semibold text-white text-base truncate">{member.name}</p>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            isActive 
                              ? 'bg-green-600/30 text-green-300 border border-green-500/30' 
                              : 'bg-slate-600/50 text-slate-400 border border-slate-500/30'
                          }`}>
                            {isActive ? '🟢 Active' : '✅ Done'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-3">
                          <span className="text-white font-semibold">{member.completed}</span>/{member.total} tasks completed · 
                          <span className="text-yellow-400 font-semibold"> {pending}</span> pending
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Progress</span>
                            <span className="font-semibold text-indigo-400">{pct}%</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                              style={{ width: `${pct}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Tasks */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-bold text-white">
              {isAdmin ? 'Recent Tasks' : 'My Tasks'}
            </h2>
            {stats?.recentTasks?.length > 0 && (
              <span className="text-sm text-slate-400">{stats.recentTasks.length} tasks</span>
            )}
          </div>
          {stats?.recentTasks?.length === 0 ? (
            <div className="card text-center py-16 text-slate-400">
              <MdCheckBox className="text-6xl mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium mb-2">No tasks yet</p>
              <p className="text-sm">{isAdmin ? 'Create a project and add tasks to get started.' : 'Tasks assigned to you will appear here.'}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {stats?.recentTasks?.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  currentUser={user}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
