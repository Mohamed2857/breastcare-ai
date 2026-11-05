const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  modelName: { type: String, required: true, unique: true },
  accuracy: Number,
  precision: Number,
  recall: Number,
  f1Score: Number,
  rocAuc: Number,
  confusionMatrix: [[Number]], // [[TN, FP], [FN, TP]]
  isBest: { type: Boolean, default: false },
});

module.exports = mongoose.model("ModelMetrics", schema);
