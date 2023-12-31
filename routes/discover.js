const express = require('express');
const controller = require('../controllers/discoverController');
const checkAuthenticated = require('../middlewares/checkAuthenticated');
const createLimiter = require('../middlewares/createLimiter');

const router = express.Router();

router.use(checkAuthenticated); // All routes below for authenticated users only

router.get('/friend-requests', controller.friend_request_get);

router.get('/user-search', controller.username_search_get);

router.post('/user-search/:username', createLimiter(10), controller.username_search_post); // Client expecting json

router.post('/user-search/', createLimiter(10), controller.username_search_post); // If user sends empty username; client expecting json

module.exports = router;
