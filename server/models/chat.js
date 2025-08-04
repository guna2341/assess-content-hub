module.exports = (sequelize, DataTypes) => {
  const ChatMessage = sequelize.define(
    "ChatMessage",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "chat_messages",
      timestamps: true,
      underscored: true,
    }
  );

  ChatMessage.associate = (models) => {
    ChatMessage.belongsTo(models.User, {
      foreignKey: "sender_id",
      as: "sender",
    });
    ChatMessage.belongsTo(models.User, {
      foreignKey: "receiver_id",
      as: "receiver",
    });
  };

  return ChatMessage;
};
