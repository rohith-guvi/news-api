exports.validateCategory = (category) => {
  const validCategories = [
    "general",
    "business",
    "entertainment",
    "sports",
  ];

  if (!validCategories.includes(category)) {
    throw new Error("Invalid category");
  }
};
