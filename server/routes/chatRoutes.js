const express = require("express");
const {
  getChatHistory,
  sendMessage,
  markMessagesAsRead,
  getUnreadCount,
} = require("../controllers/chatController");
const router = express.Router();
console.log("GET /chat/unread/:user_id");

// Get chat history between two users
router.get("/:sender_id/:receiver_id", getChatHistory);

// Send a new message
router.post("/send", sendMessage);

// Mark messages as read
router.patch("/read", markMessagesAsRead);

// Get unread message count for a user
router.get("/unread-count", getUnreadCount);

module.exports = router;
