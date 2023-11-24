const express = require('express');
const controller = require('../controllers/discoverController');

const router = express.Router();

router.get('/friend-requests', controller.friend_request_get);

router.get('/user-search', controller.username_search_get);

router.post('/user-search/:username', controller.username_search_post);

router.post('/user-search/', controller.username_search_post); // If user sends empty username

module.exports = router;
