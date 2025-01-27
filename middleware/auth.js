const User = require("../models/user");

const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.header("X-API-Key");
  if (!apiKey) return res.status(401).json({ error: "Missing API key" });

  try {
    const user = await User.findOne({ apiKey });
    if (!user) return res.status(401).json({ error: "Invalid API key" });

    req.userId = user._id;
    next();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {authenticateApiKey};
