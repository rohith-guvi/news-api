const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth");

// Generate or Regenerate API Key
router.post("/generate-api-key", userController.generateApiKey);

module.exports = router;
