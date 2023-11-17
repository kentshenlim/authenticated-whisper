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
      res.render('auth/sign-in', {
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
        res.render('auth/sign-in', {
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
    passport.authenticate('username-password', {
      successRedirect: '/',
      failureRedirect: '/sign-in#auth-err', // Error message has been flashed
      failureFlash: true,
    })],

  sign_up_local_get: (req, res, next) => {
    res.render('auth/sign-up', {
      title: 'Sign Up',
    });
  },

  sign_up_local_post: [
    body('username')
      .custom(asyncHandler(async (value) => {
        const spaceRegex = /\s/;
        if (spaceRegex.test(value) || value.length < 6) throw new Error('Username entered does not meet requirements.');
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
        if (value.length < 8 || score < 2) throw new Error('Password must meet complexity requirements');
        else return true; // Must have this, see https://github.com/express-validator/express-validator/issues/619
      }),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) { // Throw the form back to client
        const filled = {
          username: req.body.username,
          password: req.body.password,
        };
        res.render('auth/sign-up', {
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

  sign_in_google_post: passport.authenticate('google-OAuth'),

  signed_in_google_get: passport.authenticate('google-OAuth', {
    successRedirect: '/',
    failureRedirect: '/sign-in#auth-err',
    failureFlash: true,
  }),

  sign_in_facebook_post: passport.authenticate('facebook-OAuth'),

  signed_in_facebook_get: passport.authenticate('facebook-OAuth', {
    successRedirect: '/',
    failureRedirect: '/sign-in#auth-err',
    failureFlash: true,
  }),

  sign_in_email_get: (req, res, next) => {
    res.render('auth/email-get', {
      title: 'Get a Magic Link',
    });
  },

  sign_in_email_post: [
    // passport.authenticate('magic-link', {
    //   action: 'requestToken',
    //   failureRedirect: '/sign-in',
    // }),
    (req, res, next) => {
      res.render('auth/email-check', {
        title: 'Email Sent',
        email: req.body.email,
      });
    },
  ],

  signed_in_email_get: passport.authenticate('magic-link', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/sign-in',
    failureFlash: true,
  }),

  sign_out: (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      return res.redirect('/sign-in');
    });
  },
};
