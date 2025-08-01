import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from "./config/mongodb.js";
import Score from "./models/Score.js";

const app = express();
const port = process.env.PORT || 4000
connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials: true, origin: ["http://localhost:5173", "http://localhost:3000", "https://rounding-frontend.vercel.app"]}))

app.get('/', (req, res) => res.send("API Working"))

// POST /api/score - Save a user's score
app.post('/api/score', async (req, res) => {
  const { name, score } = req.body;
  if (!name || typeof score !== "number") {
    return res.status(400).json({ message: "Name and score are required" });
  }
  try {
    const newScore = new Score({ name, score });
    await newScore.save();
    res.status(201).json({ message: "Score saved!", score: newScore });
  } catch (err) {
    res.status(500).json({ message: "Error saving score", error: err.message });
  }
});

// GET /api/scores - Get all scores (optional, for leaderboard)
app.get('/api/scores', async (req, res) => {
  try {
    const scores = await Score.find().sort({ createdAt: -1 }).limit(100); // Limit to latest 100
    res.json(scores);
  } catch (err) {
    res.status(500).json({ message: "Error fetching scores", error: err.message });
  }
});

app.listen(port, () => console.log(`Server started on PORT:${port}`));