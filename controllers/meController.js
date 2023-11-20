const asyncHandler = require('express-async-handler');
const Post = require('../models/post');

module.exports = {
  about_get: (req, res, next) => {
    res.render('me/about', {
      title: 'About Us',
    });
  },

  my_posts_get: asyncHandler(async (req, res, next) => {
    console.log(req.user);
    console.log(req.user._id);
    const posts = await Post.find({ user: req.user._id });
    res.render('me/posts', {
      title: 'My Whispers',
      posts,
    });
  }),

  my_friends_get: (req, res, next) => {
    res.send('All my friends');
  },

  settings_get: (req, res, next) => {
    res.send('My settings');
  },
};
