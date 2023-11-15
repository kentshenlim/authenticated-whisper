const asyncHandler = require('express-async-handler');

module.exports = {
  details_get: asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: get user page ${req.params.id}`);
  }),

  add_friend_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: this path should be fetched by frontend callback');
  }),

  remove_friend_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: this path should be fetched by frontend callback');
  }),

  cancel_friend_request_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: this path should be fetched by frontend callback');
  }),
};
