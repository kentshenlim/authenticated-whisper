const asyncHandler = require('express-async-handler');

module.exports = {
  home_get: asyncHandler(async (req, res, next) => {
    if (!req.user) res.redirect('/sign-in');
    else {
      res.render('index', {
        title: 'authenticated-whisper',
      });
    }
  }),

  profile_get: asyncHandler(async (req, res, netx) => {
    res.send('Just redirect to user with your id');
  }),

  discover_get: asyncHandler(async (req, res, next) => {
    res.send('Discover page, only show users opt in for this, showing their post');
  }),

  setting_get: asyncHandler(async (req, res, next) => {
    res.send('Change password or link to email etc, might need to split to separate router');
  }),
};
