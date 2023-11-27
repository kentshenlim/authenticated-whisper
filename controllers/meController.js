const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const qs = require('qs');
const bcrypt = require('bcryptjs');
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
    const user = await User.findById(req.user._id, { friends: 1 })
      .populate('friends', 'displayName username')
      .exec();
    const { friends } = user;
    // Grouping
    const map = {};
    for (let i = 0; i < friends.length; i += 1) {
      const firstChar = friends[i].displayName[0];
      let char;
      if (!/[a-zA-Z]/.test(firstChar)) char = '#';
      else char = firstChar.toUpperCase();
      if (!(char in map)) map[char] = [];
      map[char].push(friends[i]);
    }
    const keys = Object.keys(map).filter((key) => key !== '#'); // Take out the #
    keys.sort(); // Lexicographically
    if (map['#']) keys.push('#'); // As last
    const friendsGrouped = keys.map((key) => map[key]);

    return res.render('me/friends', {
      title: 'My Friends',
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
    return res.render('me/user_info', {
      title: 'User Info',
      displayName: user.displayName,
      gender: user.gender,
      bio: user.bio,
      url: user.url,
    });
  }),

  user_info_update_post: [
    body('displayName')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Display name cannot be empty!')
      .isLength({ max: 100 })
      .withMessage('Display name cannot have more than 100 characters'),
    body(
      'gender',
      'Invalid gender, must be one of "male", "female", or "NA',
    ).isIn(['male', 'female', 'NA']),
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
      return res.redirect('/me');
    }),
  ],

  account_security_get: asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id, { username: 1 }).exec();
    if (!user) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    return res.render('me/account_security', {
      title: 'Account Security',
      usernameOld: user.username,
    });
  }),

  account_security_update_post: [
    body('username')
    // Allow undefined if no form element present (when username has been set)
    // Do not allow empty string (if user does not fill in username)
    // Therefore allow undefined but not falsy
      .optional({ values: 'undefined' })
      .custom(
        asyncHandler(async (value) => {
          const spaceRegex = /\s/;
          if (spaceRegex.test(value) || value.length < 6) {
            throw new Error('Username entered does not meet requirements.');
          }
          const userExist = await User.findOne({ username: value }).exec();
          if (userExist) {
            throw new Error('A user with that username already exists');
          } else return true;
        }),
      )
      .isLength({ max: 255 })
      .withMessage('Username cannot have more than 255 characters'),
    body('password')
      .custom((value) => {
        const testScheme = [/[a-z]/, /[A-Z]/, /[0-9]/, /[!@#$%^&*(),.?":{}|<>]/];
        let score = 0;
        testScheme.forEach((test) => {
          if (test.test(value)) score += 1;
        });
        if (value.length < 8 || score < 2) { throw new Error('Password must meet complexity requirements'); } else return true; // Must have this, see https://github.com/express-validator/express-validator/issues/619
      }),
    body('passwordConfirm')
      .custom((value, { req }) => {
        if (value !== req.body.password) throw new Error('Password does not match');
        return true;
      }),
    asyncHandler(async (req, res, next) => {
      const user = await User.findById(req.user._id).exec();
      if (!user) {
        const err = new Error('Resource not found');
        err.status = 404;
        return next(err);
      }
      if (user.isSampleDocument) {
        const err = new Error('Forbidden access: sample account');
        err.status = 403;
        return next(err);
      }
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('me/account_security', {
          title: 'Account Security',
          usernameOld: user.username,
          usernameNew: req.body.username,
          password: req.body.password,
          passwordConfirm: req.body.passwordConfirm,
          errors: errors.mapped(),
        });
      }
      if (!user.username) user.username = req.body.username; // Can set only once
      const hashed = await bcrypt.hash(req.body.password, 10);
      user.password = hashed;
      await user.save();
      return req.logout((err) => {
        if (err) return next(err);
        const qStr = qs.stringify({ notify: 'Log in again' });
        return res.redirect(`/sign-in?${qStr}`);
      });
    }),
  ],
};
