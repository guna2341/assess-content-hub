const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class ChatMessage extends Model {
    static associate(models) {
      // ChatMessage belongs to a question (chat related to a question)
      ChatMessage.belongsTo(models.Question, {
        foreignKey: "questionId",
        as: "question",
        onDelete: "CASCADE",
      });

      // Sender (Admin or Faculty)
      ChatMessage.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
        onDelete: "CASCADE",
      });

      // Receiver (Admin or Faculty)
      ChatMessage.belongsTo(models.User, {
        foreignKey: "receiverId",
        as: "receiver",
        onDelete: "CASCADE",
      });
    }
  }

  ChatMessage.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ChatMessage",
      timestamps: true,
    }
  );

  return ChatMessage;
};
