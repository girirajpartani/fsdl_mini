const Community = require("../models/Community");

// Create community
exports.createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    const community = await Community.create({
      name,
      description,
      createdBy: req.user.id
    });

    res.status(201).json(community);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single community
exports.getCommunity = async (req, res) => {
  try {

    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    const userId = req.user ? req.user.id : null;
    const communityWithFollowStatus = {
      ...community._doc,
      isFollowed: userId ? community.followers.includes(userId) : false
    };

    res.json(communityWithFollowStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Follow community
exports.followCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    const userId = req.user.id;

    if (!community.followers.includes(userId)) {
      community.followers.push(userId);
      await community.save();
      res.json({ message: "Followed community", isFollowed: true });
    } else {
      res.status(400).json({ message: "You are already following this community" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unfollow community
exports.unfollowCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    
    if (!community) {
      console.log("Community not found");
      return res.status(404).json({ message: "Community not found" });
    }
    
    const userId = req.user.id;

    if (community.followers.includes(userId)) {
      community.followers = community.followers.filter(
        id => id.toString() !== userId.toString()
      );
      await community.save();
      res.json({ message: "Unfollowed community", isFollowed: false });
    } else {
      res.status(400).json({ message: "You are not following this community" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCommunities = async (req, res) => {
  const userId = req.user ? req.user.id : null;
  const communities = await Community.find();

    const updated = communities.map((c) => {
    return {
      ...c._doc,
      isFollowed: userId ? c.followers.includes(userId) : false
    };
  });
  
  res.json(updated);
};