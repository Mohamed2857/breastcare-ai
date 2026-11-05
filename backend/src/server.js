require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

for (const k of ["MONGODB_URI", "JWT_SECRET", "ML_SERVICE_URL", "FRONTEND_URL"]) {
  if (!process.env[k]) {
    console.error(`Missing environment variable: ${k} (check your .env file)`);
    process.exit(1);
  }
}

connectDB()
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
