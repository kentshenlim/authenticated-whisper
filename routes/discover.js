const express = require('express');
const controller = require('../controllers/discoverController');

const router = express.Router();

router.get('/friend-requests', controller.friend_request_get);

module.exports = router;
