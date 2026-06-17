import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ FIX: proper CORS config (important for Vercel)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://personalized-dashboard-seven-pi.vercel.app",
    ],
  })
);

app.get("/api/news", async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({ error: "Category required" });
    }

    const response = await axios.get(
        "https://newsapi.org/v2/top-headlines",
        {
          params: {
            country: "us",
            category,
            apiKey: process.env.NEWS_API_KEY,
          },
        }
      );

    return res.json({
      articles: response.data.articles,
    });
  } catch (err) {
    console.error(
      "Backend Error:",
      err.response?.data || err.message
    );

    return res.status(500).json({
      error: "Failed to fetch news from API",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});