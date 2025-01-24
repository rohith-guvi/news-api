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
    const paginatedNews = await paginate(News, { category }, { page, limit });
    res.json(paginatedNews);
  } catch (error) {
    handleError(res, error, "Error fetching news by category");
  }
};

// Controller: Get Latest News by Category
const getLatestNewsByCategory = async (req, res) => {
  const { category = "general" } = req.query; // Set category to "general" by default if not provided

  try {
    // Validate the category
    validateCategory(category);

    // Fetch the most recent news article for the specified category
    const latestNews = await News.find({ category })
      .sort({ publishedAt: -1 }) // Sort by published date in descending order (most recent first)
      .limit(1); // Limit to only 1 article (the most recent one)

    if (latestNews.length === 0) {
      return res.status(404).json({
        message: `No news articles found for the '${category}' category`, // Return error if no news found
      });
    }

    // Send the most recent news article as the response
    res.json({
      category,
      latestNews: latestNews[0], // Only send the most recent article (not an array)
    });
  } catch (error) {
    handleError(res, error, "Error fetching the latest news"); // Handle any errors
  }
};

// Controller: Search News by Title with Pagination
const searchNews = async (req, res) => {
  const { title, page, limit } = req.query;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title query is required" });
  }

  try {
    const filter = { title: { $regex: title.trim(), $options: "i" } };
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
    const news = await News.findById(id);
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
  validateNews,
  checkValidation,
  async (req, res) => {
    const { id } = req.params;
    const { title, description, category, publishedAt, url } = req.body;

    try {
      validateCategory(category);
      const updatedNews = await News.findByIdAndUpdate(
        id,
        { title, description, category, publishedAt, url },
        { new: true }
      );
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
const updateLatestNews = async (req, res) => {
  try {
    const categories = [
      "general",
      "business",
      "entertainment",
      "health",
      "science",
      "sports",
      "technology",
    ];

    for (const category of categories) {
      const latestCategoryNews = await News.find({ category })
        .sort({ publishedAt: -1 })
        .limit(1);

      if (latestCategoryNews.length > 0) {
        await News.updateOne(
          { category },
          { $set: latestCategoryNews[0] },
          { upsert: true }
        );
      }
    }

    res.json({ message: "Latest news updated successfully" });
  } catch (error) {
    handleError(res, error, "Error updating latest news");
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
