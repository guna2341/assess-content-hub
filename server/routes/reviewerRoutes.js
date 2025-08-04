const express = require('express');
const router = express.Router();
const authController = require('../middleware/authMiddleware');
const adminController = require("../controllers/adminController");

router.use(authController.protect, authController.restrictTo("admin", "reviewer"));

router.get("/content", adminController.getContent);
router.get("/", (req,res) => {
    res.json("reviewer");
})


module.exports = router;