const { z } = require("zod");
const User = require("../models/User");
const Prediction = require("../models/Prediction");
const ModelMetrics = require("../models/ModelMetrics");

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const paging = (q) => {
  const page = Math.max(1, Number(q.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(q.limit) || 10));
  return { page, limit };
};

exports.updateUserSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    email: z.string().trim().toLowerCase().email().optional(),
    isActive: z.boolean().optional(),
    role: z.enum(["user", "admin"]).optional(),
  })
  .strict();

exports.dashboard = async (req, res) => {
  const [totalUsers, activeUsers, totalPredictions, malignant, recent] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    Prediction.countDocuments(),
    Prediction.countDocuments({ predictedClass: "Malignant" }),
    Prediction.find().sort({ createdAt: -1 }).limit(5).populate("user", "name email"),
  ]);
  res.json({
    totalUsers, activeUsers, totalPredictions,
    malignantPredictions: malignant,
    benignPredictions: totalPredictions - malignant,
    recentPredictions: recent,
  });
};

exports.listUsers = async (req, res) => {
  const { page, limit } = paging(req.query);
  const filter = {};
  if (req.query.q) {
    const rx = new RegExp(escapeRegex(String(req.query.q)), "i");
    filter.$or = [{ name: rx }, { email: rx }];
  }
  const [items, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
};

exports.updateUser = async (req, res) => {
  const isSelf = req.params.id === String(req.user._id);
  if (isSelf && (req.body.isActive === false || req.body.role === "user")) {
    return res.status(400).json({ message: "You cannot deactivate or demote your own account" });
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Email already in use" });
    throw err;
  }
};

exports.deleteUser = async (req, res) => {
  if (req.params.id === String(req.user._id)) {
    return res.status(400).json({ message: "You cannot delete your own account" });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  await Prediction.deleteMany({ user: user._id });
  res.json({ message: "User and their predictions deleted" });
};

exports.listPredictions = async (req, res) => {
  const { page, limit } = paging(req.query);
  const [items, total] = await Promise.all([
    Prediction.find().sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).populate("user", "name email"),
    Prediction.countDocuments(),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
};

exports.listModels = async (req, res) => {
  res.json({ models: await ModelMetrics.find().sort({ recall: -1, f1Score: -1 }) });
};
