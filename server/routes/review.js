const express = require("express");
const controllers = require("../controllers/reviewerController");
const router = express.Router();

router.post("/review/:id", controllers.reviewQuestion);

module.exports = router;
