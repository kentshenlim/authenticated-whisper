const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
require('../middlewares/passportConfig'); // Configure and register passport strategies

const User = require('../models/user');

module.exports = {
  sign_in_get: (req, res, next) => {
    res.render('sign-in', {
      title: 'Sign In',
      errorMessage: req.flash('error')[0], // Wrong credentials message
    });
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

  sign_up_local_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: sign up post, local');
  }),

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
