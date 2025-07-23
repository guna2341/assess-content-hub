const express = require("express");
const router = express.Router();
const authController = require("../middleware/authMiddleware");

router.use(authController.protect, authController.restrictTo("admin"));

router.get("/", (req, res) => {
  res.json("admin");
});

module.exports = router;
