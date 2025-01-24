const paginate = async (model, filter = {}, options = {}) => {
  const { page = 1, limit = 10, sort = { publishedAt: -1 } } = options;

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await model.countDocuments(filter);

  const results = await model
    .find(filter)
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  return {
    total,
    currentPage: parseInt(page),
    totalPages: Math.ceil(total / limit),
    results,
  };
};

module.exports = paginate;
