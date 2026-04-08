const User = require("../models/User");
const Article = require("../models/Article");

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalArticles = await Article.countDocuments();
    const flagged = await Article.countDocuments({ isFlagged: true });

    res.json({
      totalUsers,
      totalArticles,
      flaggedArticles: flagged
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};