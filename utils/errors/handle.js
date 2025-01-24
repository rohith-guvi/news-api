const handleError = (res, error, customMessage = "An error occurred") => {
  console.error("Error: ", error.message || error);
  res.status(500).json({
    message: customMessage,
    error: error.message || "Internal Server Error",
  });
};

module.exports = { handleError };
