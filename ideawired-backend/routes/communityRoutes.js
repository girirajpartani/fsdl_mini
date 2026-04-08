const router = require("express").Router();
const auth = require("../middleware/authMiddleware");
const {
  createCommunity,
  getCommunity,
  followCommunity,
  unfollowCommunity,
  getCommunities
} = require("../controllers/communityController");

router.post("/", auth, createCommunity);
router.get("/:id", auth, getCommunity);
router.post("/:id/follow", auth, followCommunity);
router.delete("/:id/follow", auth, unfollowCommunity);
router.get("/", auth, getCommunities);


module.exports = router;