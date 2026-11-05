const mongoose = require("mongoose");

const FEATURES = [
  "clump_thickness", "uniformity_cell_size", "uniformity_cell_shape",
  "marginal_adhesion", "single_epithelial_cell_size", "bare_nuclei",
  "bland_chromatin", "normal_nucleoli", "mitoses",
];

const featureShape = {};
FEATURES.forEach((f) => (featureShape[f] = { type: Number, required: true, min: 1, max: 10 }));

const predictionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    features: featureShape,
    predictedClass: { type: String, enum: ["Benign", "Malignant"], required: true },
    probability: { type: Number, min: 0, max: 1 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

module.exports = mongoose.model("Prediction", predictionSchema);
module.exports.FEATURES = FEATURES;
