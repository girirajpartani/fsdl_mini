const Comment = require("../models/Comment");

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      text,
      user: req.user.id,
      article: req.params.articleId
    });

    const populatedComment = await Comment.findById(comment._id).populate("user", "username");

    res.status(201).json(populatedComment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get comments
exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      article: req.params.articleId
    })
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};