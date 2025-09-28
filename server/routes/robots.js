const express = require('express');
const Robot = require('../models/Robot');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/robots?status=active&page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = status ? { status } : {};
    const robots = await Robot.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Robot.countDocuments(filter);
    res.json({
      robots,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/robots/:id/config (JWT required)
router.put('/:id/config', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { config } = req.body;
    const robot = await Robot.findByIdAndUpdate(
      id,
      { $set: { config } },
      { new: true }
    );
    if (!robot) return res.status(404).json({ message: 'Robot not found' });
    res.json({ message: 'Configuration updated', robot });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
