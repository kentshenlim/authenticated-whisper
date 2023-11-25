const express = require('express');
const controller = require('../controllers/meController');
const checkAuthenticated = require('../middlewares/checkAuthenticated');

const router = express.Router();

router.use(checkAuthenticated); // All routes below for authenticated users only

router.get('/about', controller.about_get);

router.get('/my/posts', controller.my_posts_get);

router.get('/my/friends', controller.my_friends_get);

router.get('/settings', controller.settings_get);

router.get('/user-info', controller.user_info_get);

module.exports = router;
