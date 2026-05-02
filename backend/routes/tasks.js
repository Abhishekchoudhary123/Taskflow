const express = require('express');
const Task    = require('../models/Task');
const Project = require('../models/Project');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const populate = [
  { path: 'project',    select: 'name color' },
  { path: 'assignedTo', select: 'name email' },
  { path: 'assignedBy', select: 'name email' },
];

// GET /api/tasks/dashboard/stats
router.get('/dashboard/stats', protect, async (req, res) => {
  try {
    const base = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };

    const [total, completed, inProgress, todo, overdue] = await Promise.all([
      Task.countDocuments(base),
      Task.countDocuments({ ...base, status: 'completed' }),
      Task.countDocuments({ ...base, status: 'in-progress' }),
      Task.countDocuments({ ...base, status: 'todo' }),
      Task.countDocuments({ ...base, dueDate: { $lt: new Date() }, status: { $ne: 'completed' } }),
    ]);

    const projectCount = req.user.role === 'admin'
      ? await Project.countDocuments()
      : await Project.countDocuments({ members: req.user._id });

    const recentTasks = await Task.find(base)
      .populate(populate)
      .sort({ createdAt: -1 })
      .limit(6);

    // Admin extra: team workload (tasks per member)
    let teamWorkload = [];
    if (req.user.role === 'admin') {
      const workload = await Task.aggregate([
        { $match: { assignedTo: { $exists: true, $ne: null } } },
        { $group: { _id: '$assignedTo', total: { $sum: 1 }, completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $project: { name: '$user.name', email: '$user.email', total: 1, completed: 1 } },
        { $sort: { total: -1 } },
        { $limit: 10 },
      ]);
      teamWorkload = workload;
    }

    res.json({ total, completed, inProgress, todo, overdue, projectCount, recentTasks, teamWorkload });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/tasks  — Members only see their OWN assigned tasks
router.get('/', protect, async (req, res) => {
  try {
    const { project, status, priority } = req.query;
    const filter = {};
    if (project)  filter.project  = project;
    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;

    // Members ONLY see tasks assigned to them
    if (req.user.role !== 'admin') {
      filter.assignedTo = req.user._id;
    }

    const tasks = await Task.find(filter).populate(populate).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/tasks  — Admin ONLY
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;
    if (!title || !project)
      return res.status(400).json({ message: 'Title and project are required' });

    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: 'Project not found' });

    const task = await Task.create({
      title, description, project,
      assignedTo: assignedTo || null,
      assignedBy: req.user._id,
      priority, dueDate: dueDate || null,
    });
    await task.populate(populate);
    res.status(201).json(task);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/tasks/:id
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isAdmin     = req.user.role === 'admin';
    const isAssignee  = task.assignedTo?.toString() === req.user._id.toString();

    // Members can ONLY update status of their own tasks
    if (!isAdmin) {
      if (!isAssignee)
        return res.status(403).json({ message: 'Not authorized' });
      const { status } = req.body;
      if (!status) return res.status(403).json({ message: 'Members can only update task status' });
      task.status = status;
      await task.save();
      await task.populate(populate);
      return res.json(task);
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate(populate);
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/tasks/:id  — Admin ONLY
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
