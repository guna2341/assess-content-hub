const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getChatPartners,
  getUserById,
  updateOnlineStatus,
  getUserChatStats,
  searchUsers,
} = require("../controllers/usersController");

// Get all users with optional role filter
// GET /users?role=admin
router.get("/", getAllUsers);

// Get chat partners for a user based on role
// GET /users/chat-partners?role=admin&currentUserId=1
router.get("/chat-partners", getChatPartners);

// Search users
// GET /users/search?query=john
router.get("/search", searchUsers);

// Get a single user by ID
// GET /users/:id
router.get("/:id", getUserById);

// Update user online status
// PUT /users/:id/status
router.put("/:id/status", updateOnlineStatus);

// Get user chat statistics
// GET /users/:id/chat-stats
router.get("/:id/chat-stats", getUserChatStats);

module.exports = router;
