const express = require('express');
const Project = require('../models/Project');
const Task    = require('../models/Task');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/projects
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin'
      ? {}
      : { $or: [{ members: req.user._id }, { admin: req.user._id }] };

    const projects = await Project.find(filter)
      .populate('admin', 'name email')
      .populate('members', 'name email')
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(projects.map(async (p) => {
      const total     = await Task.countDocuments({ project: p._id });
      const completed = await Task.countDocuments({ project: p._id, status: 'completed' });
      return { ...p.toJSON(), taskCount: total, completedCount: completed };
    }));

    res.json(enriched);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/projects  (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { name, description, members, deadline, color } = req.body;
    if (!name) return res.status(400).json({ message: 'Project name required' });

    const project = await Project.create({
      name, description, admin: req.user._id,
      members: members || [], deadline, color,
    });
    await project.populate([
      { path: 'admin',    select: 'name email' },
      { path: 'members',  select: 'name email' },
    ]);
    res.status(201).json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/projects/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('admin', 'name email role')
      .populate('members', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const isAdmin   = req.user.role === 'admin';
    const isMember  = project.members.some(m => m._id.equals(req.user._id));
    const isOwner   = project.admin._id.equals(req.user._id);
    if (!isAdmin && !isMember && !isOwner)
      return res.status(403).json({ message: 'Access denied' });

    const tasks = await Task.find({ project: req.params.id })
      .populate('assignedTo assignedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ ...project.toJSON(), tasks });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/projects/:id  (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('admin members', 'name email');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/projects/:id  (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ project: req.params.id });
    res.json({ message: 'Project and its tasks deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/projects/:id/members  — Add a member (admin only)
router.post('/:id/members', protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.body;
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { members: userId } },
      { new: true }
    ).populate('admin members', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/projects/:id/members/:userId  — Remove a member (admin only)
router.delete('/:id/members/:userId', protect, adminOnly, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { $pull: { members: req.params.userId } },
      { new: true }
    ).populate('admin members', 'name email role');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
