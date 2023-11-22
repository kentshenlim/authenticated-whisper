// Get relationship between authenticated user and another user

module.exports = function (authenticatedUserID, user) {
  // authenticatedUserID is string
  // user is User instance (document)
  if (authenticatedUserID === user._id.toString()) return 'self';
  if (user.isFriend(authenticatedUserID)) return 'friend';
  return 'unknown';
};
