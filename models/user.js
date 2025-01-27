const mongoose = require("mongoose");

// Define the User schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  apiKey: { type: String, unique: true },
});

// Create the User model
module.exports = mongoose.model("User", UserSchema);
