const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: String,

    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Community", communitySchema);