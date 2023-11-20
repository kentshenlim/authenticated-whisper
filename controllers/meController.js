const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');

module.exports = {
  about_get: (req, res, next) => {
    res.render('me/about', {
      title: 'About Us',
    });
  },

  my_posts_get: asyncHandler(async (req, res, next) => {
    const postsGrouped = await Post.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user._id) } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created' } }, posts: { $push: '$$ROOT' } } },
      { $sort: { _id: -1 } },
    ]).exec();
    // Need to hydrate because used aggregate
    const postsArr = postsGrouped.map((item) => item.posts);
    for (let day = 0; day < postsArr.length; day += 1) {
      const posts = postsArr[day];
      for (let k = 0; k < posts.length; k += 1) {
        posts[k] = Post.hydrate(posts[k]);
      }
    }
    res.render('me/posts', {
      title: 'My Whispers',
      postsArr,
    });
  }),

  my_friends_get: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id, { friends: 1 }).populate('friends', 'displayName username').exec();
    const { friends } = user;
    // Grouping
    const map = {};
    for (let i = 0; i < friends.length; i += 1) {
      const char = friends[i].displayName[0].toUpperCase();
      if (!(char in map)) map[char] = [];
      map[char].push(friends[i]);
    }
    const keys = Object.keys(map);
    keys.sort();// Lexicographically
    const friendsGrouped = keys.map((key) => map[key]);

    res.render('me/friends', {
      title: 'Friends',
      friendsGrouped,
    });
  }),

  settings_get: (req, res, next) => {
    res.send('My settings');
  },
};
