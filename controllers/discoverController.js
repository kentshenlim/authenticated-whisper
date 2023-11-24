const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const FriendRequest = require('../models/friendRequest');
const User = require('../models/user');

module.exports = {
  friend_request_get: asyncHandler(async (req, res, next) => {
    if (!req.user) return res.redirect('/sign-in');
    const allReceivedRequests = await FriendRequest
      .find({ recipient: req.user._id })
      .sort({ created: -1 })
      .populate('sender', 'displayName username')
      .exec();
    // Mark as read
    const arr = [];
    const fRNew = new Set();
    for (let i = 0; i < allReceivedRequests.length; i += 1) {
      const fR = allReceivedRequests[i];
      if (!fR.isRead) {
        fR.isRead = true;
        arr.push(fR.save());
        fRNew.add(i);
      }
    }
    await Promise.all(arr);
    return res.render('discover/friend-requests', {
      title: 'Friend Requests',
      allReceivedRequests,
      fRNew,
      mustRefreshBack: true, // Needed by layout_no_menu, control behavior of back button
    });
  }),

  username_search_get: (req, res, next) => {
    if (!req.user) return res.redirect('/sign-in');
    return res.render('discover/username-search', {
      title: 'Search',
    });
  },

  username_search_post: [
    (req, res, next) => {
      if (!req.user) res.redirect('/sign-in');
      else next();
    },
    body('username')
      .trim()
      .isLength({ min: 1 }),
    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('discover/username-search', {
          title: 'Search',
          failureText: 'Username cannot be empty',
          filled: req.body.username,
        });
      }
      const userFound = await User.findOne(
        { username: req.body.username },
        { username: 1, displayName: 1 },
      ).exec();
      return res.render('discover/username-search', {
        title: 'Search',
        filled: req.body.username,
        userFound,
        failureText: userFound ? null : 'No result',
      });
    }),
  ],
};
