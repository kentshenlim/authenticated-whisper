const express = require('express');
const controller = require('../controllers/userController');
const checkAuthenticated = require('../middlewares/checkAuthenticated');
const createLimiter = require('../middlewares/createLimiter');

const router = express.Router();

router.use(checkAuthenticated); // All routes below for authenticated users only

router.post('/:id/request-friend', createLimiter(10), controller.request_friend_post); // Client expecting json

router.post('/:id/accept-friend', controller.accept_friend_post); // Client expecting json

router.post('/:id/remove-friend', controller.remove_friend_post); // Client expecting json

router.post('/:id/cancel-friend-request', createLimiter(10), controller.cancel_friend_request_post); // Client expecting json

router.get('/:id', controller.details_get);

module.exports = router;
