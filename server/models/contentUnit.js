const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class ContentUnit extends Model {
    static associate(models) {
      // One ContentUnit has many Questions
      ContentUnit.hasMany(models.Question, {
        foreignKey: "contentUnitId",
        as: "questions",
        onDelete: "CASCADE",
      });
    }
  }

  ContentUnit.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      code: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      content: DataTypes.TEXT,
      language: DataTypes.STRING,
      explanation: DataTypes.TEXT,
      createdBy: DataTypes.STRING,
      imageLink: DataTypes.STRING,
      pending: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      published: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      approved: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      rejected: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "ContentUnit",
      timestamps: true,
    }
  );

  return ContentUnit;
};
