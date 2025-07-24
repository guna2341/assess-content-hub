// env
require("dotenv").config();

// packages
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");
const path = require("path");

// Models
const { sequelize, User } = require("./config/db");

// Port
const PORT = process.env.PORT || 5000;

// Error handlers
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Initialize Express
const app = express();

// DB connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");

    // Sync models (alter: true for development, remove for production)
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("Models synced");
    const user = await User.findByPk(1);
    if (!user) {
      const password = await bcrypt.hashSync("12345", 12);
      await User.create({
        email: "admin@gmail.com",
        password: password,
        name: "admin",
        role: "admin",
      });
      console.log("Admin user created");
    }
  } catch (error) {
    console.error("Database connection error:", error);
  }
};
testConnection();

// Middleware
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Logging requests
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/users", async (req, res) => {
  const users = await User.findAll();
  return res.json({ users: users });
});
app.use(express.static(path.join(__dirname, "public")));

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
