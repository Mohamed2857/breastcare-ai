const { z } = require("zod");
const Prediction = require("../models/Prediction");
const { FEATURES } = require("../models/Prediction");

const feature = z.number().int().min(1).max(10);
exports.createSchema = z.object(Object.fromEntries(FEATURES.map((f) => [f, feature]))).strict();

exports.create = async (req, res) => {
  let ml;
  try {
    const r = await fetch(`${process.env.ML_SERVICE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok) throw new Error(`ML service responded ${r.status}`);
    ml = await r.json();
  } catch (err) {
    console.error("ML service error:", err.message);
    return res.status(502).json({ message: "Prediction service unavailable" });
  }

  const prediction = await Prediction.create({
    user: req.user._id,
    features: req.body,
    predictedClass: ml.predicted_class,
    probability: ml.probability,
  });
  res.status(201).json({ prediction });
};

exports.list = async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const filter = { user: req.user._id };
  const [items, total] = await Promise.all([
    Prediction.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Prediction.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
};

exports.getOne = async (req, res) => {
  // filtering by user prevents reading other users' records
  const prediction = await Prediction.findOne({ _id: req.params.id, user: req.user._id });
  if (!prediction) return res.status(404).json({ message: "Prediction not found" });
  res.json({ prediction });
};
