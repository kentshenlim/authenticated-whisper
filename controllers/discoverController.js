const asyncHandler = require('express-async-handler');
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
      if (!req.user) {
        const err = new Error('Unauthorized access');
        err.status = 404;
        next(err);
      } else next();
    },
    asyncHandler(async (req, res, next) => {
      const username = req.params.username || '';
      if (!username.length) {
        return res.json({
          failureText: 'Username cannot be empty',
        });
      }
      const userFound = await User.findOne(
        { username },
        { username: 1, displayName: 1 },
      ).exec();
      if (!userFound) return res.json({ failureText: 'No result' });
      return res.json({
        displayName: userFound.displayName,
        dp: userFound.displayPicture,
        url: userFound.url,
      });
    }),
  ],
};
