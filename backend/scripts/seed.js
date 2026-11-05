// Creates the first admin + imports ML metrics. Run: npm run seed
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../src/models/User");
const ModelMetrics = require("../src/models/ModelMetrics");

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = (process.env.ADMIN_EMAIL || "").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");

  if (!(await User.findOne({ email }))) {
    await User.create({
      name: process.env.ADMIN_NAME || "Admin",
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: "admin",
    });
    console.log(`Admin created: ${email}`);
  } else {
    console.log("Admin already exists");
  }

  const file = path.join(__dirname, "..", "..", "ml", "artifacts", "metrics.json");
  if (fs.existsSync(file)) {
    const { best_model, models } = JSON.parse(fs.readFileSync(file, "utf8"));
    await ModelMetrics.deleteMany({});
    await ModelMetrics.insertMany(
      models.map((m) => ({
        modelName: m.model_name,
        accuracy: m.accuracy,
        precision: m.precision,
        recall: m.recall,
        f1Score: m.f1_score,
        rocAuc: m.roc_auc,
        confusionMatrix: m.confusion_matrix,
        isBest: m.model_name === best_model,
      }))
    );
    console.log(`Imported ${models.length} model results (best: ${best_model})`);
  } else {
    console.log("metrics.json not found - run the ML training first");
  }
  await mongoose.disconnect();
})().catch((e) => { console.error(e.message); process.exit(1); });
