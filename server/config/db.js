const { Sequelize } = require('sequelize');
const config = require('./config');

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

// ✅ CALL BOTH FACTORY FUNCTIONS
const defineUser = require("../models/User");
const defineFile = require("../models/file");

const User = defineUser(sequelize); // ✅ initialized
const File = defineFile(sequelize); // ✅ initialized

// ✅ Set up associations AFTER all models are defined
if (User.associate) User.associate(sequelize.models);
if (File.associate) File.associate(sequelize.models);

module.exports = { sequelize, User, File };
