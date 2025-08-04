const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Comment extends Model {
    static associate(models) {
      // A comment belongs to a question
      Comment.belongsTo(models.Question, {
        foreignKey: "questionId",
        as: "question",
        onDelete: "CASCADE",
      });

      // A comment is made by a user (Admin or Faculty)
      Comment.belongsTo(models.User, {
        foreignKey: "senderId",
        as: "sender",
        onDelete: "CASCADE",
      });
    }
  }

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Comment",
      timestamps: true,
    }
  );

  return Comment;
};
