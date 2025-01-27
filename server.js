const express = require("express");
const dotenv = require("dotenv");
const nodeCron = require("node-cron");
const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");
const connectDB = require("./config/db");
const { updateLatestNews } = require("./controllers/news");
dotenv.config();

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

// Cron job to update latest news every 30 minutes
nodeCron.schedule("*/30 * * * *", async () => {
  try {
    await updateLatestNews();
  } catch (error) {
    console.error("Error during scheduled update:", error);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
