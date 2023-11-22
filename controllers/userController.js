const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const Post = require('../models/post');
const searchGroupPosts = require('../middlewares/searchGroupPosts');
const getRelationship = require('../middlewares/getRelationship');

module.exports = {
  details_get: asyncHandler(async (req, res, next) => {
    if (!req.user) return res.redirect('/sign-in');
    const [user, postsArr] = await Promise.all([
      User.findById(req.params.id).exec(),
      searchGroupPosts(req.params.id),
    ]);
    if (!user) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    // Total number of heart, posts and friends, always render
    let totalPatCount = 0;
    let totalWhisperCount = 0;
    postsArr.forEach((day) => {
      day.forEach((post) => {
        totalPatCount += post.patCount;
        totalWhisperCount += 1;
      });
    });
    // Relationship between this user and authenticated user
    const relationship = getRelationship(req.user._id, user);
    // Need to check whether can view post or not
    // Viewership is mutual, so just need to check if this user can view mine
    // Might need to add another more pertinent method if want to block moment
    if (!user.canViewHisPost(req.user._id)) {
      return res.render('user/details', {
        title: user.displayName,
        user,
        postsArr: [], // Do not show post
        totalPatCount,
        totalWhisperCount,
        friendsCount: user.friendsCount,
        relationship,
      });
    }
    return res.render('user/details', {
      title: user.displayName,
      user,
      postsArr,
      totalPatCount,
      totalWhisperCount,
      friendsCount: user.friendsCount,
      relationship,
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
