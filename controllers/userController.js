const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
  details_get: asyncHandler(async (req, res, next) => {
    if (!req.user) return res.redirect('/sign-in');
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    // Need to check whether can view post or not
    // Viewership is mutual, so just need to check if this user can view mine
    // Might need to add another more pertinent method if want to block moment
    if (!user.canViewHisPost(req.user._id)) {
      return res.render('user/details', {
        title: user.displayName,
        user,
        posts: [],
      });
    }
    // Then only need to query for posts
    const posts = await Post.find({ user: req.params.id }).exec();
    return res.render('user/details', {
      title: user.displayName,
      user,
      posts,
    });
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
