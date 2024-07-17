const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/muser');

const router = express.Router();

// Middleware to check token and authentication
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get users
router.get('/', authenticateToken, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Block users
router.patch('/block/:id', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: true });
    res.status(200).json({ message: 'User blocked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Unblock users
router.patch('/unblock/:id', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isBlocked: false });
    res.status(200).json({ message: 'User unblocked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete users
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
