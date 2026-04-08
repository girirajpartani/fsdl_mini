const Comment = require("../models/Comment");

// Add comment
exports.addComment = async (req, res) => {
  const { text } = req.body;

  const comment = await Comment.create({
    text,
    user: req.user.id,
    article: req.params.articleId
  });

  res.status(201).json(comment);
};

// Get comments
exports.getComments = async (req, res) => {
  const comments = await Comment.find({
    article: req.params.articleId
  }).populate("user", "username");

  res.json(comments);
};