module.exports = (sequelize, DataTypes) => {
  const QuestionBank = sequelize.define('QuestionBank', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    question: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('Multiple Choice', 'Short Answer', 'Long Answer'),
      allowNull: false
    },
    difficulty: {
      type: DataTypes.ENUM('Easy', 'Medium', 'Hard'),
      allowNull: false
    },
    options: {
      type: DataTypes.JSON,
      allowNull: true
    },
    correct_answer: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    explanation: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected', 'needs_revision'),
      defaultValue: 'pending'
    },
    topic_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'topics',
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
    tableName: 'question_banks',
    timestamps: true,
    underscored: true
  });

  QuestionBank.associate = (models) => {
    QuestionBank.belongsTo(models.Topic, {
      foreignKey: 'topic_id',
      as: 'topic'
    });
    QuestionBank.hasMany(models.Comment, {
      foreignKey: 'question_id',
      as: 'comments'
    });
    QuestionBank.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'author'
    });
  };

  return QuestionBank;
};