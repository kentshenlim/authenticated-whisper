const express = require('express');
const controller = require('../controllers/userController');

const router = express.Router();

router.post('/:id/accept-friend', controller.accept_friend_post);

router.get('/:id', controller.details_get);

router.post('/:id/add-friend', controller.add_friend_post);

router.post('/:id/remove-friend', controller.remove_friend_post);

router.post('/:id/cancel-friend-request', controller.cancel_friend_request_post);

module.exports = router;
