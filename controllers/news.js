const News = require("../models/news");
const { handleError } = require("../utils/errors/handle");
const { validateNews, checkValidation } = require("../utils/validation/news");
const { validateCategory } = require("../utils/validation/category");
const paginate = require("../utils/pagination/paginate");

// Controller: Get All News with Pagination
const getAllNews = async (req, res) => {
  const { page, limit, category, title } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (title) filter.title = { $regex: title, $options: "i" };

  try {
    // Fetch all news articles
    const paginatedNews = await paginate(News, filter, { page, limit });
    res.json(paginatedNews);
  } catch (error) {
    handleError(res, error, "Error fetching all news");
  }
};

// Controller: Get News by Category with Pagination
const getNewsByCategory = async (req, res) => {
  const { page, limit } = req.query;
  const category = req.query.category || "general";

  try {
    validateCategory(category);
    // Fetch news articles for the specified category
    const paginatedNews = await paginate(News, { category }, { page, limit });
    res.json(paginatedNews);
  } catch (error) {
    handleError(res, error, "Error fetching news by category");
  }
};

// Controller: Get Latest News by Category
const getLatestNewsByCategory = async (req, res) => {
  const { category = "general" } = req.query;

  try {
    validateCategory(category);

    // Find the latest news article for the specified category
    const latestNews = await News.find({ category })
      .sort({ publishedAt: -1 })
      .limit(1);

    // If no news articles found, return a 404 response
    if (latestNews.length === 0) {
      return res.status(404).json({
        message: `No news articles found for the '${category}' category`,
      });
    }

    // Return the latest news article
    res.json({
      category,
      latestNews: latestNews[0],
    });
  } catch (error) {
    handleError(res, error, "Error fetching the latest news");
  }
};

// Controller: Search News by Title with Pagination
const searchNews = async (req, res) => {
  const { title, page, limit } = req.query;

  // Check if title query is provided
  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title query is required" });
  }

  try {
    // Define the search filter
    const filter = { title: { $regex: title.trim(), $options: "i" } };
    // Fetch news articles based on the search query
    const paginatedNews = await paginate(News, filter, { page, limit });
    res.json(paginatedNews);
  } catch (error) {
    handleError(res, error, "Error searching news by title");
  }
};

// Controller: Get News by ID
const getNewsById = async (req, res) => {
  const { id } = req.params;

  try {
    // Fetch news article by ID
    const news = await News.findById(id);
    // If no news article found, return a 404 response
    if (!news) {
      return res.status(404).json({ message: "News article not found" });
    }
    res.json(news);
  } catch (error) {
    handleError(res, error, "Error fetching news article by ID");
  }
};

// Controller: Create News
const createNews = [
  validateNews,
  checkValidation,
  async (req, res) => {
    const { title, description, category, publishedAt, article } = req.body;

    try {
      validateCategory(category);
      // Create a new news article
      const news = new News({
        title,
        description,
        category,
        publishedAt,
        article,
      });
      await news.save();
      res
        .status(201)
        .json({ message: "News article created successfully", news });
    } catch (error) {
      handleError(res, error, "Error creating news article");
    }
  },
];

// Controller: Update News
const updateNews = [
  // Validate the request body
  validateNews,
  checkValidation,
  async (req, res) => {
    const { id } = req.params;
    const { title, description, category, publishedAt, url } = req.body;

    try {
      validateCategory(category);
      // Update the news article
      const updatedNews = await News.findByIdAndUpdate(
        id,
        { title, description, category, publishedAt, url },
        { new: true }
      );
      // If no news article found, return a 404 response
      if (!updatedNews) {
        return res.status(404).json({ message: "News article not found" });
      }
      res.json({ message: "News article updated successfully", updatedNews });
    } catch (error) {
      handleError(res, error, "Error updating news article");
    }
  },
];

// Controller: Update Latest News for Each Category
const updateLatestNews = async () => {
  const categories = ["general", "business", "entertainment", "sports"];
  try {
    for (const category of categories) {
      // Find the oldest news article for the current category
      const oldestCategoryNews = await News.find({ category })
        .sort({ publishedAt: 1 })
        .limit(1);

      if (oldestCategoryNews.length > 0) {
        // Update the `publishedAt` field to the current date and time
        await News.updateOne(
          { _id: oldestCategoryNews[0]._id },
          { $set: { publishedAt: new Date() } }
        );
      }
    }
    console.log("Oldest news updated to the latest for all categories.");
  } catch (error) {
    console.error("Error updating oldest news to the latest:", error);
  }
};

module.exports = {
  getNewsByCategory,
  getLatestNewsByCategory,
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  searchNews,
  updateLatestNews,
};
