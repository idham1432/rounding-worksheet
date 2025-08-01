import mongoose from "mongoose";

const ScoreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  score: { type: Number, required: true }
}, { timestamps: true });

const scoreModel = mongoose.models.Score || mongoose.model('Score', ScoreSchema, 'scores');

export default scoreModel;