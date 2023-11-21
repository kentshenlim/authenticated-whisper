const asyncHandler = require('express-async-handler');

module.exports = {
  detail_get: asyncHandler(async (req, res, next) => {
    res.send(`NOT IMPLEMENTED: get detail for ${req.params.id}`);
  }),

  add_pat_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: this path should be fetched by frontend callback');
  }),

  remove_pat_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: this path should be fetched by frontend callback');
  }),
};
