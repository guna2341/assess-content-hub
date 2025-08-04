const { ChatMessage, User } = require("../models");
const { Op } = require("sequelize");
const { sequelize } = require('../models');

// Get chat history between two users
exports.getChatHistory = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.params;

    // Validate users exist
    const users = await User.findAll({
      where: { id: [sender_id, receiver_id] },
    });

    if (users.length !== 2) {
      return res.status(404).json({ message: "One or both users not found" });
    }

    // Get messages between these users, sorted by date
    const messages = await ChatMessage.findAll({
      where: {
        [Op.or]: [
          { sender_id, receiver_id },
          { sender_id: receiver_id, receiver_id: sender_id },
        ],
      },
      order: [["created_at", "ASC"]],
      include: [
        { model: User, as: "sender", attributes: ["id", "name"] },
        { model: User, as: "receiver", attributes: ["id", "name"] },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ message: "Error fetching chat history" });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { sender_id, receiver_id, message } = req.body;

    // Validate users exist
    const users = await User.findAll({
      where: { id: [sender_id, receiver_id] },
    });

    if (users.length !== 2) {
      return res.status(404).json({ message: "Sender or receiver not found" });
    }

    // Create new message
    const newMessage = await ChatMessage.create({
      sender_id,
      receiver_id,
      message,
      read: false,
    });

    // Fetch the message with sender details
    const messageWithSender = await ChatMessage.findByPk(newMessage.id, {
      include: [{ model: User, as: "sender", attributes: ["id", "name"] }],
    });

    res.status(201).json(messageWithSender);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
};

// Mark messages as read
// In your chatController.js
exports.markMessagesAsRead = async (req, res) => {
  
  try {
    const { sender_id, receiver_id } = req.query;
    
    await ChatMessage.update(
      { read: true },
      {
        where: {
          sender_id,
          receiver_id,
          read: false
        }
      }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
};

// Get unread message count for a user
exports.getUnreadCount = async (req, res) => {
  try {
    const { user_id } = req.query;
    const userId = parseInt(user_id);

    const unreadCounts = await ChatMessage.findAll({
      attributes: [
        "sender_id",
        [
          sequelize.fn("COUNT", sequelize.col("ChatMessage.id")), // Explicitly specify table
          "count",
        ],
      ],
      where: {
        receiver_id: userId,
        read: false,
      },
      group: ["ChatMessage.sender_id"], // Explicit group by
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name"],
        },
      ],
    });

    res.status(200).json(unreadCounts);
  } catch (error) {
    console.error("Error fetching unread count:", error);
    res.status(500).json({
      message: "Error fetching unread count",
      error: error.message,
    });
  }
};