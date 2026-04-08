const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createArticle,
  getFeed,
  getArticleById,
  getArticlesByCommunity,
  updateArticle,
  deleteArticle,
  likeArticle,
  bookmarkArticle,
  flagArticle,
  getFlaggedArticles,
  deleteByAdmin,
} = require("../controllers/articleController");
const admin = require("../middleware/adminMiddleware");

router.post("/", auth, createArticle);
router.get("/feed", auth, getFeed);
router.get("/flagged", auth, admin, getFlaggedArticles);
router.get("/community/:communityId", auth, getArticlesByCommunity);
router.get("/:id", auth, getArticleById);

router.put("/:id", auth, updateArticle);
router.delete("/:id", auth, deleteArticle);

router.post("/:id/like", auth, likeArticle);
router.post("/:id/bookmark", auth, bookmarkArticle);

// Flag
router.post("/:id/flag", auth, flagArticle);

// Admin
router.delete("/admin/:id", auth, admin, deleteByAdmin);

module.exports = router;