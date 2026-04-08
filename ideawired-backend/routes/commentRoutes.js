const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  addComment,
  getComments
} = require("../controllers/commentController");

router.post("/:articleId", auth, addComment);
router.get("/:articleId", getComments);

module.exports = router;