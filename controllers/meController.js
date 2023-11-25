const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const qs = require('qs');
const User = require('../models/user');
const searchGroupPosts = require('../middlewares/searchGroupPosts');

module.exports = {
  about_get: (req, res, next) => res.render('me/about', {
    title: 'About Us',
  }),

  my_posts_get: asyncHandler(async (req, res, next) => {
    const postsArr = await searchGroupPosts(req.user._id);
    return res.render('me/posts', {
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

  settings_get: (req, res, next) => res.render('me/settings', {
    title: 'Settings',
  }),

  user_info_get: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).exec();
    if (!user) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    const { notify } = req.query;
    return res.render('me/user_info', {
      title: 'User Info',
      displayName: user.displayName,
      gender: user.gender,
      bio: user.bio,
      notify,
    });
  }),

  user_info_update_post: [
    body('displayName')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Display name cannot be empty!')
      .isLength({ max: 100 })
      .withMessage('Display name cannot have more than 100 characters'),
    body('gender', 'Invalid gender, must be one of "male", "female", or "NA')
      .isIn(['male', 'female', 'NA']),
    body('bio', 'Bio cannot have more than 120 characters')
      .trim()
      .isLength({ max: 120 }),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('me/user_info', {
          title: 'User Info',
          displayName: req.body.displayName,
          gender: req.body.gender,
          bio: req.body.bio,
          errors: errors.mapped(),
        });
      }
      const user = await User.findById(req.user._id);
      if (!user) {
        const err = new Error('Resource not found');
        err.status = 404;
        return next(err);
      }
      user.displayName = req.body.displayName;
      user.gender = req.body.gender;
      user.bio = req.body.bio;
      await user.save();
      const qStr = qs.stringify({ notify: 'User info updated!' });
      return res.redirect(`/user-info?${qStr}`);
    }),

  ],
};
