const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

connectDB();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
