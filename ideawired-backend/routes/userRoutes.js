const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const { getUserProfile } = require("../controllers/userController");

router.get("/:id", auth, getUserProfile);

module.exports = router;