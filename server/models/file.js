// models/file.js
module.exports = (sequelize) => {
  const { DataTypes } = require("sequelize");

  const File = sequelize.define(
    "File",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      timestamps: true,
    }
  );

  File.associate = (models) => {
    File.belongsTo(models.User, { foreignKey: "userId", as: "user" });
  };

  return File;
};
