const express = require("express");
const router = express.Router();
const authController = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

// router.use(authController.protect, authController.restrictTo("admin"));

router.get("/content", adminController.getContent);

router.get("/", (req, res) => {
  res.json("admin");
});

module.exports = router;
