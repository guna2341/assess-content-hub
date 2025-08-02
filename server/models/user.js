module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM("admin", "reviewer", "student", "user"),
        defaultValue: "user",
      },
    },
    {
      tableName: "users",
      timestamps: true, // Sequelize will create createdAt & updatedAt
      underscored: true, // Will name them created_at & updated_at
      paranoid: true, // Optional: adds deletedAt for soft deletes
    }
  );

  User.associate = (models) => {
    User.hasMany(models.QuestionBank, {
      foreignKey: "created_by",
      as: "questions",
    });
    User.hasMany(models.Comment, {
      foreignKey: "created_by",
      as: "comments",
    });
  };

  return User;
};
