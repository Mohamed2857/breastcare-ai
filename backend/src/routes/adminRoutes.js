const router = require("express").Router();
const c = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");
const { validate, validateObjectId } = require("../middleware/validate");

router.use(protect, adminOnly); // protects every admin endpoint
router.get("/dashboard", c.dashboard);
router.get("/users", c.listUsers);
router.patch("/users/:id", validateObjectId, validate(c.updateUserSchema), c.updateUser);
router.delete("/users/:id", validateObjectId, c.deleteUser);
router.get("/predictions", c.listPredictions);
router.get("/models", c.listModels);

module.exports = router;
