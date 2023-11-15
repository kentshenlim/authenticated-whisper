const asyncHandler = require('express-async-handler');

module.exports = {
  sign_in_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: sign in form, displaying all options');
  }),

  sign_in_local_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: sign in post, local');
  }),

  sign_up_local_get: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: sign up form, local');
  }),

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
