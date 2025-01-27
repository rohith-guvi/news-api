const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const crypto = require("crypto");

exports.generateApiKey = [
  // Validate the request body
  body("email").exists().withMessage("Email is required"),
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email } = req.body;

    try {
      // Check if the user already exists
      let user = await User.findOne({ email });

      // If the user doesn't exist, create a new user
      if (!user) {
        const newApiKey = crypto.randomBytes(24).toString("hex");

        const newUser = new User({ email, apiKey: newApiKey });
        await newUser.save();

        return res.json({
          message: "New API Key generated",
          apiKey: newApiKey,
        });
      }
      // If the user already exists, generate a new API key
      const newApiKey = crypto.randomBytes(24).toString("hex");
      user.apiKey = newApiKey;

      await user.save();

      res.json({
        message: "API Key generated successfully",
        apiKey: newApiKey,
      });
    } catch (error) {
      console.error("Error generating API Key:", error);
      res.status(500).json({ message: "Error generating API Key", error });
    }
  },
];
