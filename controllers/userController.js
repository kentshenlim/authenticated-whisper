const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const FriendRequest = require('../models/friendRequest');
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
    const relationship = await getRelationship(req.user._id, user);
    // Need to check whether can view post or not
    // Viewership is mutual, so just need to check if this user can view mine
    // Might need to add another more pertinent method if want to block moment
    if (!user.canViewHisPost(req.user._id)) {
      return res.render('user/details', {
        title: user.displayName,
        user,
        gender: user.gender ? user.gender : undefined,
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
      gender: user.gender ? user.gender : undefined,
      postsArr,
      totalPatCount,
      totalWhisperCount,
      friendsCount: user.friendsCount,
      relationship,
    });
  }),

  // For the four handlers below, the server will only pass json response
  // The server will not be responsible for next render
  // The json will be read by client for next render by fetch()
  // This is to avoid back fiasco
  // If the server is responsible for next render, res.redirect() to same URL
  // will lead to back fiasco, in which back button need to be clicked multiple
  // times to go back to "true" previous screen, terrible UX
  // Because the redirect is now handled by browser, need to recheck the URL
  // used in client-sided JS (friend-request.js)
  accept_friend_post: asyncHandler(async (req, res, next) => {
    if (!req.user) {
      const err = new Error('Unauthorized access');
      err.status = 401;
      return next(err);
    }
    const [friendNew, friendRequest] = await Promise.all([
      User.findById(req.params.id).exec(),
      FriendRequest.findOne({ sender: req.params.id, recipient: req.user._id }).exec(),
    ]);
    if (!friendNew || !friendRequest) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    await Promise.all([
      User.beFriend(req.user._id, req.params.id),
      friendRequest.deleteOne(),
    ]);
    return res.json({});
  }),

  remove_friend_post: asyncHandler(async (req, res, next) => {
    if (!req.user) {
      const err = new Error('Unauthorized access');
      err.status = 401;
      return next(err);
    }
    const friend = await User.findById(req.params.id).exec();
    // User does not exist
    if (!friend) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    // Not already friend, consider it done
    if (!friend.isFriend(req.user._id)) return res.json({});
    await User.unFriend(req.user._id, req.params.id);
    return res.json({});
  }),

  request_friend_post: asyncHandler(async (req, res, next) => {
    if (!req.user) {
      const err = new Error('Unauthorized access');
      err.status = 401;
      return next(err);
    }
    const recipient = await User.findById(req.params.id).exec();
    if (!recipient) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    const friendRequest = new FriendRequest({
      sender: req.user._id,
      recipient: req.params.id,
    });
    await friendRequest.save();
    return res.json({});
  }),

  cancel_friend_request_post: asyncHandler(async (req, res, next) => {
    if (!req.user) {
      const err = new Error('Unauthorized access');
      err.status = 401;
      return next(err);
    }
    const [recipient, friendRequest] = await Promise.all([
      User.findById(req.params.id).exec(),
      FriendRequest.findOne({
        sender: req.user._id, recipient: req.params.id,
      }).exec(),
    ]);
    if (!recipient || !friendRequest) {
      const err = new Error('Resource not found');
      err.status = 404;
      return next(err);
    }
    await friendRequest.deleteOne();
    return res.json({});
  }),
};
