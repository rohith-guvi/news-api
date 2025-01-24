const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  apiKey: { type: String, unique: true },
});

module.exports = mongoose.model("User", UserSchema);
