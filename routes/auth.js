const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth");

// Route: Generate API key
router.post("/generate-api-key", userController.generateApiKey);

module.exports = router;
