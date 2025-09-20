const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true, unique: true },
  marks: {
    math: { type: Number, required: true, min: 0, max: 100 },
    physics: { type: Number, required: true, min: 0, max: 100 },
    chemistry: { type: Number, required: true, min: 0, max: 100 }
  },
  total: Number,
  percentage: Number,
  grade: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Student", StudentSchema);
