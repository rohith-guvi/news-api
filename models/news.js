const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  article: { type: String, required: true }, 
  publishedAt: { type: Date, required: true },
});

const News = mongoose.model("News", newsSchema);
module.exports = News;
