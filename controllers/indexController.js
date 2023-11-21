const asyncHandler = require('express-async-handler');

module.exports = {
  home_get: asyncHandler(async (req, res, next) => {
    if (!req.user) res.redirect('/sign-in');
    else {
      res.render('index', {
        title: 'authenticated-whisper',
        current: 'home',
      });
    }
  }),

  discover_get: asyncHandler(async (req, res, next) => {
    if (!req.user) res.redirect('/sign-in');
    else {
      res.render('index', {
        title: 'Discover',
        current: 'discover',
      });
    }
  }),

  me_get: asyncHandler(async (req, res, next) => {
    if (!req.user) res.redirect('/sign-in');
    else {
      res.render('me', {
        title: 'Profile',
        current: 'me',
      });
    }
  }),
};
