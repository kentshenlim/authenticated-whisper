module.exports = {
  about_get: (req, res, next) => {
    res.render('me/about', {
      title: 'About Us',
    });
  },

  my_posts_get: (req, res, next) => {
    res.send('My posts');
  },

  my_friends_get: (req, res, next) => {
    res.send('All my friends');
  },

  settings_get: (req, res, next) => {
    res.send('My settings');
  },
};
