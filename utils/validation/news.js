const { body, validationResult } = require("express-validator");

const validateNews = [
  body("title").isString().notEmpty().withMessage("Title is required"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("Description is required"),
  body("article").isString().notEmpty().withMessage("Article is required"),
  body("category").isString().notEmpty().withMessage("Category is required"),
  body("publishedAt").isISO8601().withMessage("Invalid date format"),
];

// Middleware to check validation result
const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateNews, checkValidation };
