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

const defineUser = require("../models/User");
const defineFile = require("../models/file");
const defineContentUnit = require("../models/contentUnit");
const defineQuestion = require("../models/question");

const User = defineUser(sequelize); 
const File = defineFile(sequelize); 
const ContentUnit = defineContentUnit(sequelize); 
const Question = defineQuestion(sequelize); 

if (User.associate) User.associate(sequelize.models);
if (File.associate) File.associate(sequelize.models);
if (ContentUnit.associate) ContentUnit.associate(sequelize.models);
if (Question.associate) Question.associate(sequelize.models);

module.exports = { sequelize, User, File };
