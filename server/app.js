require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const bcrypt = require('bcryptjs');
const path = require('path');

// Database connection
const { sequelize, User } = require('./config/db');

const PORT = process.env.PORT || 5000;

// Error handlers
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const questionBankRoutes = require('./routes/questionBank');

const app = express();

// Test DB connection and sync models
const initializeDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    // Sync models
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Models synced');

    // Create admin user if not exists
    const admin = await User.findOne({ where: { email: 'admin@gmail.com' } });
    if (!admin) {
      const password = await bcrypt.hash('12345', 12);
      await User.create({
        email: 'admin@gmail.com',
        password,
        name: 'admin',
        role: 'admin'
      });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

initializeDB();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/question-bank', questionBankRoutes);

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;