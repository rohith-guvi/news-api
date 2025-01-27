const express = require("express");
const router = express.Router();
const userController = require("../controllers/auth");

router.post("/generate-api-key", userController.generateApiKey);

module.exports = router;
