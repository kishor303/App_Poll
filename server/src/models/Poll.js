/**
 * Poll Model
 * Prepared for MongoDB integration
 * This will be used when MongoDB is connected
 */

// Example schema structure for MongoDB (using Mongoose)
/*
import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  timer: { type: Number, default: 60 },
  createdAt: { type: Date, default: Date.now },
  startedAt: Date,
  completedAt: Date,
  status: { type: String, enum: ['created', 'active', 'completed'], default: 'created' },
  results: { type: Map, of: Number },
  totalAnswers: Number
});

export default mongoose.model('Poll', pollSchema);
*/

// For now, this is a placeholder
export default class Poll {
  constructor(data) {
    this.id = data.id;
    this.question = data.question;
    this.options = data.options;
    this.timer = data.timer || 60;
    this.createdAt = data.createdAt || new Date();
    this.status = data.status || 'created';
    this.results = data.results || {};
  }
}

