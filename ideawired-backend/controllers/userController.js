const User = require("../models/User");
const Article = require("../models/Article");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("username role createdAt");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const articles = await Article.find({ author: req.params.id })
      .populate("author", "username")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    res.json({
      user,
      articleCount: articles.length,
      articles,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};