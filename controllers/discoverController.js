const asyncHandler = require('express-async-handler');
const FriendRequest = require('../models/friendRequest');

module.exports = {
  friend_request_get: asyncHandler(async (req, res, next) => {
    if (!req.user) return res.redirect('/sign-in');
    const allReceivedRequests = await FriendRequest
      .find({ recipient: req.user._id }, { recipient: 0 })
      .sort({ created: 1 })
      .populate('sender', 'displayName username')
      .exec();
    return res.render('discover/friend-requests', {
      title: 'Friend Requests',
      allReceivedRequests,
    });
  }),
};
