const asyncHandler = require('express-async-handler');

module.exports = {
  home_get: asyncHandler(async (req, res, next) => {
    res.send('Homepage, form if not signed in, otherwise friends feed');
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
