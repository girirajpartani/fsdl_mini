const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createArticle,
  getFeed,
  getArticlesByCommunity,
  updateArticle,
  deleteArticle,
  likeArticle,
  bookmarkArticle,
  flagArticle,
  getFlaggedArticles,
  deleteByAdmin
} = require("../controllers/articleController");

router.post("/", auth, createArticle);
router.get("/feed", auth, getFeed);
router.get("/community/:communityId", auth, getArticlesByCommunity);

router.put("/:id", auth, updateArticle);
router.delete("/:id", auth, deleteArticle);

router.post("/:id/like", auth, likeArticle);
router.post("/:id/bookmark", auth, bookmarkArticle);

const admin = require("../middleware/adminMiddleware");

// Flag
router.post("/:id/flag", auth, flagArticle);

// Admin
router.get("/flagged", auth, admin, getFlaggedArticles);
router.delete("/admin/:id", auth, admin, deleteByAdmin);

module.exports = router;