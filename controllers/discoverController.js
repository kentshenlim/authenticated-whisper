const asyncHandler = require('express-async-handler');
const FriendRequest = require('../models/friendRequest');

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
      mustRefreshBack: true,
    });
  }),
};
