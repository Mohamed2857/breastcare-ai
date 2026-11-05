const router = require("express").Router();
const c = require("../controllers/predictionController");
const { protect } = require("../middleware/auth");
const { validate, validateObjectId } = require("../middleware/validate");

router.use(protect);
router.post("/", validate(c.createSchema), c.create);
router.get("/", c.list);
router.get("/:id", validateObjectId, c.getOne);

module.exports = router;
