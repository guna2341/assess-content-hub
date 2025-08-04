const { User, ChatMessage } = require("../models");
const { Op } = require("sequelize");

// Get all users with optional role filter
exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query;
    console.log(role);

    const where = {};
    if (role) {
      where.role = role;
    }

    const users = await User.findAll({
      where,
      attributes: ["id", "name", "email", "role"],
      order: [["name", "ASC"]],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Get users that current user can chat with based on role
exports.getChatPartners = async (req, res) => {
  try {
    const { role, currentUserId } = req.query;

    let whereCondition = {};

    // Define who can chat with whom based on roles
    if (role === "admin") {
      // Admin can chat with everyone except themselves
      whereCondition = {
        role: {
          [Op.in]: ["admin", "reviewer", "faculty"],
        },
        id: {
          [Op.ne]: currentUserId, // Exclude current user
        },
      };
    } else if (role === "reviewer") {
      // Reviewer can chat with admin and faculty
      whereCondition = {
        role: {
          [Op.in]: ["admin", "faculty"],
        },
      };
    } else if (role === "faculty") {
      // Faculty can chat with admin and reviewers
      whereCondition = {
        role: {
          [Op.in]: ["admin", "reviewer"],
        },
      };
    } else {
      return res.status(400).json({ message: "Invalid role" });
    }

    // Get all potential chat partners
    const users = await User.findAll({
      where: whereCondition,
      attributes: [
        "id",
        "name",
        "email",
        "role",
      ],
      order: [["name", "ASC"]],
    });

    // For each user, get their last message and format the response
    const usersWithChatData = await Promise.all(
      users.map(async (user) => {
        // Get the last message between current user and this chat partner
        const lastMessage = await ChatMessage.findOne({
          where: {
            [Op.or]: [
              {
                sender_id: currentUserId,
                receiver_id: user.id,
              },
              {
                sender_id: user.id,
                receiver_id: currentUserId,
              },
            ],
          },
          order: [["created_at", "DESC"]],
          attributes: ["message", "created_at", "sender_id"],
        });

        // Get unread count for messages from this user to current user
        const unreadCount = await ChatMessage.count({
          where: {
            sender_id: user.id,
            receiver_id: currentUserId,
            read: false,
          },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          lastMessage: lastMessage ? lastMessage.message : null,
          lastMessageTime: lastMessage ? lastMessage.created_at : null,

        };
      })
    );

    // Sort by last message time (most recent first) and then by unread count
    usersWithChatData.sort((a, b) => {
      // First priority: unread messages
      if (a.unreadCount > 0 && b.unreadCount === 0) return -1;
      if (a.unreadCount === 0 && b.unreadCount > 0) return 1;

      // Second priority: last message time
      if (a.lastMessageTime && b.lastMessageTime) {
        return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
      }
      if (a.lastMessageTime && !b.lastMessageTime) return -1;
      if (!a.lastMessageTime && b.lastMessageTime) return 1;

      // Third priority: online status
      if (a.is_online && !b.is_online) return -1;
      if (!a.is_online && b.is_online) return 1;

      // Finally: alphabetical by name
      return a.name.localeCompare(b.name);
    });

    res.status(200).json(usersWithChatData);
  } catch (error) {
    console.error("Error fetching chat partners:", error);
    res.status(500).json({ message: "Error fetching chat partners" });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: [
        "id",
        "name",
        "email",
        "avatar",
        "department",
        "role",
        "is_online",
        "last_active",
      ],
      include: [
        {
          model: ChatMessage,
          as: "sentMessages",
          limit: 10,
          order: [["created_at", "DESC"]],
        },
        {
          model: ChatMessage,
          as: "receivedMessages",
          limit: 10,
          order: [["created_at", "DESC"]],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

// Update user online status
exports.updateOnlineStatus = async (req, res) => {
  try {
    const { is_online } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {
      is_online,
      last_active: new Date(),
    };

    await user.update(updateData);

    res.status(200).json({
      id: user.id,
      is_online: user.is_online,
      last_active: user.last_active,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Error updating user status" });
  }
};

// Get user chat statistics
exports.getUserChatStats = async (req, res) => {
  try {
    const userId = req.params.id;

    const [totalSent, totalReceived, unreadCount] = await Promise.all([
      ChatMessage.count({ where: { sender_id: userId } }),
      ChatMessage.count({ where: { receiver_id: userId } }),
      ChatMessage.count({
        where: {
          receiver_id: userId,
          read: false,
        },
      }),
    ]);

    res.status(200).json({
      user_id: userId,
      total_sent_messages: totalSent,
      total_received_messages: totalReceived,
      unread_messages: unreadCount,
    });
  } catch (error) {
    console.error("Error fetching user chat stats:", error);
    res.status(500).json({ message: "Error fetching user chat stats" });
  }
};

// Search users
exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return res
        .status(400)
        .json({ message: "Search query must be at least 2 characters" });
    }

    const users = await User.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: `%${query}%` } },
          { email: { [Op.iLike]: `%${query}%` } },
          { department: { [Op.iLike]: `%${query}%` } },
        ],
      },
      attributes: ["id", "name", "email", "avatar", "department", "role"],
      limit: 20,
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ message: "Error searching users" });
  }
};
