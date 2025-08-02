require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const path = require("path");

// Database connection
const { sequelize, User } = require("./config/db");

const PORT = process.env.PORT || 5000;

// Error handlers
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reviewerRoutes = require("./routes/reviewerRoutes");
const questionBankRoutes = require("./routes/questionBank");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Test DB connection and sync models
const initializeDB = async () => {
  try {
    console.log("🟢 Starting DB init...");
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync({});
    console.log("✅ Models synced");

    console.log("➡️ Checking for admin user...");
    const user = await User.findOne({ where: { email: "admin@gmail.com" } });
    console.log("🔍 Admin found?", !!user);

    if (!user) {
      console.log("🚀 Creating admin user...");
      const password = await bcrypt.hash("12345", 12);
      await User.create({
        email: "admin@gmail.com",
        password,
        name: "admin",
        role: "admin",
      });
      console.log("✅ Admin created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
};

initializeDB();

// CORS Configuration - Allow all origins
const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Added PATCH method
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  credentials: false, // Set to false when using wildcard origin
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/reviewer", reviewerRoutes);
app.use("/chat", chatRoutes);
app.use("/users", userRoutes);
app.use(express.static(path.join(__dirname, "public")));
app.use("/question-bank", questionBankRoutes);

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Error handling
app.use(notFound);
app.use(errorHandler);

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

// Socket.IO with proper CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST", "PATCH"], // Keep PATCH here too
    allowedHeaders: ["Content-Type"],
    credentials: false,
  },
  allowEIO3: true, // Allow Engine.IO v3 clients to connect
});

// Store user socket mappings and online status
const userSockets = new Map(); // userId -> socketId
const onlineUsers = new Set(); // Set of online user IDs

io.on("connection", (socket) => {
  console.log("🔌 New client connected:", socket.id);

  // Store user socket mapping when they identify themselves
  socket.on("registerUser", async (userId) => {
    try {
      const userIdInt = parseInt(userId);
      
      // Store socket mapping
      userSockets.set(userIdInt, socket.id);
      
      // Add to online users
      onlineUsers.add(userIdInt);
      
      // Update user's online status in database
      await User.update(
        { is_online: true, last_seen: new Date() },
        { where: { id: userIdInt } }
      );

      console.log(`User ${userId} registered with socket ${socket.id} and is now online`);

      // Broadcast online status to all connected users
      socket.broadcast.emit("userOnlineStatusChanged", {
        userId: userIdInt,
        isOnline: true
      });

      // Send current online users to the newly connected user
      const onlineUsersList = Array.from(onlineUsers);
      socket.emit("onlineUsersUpdate", onlineUsersList);

    } catch (error) {
      console.error("Error registering user:", error);
    }
  });

  // Join chat room for direct messaging
  socket.on("joinChatRoom", ({ userId1, userId2 }) => {
    // Create a consistent room name regardless of user order
    const roomName = [userId1, userId2].sort().join("_");
    socket.join(roomName);
    console.log(`User joined chat room: ${roomName}`);
  });

  // Handle direct messages between users
  socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
    try {
      // Save message in database
      const chatMessage = await sequelize.models.ChatMessage.create({
        sender_id: senderId,
        receiver_id: receiverId,
        message: message,
        read: false,
        created_at: new Date(),
        updated_at: new Date(),
      });

      // Create room name (consistent ordering)
      const roomName = [senderId, receiverId].sort().join("_");

      // Emit to all users in the chat room
      io.to(roomName).emit("newMessage", {
        id: chatMessage.id,
        sender_id: senderId,
        receiver_id: receiverId,
        message: message,
        created_at: chatMessage.created_at,
        read: false,
      });

      // Get updated unread count for the receiver
      const unreadCount = await sequelize.models.ChatMessage.count({
        where: {
          receiver_id: receiverId,
          sender_id: senderId,
          read: false,
        },
      });

      // Send unread count update to the receiver if they're online
      const receiverSocketId = userSockets.get(parseInt(receiverId));
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("unreadCountUpdate", {
          senderId: senderId,
          count: unreadCount,
        });
      }

      console.log(`Message sent in room ${roomName}:`, message);
    } catch (error) {
      console.error("Error saving message:", error);
      socket.emit("messageError", { error: "Failed to send message" });
    }
  });

  // Handle marking messages as read
  socket.on("markMessagesAsRead", async ({ senderId, receiverId }) => {
    try {
      await sequelize.models.ChatMessage.update(
        { read: true },
        {
          where: {
            sender_id: senderId,
            receiver_id: receiverId,
            read: false,
          },
        }
      );

      // Notify the sender that their messages have been read
      const senderSocketId = userSockets.get(parseInt(senderId));
      if (senderSocketId) {
        io.to(senderSocketId).emit("messagesMarkedAsRead", {
          receiverId: receiverId,
        });
      }

      console.log(`Messages marked as read from ${senderId} to ${receiverId}`);
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  // Handle request for online status of specific users
  socket.on("checkOnlineStatus", (userIds) => {
    const onlineStatus = {};
    userIds.forEach(userId => {
      onlineStatus[userId] = onlineUsers.has(parseInt(userId));
    });
    socket.emit("onlineStatusResponse", onlineStatus);
  });

  // Join question room for comments (existing functionality)
  socket.on("joinQuestionRoom", (questionId) => {
    socket.join(`question_${questionId}`);
    console.log(`User joined question room: question_${questionId}`);
  });

  // Handle question comments (existing functionality)
  socket.on("sendComment", async ({ questionId, senderId, text }) => {
    try {
      const comment = await sequelize.models.Comment.create({
        questionId,
        senderId,
        text,
      });
      io.to(`question_${questionId}`).emit("newComment", comment);
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  });

  // Handle user disconnection
  socket.on("disconnect", async () => {
    try {
      // Find and remove user from socket mapping
      let disconnectedUserId = null;
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;
          userSockets.delete(userId);
          onlineUsers.delete(userId);
          break;
        }
      }

      if (disconnectedUserId) {
        // Update user's offline status in database
        await User.update(
          { is_online: false, last_seen: new Date() },
          { where: { id: disconnectedUserId } }
        );

        console.log(`User ${disconnectedUserId} disconnected and is now offline`);

        // Broadcast offline status to all connected users
        socket.broadcast.emit("userOnlineStatusChanged", {
          userId: disconnectedUserId,
          isOnline: false
        });
      }

    } catch (error) {
      console.error("Error handling disconnect:", error);
    }

    console.log("❌ Client disconnected:", socket.id);
  });
});

// API endpoint to get online status of users
app.get("/api/users/online-status", async (req, res) => {
  try {
    const { userIds } = req.query;
    
    if (!userIds) {
      return res.status(400).json({ message: "User IDs are required" });
    }

    const userIdArray = Array.isArray(userIds) ? userIds : [userIds];
    const onlineStatus = {};
    
    userIdArray.forEach(userId => {
      onlineStatus[userId] = onlineUsers.has(parseInt(userId));
    });

    res.json(onlineStatus);
  } catch (error) {
    console.error("Error getting online status:", error);
    res.status(500).json({ message: "Error getting online status" });
  }
});

// API endpoint to get all online users
app.get("/api/users/online", async (req, res) => {
  try {
    const onlineUserIds = Array.from(onlineUsers);
    
    // Get user details for online users
    const onlineUsersData = await User.findAll({
      where: { id: onlineUserIds },
      attributes: ['id', 'name', 'email', 'role', 'department', 'avatar']
    });

    res.json(onlineUsersData);
  } catch (error) {
    console.error("Error getting online users:", error);
    res.status(500).json({ message: "Error getting online users" });
  }
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;