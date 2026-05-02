const express = require('express');
const User    = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// GET /api/users  (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/users/all  (all authenticated — for dropdowns)
router.get('/all', protect, async (req, res) => {
  try {
    const users = await User.find().select('name email role _id');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/users/:id/role  (admin only)
router.put('/:id/role', protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'member'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot change your own role' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/users/:id  (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: 'Cannot delete yourself' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
