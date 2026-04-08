const Article = require("../models/Article");

// CREATE ARTICLE
exports.createArticle = async (req, res) => {
  try {
    const { title, content, communityId } = req.body;

    const article = await Article.create({
      title,
      content,
      community: communityId,
      author: req.user.id
    });

    res.status(201).json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL ARTICLES (FILTER BY FOLLOWED COMMUNITIES)
exports.getFeed = async (req, res) => {
  try {
    const userId = req.user.id;

    const Community = require("../models/Community");
    const followed = await Community.find({ followers: userId });

    const communityIds = followed.map(c => c._id);

    const articles = await Article.find({
      community: { $in: communityIds }
    })
      .populate("author", "username")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE ARTICLE
exports.getArticleById = async (req, res) => {
  try {
    const userId = req.user.id;

    const article = await Article.findById(req.params.id)
      .populate("author", "username")
      .populate("community", "name");

    if (!article) {
      return res.status(404).json({ error: "Article not found" });
    }

    const isLiked = article.likes.some(
      (id) => id.toString() === userId.toString()
    );

    const isBookmarked = article.bookmarks.some(
      (id) => id.toString() === userId.toString()
    );

    res.json({
      ...article.toObject(),
      isLiked,
      isBookmarked,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ARTICLES BY COMMUNITY
exports.getArticlesByCommunity = async (req, res) => {
  try {
    const { communityId } = req.params;
    const userId = req.user.id; // 🔥 current user

    const articles = await Article.find({ community: communityId })
      .populate("author", "username")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    // 🔥 Add isLiked + isBookmarked
    const updatedArticles = articles.map((article) => {
      const isLiked = article.likes.some(
        (id) => id.toString() === userId.toString()
      );

      const isBookmarked = article.bookmarks.some(
        (id) => id.toString() === userId.toString()
      );

      return {
        ...article.toObject(),
        isLiked,
        isBookmarked,
      };
    });

    res.json(updatedArticles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ARTICLE
exports.updateArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (article.author.toString() !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  article.title = req.body.title || article.title;
  article.content = req.body.content || article.content;

  await article.save();
  res.json(article);
};

// DELETE ARTICLE
exports.deleteArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (article.author.toString() !== req.user.id)
    return res.status(403).json({ message: "Not allowed" });

  await article.deleteOne();
  res.json({ message: "Article deleted" });
};

// LIKE ARTICLE
exports.likeArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article.likes.includes(req.user.id)) {
    article.likes.push(req.user.id);
  } else {
    article.likes = article.likes.filter(
      id => id.toString() !== req.user.id
    );
  }

  await article.save();
  res.json(article);
};


// BOOKMARK ARTICLE
exports.bookmarkArticle = async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article.bookmarks.includes(req.user.id)) {
    article.bookmarks.push(req.user.id);
  } else {
    article.bookmarks = article.bookmarks.filter(
      id => id.toString() !== req.user.id
    );
  }

  await article.save();
  res.json(article);
};



exports.flagArticle = async (req, res) => {
  const { reason } = req.body;

  const article = await Article.findById(req.params.id);

  article.flags.push({
    user: req.user.id,
    reason
  });

  article.isFlagged = true;

  await article.save();

  res.json({ message: "Article flagged for review" });
};

exports.getFlaggedArticles = async (req, res) => {
  const articles = await Article.find({ isFlagged: true })
    .populate("author", "username");

  res.json(articles);
};

exports.deleteByAdmin = async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);

  res.json({ message: "Article removed by admin" });
};