require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { sequelize } = require('./config/db'); 
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
// app.use('/auth', authRoutes);

// Test DB connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    
    // Sync models (alter: true for development, remove for production)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('Models synced');
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

testConnection();

// Routes
app.use('/auth', authRoutes);

app.use('/', (req,res) => {
    res.json({ message: 'Welcome to the API' });
})

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;