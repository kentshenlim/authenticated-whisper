const express = require('express');
const controller = require('../controllers/postController');

const router = express.Router();

router.post('/:id/add-pat', controller.add_pat_post);

router.post('/:id/remove-pat', controller.remove_pat_post);

module.exports = router;
