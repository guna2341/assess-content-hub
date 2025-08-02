module.exports = (sequelize, DataTypes) => {
  const Topic = sequelize.define('Topic', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    parent_id: DataTypes.INTEGER  
  }, {
    tableName: 'topics',
    underscored: true,  
    scopes: {
      withChildren: {
        include: [
          {
            model: sequelize.models.Topic,
            as: 'children',
            include: [{ model: sequelize.models.Topic, as: 'children' }]
          },
          { model: sequelize.models.QuestionBank, as: 'questions' }
        ],
        order: [
          ['created_at', 'ASC'],
          [{ model: sequelize.models.Topic, as: 'children' }, 'created_at', 'ASC']
        ]
      }
    }
  });

  Topic.associate = function(models) {
    Topic.hasMany(models.Topic, {
      foreignKey: 'parent_id',
      as: 'children'
    });
    Topic.belongsTo(models.Topic, {
      foreignKey: 'parent_id',
      as: 'parent'
    });
    Topic.hasMany(models.QuestionBank, {
      foreignKey: 'topic_id',
      as: 'questions'
    });
  };

  return Topic;
};