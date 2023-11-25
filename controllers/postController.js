const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const Post = require('../models/post');

module.exports = {
  detail_get: asyncHandler(async (req, res, next) => {
    // Need to check if current user has view permission
    const post = await Post.findById(req.params.id).populate('user', 'username displayName').exec();
    // Post does not even exist
    if (!post) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    // Does not have view permission (not friend and the post is not public)
    const postOwner = post.user;
    const crtUser = await User.findById(req.user._id).exec();
    if (!crtUser.canViewHisPost(postOwner._id) && !post.isPublic) {
      const err = new Error('Forbidden access');
      err.status = 403;
      return next(err);
    }
    return res.render('post/details', {
      title: 'Details',
      post,
      hasUserPatted: post.hasUserPatted(req.user._id),
    });
  }),

  create_form_get: (req, res, next) => res.render('post/create_form', {
    title: 'Whisper',
  }),

  create_form_post: [
    body('content')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Whisper must not be empty')
      .isLength({ max: 500 })
      .withMessage('Whisper must not have more than 500 characters'),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('post/create_form', {
          title: 'Whisper',
          filled: {
            content: req.body.content,
            isPublic: !!req.body.isPublic,
          },
          errors: errors.array(),
        });
      }
      const post = new Post({
        content: req.body.content,
        user: req.user._id,
        isPublic: !!req.body.isPublic,
      });
      await post.save();
      return res.redirect('/');
    }),
  ],

  delete_post: asyncHandler(async (req, res, next) => {
    // Current post must belong to current user
    const postID = req.body.id;
    const post = await Post.findById(postID).exec();
    if (!post) return res.redirect('/'); // Consider done
    if (post.user._id.toString() !== req.user._id) { // Not user's post
      const err = new Error('Forbidden access');
      err.status = 403;
      return next(err);
    }
    await Post.findByIdAndDelete(postID).exec();
    return res.redirect('/');
  }),

  pat_toggle_post: asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id); // Stored in URl, from id added to pad DOM
    if (!post) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    // Allow anyone to pat, not just friends, so no need check for friends
    const userID = req.user._id;
    let pattedNow;
    if (post.hasUserPatted(userID)) { // Then he is un-patting
      post.removePat(userID);
      pattedNow = false;
    } else { // Then he is patting
      post.addPat(userID);
      pattedNow = true;
    }
    await post.save();
    return res.json({ updatedPatCount: post.patCount, pattedNow });
  }),

  public_toggle_post: asyncHandler(async (req, res, next) => {
    const postID = req.params.id; // Frontend will encode this into URL
    const post = await Post.findById(postID).exec();
    if (!post) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    if (post.user.toString() !== req.user._id) {
      const err = new Error('Forbidden access');
      err.status = 403;
      return next(err);
    }
    post.isPublic = !post.isPublic;
    await post.save();
    return res.json({ // Pass this to frontend
      isNowPublic: post.isPublic,
    });
  }),
};
