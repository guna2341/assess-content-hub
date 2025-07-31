module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('comment', 'suggestion', 'needs_edit', 'approved', 'rejected'),
      defaultValue: 'comment'
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'question_banks',
        key: 'id'
      }
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'comments',
    timestamps: true,
    underscored: true
  });

  Comment.associate = (models) => {
    Comment.belongsTo(models.QuestionBank, {
      foreignKey: 'question_id',
      as: 'question'
    });
    Comment.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'author'
    });
  };

  return Comment;
};