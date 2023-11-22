// Search and group the posts of user given user id
const mongoose = require('mongoose');
const Post = require('../models/post');

module.exports = async function (userID) {
  const postsGrouped = await Post.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userID) } },
    { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$created' } }, posts: { $push: '$$ROOT' } } },
    { $sort: { _id: -1 } },
  ]).exec();
    // Need to hydrate because used aggregate
  const postsArr = postsGrouped.map((item) => item.posts);
  for (let day = 0; day < postsArr.length; day += 1) {
    const posts = postsArr[day];
    for (let k = 0; k < posts.length; k += 1) {
      posts[k] = Post.hydrate(posts[k]);
    }
  }

  return postsArr;
};
// No need catch error here, this will be wrapped by asyncHandler outside
