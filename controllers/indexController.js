const asyncHandler = require('express-async-handler');

module.exports = {
  home_get: asyncHandler(async (req, res, next) => {
    if (!req.user) res.redirect('/sign-in');
    else {
      res.render('index', {
        title: 'Home',
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
        title: 'Me',
        current: 'me',
      });
    }
  }),

  setting_get: asyncHandler(async (req, res, next) => {
    res.send('Change password or link to email etc, might need to split to separate router');
  }),
};
