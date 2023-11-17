const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
require('../middlewares/passportConfig'); // Configure and register passport strategies

const User = require('../models/user');

module.exports = {
  sign_in_get: (req, res, next) => {
    if (req.user) res.redirect('/'); // Already logged in
    else {
      res.render('sign-in', {
        title: 'Sign In',
        errorMessage: req.flash('error')[0], // Wrong credentials message
      });
    }
  },

  sign_in_local_post: [
    body('username', 'Please fill in username')
      .isLength({ min: 1 }), // Do not trim
    body('password', 'Please fill in password')
      .isLength({ min: 1 }), // Do not trim
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('sign-in', {
          title: 'Sign In',
          filled: {
            username: req.body.username,
            password: req.body.password,
          },
          errors: errors.mapped(),
        });
        return;
      }
      next();
    },
    passport.authenticate('username and password', {
      successRedirect: '/',
      failureRedirect: '/sign-in#auth-err', // Error message has been flashed
      failureFlash: true,
    })],

  sign_up_local_get: (req, res, next) => {
    res.render('sign-up', {
      title: 'Sign Up',
    });
  },

  sign_up_local_post: [
    body('username')
      .custom(asyncHandler(async (value) => {
        const spaceRegex = /\s/;
        if (spaceRegex.test(value) || value.length < 6) throw new Error('Invalid username');
        const userExist = await User.findOne({ username: value }).exec();
        if (userExist) throw new Error('A user with that username already exists');
        else return true;
      }))
      .isLength({ max: 255 })
      .withMessage('Username cannot have more than 255 characters'),
    body('password')
      .custom((value) => {
        const testScheme = [
          /[a-z]/,
          /[A-Z]/,
          /[0-9]/,
          /[!@#$%^&*(),.?":{}|<>]/,
        ];
        let score = 0;
        testScheme.forEach((test) => {
          if (test.test(value)) score += 1;
        });
        if (value.length < 8 || score < 2) throw new Error('Invalid password');
        else return true; // Must have this, see https://github.com/express-validator/express-validator/issues/619
      }),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) { // Throw the form back to client
        const filled = {
          username: req.body.username,
          password: req.body.password,
        };
        res.render('sign-up', {
          title: 'Sign Up',
          filled,
          errors: errors.mapped(),
        });
        return;
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        displayName: req.body.username, // Default
        username: req.body.username,
        password: hashedPassword,
      });
      await user.save();
      res.redirect('/sign-in');
    }),
  ],

  sign_in_google_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: get or post, directed user to Google OAuth');
  }),

  sign_in_facebook_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: get or post, directed user to Facebook OAuth');
  }),

  signed_in_google_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: get, directed by google to here after successful auth');
  }),

  signed_in_facebook_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: get, directed by facebook to here after successful auth');
  }),

  sign_in_email_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: enter email form ');
  }),

  check_email_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: check your email, and resend link');
  }),

  signed_in_email_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: from clicking email link, need to redirect');
  }),
};
