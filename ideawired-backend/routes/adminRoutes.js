const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const { getStats } = require("../controllers/adminController");

// Admin dashboard stats
router.get("/stats", auth, admin, getStats);

module.exports = router;