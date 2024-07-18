const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');
const app = express();

app.use(express.json());

const secret = 'your_jwt_secret'; 


app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
  db.query(query, [name, email, hashedPassword], (err, results) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Email already in use' });
      }
      return res.status(500).json({ message: 'Server error' });
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    if (results.length === 0) return res.status(400).json({ message: 'Invalid email or password' });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id }, secret, { expiresIn: '1h' });
    res.json({ token });
  });
});

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, secret, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};


app.get('/api/users', authenticateToken, (req, res) => {
  const query = 'SELECT id, name, email, last_login, registration_time, status FROM users';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json(results);
  });
});


app.patch('/api/users', authenticateToken, (req, res) => {
  const { ids, status } = req.body;
  const query = 'UPDATE users SET status = ? WHERE id IN (?)';
  db.query(query, [status, ids], (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Status updated successfully' });
  });
});


app.delete('/api/users', authenticateToken, (req, res) => {
  const { ids } = req.body;
  const query = 'DELETE FROM users WHERE id IN (?)';
  db.query(query, [ids], (err) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    res.json({ message: 'Users deleted successfully' });
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
