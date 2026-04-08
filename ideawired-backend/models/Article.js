const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community"
    },

    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    bookmarks: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    isFlagged: {
        type: Boolean,
        default: false
    },
    flags: [
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reason: String
    }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);