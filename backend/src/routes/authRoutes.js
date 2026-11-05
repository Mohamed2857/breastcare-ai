const router = require("express").Router();
const c = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const { validate } = require("../middleware/validate");

router.post("/register", validate(c.registerSchema), c.register);
router.post("/login", validate(c.loginSchema), c.login);
router.post("/logout", c.logout);
router.get("/me", protect, c.me);

module.exports = router;
