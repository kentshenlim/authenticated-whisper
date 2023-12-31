const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Post = require('../models/post');
const FriendRequest = require('../models/friendRequest');

module.exports = {
  me_get: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id, { displayName: 1 }).exec();
    res.render('home/me', {
      title: 'Profile',
      current: 'me',
      displayName: user.displayName, // User might change username, cannot use session
    });
  }),

  home_get: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).exec();
    const { friends } = user;
    friends.push(req.user._id);
    const friendPosts = await Post.find({ user: { $in: friends } })
      .populate('user', 'displayName username')
      .sort({ created: -1 })
      .exec();
    return res.render('home/index', {
      title: 'authenticated-whisper',
      current: 'home',
      friendPosts,
    });
  }),

  discover_get: asyncHandler(async (req, res, next) => {
    // Check if there is new friend request
    const [newFR, globalPosts] = await Promise.all([
      FriendRequest.findOne({ recipient: req.user._id, isRead: false }).exec(),
      Post.find({ isPublic: true }).sort({ created: -1 }).limit(10).populate('user', 'displayName username')
        .exec(),
    ]);
    return res.render('home/discover', {
      title: 'Discover',
      current: 'discover',
      hasNewFR: !!newFR,
      globalPosts,
    });
  }),
};
