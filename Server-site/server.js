const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

mongoose.connect('mongodb://localhost/users', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastLogin: Date,
  registrationTime: Date,
  status: String
});

const User = mongoose.model('User', userSchema);

app.use(express.json());

// Register user
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword, registrationTime: new Date() });
  await user.save();
  res.json({ message: 'User created successfully' });
});

// Login user
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return res.status(401).json({ message: 'Invalid email or password' });
  const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });
  res.json({ token });
});

// Authenticate user
app.use(async (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  const decoded = jwt.verify(token, 'secretkey');
  req.userId = decoded.userId;
  next();
});

// User management API
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.put('/users/:id/block', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndUpdate(userId, { status: 'blocked' });
  res.json({ message: 'User blocked successfully' });
});

app.put('/users/:id/unblock', async (req, res) => {
  const userId = req.params.id;
  const user = await User.findByIdAndUpdate(userId, { status: 'active' });
  res.json({ message: 'User unblocked successfully' });
});

app.delete('/users/:id', async (req, res) => {
  const userId = req.params.id;
  await User.findByIdAndRemove(userId);
  res.json({ message: 'User deleted successfully' });
});

app.listen(3000, () => console.log('Server started on port 3000'));