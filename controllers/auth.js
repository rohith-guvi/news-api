const { body, validationResult } = require("express-validator");
const User = require("../models/user");
const crypto = require("crypto");

exports.generateApiKey = [
  // Validate the email
  body("email").isEmail().withMessage("Invalid email format").normalizeEmail(),

  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        // Generate API Key before creating a new user
        const newApiKey = crypto.randomBytes(24).toString("hex");

        // Create and save the new user with the generated API Key
        const newUser = new User({ email, apiKey: newApiKey });
        await newUser.save();

        return res.json({
          message: "New API Key generated",
          apiKey: newApiKey,
        });
      }

      // If user exists, generate a new API Key
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
