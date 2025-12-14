/**
 * Student Model
 * Prepared for MongoDB integration
 * This will be used when MongoDB is connected
 */

// Example schema structure for MongoDB (using Mongoose)
/*
import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  socketId: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Student', studentSchema);
*/

// For now, this is a placeholder
export default class Student {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.socketId = data.socketId;
    this.joinedAt = data.joinedAt || new Date();
  }
}




