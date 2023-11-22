const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Post = require('../models/post');
const User = require('../models/user');
const searchGroupPosts = require('../middlewares/searchGroupPosts');

module.exports = {
  about_get: (req, res, next) => {
    if (!req.user) return res.redirect('/sign-in');
    return res.render('me/about', {
      title: 'About Us',
    });
  },

  my_posts_get: asyncHandler(async (req, res, next) => {
    if (!req.user) return res.redirect('/sign-in');
    const postsArr = await searchGroupPosts(req.user._id);
    return res.render('me/posts', {
      title: 'My Whispers',
      postsArr,
    });
  }),

  my_friends_get: asyncHandler(async (req, res, next) => {
    if (!req.user) return res.redirect('/sign-in');
    const user = await User.findById(req.user._id, { friends: 1 }).populate('friends', 'displayName username').exec();
    const { friends } = user;
    // Grouping
    const map = {};
    for (let i = 0; i < friends.length; i += 1) {
      const firstChar = friends[i].displayName[0];
      let char;
      if (!(/[a-zA-Z]/.test(firstChar))) char = '#';
      else char = firstChar.toUpperCase();
      if (!(char in map)) map[char] = [];
      map[char].push(friends[i]);
    }
    const keys = Object.keys(map).filter((key) => key !== '#'); // Take out the #
    keys.sort();// Lexicographically
    if (map['#']) keys.push('#'); // As last
    const friendsGrouped = keys.map((key) => map[key]);

    return res.render('me/friends', {
      title: 'Friends',
      friendsGrouped,
      firstChars: keys,
    });
  }),

  settings_get: (req, res, next) => {
    if (!req.user) return res.redirect('/sign-in');
    return res.render('me/settings', {
      title: 'Settings',
    });
  },
};
