const express = require('express');
const controller = require('../controllers/meController');

const router = express.Router();

router.get('/about', controller.about_get);

router.get('/my/posts', controller.my_posts_get);

router.get('/my/friends', controller.my_friends_get);

router.get('/settings', controller.settings_get);

module.exports = router;
