const { Sequelize, DataTypes } = require("sequelize");

// Create new Sequelize instance
const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT || 3306,
    dialect: "mysql",
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      underscored: true,
      underscoredAll: true,
    },
  }
);

// Import models
const User = require("../models/User")(sequelize, DataTypes);
const Topic = require("../models/topic")(sequelize, DataTypes);
const QuestionBank = require("../models/questionBank")(sequelize, DataTypes);
const Comment = require("../models/Comment")(sequelize, DataTypes);
const Chat = require("../models/chat")(sequelize, DataTypes);

// Set up associations
User.associate({ QuestionBank, Comment, Chat });
Topic.associate = (models) => {
  Topic.hasMany(models.QuestionBank, {
    foreignKey: "topic_id",
    as: "questions",
  });
};QuestionBank.associate({ Topic, Comment, User });
Comment.associate({ QuestionBank, User });

// Chat relationships
Chat.belongsTo(User, { as: "sender", foreignKey: "sender_id" });
Chat.belongsTo(User, { as: "receiver", foreignKey: "receiver_id" });

// Test DB connection
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ Unable to connect to the database:", err));

// Sync models
sequelize
  .sync({ alter: process.env.NODE_ENV === "development" })
  .then(() => console.log("✅ Models synced"))
  .catch((err) => console.error("❌ Error syncing models:", err));

module.exports = {
  sequelize,
  User,
  Topic,
  QuestionBank,
  Comment,
  Chat,
};
