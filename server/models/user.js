const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.File, {
        foreignKey: 'userId',
        as: 'files'
      });
    }

    validPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('password', bcrypt.hashSync(value, 12));
      }
    },
    name: DataTypes.STRING,
    role: {
      type: DataTypes.STRING,
      defaultValue: 'student'
    }
  }, {
    sequelize,
    modelName: 'User',
    freezeTableName: true,
    timestamps: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  });

  return User;
};