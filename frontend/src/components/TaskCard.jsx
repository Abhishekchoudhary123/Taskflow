import { format, isPast, parseISO } from 'date-fns';
import { MdEdit, MdDelete, MdCalendarToday, MdPerson, MdFlag } from 'react-icons/md';

const statusClass = { 
  todo: 'badge-todo', 
  'in-progress': 'badge-in-progress', 
  completed: 'badge-completed' 
};

const priorityClass = { 
  low: 'badge-low', 
  medium: 'badge-medium', 
  high: 'badge-high' 
};

const priorityIcon = {
  low: '🟢',
  medium: '🟡',
  high: '🔴'
};

export default function TaskCard({ task, onEdit, onDelete, onStatusChange, currentUser }) {
  const isOverdue  = task.dueDate && task.status !== 'completed' && isPast(new Date(task.dueDate));
  const canEdit    = currentUser?.role === 'admin' || task.assignedBy?._id === currentUser?._id;
  const canDelete  = currentUser?.role === 'admin' || task.assignedBy?._id === currentUser?._id;
  const isAssignee = task.assignedTo?._id === currentUser?._id;

  return (
    <div className={`card-hover animate-fade-in relative overflow-hidden ${
      isOverdue ? 'border-red-500/50 shadow-red-500/20' : ''
    }`}>
      {/* Priority indicator bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        task.priority === 'high' ? 'bg-gradient-to-r from-red-500 to-red-600' :
        task.priority === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
        'bg-gradient-to-r from-slate-500 to-slate-600'
      }`} />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3 mt-2">
        <h3 className="font-semibold text-white text-base leading-snug line-clamp-2 flex-1">
          {task.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          {canEdit && (
            <button 
              onClick={() => onEdit(task)} 
              className="p-1.5 text-slate-400 hover:text-indigo-400 transition-colors rounded-lg hover:bg-slate-700/50"
              title="Edit task"
            >
              <MdEdit className="text-base" />
            </button>
          )}
          {canDelete && (
            <button 
              onClick={() => onDelete(task._id)} 
              className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-700/50"
              title="Delete task"
            >
              <MdDelete className="text-base" />
            </button>
          )}
        </div>
      </div>

      {task.description && (
        <p className="text-xs text-slate-400 mb-4 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className={statusClass[task.status]}>
          {task.status.replace('-', ' ')}
        </span>
        <span className={priorityClass[task.priority]}>
          {priorityIcon[task.priority]} {task.priority}
        </span>
        {isOverdue && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600/30 text-red-300 border border-red-500/30 animate-pulse">
            ⚠️ overdue
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
        <div className="flex items-center gap-2 text-xs">
          {task.assignedTo ? (
            <>
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-xs font-bold uppercase">
                {task.assignedTo.name[0]}
              </div>
              <span className="text-indigo-400 font-medium">{task.assignedTo.name}</span>
            </>
          ) : (
            <span className="text-slate-500 italic flex items-center gap-1">
              <MdPerson className="text-sm" /> Unassigned
            </span>
          )}
        </div>
        {task.dueDate && (
          <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg ${
            isOverdue 
              ? 'bg-red-600/20 text-red-400 border border-red-500/30' 
              : 'bg-slate-700/50 text-slate-400'
          }`}>
            <MdCalendarToday className="text-xs" />
            {format(new Date(task.dueDate), 'MMM d')}
          </div>
        )}
      </div>

      {/* Status toggle for assignee */}
      {(isAssignee || canEdit) && (
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="mt-4 w-full text-xs bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-slate-300 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer hover:bg-slate-700"
        >
          <option value="todo">📋 To Do</option>
          <option value="in-progress">⚡ In Progress</option>
          <option value="completed">✅ Completed</option>
        </select>
      )}
    </div>
  );
}
