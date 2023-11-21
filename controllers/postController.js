const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
  detail_get: asyncHandler(async (req, res, next) => {
    if (!req.user) return res.redirect('/sign-in');
    // Need to check if current user has view permission
    const post = await Post.findById(req.params.id).populate('user', 'username displayName').exec();
    // Post does not even exist
    if (!post) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    // Does not have view permission
    const postOwner = post.user;
    const crtUser = await User.findById(req.user._id).exec();
    if (!(crtUser.canViewHisPost(postOwner._id))) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    return res.render('post/details', {
      title: 'Details',
      post,
    });
  }),

  create_form_get: (req, res, next) => {
    res.render('post/create_form', {
      title: 'Whisper',
    });
  },

  add_pat_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: this path should be fetched by frontend callback');
  }),

  remove_pat_post: asyncHandler(async (req, res, next) => {
    res.send('NOT IMPLEMENTED: this path should be fetched by frontend callback');
  }),
};
