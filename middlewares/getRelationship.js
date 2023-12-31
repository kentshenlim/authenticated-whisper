// Get relationship between authenticated user and another user
const FriendRequest = require('../models/friendRequest');

module.exports = async function (authenticatedUserID, user) {
  // authenticatedUserID is string
  // user is User instance (document)
  if (authenticatedUserID === user._id.toString()) return 'self';
  if (user.isFriend(authenticatedUserID)) return 'friend';
  const meSent = await FriendRequest.findOne({
    sender: authenticatedUserID,
    recipient: user._id,
  });
  if (meSent) return 'sent_pending';
  const meReceive = await FriendRequest.findOne({
    sender: user._id,
    recipient: authenticatedUserID,
  });
  if (meReceive) return 'receive_pending';
  return 'stranger';
};
