const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes);

sequelize.sync().then(() => {
  app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
  });
}).catch(error => console.log('Database sync error:', error));
