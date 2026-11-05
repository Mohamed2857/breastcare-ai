const mongoose = require("mongoose");

// validate(zodSchema) -> replaces req.body with parsed data
exports.validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
  }
  req.body = result.data;
  next();
};

exports.validateObjectId = (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: "Invalid id" });
  next();
};
