const express = require('express');
const router = express.Router();
const authController = require('../middleware/authMiddleware');

router.use(authController.protect, authController.restrictTo("admin","reviewer"));

router.get("/", (req,res) => {
    res.json("reviewer");
})


module.exports = router;