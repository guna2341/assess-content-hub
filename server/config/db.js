const { Sequelize } = require('sequelize');
const config = require('./config/config');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Import models
const User = require('./models/User');
const File = require('./models/File');

// Initialize models
User.init(sequelize);
File.init(sequelize);

// Set up associations
User.associate(sequelize.models);
File.associate(sequelize.models);

module.exports = sequelize;