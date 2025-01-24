const express = require("express");
const {
  getNewsByCategory,
  getLatestNewsByCategory,
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  searchNews,
  updateLatestNews,
} = require("../controllers/news");
const { authenticateApiKey } = require("../middleware/auth");

const router = express.Router();

// Apply the API key authentication middleware to all routes
//router.use(authenticateApiKey);

// Route: Get all news with pagination
router.get("/", getAllNews);

// Route: Get news by category with pagination
router.get("/category", getNewsByCategory);

// Route: Get the latest news by category
router.get("/category/latest", getLatestNewsByCategory);

// Route: Search news by title with pagination
router.get("/search", searchNews);

// Route: Get news by ID
router.get("/:id", getNewsById);

// Route: Create a news article
router.post("/", createNews);

// Route: Update a news article
router.put("/:id", updateNews);

// Route: Update the latest news for each category
router.put("/update/latest", updateLatestNews);

module.exports = router;
